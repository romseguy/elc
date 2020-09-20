import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot,
} from "mobx-state-tree";
import api from "utils/api";

export const levels = ["-", "CP", "CE1", "CE2", "CM1", "CM2"];
export const domains = ["-", "Français"];

export const SkillModel = t
  .model("SkillModel", {
    _id: t.identifier,
    code: t.string,
    description: t.string,
    domain: t.optional(t.enumeration(domains), "-"),
    level: t.optional(t.enumeration(levels), "-"),
  })
  .views((skill) => ({
    get slug() {
      return skill.code;
    },
  }))
  .actions((skill) => ({
    merge(formData) {
      skill.code = formData.code;
      skill.description = formData.description;
      skill.domain = formData.domain;
      skill.level = formData.level;
    },
    update() {
      return getParent(skill, 2).updateSkill(skill);
    },
    remove: function remove() {
      getParent(skill, 2).removeSkill(skill);
    },
  }));

const SkillStore = t
  .model("SkillStore", {
    skills: t.map(SkillModel),
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
    setSkills(data) {
      const skills = {};
      data.forEach(({ _id, code, ...attrs }) => {
        skills[_id] = SkillModel.create({
          _id,
          code,
          ...attrs,
        });
      });
      store.skills = skills;
    },
    // API
    fetch: flow(function* fetch() {
      store.state = "pending";
      const { data } = yield api.get("skills");
      store.setSkills(data);
      store.state = "done";
    }),
    postSkill: flow(function* postSkill(data) {
      store.state = "pending";
      const res = yield api.post("skills", data);
      store.state = "done";
      return res;
    }),
    updateSkill: flow(function* updateSkill(skill) {
      store.state = "pending";
      const res = yield api.update(`skills/${skill._id}`, getSnapshot(skill));
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
  //selectedSkill: t.maybeNull(t.safeReference(SkillModel)),
});
// .actions((self) => ({
//   selectSkill: flow(function* selectSkill(slug) {
//     yield self.store.fetch();
//     self.store.skills.forEach((skill) => {
//       if (slug === skill.slug) {
//         self.selectedSkill = skill;
//       }
//     });
//   }),
// }));
