import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';

type SaveDraftModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
};

const SaveDraftModal = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
}: SaveDraftModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sair da Confirmação</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Deseja manter esta lista como rascunho para continuar depois?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" variant="ghost" mr={3} onClick={onDiscard}>
            Não, descartar
          </Button>
          <Button colorScheme="teal" onClick={onSave}>
            Sim, manter rascunho
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveDraftModal;
