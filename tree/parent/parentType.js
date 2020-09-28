import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot,
} from "mobx-state-tree";
import { ProfileModel } from "tree/profile";
import api from "utils/api";

const ParentModel = t
  .model("ParentModel", {
    _id: t.identifier,
    firstname: t.string,
    lastname: t.string,
    email: t.string,
    children: t.optional(
      t.array(t.reference(ProfileModel)),
      // t.array(t.maybe(t.reference(t.late(() => ProfileModel)))),
      // t.array(t.safeReference(ProfileModel, { acceptsUndefined: false })),
      []
    ),
  })
  .views((parent) => ({
    get slug() {
      return `${parent.firstname}-${parent.lastname}`;
    },
  }))
  .actions((parent) => ({
    merge(formData) {
      parent.firstname = formData.firstname;
      parent.lastname = formData.lastname;
      parent.email = formData.email;
      parent.children = formData.profiles === "" ? [] : formData.profiles;
    },
    update() {
      return getParent(parent, 2).updateParent(parent);
    },
    remove: function remove() {
      getParent(parent, 2).removeParent(parent);
    },
  }));

const ParentStore = t
  .model("ParentStore", {
    parents: t.map(ParentModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending"),
  })
  .views((store) => ({
    get isEmpty() {
      return store.parents.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    },
  }))
  .actions((store) => ({
    setParents(data) {
      const parents = {};
      data.forEach(({ _id, firstname, lastname, email, children }) => {
        parents[_id] = ParentModel.create({
          _id,
          firstname,
          lastname,
          email,
          children,
        });
      });
      store.parents = parents;
    },
    // API
    fetch: flow(function* fetch() {
      store.state = "pending";
      const { data } = yield api.get("parents");
      store.setParents(data);
      store.state = "done";
    }),
    postParent: flow(function* postParent(data) {
      store.state = "pending";
      const res = yield api.post("parents", data);
      store.state = "done";
      return res;
    }),
    updateParent: flow(function* updateParent(parent) {
      store.state = "pending";
      const res = yield api.update(
        `parents/${parent._id}`,
        getSnapshot(parent)
      );
      store.state = "done";
      return res;
    }),
    removeParent: flow(function* removeParent(parent) {
      // destroy(parent);
      store.state = "pending";
      const res = yield api.remove(`parents/${parent._id}`);
      store.state = "done";
      return res;
    }),
  }));

export const ParentType = t
  .model("ParentType", {
    store: t.optional(ParentStore, {}),
    selectedParent: t.optional(
      t.maybeNull(t.safeReference(ParentModel)),
      undefined
    ),
  })
  .actions((self) => ({
    selectParent: flow(function* selectParent(slug) {
      yield self.store.fetch();
      self.store.parents.forEach((parent) => {
        if (slug === parent.slug) {
          self.selectedParent = parent;
        }
      });

      if (self.selectedParent === undefined) {
        self.selectedParent = null;
      }
    }),
  }));
