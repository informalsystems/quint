import SidebarLayout from '@/app/sidebar-layout';

export default function QRCodePaymentLayout({children}: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
}
