import SidebarLayout from '@/app/sidebar-layout';

export default function DashboardLayout({children}: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
}
