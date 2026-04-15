import DashboardAuthShell from '@/components/DashboardAuthShell';

export const metadata = {
  title: 'Faculty dashboard',
  description:
    'FACTACTO faculty workspace: browse activity categories, open forms, and submit publications, conferences, projects, and events.',
};

export default function DashboardLayout({ children }) {
  return <DashboardAuthShell>{children}</DashboardAuthShell>;
}
