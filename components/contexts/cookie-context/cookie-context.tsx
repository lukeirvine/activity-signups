"use client";

import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { createContext, useCallback, useContext, useEffect } from "react";

type CookieContextType = {
  getCookie: (key: string) => Promise<any>;
  setCookie: (key: string, value: string) => Promise<void>;
  deleteCookie: (key: string) => Promise<void>;
  getAllCookies: () => Promise<RequestCookie[]>;
};

const cookieContextDefaultValues: CookieContextType = {
  getCookie: async () => {
    throw new Error("getCookieAction is not implemented");
  },
  setCookie: async () => {
    throw new Error("setCookieAction is not implemented");
  },
  deleteCookie: async () => {
    throw new Error("deleteCookieAction is not implemented");
  },
  getAllCookies: async () => {
    throw new Error("getAllCookiesAction is not implemented");
  },
};

const CookieContext = createContext(cookieContextDefaultValues);

export function useCookieContext() {
  return useContext(CookieContext);
}

type CookieProviderProps = {
  children: React.ReactNode;
  getCookieAction: (key: string) => Promise<any>;
  setCookieAction: (key: string, value: string) => Promise<void>;
  deleteCookieAction: (key: string) => Promise<void>;
  getAllCookiesAction: () => Promise<RequestCookie[]>;
};

export const CookieProvider: React.FC<Readonly<CookieProviderProps>> = ({
  children,
  getCookieAction,
  setCookieAction,
  deleteCookieAction,
  getAllCookiesAction,
}) => {
  const getCookie = useCallback(getCookieAction, [getCookieAction]);
  const setCookie = useCallback(setCookieAction, [setCookieAction]);
  const deleteCookie = useCallback(deleteCookieAction, [deleteCookieAction]);
  const getAllCookies = useCallback(getAllCookiesAction, [getAllCookiesAction]);

  useEffect(() => {
    (async () => {
      // Use for one-off cookie setting
    })();
  }, []);
  return (
    <CookieContext.Provider
      value={{
        getCookie,
        setCookie,
        deleteCookie,
        getAllCookies,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};
