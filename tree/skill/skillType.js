import { values } from "mobx";
import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot,
  getRoot
} from "mobx-state-tree";
import api from "utils/api";
import { array2map } from "utils/array2map";
import { levels, mapDomains, mapSkills } from "./utils";

const DomainModel = t.model("DomainModel", {
  _id: t.identifier,
  name: t.string
});

const DomainStore = t
  .model("DomainStore", {
    domains: t.map(DomainModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending")
  })
  .views((store) => ({
    get isEmpty() {
      return store.domains.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    }
  }))
  .actions((store) => ({
    getById(id) {
      for (const domain of values(store.domains))
        if (domain._id === id) return domain;
    },
    // CRUD API CALLS
    getDomains: flow(function* getDomains() {
      store.state = "pending";
      const { error, data } = yield api.get("domains");

      if (error || !Array.isArray(data)) {
        store.state = "error";
        return { error };
      }

      store.domains = array2map(data.map(mapDomains), "_id");
      store.state = "done";
    }),
    postDomain: flow(function* postDomain(snapshot) {
      store.state = "pending";
      const { error, data } = yield api.post("domains", snapshot);

      if (error) {
        store.state = "error";
        return { error };
      }

      const domain = mapDomains(data);
      store.domains.put(domain);
      store.state = "done";
      return { data: domain };
    }),
    updateDomain: flow(function* updateDomain(domain) {
      store.state = "pending";
      const { error, data } = yield api.update(
        `domains/${domain._id}`,
        getSnapshot(domain)
      );

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data };
    }),
    removeDomain: flow(function* removeDomain(snapshot) {
      store.state = "pending";
      const { error, data } = yield api.remove(`domains/${snapshot._id}`);

      if (error) {
        store.state = "error";
        return { error };
      }

      destroy(store.getById(snapshot._id));
      store.state = "done";
      return { data };
    })
  }));

const DomainType = t.model("DomainType", {
  store: t.optional(DomainStore, {})
});

export const SkillModel = t
  .model("SkillModel", {
    _id: t.identifier,
    code: t.string,
    description: t.string,
    domain: t.maybeNull(t.safeReference(DomainModel)),
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
      return skill;
    },
    update() {
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
      yield getParent(store).domainType.store.getDomains();

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
  store: t.optional(SkillStore, {}),
  domainType: t.optional(DomainType, {})
});
