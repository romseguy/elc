import { useEffect } from "react";
import { useStore } from "tree";
import { observer } from "mobx-react-lite";
import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Modal,
  useDisclosure
} from "@chakra-ui/core";

export const Confirm = observer(() => {
  const { confirmType } = useStore();
  const disclosure = useDisclosure({
    defaultIsOpen: confirmType.isOpen
  });
  const onClose = () => confirmType.onClose();
  const onConfirm = () => confirmType.onConfirm();

  useEffect(() => {
    if (confirmType.isOpen) disclosure.onOpen();
    else disclosure.onClose();
  }, [confirmType.isOpen]);

  return (
    <Modal isOpen={disclosure.isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>{confirmType.getHeader()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{confirmType.getBody()}</ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button ml={5} onClick={onConfirm}>
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
});
