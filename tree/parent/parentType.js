import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot,
  getRoot
} from "mobx-state-tree";
import { ProfileModel } from "tree";
import api from "utils/api";
import { array2map } from "utils/array2map";
import { mapParents } from "./utils";

export const ParentModel = t
  .model("ParentModel", {
    _id: t.identifier,
    firstname: t.string,
    lastname: t.string,
    email: t.string,
    children: t.maybeNull(t.array(t.reference(t.late(() => ProfileModel))))
    // t.array(t.maybe(t.reference(t.late(() => ProfileModel)))),
    // t.array(t.safeReference(ProfileModel, { acceptsUndefined: false })),
  })
  .views((parent) => ({
    get slug() {
      return `${parent.firstname}-${parent.lastname}`;
    }
  }))
  .actions((parent) => ({
    edit(data) {
      parent.firstname = data.firstname;
      parent.lastname = data.lastname;
      parent.email = data.email;
      parent.children = !data.children
        ? []
        : data.children.map(({ _id }) => _id);
      return parent;
    },
    update() {
      return getParent(parent, 2).updateParent(parent);
    },
    remove: function remove() {
      getParent(parent, 2).removeParent(parent);
    }
  }));

const ParentStore = t
  .model("ParentStore", {
    parents: t.map(ParentModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending")
  })
  .views((store) => ({
    get isEmpty() {
      return store.parents.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    }
  }))
  .actions((store) => ({
    // CRUD API CALLS
    getParents: flow(function* getParents() {
      yield getRoot(store).profileType.store.getProfiles();

      store.state = "pending";
      const { error, data } = yield api.get("parents");

      if (error || !Array.isArray(data)) {
        store.state = "error";
        return { error };
      }

      store.parents = array2map(data.map(mapParents), "_id");
      store.state = "done";
    }),
    postParent: flow(function* postParent(snapshot) {
      store.state = "pending";
      const { error, data } = yield api.post("parents", snapshot);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data: ParentModel.create(mapParents(data)) };
    }),
    updateParent: flow(function* updateParent(parent) {
      store.state = "pending";
      const { error, data } = yield api.update(
        `parents/${parent._id}`,
        getSnapshot(parent)
      );

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data };
    }),
    removeParent: flow(function* removeParent(parent) {
      // destroy(parent);
      store.state = "pending";
      const { data, error } = yield api.remove(`parents/${parent._id}`);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data };
    })
  }));

export const ParentType = t
  .model("ParentType", {
    store: t.optional(ParentStore, {}),
    selectedParent: t.optional(
      t.maybeNull(t.safeReference(ParentModel)),
      undefined
    )
  })
  .actions((type) => ({
    selectParent(slug) {
      type.store.parents.forEach((parent) => {
        if (slug === parent.slug) {
          type.selectedParent = parent;
        }
      });
      if (type.selectedParent === undefined) {
        type.selectedParent = null;
      }
    }
  }));
