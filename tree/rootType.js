import { types as t } from "mobx-state-tree";
import { Counter } from "./counter";
import { Confirm } from "./confirm";
import { ObservationType } from "./observation/observationType";
import { ParentType } from "./parent/parentType";
import { ProfileType } from "./profile/profileType";
import { SkillType } from "./skill/skillType";
import { WorkshopType } from "./workshop/workshopType";

const rootTypes = {
  counter: t.optional(Counter, {}),
  confirm: t.optional(Confirm, {}),
  observationType: t.optional(ObservationType, {}),
  parentType: t.optional(ParentType, {}),
  profileType: t.optional(ProfileType, {}),
  skillType: t.optional(SkillType, {}),
  workshopType: t.optional(WorkshopType, {})
};

let TYPES = {};

Object.keys(rootTypes).forEach((key) => {
  const K = key.substr(0, key.length - 4).toUpperCase();
  TYPES[K] = K;
});

const RootType = t.model(rootTypes).actions((root) => ({
  reset() {
    Object.keys(root).forEach((key) => {
      root[key].reset && root[key].reset();
    });
  }
}));

export { RootType, TYPES };
