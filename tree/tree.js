import { createContext, useContext } from "react";
import { useStaticRendering } from "mobx-react-lite";
import { applySnapshot, onSnapshot, types as t } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import { isServer } from "utils/isServer";
import { Counter } from "./counter";
import { Confirm } from "./confirm";
import {
  ObservationType,
  ParentType,
  ProfileType,
  SkillType,
  WorkshopType
} from "./";

useStaticRendering(isServer());
let clientStore;

export const Tree = t
  .model({
    counter: t.optional(Counter, {}),
    confirm: t.optional(Confirm, {}),
    observationType: t.optional(ObservationType, {}),
    parentType: t.optional(ParentType, {}),
    profileType: t.optional(ProfileType, {}),
    skillType: t.optional(SkillType, {}),
    workshopType: t.optional(WorkshopType, {})
  })
  .actions((tree) => ({
    reset() {
      Object.keys(tree).forEach((key) => {
        tree[key].reset && tree[key].reset();
      });
    }
  }));

export function initializeStore(snapshot = null) {
  const root = makeInspectable(Tree.create({}));
  // if (!process.env.NEXT_PUBLIC_IS_TEST)
  onSnapshot(
    root,
    (snapshot) => console.log(snapshot)
    //   //(snapshot) => !isServer() && console.log(snapshot)
    //   //(snapshot) => console.log(JSON.stringify(snapshot, null, 2))
  );
  const store = clientStore ?? root;

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here
  if (snapshot) {
    applySnapshot(store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return store;
  // Create the store once in the client
  if (!clientStore) clientStore = store;

  return clientStore;
}

const RootStoreContext = createContext(null);
export const Provider = RootStoreContext.Provider;

export function useStore() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}

// make instance JSON serializable
// export const getSnapshot = (instance) => {
//   console.log(instance);
//   // filter undefined values
//   let o = {};
//   Object.keys(instance).forEach((key) => {
//     if (instance[key] !== undefined) o[key] = instance[key];
//   });
//   return o;
// };
