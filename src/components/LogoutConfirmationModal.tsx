import ConfirmationModal from './ConfirmationModal';

type LogoutConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
};

const LogoutConfirmationModal = ({
  isOpen,
  onClose,
  onConfirmLogout,
}: LogoutConfirmationModalProps) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirmLogout}
      title="Confirmar Saída"
      bodyText="Você tem certeza que deseja sair do sistema?"
      confirmButtonText="Sim, sair"
      confirmButtonColorScheme="red"
    />
  );
};

export default LogoutConfirmationModal;
