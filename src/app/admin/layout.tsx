import { AdminAuthGuard } from "@/lib/admin-auth"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminViewProvider } from "@/contexts/AdminViewContext"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Separator } from "@/components/ui/separator"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="admin-theme"
      >
        <div className="min-h-screen bg-background text-foreground antialiased transition-all duration-300">
          <AdminViewProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 dark:to-background/80 transition-all duration-300">
                <AdminSidebar />
                <SidebarInset className="w-full bg-transparent">
                  <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-6 transition-all duration-300 shadow-sm dark:shadow-gray-900/20">
                    <SidebarTrigger className="-ml-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 rounded-md" />
                    <Separator orientation="vertical" className="h-6 bg-border/60" />
                    <div className="flex flex-1 items-center justify-between">
                      <h2 className="text-sm font-medium text-muted-foreground tracking-wide">Admin Dashboard</h2>
                      <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto bg-gradient-to-b from-muted/5 to-muted/10 dark:from-background/30 dark:to-background/50 transition-all duration-300">
                    <div className="container max-w-screen-2xl mx-auto p-0">
                      <div className="min-h-full bg-background/30 dark:bg-transparent backdrop-blur-[1px] transition-all duration-300">
                        <div className="p-6">
                          {children}
                        </div>
                      </div>
                    </div>
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </AdminViewProvider>
        </div>
      </ThemeProvider>
    </AdminAuthGuard>
  )
}