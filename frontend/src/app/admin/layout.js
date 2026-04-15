import AdminAuthShell from '@/components/AdminAuthShell';

export const metadata = {
  title: 'Admin',
  description:
    'FACTACTO admin: analytics, data browser, and monthly activity reports for the IT Department.',
};

export default function AdminLayout({ children }) {
  return <AdminAuthShell>{children}</AdminAuthShell>;
}
