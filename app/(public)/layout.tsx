import { PublicNavHeader } from "@/components/nav/public-nav-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavHeader />
      {children}
    </>
  );
}
