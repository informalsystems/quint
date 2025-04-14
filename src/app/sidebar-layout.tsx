import * as React from 'react';

import {Icons} from '@/components/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';

interface SidebarNavItem {
  title: string;
  href: string;
  icon: keyof typeof Icons;
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'home',
  },
  {
    title: 'Onboarding',
    href: '/onboarding',
    icon: 'plusCircle',
  },
  {
    title: 'QR Code Payment',
    href: '/qr-code-payment',
    icon: 'qrCode',
  },
  {
    title: 'Marketplace',
    href: '/marketplace',
    icon: 'search',
  },
  {
    title: 'Trade Suggestions',
    href: '/trade-suggestions',
    icon: 'workflow',
  },
  {
    title: 'PayPal Top-up',
    href: '/paypal-topup',
    icon: 'mail',
  },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({children}: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarTrigger className="md:hidden"/>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {sidebarNavItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton href={item.href} asChild>
                    <Button variant="ghost" className="justify-start">
                      <Icons[item.icon] className="mr-2 h-4 w-4"/>
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarGroup>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Sardex Network Hub
              </p>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
