import { PublicNavHeader } from "@/application/nav/components/public-nav-header";

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
