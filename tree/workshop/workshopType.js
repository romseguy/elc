import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot,
} from "mobx-state-tree";
import api from "utils/api";
import { SkillModel } from "tree";

export const levels = ["-", "CP", "CE1", "CE2", "CM1", "CM2"];
export const domains = ["-", "Français"];

export const WorkshopModel = t
  .model("WorkshopModel", {
    _id: t.identifier,
    name: t.string,
    skills: t.optional(
      t.array(t.reference(t.late(() => SkillModel))),
      // t.array(t.maybe(t.reference(t.late(() => ProfileModel)))),
      // t.array(t.safeReference(ProfileModel, { acceptsUndefined: false })),
      []
    ),
  })
  .views((workshop) => ({
    get slug() {
      return workshop.name;
    },
  }))
  .actions((workshop) => ({
    fromUi(data) {
      workshop.name = data.name;
      workshop.skills = data.skills === null ? [] : data.skills;
      return workshop;
    },
    update() {
      return getParent(workshop, 2).updateWorkshop(workshop);
    },
    remove: function remove() {
      getParent(workshop, 2).removeWorkshop(workshop);
    },
  }));

const WorkshopStore = t
  .model("WorkshopStore", {
    workshops: t.map(WorkshopModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending"),
  })
  .views((store) => ({
    get isEmpty() {
      return store.workshops.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    },
  }))
  .actions((store) => ({
    setWorkshops: async function setWorkshops(data) {
      return new Promise((resolve, reject) => {
        const workshops = {};
        data.forEach(({ _id, ...attrs }) => {
          workshops[_id] = {
            _id,
            ...attrs,
          };
        });
        resolve(workshops);
      });
    },
    // API
    getWorkshops: flow(function* getWorkshops() {
      store.state = "pending";
      const { error, data } = yield api.get("workshops");

      if (error) {
        store.state = "error";
        return { error };
      }

      store.workshops = yield store.setWorkshops(data);
      store.state = "done";
    }),
    postWorkshop: flow(function* postWorkshop(formData) {
      store.state = "pending";
      const { error, data } = yield api.post("workshops", formData);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data: WorkshopModel.create(data) };
    }),
    updateWorkshop: flow(function* updateWorkshop(workshop) {
      store.state = "pending";
      const { error, data } = yield api.update(
        `workshops/${workshop._id}`,
        getSnapshot(workshop)
      );

      if (error) {
        store.state = "error";
        return error;
      }

      store.state = "done";
      return data;
    }),
    removeWorkshop: flow(function* removeWorkshop(workshop) {
      // destroy(workshop);
      store.state = "pending";
      const { data, error } = yield api.remove(`workshops/${workshop._id}`);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return data;
    }),
  }));

export const WorkshopType = t
  .model("WorkshopType", {
    store: t.optional(WorkshopStore, {}),
    selectedWorkshop: t.optional(
      t.maybeNull(t.safeReference(WorkshopModel)),
      undefined
    ),
  })
  .actions((self) => ({
    selectWorkshop: flow(function* selectWorkshop(slug) {
      yield self.store.getWorkshops();
      self.store.workshops.forEach((workshop) => {
        if (slug === workshop.slug) {
          self.selectedWorkshop = workshop;
        }
      });
      if (self.selectedWorkshop === undefined) {
        self.selectedWorkshop = null;
      }
    }),
  }));
