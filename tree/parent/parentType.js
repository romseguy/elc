import {
  types as t,
  flow,
  getParent,
  destroy,
  getSnapshot
} from "mobx-state-tree";
import { ProfileModel } from "tree";
import api from "utils/api";

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
    setParents: async function setParents(data) {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(data)) return reject();

        const parents = {};
        data.forEach(({ _id, firstname, lastname, email, children }) => {
          parents[_id] = {
            _id,
            firstname,
            lastname,
            email,
            children
          };
        });
        resolve(parents);
      });
    },
    // API
    getParents: flow(function* getParents() {
      store.state = "pending";
      const { error, data } = yield api.get("parents");

      if (error) {
        store.state = "error";
        return { error };
      }

      store.parents = yield store.setParents(data);
      store.state = "done";
    }),
    postParent: flow(function* postParent(formData) {
      store.state = "pending";
      const { error, data } = yield api.post("parents", formData);

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data: ParentModel.create(data) };
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
  .actions((self) => ({
    selectParent: flow(function* selectParent(slug) {
      if (self.store.state === "pending") yield self.store.getParents();
      self.store.parents.forEach((parent) => {
        if (slug === parent.slug) {
          self.selectedParent = parent;
        }
      });
      if (self.selectedParent === undefined) {
        self.selectedParent = null;
      }
    })
  }));
