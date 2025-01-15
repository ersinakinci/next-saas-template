import { ReactQueryProvider } from "@/components/providers/react-query";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <div>{children}</div>
    </ReactQueryProvider>
  );
}
