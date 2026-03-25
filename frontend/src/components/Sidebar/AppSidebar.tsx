import { Link, useRouterState } from "@tanstack/react-router"
import { LayoutList, CreditCard, Settings, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { icon: LayoutList, title: "WorkLogs", path: "/worklogs" },
  { icon: CreditCard, title: "Payment", path: "/payment" },
]

export function AppSidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-md bg-[#C8953B] flex items-center justify-center flex-shrink-0">
            <span className="text-[#08090C] text-xs font-bold leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>WL</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold leading-tight" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}>WorkLog</p>
            <p className="text-[10px] tracking-wide" style={{ color: 'var(--c-text-muted)' }}>Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path)
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`
                    rounded-md transition-all duration-150 text-sm
                    ${isActive
                      ? 'bg-[rgba(200,149,59,0.12)] font-medium'
                      : 'hover:bg-[rgba(128,128,128,0.08)]'
                    }
                  `}
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    color: isActive ? 'var(--c-amber)' : 'var(--c-text-muted)',
                  }}
                >
                  <Link to={item.path}>
                    <item.icon
                      size={16}
                      style={{ color: isActive ? 'var(--c-amber)' : 'var(--c-text-muted)' }}
                    />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4 border-t border-sidebar-border pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="rounded-md text-sm hover:bg-[rgba(128,128,128,0.08)] transition-all duration-150"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--c-text-muted)' }}
            >
              {isDark ? <Sun size={16} style={{ color: 'var(--c-text-muted)' }} /> : <Moon size={16} style={{ color: 'var(--c-text-muted)' }} />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-md text-sm hover:bg-[rgba(128,128,128,0.08)] transition-all duration-150"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--c-text-muted)' }}
            >
              <Link to="/settings">
                <Settings size={16} style={{ color: 'var(--c-text-muted)' }} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
