import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { TestWork } from "@/components/test/test-work";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Test a Work" };

export default function TestPage() {
  const { t } = getT();
  return (
    <>
      <PageHeader
        eyebrow={t("test.eyebrow")}
        title={t("test.title")}
        description={t("test.body")}
        breadcrumb={[
          { label: t("common.home"), href: "/" },
          { label: t("test.title"), href: "/test" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <TestWork />
      </div>
    </>
  );
}
