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
import { useParams } from "next/navigation"
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


const getNavMain = (orgId: string) => [
  {
    title: "Workspace",
    url: `/organisation/${orgId}/dashboard/workspace`,
    icon: IconDashboard,
  },
  {
    title: "Task Management",
    url: `/organisation/${orgId}/dashboard/taskManagement`,
    icon: IconListDetails,
  },
  {
    title: "My Hub",
    url: `/organisation/${orgId}/dashboard/myHub`,
    icon: IconFolder,
  },
  {
    title: "My Team",
    url: `/organisation/${orgId}/dashboard/myTeam`,
    icon: IconUsers,
  },
  {
    title: "Calender",
    url: `/organisation/${orgId}/dashboard/calender`,
    icon: IconChartBar,
  },
]

const data = {
  user: {
    name: "userxyz",
    email: "userxyz@gmail.com",
    avatar: "/profile.jpeg",
  },
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
  const params = useParams()
  const orgId = params.orgId as string
  const [workspaces, setWorkspaces] = React.useState<{ title: string; url: string; icon: any }[]>([])

  React.useEffect(() => {
    async function fetchWorkspaces() {
      if (!orgId) return
      try {
        const { data, error } = await supabase
          .from('Workspace')
          .select('id, project')
          .eq('org_id', orgId) // Assuming there is an org_id column

        if (error) throw error

        if (data) {
          const workspaceItems = data.map((ws: any) => ({
            title: ws.project,
            url: `/organisation/${orgId}/dashboard/taskManagement?workspaceId=${ws.id}`,
            icon: IconInnerShadowTop,
          }))
          setWorkspaces(workspaceItems)
        }
      } catch (error) {
        console.error('Error fetching workspaces for sidebar:', error)
      }
    }

    fetchWorkspaces()
  }, [orgId])

  return (
    <Sidebar collapsible="offcanvas" className="border-none bg-linear-to-b from-sidebar to-sidebar/95 backdrop-blur-xl" {...props}>
      <SidebarHeader className="py-4 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-transparent"
            >
              <a href="#" className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 bg-linear-to-br from-primary to-primary/80">
                  <GrAd size={20} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/80">
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
        <NavMain items={getNavMain(orgId)} />
        <div className="py-1 px-4">
          <div className="h-px bg-linear-to-r from-transparent via-border/10 to-transparent" />
        </div>
        <div className="px-4 py-2">
          <h1 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">My Workspaces</h1>
          <NavSecondary items={workspaces} />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-black/5 dark:bg-white/5 backdrop-blur-sm border-t border-border/10">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
