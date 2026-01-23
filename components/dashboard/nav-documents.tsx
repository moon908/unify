"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 px-4 mb-2">
        Documents & Assets
      </SidebarGroupLabel>
      <SidebarMenu className="px-2 gap-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className="h-10 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group/doc"
            >
              <a href={item.url} className="flex items-center gap-3">
                <item.icon className="size-4.5 text-muted-foreground group-hover/doc:text-primary transition-colors" />
                <span className="font-semibold text-[13px] text-muted-foreground group-hover/doc:text-foreground transition-colors">{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-black/10 dark:data-[state=open]:bg-white/10 rounded-md size-7 top-1.5"
                >
                  <IconDots className="size-4 opacity-50" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-xl shadow-2xl backdrop-blur-xl bg-card/90 border-none p-1"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem className="rounded-lg h-9 font-medium text-xs gap-3">
                  <IconFolder className="size-4 opacity-70" />
                  <span>Open Location</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg h-9 font-medium text-xs gap-3">
                  <IconShare3 className="size-4 opacity-70" />
                  <span>Share Asset</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/10" />
                <DropdownMenuItem variant="destructive" className="rounded-lg h-9 font-medium text-xs gap-3">
                  <IconTrash className="size-4" />
                  <span>Move to Trash</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="h-10 px-3 rounded-lg text-muted-foreground/50 hover:text-muted-foreground transition-all">
            <IconDots className="size-4 opacity-50" />
            <span className="text-[13px] font-medium">View All Library</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
