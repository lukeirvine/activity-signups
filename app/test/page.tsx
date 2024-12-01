"use client";

import Button from "@/components/atoms/buttons/button/button";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import PagePadding from "@/components/atoms/containers/page-padding/page-padding";
import ProtectedPage from "@/components/atoms/containers/protected-page/protected-page";
import { useCallableFunction } from "@/hooks/use-firebase";

export default function Page() {
  const { callFunction, loading } = useCallableFunction("databaseTransform");

  return (
    <PagePadding>
      <ProtectedPage>
        <PageContainer>
          <div className="flex flex-col gap-4 items-start">
            <div className="prose">
              <h1>Test Page</h1>
            </div>
            <Button
              onClick={async () => {
                const result = await callFunction();
                console.log(result);
              }}
              loading={loading}
            >
              Run Function
            </Button>
          </div>
        </PageContainer>
      </ProtectedPage>
    </PagePadding>
  );
}
