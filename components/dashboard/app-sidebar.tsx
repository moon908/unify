"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { GrAd } from "react-icons/gr";
import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavSecondary } from "./nav-secondary";
import { supabase } from "@/lib/supabase/client"


const data = {
  user: {
    name: "userxyz",
    email: "userxyz@gmail.com",
    avatar: "/profile.jpeg",
  },
  navMain: [
    {
      title: "Workspace",
      url: "/dashboard/workspace",
      icon: IconDashboard,
    },
    {
      title: "Task Management",
      url: "/dashboard/taskManagement",
      icon: IconListDetails,
    },
    {
      title: "My Hub",
      url: "/dashboard/myHub",
      icon: IconFolder,
    },
    {
      title: "My Team",
      url: "/dashboard/myTeam",
      icon: IconUsers,
    },

    {
      title: "Calender",
      url: "/dashboard/calender",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [workspaces, setWorkspaces] = React.useState<{ title: string; url: string; icon: any }[]>([])

  React.useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const { data, error } = await supabase
          .from('Workspace')
          .select('id, project')

        if (error) throw error

        if (data) {
          const workspaceItems = data.map((ws: any) => ({
            title: ws.project,
            url: `/dashboard/taskManagement?workspaceId=${ws.id}`,
            icon: IconInnerShadowTop,
          }))
          setWorkspaces(workspaceItems)
        }
      } catch (error) {
        console.error('Error fetching workspaces for sidebar:', error)
      }
    }

    fetchWorkspaces()
  }, [])

  return (
    <Sidebar collapsible="offcanvas" className="border-none bg-linear-to-b from-sidebar to-sidebar/95 backdrop-blur-xl" {...props}>
      <SidebarHeader className="py-6 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-transparent"
            >
              <a href="#" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 bg-linear-to-br from-primary to-primary/80">
                  <GrAd size={22} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/80">
                    UNIFY PM
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    Enterprise
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 gap-0">
        <NavMain items={data.navMain} />
        <div className="py-1 px-4">
          <div className="h-px bg-linear-to-r from-transparent via-border/10 to-transparent" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/80">My Workspaces</h1>
          <NavSecondary items={workspaces} />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-black/5 dark:bg-white/5 backdrop-blur-sm border-t border-border/10">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
