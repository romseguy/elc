import { types as t, flow, getParent, destroy } from "mobx-state-tree";
import api from "utils/api";

const SkillModel = t
  .model("SkillModel", {
    _id: t.string,
    code: t.string,
    description: t.string,
    date: t.Date,
  })
  .actions((skill) => ({
    remove: function remove() {
      getParent(skill, 2).removeSkill(skill);
    },
  }));

const SkillStore = t
  .model("SkillStore", {
    skills: t.optional(t.map(SkillModel), {}),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending"),
  })
  .views((store) => ({
    get isEmpty() {
      return store.skills.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    },
  }))
  .actions((store) => ({
    fetch: flow(function* fetchList() {
      store.state = "pending";
      try {
        const { data } = yield api.get("skills");
        const skills = {};
        data.forEach(({ _id, firstname, lastname, birthdate }) => {
          skills[_id] = SkillModel.create({
            _id,
            slug: `${firstname}-${lastname}`,
            firstname,
            lastname,
            birthdate: new Date(birthdate),
          });
        });
        store.skills = skills;
        store.state = "done";
        return skills;
      } catch (error) {
        store.state = "error";
        console.error(error);
      }
    }),
    addSkill: flow(function* addSkill(data) {
      try {
        return yield api.post("skills", data);
      } catch (error) {
        console.error(error);
      }
    }),
    setSkill: flow(function* setSkill(data) {
      store.state = "pending";
      const res = yield api.update(`skills/${data._id}`, data);
      store.state = "done";
      return res;
    }),
    removeSkill: flow(function* removeSkill(skill) {
      // destroy(skill);
      store.state = "pending";
      const res = yield api.remove(`skills/${skill._id}`);
      store.state = "done";
      return res;
    }),
  }));

export const SkillType = t.model("SkillType", {
  store: t.optional(SkillStore, {}),
});
