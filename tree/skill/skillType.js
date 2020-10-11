import { values } from "mobx";
import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot
} from "mobx-state-tree";
import api from "utils/api";
import { array2map } from "utils/array2map";

export const levels = ["CP", "CE1", "CE2", "CM1", "CM2"];
export const domains = ["Français"];
export const uiToApi = ({ code, description, domain, level }) => ({
  code,
  description,
  domain: domain === "" ? null : domain,
  level: level === "" ? null : level
});
const mapSkills = ({ ...rest }) => ({ ...rest });

export const SkillModel = t
  .model("SkillModel", {
    _id: t.identifier,
    code: t.string,
    description: t.string,
    domain: t.maybeNull(t.enumeration(domains)),
    level: t.maybeNull(t.enumeration(levels))
  })
  .views((skill) => ({
    get slug() {
      return skill.code;
    }
  }))
  .actions((skill) => ({
    edit({ code, description, domain, level }) {
      skill.code = code;
      skill.description = description;
      skill.domain = domain;
      skill.level = level;
      return getParent(skill, 2).updateSkill(skill);
    },
    remove: function remove() {
      getParent(skill, 2).removeSkill(skill);
    }
  }));

const SkillStore = t
  .model("SkillStore", {
    skills: t.map(SkillModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending")
  })
  .views((store) => ({
    get isEmpty() {
      return store.skills.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    },
    getSkillsByLevel(level) {
      return values(store.skills).filter((skill) => skill.level === level);
    }
  }))
  .actions((store) => ({
    getById(id) {
      for (const skill of values(store.skills))
        if (skill._id === id) return skill;
    },
    // CRUD API CALLS
    getSkills: flow(function* getSkills() {
      store.state = "pending";
      const { error, data } = yield api.get("skills");

      if (error || !Array.isArray(data)) {
        store.state = "error";
        return { error };
      }

      store.skills = array2map(data.map(mapSkills), "_id");
      store.state = "done";
    }),
    postSkill: flow(function* postSkill(snapshot) {
      store.state = "pending";
      const { error, data } = yield api.post("skills", snapshot);

      if (error) {
        store.state = "error";
        return { error };
      }

      const skill = SkillModel.create(mapSkills(data));
      store.state = "done";
      return { data };
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
      return { data };
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
      return { data };
    })
  }));

export const SkillType = t.model("SkillType", {
  store: t.optional(SkillStore, {})
});
