import { AdminAuthGuard } from "@/lib/admin-auth"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-background">
          <AdminSidebar />
          <SidebarInset className="w-full">
            <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
              <SidebarTrigger className="-ml-2 h-8 w-8" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex flex-1 items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">Admin Dashboard</h2>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto bg-muted/5">
              <div className="container max-w-screen-2xl mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AdminAuthGuard>
  )
}