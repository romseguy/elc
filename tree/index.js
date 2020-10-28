import { createContext, useContext } from "react";
import { applySnapshot, onSnapshot } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import { RootType } from "./rootType";

let clientStore;

const initializeStore = (snapshot = null) => {
  const instance = makeInspectable(RootType.create({}));
  // if (!process.env.NEXT_PUBLIC_IS_TEST)
  onSnapshot(
    instance,
    (snapshot) => console.log(snapshot)
    //   //(snapshot) => !isServer() && console.log(snapshot)
    //   //(snapshot) => console.log(JSON.stringify(snapshot, null, 2))
  );
  const store = clientStore ?? instance;

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
};

const RootStoreContext = createContext(null);
const Provider = RootStoreContext.Provider;

const useStore = () => {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
};

export { Provider, initializeStore, useStore };

export * from "./observation/observationType";
export * from "./profile/profileType";
export * from "./parent/parentType";
export * from "./skill/skillType";
export * from "./workshop/workshopType";
export * from "./rootType";
