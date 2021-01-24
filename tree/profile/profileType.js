import api from "utils/api";
import { isDate, parseISO, toDate } from "date-fns";
import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot,
  getRoot
} from "mobx-state-tree";
import { ParentModel, ObservationModel, SkillModel, WorkshopModel } from "tree";
import { array2map } from "utils/array2map";

const mapProfiles = ({
  birthdate,
  observations,
  skills,
  workshops,
  ...rest
}) => ({
  birthdate: birthdate && new Date(birthdate),
  observations: observations.map(({ date, ...rest }) => ({
    date: new Date(date),
    ...rest
  })),
  skills: skills.map(({ date, ...rest }) => ({
    date: new Date(date),
    ...rest
  })),
  workshops: workshops.map(({ started, completed, ...rest }) => ({
    started: started && new Date(started),
    completed: completed && new Date(completed),
    ...rest
  })),
  ...rest
});

const ObservationRef = t
  .model("ObservationRef", {
    observation: t.reference(t.late(() => ObservationModel)),
    date: t.Date,
    workshop: t.reference(t.late(() => WorkshopModel))
  })
  .actions((observationRef) => ({
    fromUi(data) {
      observationRef.date = data.date;
    }
  }));

const SkillRef = t
  .model("SkillRef", {
    skill: t.reference(t.late(() => SkillModel)),
    workshop: t.maybe(t.reference(t.late(() => WorkshopModel))),
    date: t.Date
  })
  .actions((skillRef) => ({
    fromUi(data) {
      skillRef.date = data.date;
    }
  }));

const WorkshopRef = t
  .model("WorkshopRef", {
    _id: t.maybe(t.string),
    workshop: t.reference(t.late(() => WorkshopModel)),
    started: t.maybeNull(t.Date),
    completed: t.maybeNull(t.Date)
  })
  .actions((workshopRef) => ({
    edit(data) {
      workshopRef.started = data.started;
      workshopRef.completed = data.completed;
    }
  }));

export const ProfileModel = t
  .model("ProfileModel", {
    _id: t.identifier,
    firstname: t.string,
    lastname: t.string,
    birthdate: t.maybeNull(t.Date),
    observations: t.array(ObservationRef),
    skills: t.array(SkillRef),
    workshops: t.array(WorkshopRef),
    parents: t.optional(
      t.array(t.safeReference(t.late(() => ParentModel))),
      // t.array(t.maybe(t.reference(t.late(() => ProfileModel)))),
      // t.array(t.safeReference(ProfileModel, { acceptsUndefined: false })),
      []
    )
  })
  .views((profile) => ({
    get slug() {
      return `${profile.firstname}-${profile.lastname}`;
    },
    getSkillsByLevel(level) {
      return profile.skills.filter(
        (skillRef) => skillRef.skill.level === level
      );
    }
  }))
  .actions((profile) => ({
    edit({ firstname, lastname, birthdate }) {
      profile.firstname = firstname;
      profile.lastname = lastname;
      profile.birthdate = isDate(birthdate) ? birthdate : parseISO(birthdate);
      return profile;
    },
    update() {
      return getParent(profile, 2).updateProfile(profile);
    },
    remove: function remove() {
      getParent(profile, 2).removeProfile(profile);
    },
    addSkillRef({ skill, workshop, date }) {
      const add = () =>
        profile.skills.push(SkillRef.create({ skill, workshop, date }));

      if (!profile.skills.length) add();
      else {
        let found = false;
        let i = 0;

        while (!found && i < profile.skills.length)
          profile.skills.get(i).skill._id === skill._id ? (found = true) : i++;

        if (!found) add();
      }
    },
    removeSkillRef(skillRef) {
      profile.skills = profile.skills.filter(
        (ref) => ref.skill._id !== skillRef.skill._id
      );
    },
    addWorkshopRef({ workshopId }) {
      profile.workshops.push(WorkshopRef.create({ workshop: workshopId }));
    },
    removeWorkshopRef(_id) {
      profile.workshops = profile.workshops.filter((ref) => {
        return ref._id !== _id;
      });
    },
    addObservationRef({ observation, date, workshop }) {
      const add = () =>
        profile.observations.push(
          ObservationRef.create({ observation, date, workshop })
        );

      if (!profile.observations.length) add();
      else {
        let found = false;
        let i = 0;

        while (!found && i < profile.observations.length)
          profile.observations.get(i).observation._id === observation._id
            ? (found = true)
            : i++;

        if (!found) add();
      }
    },
    removeObservationRef(observationRef) {
      profile.observations = profile.observations.filter((ref) => {
        return ref.observation._id !== observationRef.observation._id;
      });
    }
  }));

const ProfileStore = t
  .model("ProfileStore", {
    profiles: t.map(ProfileModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending")
  })
  .views((store) => ({
    get isEmpty() {
      return store.profiles.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    }
  }))
  .actions((store) => ({
    // CRUD API CALLS
    getProfiles: flow(function* getProfiles() {
      yield getRoot(store).observationType.store.getObservations();
      yield getRoot(store).workshopType.store.getWorkshops();

      store.state = "pending";
      const { error, data } = yield api.get("profiles");

      if (error || !Array.isArray(data)) {
        store.state = "error";
        return { error };
      }

      store.profiles = array2map(data.map(mapProfiles), "_id");
      store.state = "done";
    }),
    postProfile: flow(function* postProfile(snapshot) {
      store.state = "pending";
      const { error, data } = yield api.post("profiles", snapshot);

      if (error) {
        store.state = "error";
        return { error };
      }

      const profile = ProfileModel.create(mapProfiles(data));
      store.state = "done";
      return { data };
    }),
    updateProfile: flow(function* updateProfile(profile) {
      store.state = "pending";
      const { error, data } = yield api.update(`profiles/${profile._id}`, {
        ...getSnapshot(profile),
        birthdate: toDate(profile.birthdate)
      });

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data };
    }),
    removeProfile: flow(function* removeProfile(profile) {
      // destroy(profile);
      store.state = "pending";
      const { error, data } = yield api.remove(`profiles/${profile._id}`);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data };
    })
  }));

export const ProfileType = t
  .model("ProfileType", {
    store: t.optional(ProfileStore, {}),
    selectedProfile: t.optional(
      t.maybeNull(t.safeReference(ProfileModel)),
      undefined
    )
  })
  .actions((type) => ({
    selectProfile(slug) {
      type.store.profiles.forEach((profile) => {
        if (slug === profile.slug) {
          type.selectedProfile = profile;
        }
      });
      if (type.selectedProfile === undefined) {
        type.selectedProfile = null;
      }
    }
  }));
