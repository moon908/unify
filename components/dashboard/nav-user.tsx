"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-black/10 dark:data-[state=open]:bg-white/10 h-14 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Avatar className="h-9 w-9 rounded-lg border-2 border-primary/20 transition-transform group-hover:scale-105">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-black text-foreground/90">{user.name}</span>
                <span className="text-muted-foreground/60 truncate text-[10px] font-bold uppercase tracking-wider">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 opacity-30" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-2xl shadow-2xl backdrop-blur-2xl bg-card/90 border-none p-2 mb-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-3 text-left">
                <Avatar className="h-10 w-10 rounded-xl border-2 border-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-xl font-bold bg-primary/20">JD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-black text-lg -mb-0.5">{user.name}</span>
                  <span className="text-muted-foreground/60 truncate text-[10px] font-bold uppercase tracking-wider">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/10 my-1" />
            <DropdownMenuGroup className="gap-1 flex flex-col">
              <DropdownMenuItem onClick={() => router.push("/profile")} className="rounded-lg h-10 px-3 font-semibold text-xs gap-3">
                <IconUserCircle className="size-7 opacity-70" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/notification")} className="rounded-lg h-10 px-3 font-semibold text-xs gap-3">
                <IconNotification className="size-7 opacity-70" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/10 my-1" />
            <DropdownMenuItem className="rounded-lg h-10 px-3 font-semibold text-xs gap-3 text-rose-500 focus:text-rose-500 focus:bg-rose-500/10">
              <IconLogout className="size-7" />
              <span>Sign Out Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
