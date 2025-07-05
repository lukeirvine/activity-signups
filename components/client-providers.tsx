import { cookies } from "next/headers";
import { ActionVerificationModalProvider } from "./contexts/action-verification-modal-context/action-verification-modal-context";
import { CookieProvider } from "./contexts/cookie-context/cookie-context";

interface Props {
  children: React.ReactNode;
}

const ClientProviders = ({ children }: Props) => {
  const setCookieAction = async (key: string, value: string) => {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set(key, value);
  };

  const getCookieAction = async (key: string) => {
    "use server";
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
  };

  const getAllCookiesAction = async () => {
    "use server";
    const cookieStore = await cookies();
    return cookieStore.getAll();
  };

  const deleteCookieAction = async (key: string) => {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete(key);
  };

  return (
    <CookieProvider
      getCookieAction={getCookieAction}
      setCookieAction={setCookieAction}
      deleteCookieAction={deleteCookieAction}
      getAllCookiesAction={getAllCookiesAction}
    >
      <ActionVerificationModalProvider>
        {children}
      </ActionVerificationModalProvider>
    </CookieProvider>
  );
};

export default ClientProviders;
