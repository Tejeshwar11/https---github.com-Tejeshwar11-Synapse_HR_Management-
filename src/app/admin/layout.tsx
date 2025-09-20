import { AppHeader } from "@/components/app/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader userRole="admin" />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
}
