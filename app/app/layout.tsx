import { QueryProvider } from "@/services/query/components/query-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div>{children}</div>
    </QueryProvider>
  );
}
