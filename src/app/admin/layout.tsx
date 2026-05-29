import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-brand-charcoal-50 dark-theme">
      {/* Admin Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto bg-brand-charcoal-50">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
