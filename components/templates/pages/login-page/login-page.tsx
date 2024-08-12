import React from "react";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import LoginForm from "@/components/organisms/forms/login-form/login-form";

type LoginPageProps = {};

const LoginPage: React.FC<Readonly<LoginPageProps>> = () => {
  return (
    <PagePadding>
      <PageContainer className="h-full">
        <div className="lg:flex lg:justify-center lg:h-full lg:items-center">
          <div className="lg:w-1/3 lg:mb-24">
            <div className="prose flex justify-center w-full">
              <h2>Login</h2>
            </div>
            <LoginForm />
          </div>
        </div>
      </PageContainer>
    </PagePadding>
  );
};

export default LoginPage;
