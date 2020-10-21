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
  const { confirm } = useStore();
  const disclosure = useDisclosure({
    defaultIsOpen: confirm.isOpen
  });
  const onClose = () => confirm.onClose();
  const onConfirm = () => confirm.onConfirm();

  useEffect(() => {
    if (confirm.isOpen) disclosure.onOpen();
    else disclosure.onClose();
  }, [confirm.isOpen]);

  return (
    <Modal isOpen={disclosure.isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>{confirm.getHeader()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{confirm.getBody()}</ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={onConfirm}>Confirmer</Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
});
