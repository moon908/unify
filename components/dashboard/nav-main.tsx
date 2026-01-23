"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  const router = useRouter()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="flex justify-center items-center h-10 bg-linear-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 hover:text-primary-foreground active:scale-95 shadow-md shadow-primary/20 transition-all font-bold tracking-tight rounded-xl px-4"
              onClick={() => router.push("/")}
            >
              <span>My Dashboard</span>
            </SidebarMenuButton>

          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="gap-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="h-9 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group/item"
                onClick={() => router.push(item.url)}
              >
                {item.icon && <item.icon className="size-4.5 text-muted-foreground group-hover/item:text-foreground transition-colors" />}
                <span className="font-semibold text-lg text-muted-foreground group-hover/item:text-foreground transition-colors">
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
