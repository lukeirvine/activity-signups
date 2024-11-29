import { ActionVerificationModalProvider } from "./contexts/action-verification-modal-context/action-verification-modal-context";

interface Props {
  children: React.ReactNode;
}

const ClientProviders = ({ children }: Props) => {
  return (
    <ActionVerificationModalProvider>
      {children}
    </ActionVerificationModalProvider>
  );
};

export default ClientProviders;
