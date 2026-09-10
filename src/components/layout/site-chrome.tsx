import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AssistantDrawer } from "@/components/ai/assistant-drawer";
import { DemoBanner } from "./demo-banner";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AssistantDrawer />
    </div>
  );
}
