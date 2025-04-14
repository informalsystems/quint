import SidebarLayout from '@/app/sidebar-layout';

export default function MarketplaceLayout({children}: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
}
