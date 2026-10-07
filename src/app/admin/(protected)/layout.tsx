import AdminShell from "@/components/admin/AdminShell";
import { DialogRenderer } from "@/components/admin/DialogSystem";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      {children}
      <DialogRenderer />
    </AdminShell>
  );
}
