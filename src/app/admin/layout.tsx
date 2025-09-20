import { AppHeader } from "@/components/app/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
}
