"use client";
import PageContainer from "@/components/atoms/containers/page-container/page-container";

export default function Home() {
  return (
    <main>
      <PageContainer>
        <div className="prose">
          <h1>Mivoden Activity Signups Generator</h1>
          <p>
            Welcome to the Mivoden Activity Signups Generator. This is a tool to
            help you create signups for activities at Camp Mivoden.
          </p>
          <p>Select a week to get started</p>
        </div>
      </PageContainer>
    </main>
  );
}
