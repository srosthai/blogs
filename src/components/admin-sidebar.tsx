"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FileText, 
  Plus, 
  Settings, 
  Users,
  BarChart3,
  LogOut,
  PenSquare,
  ChevronRight,
  Tags,
  FolderOpen,
  Grid3X3,
  Folder
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    title: "Content",
    icon: FileText,
    items: [
      {
        title: "All Posts",
        icon: FolderOpen,
        href: "/admin",
      },
      {
        title: "Create New",
        icon: Plus,
        href: "/admin/new",
      },
      {
        title: "Categories",
        icon: Folder,
        href: "/admin/categories",
      },
      {
        title: "Post Categories",
        icon: Grid3X3,
        href: "/admin/post-categories",
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Content"])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin" className="group">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
                  <PenSquare className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Blog Admin</span>
                  <span className="truncate text-xs text-muted-foreground">Content Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">MAIN MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                if (item.items) {
                  const isExpanded = expandedItems.includes(item.title)
                  const hasActiveChild = item.items.some(subItem => pathname === subItem.href)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => toggleExpanded(item.title)}
                        className={cn(
                          "group relative",
                          hasActiveChild && "bg-sidebar-accent"
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                        <ChevronRight className={cn(
                          "size-4 transition-transform duration-200",
                          isExpanded && "rotate-90"
                        )} />
                      </SidebarMenuButton>
                      {isExpanded && (
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.href}
                                  className="group"
                                >
                                  <Link href={subItem.href} className="flex items-center gap-2">
                                    {SubIcon && <SubIcon className="size-3 shrink-0" />}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  )
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="group"
                    >
                      <Link href={item.href}>
                        <Icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          {session?.user && (
            <SidebarMenuItem>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{session.user.name || 'Admin'}</span>
                  <span className="text-xs text-muted-foreground">{session.user.email}</span>
                </div>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarSeparator className="my-2" />
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: '/' })}
              className="group text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="size-4 shrink-0" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}