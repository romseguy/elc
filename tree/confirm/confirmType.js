import { applySnapshot, types as t } from "mobx-state-tree";

let onConfirm = () => {};
let header = null;
let body = null;

export const ConfirmType = t
  .model({
    isOpen: t.optional(t.boolean, false)
  })
  .actions((type) => ({
    getBody() {
      return body;
    },
    getHeader() {
      return header;
    },
    onOpen(props) {
      onConfirm = props.onConfirm;
      header = props.header;
      body = props.body;

      applySnapshot(type, { isOpen: true, ...props });
    },
    onClose() {
      type.reset();
    },
    onConfirm() {
      type.reset();
      onConfirm();
    },
    reset() {
      applySnapshot(type, { isOpen: false });
    }
  }));
