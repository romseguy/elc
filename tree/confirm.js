import { applySnapshot, types as t } from "mobx-state-tree";

let onConfirm = () => {};
let header = null;
let body = null;

export const Confirm = t
  .model({
    isOpen: t.optional(t.boolean, false)
  })
  .actions((confirm) => ({
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

      applySnapshot(confirm, { isOpen: true, ...props });
    },
    onClose() {
      confirm.reset();
    },
    onConfirm() {
      confirm.reset();
      onConfirm();
    },
    reset() {
      applySnapshot(confirm, { isOpen: false });
    }
  }));
