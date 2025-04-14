import SidebarLayout from '@/app/sidebar-layout';

export default function TradeSuggestionsLayout({children}: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
}
