import SidebarLayout from '@/app/sidebar-layout';

export default function OnboardingLayout({children}: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
}
