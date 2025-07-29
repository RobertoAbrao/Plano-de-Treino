
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Target, ClipboardList } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTitle,
} from "@/components/ui/sidebar";

const links = [
  {
    href: "/",
    label: "Meu Treino",
    icon: Dumbbell,
  },
  {
    href: "/focus",
    label: "Foco da Semana",
    icon: Target,
  },
  {
    href: "/generator",
    label: "Gerador de Treino",
    icon: ClipboardList,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Dumbbell className="size-6 text-primary" />
            <SidebarTitle>Personal Trainer</SidebarTitle>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <Link href={link.href} className="w-full">
              <SidebarMenuButton
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <link.icon className="size-4" />
                <span>{link.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
}

    
