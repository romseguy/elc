import { values } from "mobx";
import { types as t, flow, getSnapshot, getParent } from "mobx-state-tree";
import api from "utils/api";
import { array2map } from "utils/array2map";
import { mapObservations } from "./utils";

export const ObservationModel = t
  .model("ObservationModel", {
    _id: t.identifier,
    description: t.string
  })
  .views((obs) => ({
    get slug() {
      return obs._id;
    }
  }))
  .actions((observation) => ({
    edit({ description }) {
      observation.description = description;
      return observation;
    },
    update() {
      return getParent(observation, 2).updateObservation(observation);
    },
    remove: function remove() {
      getParent(observation, 2).removeObservation(observation);
    }
  }));
const ObservationStore = t
  .model("ObservationStore", {
    observations: t.map(ObservationModel),
    state: t.optional(t.enumeration(["pending", "done", "error"]), "pending")
  })
  .views((store) => ({
    get isEmpty() {
      return store.observations.size === 0;
    },
    get isLoading() {
      return store.state === "pending";
    }
  }))
  .actions((store) => ({
    getById(id) {
      for (const observation of values(store.observations))
        if (observation._id === id) return observation;
    },
    // CRUD API CALLS
    getObservations: flow(function* getObservations() {
      store.state = "pending";
      const { error, data } = yield api.get("observations");

      if (error) {
        store.state = "error";
        return { error };
      }

      store.observations = array2map(data.map(mapObservations), "_id");
      store.state = "done";
    }),
    postObservation: flow(function* postObservation(snapshot) {
      store.state = "pending";
      const { error, data } = yield api.post("observations", snapshot);

      if (error) {
        store.state = "error";
        return { error };
      }

      const model = ObservationModel.create(mapObservations(data));
      store.observations.set(model._id, model);
      store.state = "done";
      return { data: model };
    }),
    updateObservation: flow(function* updateObservation(observation) {
      store.state = "pending";
      const { error, data } = yield api.update(
        `observations/${observation._id}`,
        getSnapshot(observation)
      );

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data };
    }),
    removeObservation: flow(function* removeObservation(observation) {
      store.state = "pending";
      const { error, data } = yield api.remove(
        `observations/${observation._id}`
      );

      if (error) {
        store.state = "error";
        return { error };
      }

      store.state = "done";
      return { data };
    })
  }));
export const ObservationType = t.model("ObservationType", {
  store: t.optional(ObservationStore, {})
});
