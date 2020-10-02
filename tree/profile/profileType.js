import api from "utils/api";
import { toDate } from "date-fns";
import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot
} from "mobx-state-tree";
import { ParentModel, SkillModel, WorkshopModel } from "tree";

const SkillRef = t.model("SkillRef", {
  skill: t.reference(t.late(() => SkillModel)),
  date: t.Date
});

const WorkshopRef = t.model("WorkshopRef", {
  workshop: t.reference(t.late(() => WorkshopModel)),
  started: t.maybeNull(t.Date),
  completed: t.maybeNull(t.Date)
});

export const ProfileModel = t
  .model("ProfileModel", {
    _id: t.identifier,
    firstname: t.string,
    lastname: t.string,
    birthdate: t.Date,
    skills: t.array(SkillRef),
    workshops: t.array(WorkshopRef),
    parents: t.optional(
      t.array(t.reference(t.late(() => ParentModel))),
      // t.array(t.maybe(t.reference(t.late(() => ProfileModel)))),
      // t.array(t.safeReference(ProfileModel, { acceptsUndefined: false })),
      []
    )
  })
  .views((profile) => ({
    get slug() {
      return `${profile.firstname}-${profile.lastname}`;
    }
  }))
  .actions((profile) => ({
    fromUi(data) {
      profile.firstname = data.firstname;
      profile.lastname = data.lastname;
      profile.birthdate = data.birthdate;
    },
    update() {
      return getParent(profile, 2).updateProfile(profile);
    },
    remove: function remove() {
      getParent(profile, 2).removeProfile(profile);
    },
    addSkill: function addSkill({ _id, date }) {
      profile.skills.push(SkillRef.create({ skill: _id, date }));
    },
    removeSkill: function removeSkill(skill) {
      profile.skills = profile.skills.filter((ref) => ref.skill !== skill);
    },
    addWorkshop: function addWorkshop({ _id }) {
      profile.workshops.push(WorkshopRef.create({ workshop: _id }));
    },
    removeWorkshop: function removeWorkshop(workshop) {
      profile.workshops = profile.workshops.filter(
        (ref) => ref.workshop !== workshop
      );
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
    setProfiles: async function setProfiles(data) {
      return new Promise((resolve, reject) => {
        const profiles = {};
        data.forEach(
          ({
            _id,
            firstname,
            lastname,
            birthdate,
            skills,
            parents,
            workshops
          }) => {
            profiles[_id] = {
              _id,
              firstname,
              lastname,
              birthdate: new Date(birthdate),
              skills: skills.map(({ skill, date }) =>
                SkillRef.create({ skill, date: new Date(date) })
              ),
              workshops: workshops.map(({ workshop, started, completed }) =>
                WorkshopRef.create({
                  workshop,
                  started: started && new Date(started),
                  completed: completed && new Date(completed)
                })
              ),
              parents
            };
          }
        );
        resolve(profiles);
      });
    },
    // API
    getProfiles: flow(function* getProfiles() {
      store.state = "pending";
      const { error, data } = yield api.get("profiles");

      if (status === api.HTTP_ERROR) {
        store.state = "error";
        return { error };
      } else {
        store.profiles = yield store.setProfiles(data);
        store.state = "done";
      }
    }),
    postProfile: flow(function* postProfile(formData) {
      store.state = "pending";
      const { error, data } = yield api.post("profiles", formData);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data: ProfileModel.create(data) };
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
      return data;
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
  .actions((self) => ({
    selectProfile: flow(function* selectProfile(slug) {
      yield self.store.getProfiles();
      self.store.profiles.forEach((profile) => {
        if (slug === profile.slug) {
          self.selectedProfile = profile;
        }
      });
      if (self.selectedProfile === undefined) {
        self.selectedProfile = null;
      }
    })
  }));
