import { useState, useEffect } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { getMockWorklogs, getFreelancerById, FREELANCERS } from "@/data/mock"

export const Route = createFileRoute("/_layout/worklogs/")({
  component: WorklogsPage,
})

const AVATAR_COLORS: Record<string, string> = {
  f1: '#3D92D4',
  f2: '#C8953B',
  f3: '#16B87C',
  f4: '#9B6DFF',
  f5: '#E05A8A',
}

const PAGE_SIZE = 8

function WorklogsPage() {
  const navigate = useNavigate()

  const [allData, setAllData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const [activeFilterTab, setActiveFilterTab] = useState<'status' | 'freelancer' | 'daterange' | null>(null)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'REMITTED' | 'UNREMITTED'>('ALL')
  const [freelancerFilter, setFreelancerFilter] = useState<string>('ALL')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetch('http://localhost:3000/api/worklogs')
      .then(() => {})
      .catch(() => {})
    getMockWorklogs()
      .then((data: any) => {
        setAllData(data)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Failed to load worklogs.')
        setIsLoading(false)
      })
  }, [])

  // Compute stats from ALL data (not filtered)
  const totalPending = allData
    .filter((w: any) => w.status === 'UNREMITTED')
    .reduce((sum: number, w: any) => sum + w.totalAmount, 0)
  const totalWorklogs = allData.length
  const activeFreelancerIds = new Set(
    allData.filter((w: any) => w.status === 'UNREMITTED').map((w: any) => w.freelancerId)
  )
  const pendingHours = allData
    .filter((w: any) => w.status === 'UNREMITTED')
    .reduce((sum: number, w: any) => sum + w.totalHours, 0)

  const today = new Date().toISOString().slice(0, 10)

  // Filtered data
  const filtered = allData.filter((w: any) => {
    if (statusFilter !== 'ALL' && w.status !== statusFilter) return false
    if (freelancerFilter !== 'ALL' && w.freelancerId !== freelancerFilter) return false
    const createdDate = w.createdAt.slice(0, 10)
    if (dateFrom && createdDate < dateFrom) return false
    if (dateTo && createdDate > dateTo) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterTabClick(tab: 'status' | 'freelancer' | 'daterange') {
    setActiveFilterTab((prev) => (prev === tab ? null : tab))
  }

  function handleStatusSelect(s: 'ALL' | 'REMITTED' | 'UNREMITTED') {
    setStatusFilter(s)
    setPage(1)
  }

  function handleFreelancerSelect(id: string) {
    setFreelancerFilter(id)
    setPage(1)
  }

  function handleDateChange() {
    setPage(1)
  }

  const statCards = [
    {
      label: 'PENDING AMOUNT',
      value: `$${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      amber: true,
    },
    { label: 'TOTAL WORKLOGS', value: String(totalWorklogs), amber: false },
    { label: 'ACTIVE FREELANCERS', value: String(activeFreelancerIds.size), amber: false },
    { label: 'PENDING HOURS', value: String(pendingHours), amber: false },
  ]

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold leading-tight"
            style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}
          >
            WorkLogs
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--c-text-muted)' }}>
            Manage and process freelancer time entries and payments
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/payment' })}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 shrink-0"
          style={{
            background: 'var(--c-amber)',
            color: '#08090C',
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
          onMouseOut={(e) => (e.currentTarget.style.filter = '')}
        >
          Process Payment →
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className={`rounded-lg p-4 border animate-fade-in-up animate-stagger-${i + 1}`}
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
          >
            <p
              className="text-[10px] tracking-widest uppercase mb-2"
              style={{ color: 'var(--c-text-muted)' }}
            >
              {card.label}
            </p>
            <p
              className="text-2xl font-mono-nums font-medium"
              style={{ color: card.amber ? 'var(--c-amber)' : 'var(--c-text)' }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {(['status', 'freelancer', 'daterange'] as const).map((tab) => {
            const labels = { status: 'Status', freelancer: 'Freelancer', daterange: 'Date Range' }
            const isActive = activeFilterTab === tab
            return (
              <button
                key={tab}
                onClick={() => handleFilterTabClick(tab)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border"
                style={{
                  background: isActive ? 'var(--c-amber-bg)' : 'transparent',
                  color: isActive ? 'var(--c-amber)' : 'var(--c-text-muted)',
                  borderColor: isActive ? 'var(--c-amber-border)' : 'var(--c-border)',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {labels[tab]}
                {tab === 'status' && statusFilter !== 'ALL' && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--c-amber)' }} />
                )}
                {tab === 'freelancer' && freelancerFilter !== 'ALL' && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--c-amber)' }} />
                )}
                {tab === 'daterange' && (dateFrom || dateTo) && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--c-amber)' }} />
                )}
              </button>
            )
          })}

          {(statusFilter !== 'ALL' || freelancerFilter !== 'ALL' || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setStatusFilter('ALL')
                setFreelancerFilter('ALL')
                setDateFrom('')
                setDateTo('')
                setPage(1)
              }}
              className="px-3 py-1.5 rounded-md text-xs transition-all duration-150"
              style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}
            >
              Clear filters
            </button>
          )}
        </div>

        {activeFilterTab === 'status' && (
          <div
            className="flex items-center gap-2 p-3 rounded-lg border animate-fade-in-up"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
          >
            {(['ALL', 'UNREMITTED', 'REMITTED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusSelect(s)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border"
                style={{
                  background: statusFilter === s ? 'var(--c-amber-bg)' : 'transparent',
                  color: statusFilter === s ? 'var(--c-amber)' : 'var(--c-text-muted)',
                  borderColor: statusFilter === s ? 'var(--c-amber-border)' : 'var(--c-border)',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {s === 'ALL' ? 'All' : s === 'UNREMITTED' ? 'Pending' : 'Paid'}
              </button>
            ))}
          </div>
        )}

        {activeFilterTab === 'freelancer' && (
          <div
            className="flex flex-wrap items-center gap-2 p-3 rounded-lg border animate-fade-in-up"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
          >
            <button
              onClick={() => handleFreelancerSelect('ALL')}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border"
              style={{
                background: freelancerFilter === 'ALL' ? 'var(--c-amber-bg)' : 'transparent',
                color: freelancerFilter === 'ALL' ? 'var(--c-amber)' : 'var(--c-text-muted)',
                borderColor: freelancerFilter === 'ALL' ? 'var(--c-amber-border)' : 'var(--c-border)',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              All Freelancers
            </button>
            {FREELANCERS.map((f: any) => (
              <button
                key={f.id}
                onClick={() => handleFreelancerSelect(f.id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border"
                style={{
                  background: freelancerFilter === f.id ? 'var(--c-amber-bg)' : 'transparent',
                  color: freelancerFilter === f.id ? 'var(--c-amber)' : 'var(--c-text-muted)',
                  borderColor: freelancerFilter === f.id ? 'var(--c-amber-border)' : 'var(--c-border)',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {activeFilterTab === 'daterange' && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg border animate-fade-in-up"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
          >
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>From</label>
              <input
                type="date"
                value={dateFrom}
                max={dateTo || today}
                onChange={(e) => { setDateFrom(e.target.value); handleDateChange() }}
                className="px-2 py-1.5 rounded-md text-xs border date-input"
                style={{
                  background: 'var(--c-surface)',
                  borderColor: 'var(--c-border-strong)',
                  color: 'var(--c-text)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>To</label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                max={today}
                onChange={(e) => { setDateTo(e.target.value); handleDateChange() }}
                className="px-2 py-1.5 rounded-md text-xs border date-input"
                style={{
                  background: 'var(--c-surface)',
                  borderColor: 'var(--c-border-strong)',
                  color: 'var(--c-text)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
      >
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-md shimmer-bg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm" style={{ color: 'var(--c-red)' }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>No worklogs match the current filters.</p>
            <button
              onClick={() => {
                setStatusFilter('ALL')
                setFreelancerFilter('ALL')
                setDateFrom('')
                setDateTo('')
                setPage(1)
              }}
              className="mt-3 text-xs hover:underline"
              style={{ color: 'var(--c-amber)', fontFamily: "'Outfit', sans-serif" }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--c-border)' }}>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium hidden sm:table-cell" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>#</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Task</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Freelancer</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium hidden md:table-cell" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Entries</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium hidden md:table-cell" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Hours</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Amount</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium hidden sm:table-cell" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((w: any, idx: number) => {
                  const freelancer = getFreelancerById(w.freelancerId)
                  const rowNum = (page - 1) * PAGE_SIZE + idx + 1
                  const staggerClass = idx < 4 ? `animate-fade-in-up animate-stagger-${idx + 1}` : ''
                  const avatarColor = AVATAR_COLORS[w.freelancerId] || '#525666'

                  return (
                    <tr
                      key={w.id}
                      className={`wl-row border-b last:border-0 ${staggerClass}`}
                      style={{ borderColor: 'var(--c-border)' }}
                    >
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="font-mono-nums text-xs" style={{ color: 'var(--c-text-muted)' }}>{String(rowNum).padStart(2, '0')}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>{w.taskName}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-muted)' }}>{w.project}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ background: avatarColor + '22', color: avatarColor, border: `1px solid ${avatarColor}44` }}
                          >
                            {freelancer?.initials ?? '??'}
                          </div>
                          <span className="text-sm hidden lg:inline" style={{ color: 'var(--c-text)' }}>{freelancer?.name ?? w.freelancerId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="font-mono-nums text-sm" style={{ color: 'var(--c-text-muted)' }}>{w.entries?.length ?? 0}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="font-mono-nums text-sm" style={{ color: 'var(--c-text)' }}>{w.totalHours}h</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono-nums text-sm" style={{ color: 'var(--c-amber)' }}>
                          ${w.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        {w.status === 'UNREMITTED' ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{ background: 'var(--c-amber-bg)', color: 'var(--c-amber)', border: '1px solid var(--c-amber-border)' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--c-amber)' }} />
                            Pending
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{ background: 'var(--c-green-bg)', color: 'var(--c-green)', border: '1px solid var(--c-green-border)' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--c-green)' }} />
                            Paid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => navigate({ to: `/worklogs/${w.id}` })}
                          className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border whitespace-nowrap"
                          style={{
                            background: 'transparent',
                            color: 'var(--c-text-muted)',
                            borderColor: 'var(--c-border)',
                            fontFamily: "'Outfit', sans-serif",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = 'var(--c-text)'
                            e.currentTarget.style.borderColor = 'var(--c-border-strong)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = 'var(--c-text-muted)'
                            e.currentTarget.style.borderColor = 'var(--c-border)'
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between px-4 py-3 border-t gap-3"
                style={{ borderColor: 'var(--c-border)' }}
              >
                <span className="text-xs shrink-0" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>
                  {filtered.length} · {page}/{totalPages}
                </span>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-md text-xs border transition-all duration-150 disabled:opacity-30"
                    style={{ background: 'transparent', color: 'var(--c-text-muted)', borderColor: 'var(--c-border)', fontFamily: "'Outfit', sans-serif" }}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className="w-7 h-7 rounded-md text-xs border transition-all duration-150 hidden sm:inline-flex items-center justify-center"
                      style={{
                        background: page === i + 1 ? 'var(--c-amber-bg)' : 'transparent',
                        color: page === i + 1 ? 'var(--c-amber)' : 'var(--c-text-muted)',
                        borderColor: page === i + 1 ? 'var(--c-amber-border)' : 'var(--c-border)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-md text-xs border transition-all duration-150 disabled:opacity-30"
                    style={{ background: 'transparent', color: 'var(--c-text-muted)', borderColor: 'var(--c-border)', fontFamily: "'Outfit', sans-serif" }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
