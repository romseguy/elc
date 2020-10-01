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
    fromUi(data) {
      skill.code = data.code;
      skill.description = data.description;
      skill.domain = data.domain;
      skill.level = data.level;
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
    setSkills: async function setSkills(data) {
      return new Promise((resolve, reject) => {
        const skills = {};
        data.forEach(({ _id, code, ...attrs }) => {
          skills[_id] = {
            _id,
            code,
            ...attrs,
          };
        });
        resolve(skills);
      });
    },
    // API
    getSkills: flow(function* getSkills() {
      store.state = "pending";
      const { error, data } = yield api.get("skills");

      if (error) {
        store.state = "error";
        return { error };
      }
      store.skills = yield store.setSkills(data);
      store.state = "done";
    }),
    postSkill: flow(function* postSkill(formData) {
      store.state = "pending";
      const { error, data } = yield api.post("skills", formData);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data: SkillModel.create(data) };
    }),
    updateSkill: flow(function* updateSkill(skill) {
      store.state = "pending";
      const { error, data } = yield api.update(
        `skills/${skill._id}`,
        getSnapshot(skill)
      );

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return data;
    }),
    removeSkill: flow(function* removeSkill(skill) {
      // destroy(skill);
      store.state = "pending";
      const { error, data } = yield api.remove(`skills/${skill._id}`);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return data;
    }),
  }));

export const SkillType = t.model("SkillType", {
  store: t.optional(SkillStore, {}),
});
