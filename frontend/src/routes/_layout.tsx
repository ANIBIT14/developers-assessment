import { createFileRoute, Outlet } from "@tanstack/react-router"
import AppSidebar from "@/components/Sidebar/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export const Route = createFileRoute("/_layout")({
  component: Layout,
})

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border px-5 backdrop-blur-sm"
          style={{ background: 'var(--c-surface-header)' }}
        >
          <SidebarTrigger className="-ml-1 transition-colors" style={{ color: 'var(--c-text-muted)' }} />
          <div className="h-4 w-px ml-1" style={{ background: 'var(--c-border-strong)' }} />
          <span className="text-xs font-['Outfit'] tracking-wide" style={{ color: 'var(--c-text-muted)' }}>WorkLog Admin</span>
        </header>
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
