import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import FullPageLoading from "../../full-page-loading/full-page-loading";
import { useCurrentUser } from "@/hooks/use-user";

type ProtectedPageProps = {
  children: ReactNode;
};

const ProtectedPage: React.FC<Readonly<ProtectedPageProps>> = ({
  children,
}) => {
  const user = useCurrentUser();
  const router = useRouter();

  if (user === undefined) {
    router.push("/auth/login");
  }

  return (
    <>
      {user === null && <FullPageLoading />}
      {user && children}
    </>
  );
};

export default ProtectedPage;
