import api from "utils/api";
import { toDate } from "date-fns";
import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot,
  getRoot,
  resolveIdentifier,
} from "mobx-state-tree";
import { ParentModel, SkillModel } from "tree";

const SkillRef = t.model("SkillRef", {
  skill: t.reference(t.late(() => SkillModel)),
  date: t.Date,
});

export const ProfileModel = t
  .model("ProfileModel", {
    _id: t.identifier,
    firstname: t.string,
    lastname: t.string,
    birthdate: t.Date,
    skills: t.array(SkillRef),
    parents: t.optional(
      t.array(t.reference(t.late(() => ParentModel))),
      // t.array(t.maybe(t.reference(t.late(() => ProfileModel)))),
      // t.array(t.safeReference(ProfileModel, { acceptsUndefined: false })),
      []
    ),
  })
  .views((profile) => ({
    get slug() {
      return `${profile.firstname}-${profile.lastname}`;
    },
  }))
  .actions((profile) => ({
    merge(formData) {
      profile.firstname = formData.firstname;
      profile.lastname = formData.lastname;
      profile.birthdate = formData.birthdate;
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
  }));

const ProfileStore = t
  .model("ProfileStore", {
    profiles: t.map(ProfileModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending"),
  })
  .views((store) => ({
    get isEmpty() {
      return store.profiles.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    },
  }))
  .actions((store) => ({
    setProfiles: async function setProfiles(data) {
      return new Promise((resolve, reject) => {
        const profiles = {};
        data.forEach(
          ({ _id, firstname, lastname, birthdate, skills, parents }) => {
            profiles[_id] = {
              _id,
              firstname,
              lastname,
              birthdate: new Date(birthdate),
              skills: skills.map(({ skill, date }) => {
                return SkillRef.create({ skill, date: new Date(date) });
              }),
              parents,
            };
          }
        );
        store.profiles = profiles;
        resolve(profiles);
      });
    },
    // API
    fetch: flow(function* fetch() {
      store.state = "pending";
      const { status, data } = yield api.get("profiles");

      if (status === api.HTTP_STATUS_ERROR) {
        store.state = "error";
      } else {
        yield store.setProfiles(data);
        store.state = "done";
      }
    }),
    postProfile: flow(function* postProfile(data) {
      store.state = "pending";
      const res = yield api.post("profiles", data);
      store.state = "done";
      return res;
    }),
    updateProfile: flow(function* updateProfile(profile) {
      store.state = "pending";
      const data = getSnapshot(profile);
      const res = yield api.update(`profiles/${profile._id}`, {
        ...data,
        birthdate: toDate(data.birthdate),
      });
      store.state = "done";
      return res;
    }),
    removeProfile: flow(function* removeProfile(profile) {
      // destroy(profile);
      store.state = "pending";
      const res = yield api.remove(`profiles/${profile._id}`);
      store.state = "done";
      return res;
    }),
  }));

export const ProfileType = t
  .model("ProfileType", {
    store: t.optional(ProfileStore, {}),
    selectedProfile: t.optional(
      t.maybeNull(t.safeReference(ProfileModel)),
      undefined
    ),
  })
  .actions((self) => ({
    selectProfile: flow(function* selectProfile(slug) {
      yield self.store.fetch();
      self.store.profiles.forEach((profile) => {
        if (slug === profile.slug) {
          self.selectedProfile = profile;
        }
      });
      if (self.selectedProfile === undefined) {
        self.selectedProfile = null;
      }
    }),
  }));
