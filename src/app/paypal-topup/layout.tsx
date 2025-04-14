import SidebarLayout from '@/app/sidebar-layout';

export default function PaypalTopUpLayout({children}: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
}
