import { useState, useEffect, useMemo } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { getMockWorklogs, getFreelancerById, FREELANCERS } from "@/data/mock"

export const Route = createFileRoute("/_layout/payment")({
  component: PaymentPage,
})

const AVATAR_COLORS: Record<string, string> = {
  f1: '#3D92D4',
  f2: '#C8953B',
  f3: '#16B87C',
  f4: '#9B6DFF',
  f5: '#E05A8A',
}

function PaymentPage() {
  const navigate = useNavigate()

  const today = new Date().toISOString().slice(0, 10)

  const [allWorklogs, setAllWorklogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState<string>('2026-03-01')
  const [dateTo, setDateTo] = useState<string>('2026-03-31')
  const [excludedFreelancers, setExcludedFreelancers] = useState<Set<string>>(new Set())
  const [excludedWorklogs, setExcludedWorklogs] = useState<Set<string>>(new Set())
  const [isReviewing, setIsReviewing] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/worklogs')
      .then(() => {})
      .catch(() => {})
    getMockWorklogs().then((data: any) => {
      setAllWorklogs(data)
      setIsLoading(false)
    })
  }, [])

  const eligibleWorklogs = useMemo(() => {
    return allWorklogs.filter((w: any) => {
      if (w.status !== 'UNREMITTED') return false
      if (excludedFreelancers.has(w.freelancerId)) return false
      if (excludedWorklogs.has(w.id)) return false
      const createdDate = w.createdAt.slice(0, 10)
      if (dateFrom && createdDate < dateFrom) return false
      if (dateTo && createdDate > dateTo) return false
      return true
    })
  }, [allWorklogs, excludedFreelancers, excludedWorklogs, dateFrom, dateTo])

  const selectedTotal = eligibleWorklogs.reduce((sum: number, w: any) => sum + w.totalAmount, 0)
  const selectedCount = eligibleWorklogs.length

  const uniqueFreelancerIds = new Set(eligibleWorklogs.map((w: any) => w.freelancerId))
  const freelancerCount = uniqueFreelancerIds.size

  function toggleFreelancer(id: string) {
    setExcludedFreelancers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleWorklog(id: string, currentlyIncluded: boolean) {
    setExcludedWorklogs((prev) => {
      const next = new Set(prev)
      if (currentlyIncluded) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  // All UNREMITTED within date range (before freelancer/worklog exclusions) for table display
  const candidateWorklogs = useMemo(() => {
    return allWorklogs.filter((w: any) => {
      if (w.status !== 'UNREMITTED') return false
      const createdDate = w.createdAt.slice(0, 10)
      if (dateFrom && createdDate < dateFrom) return false
      if (dateTo && createdDate > dateTo) return false
      return true
    })
  }, [allWorklogs, dateFrom, dateTo])

  // Confirmed screen
  if (isConfirmed) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <div className="text-center animate-scale-in">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--c-green-bg)', border: '1px solid var(--c-green-border)' }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M8 18L15 25L28 11"
                stroke="var(--c-green)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="100"
                style={{ animation: 'checkmark 0.5s ease 0.2s forwards', strokeDashoffset: 100 }}
              />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}
          >
            Payment Confirmed
          </h1>
          <p
            className="text-5xl font-bold mb-4 font-mono-nums"
            style={{ color: 'var(--c-amber)' }}
          >
            ${selectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--c-text-muted)' }}>
            {selectedCount} worklogs settled across {freelancerCount} freelancers
          </p>
          <button
            onClick={() => {
              setIsConfirmed(false)
              navigate({ to: '/worklogs' })
            }}
            className="px-5 py-2.5 rounded-md text-sm font-medium border transition-all"
            style={{
              borderColor: 'var(--c-border-strong)',
              color: 'var(--c-text)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = '')}
          >
            View WorkLogs
          </button>
        </div>
      </div>
    )
  }

  // Review screen
  if (isReviewing) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif" }} className="pb-28">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => setIsReviewing(false)}
            className="flex items-center gap-1.5 text-sm transition-colors mb-5"
            style={{ color: 'var(--c-text-muted)' }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--c-text)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--c-text-muted)')}
          >
            ← Edit Selection
          </button>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}
          >
            Review Payment
          </h1>
          <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>
            Check entries before confirming
          </p>
        </div>

        {/* Summary bar */}
        <div
          className="rounded-lg border p-4 mb-6 flex flex-wrap items-center gap-3 sm:gap-6"
          style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
        >
          <span className="text-sm" style={{ color: 'var(--c-text-muted)' }}>
            <span className="font-mono-nums" style={{ color: 'var(--c-text)' }}>{selectedCount}</span> worklogs
          </span>
          <span className="text-sm" style={{ color: 'var(--c-text-muted)' }}>
            <span className="font-mono-nums" style={{ color: 'var(--c-text)' }}>{freelancerCount}</span> freelancers
          </span>
          <span className="text-sm font-mono-nums font-semibold" style={{ color: 'var(--c-amber)' }}>
            Total: ${selectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Worklog review cards */}
        <div className="space-y-4">
          {eligibleWorklogs.map((w: any) => {
            const freelancer = getFreelancerById(w.freelancerId)
            const avatarColor = AVATAR_COLORS[w.freelancerId] || '#525666'
            const entries = w.entries ?? []
            const totalHours = entries.reduce((sum: number, e: any) => sum + e.hours, 0)
            const subtotal = entries.reduce((sum: number, e: any) => sum + e.amount, 0)

            return (
              <div
                key={w.id}
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
              >
                {/* Card header */}
                <div className="px-5 pt-4 pb-3 flex items-start justify-between">
                  <div>
                    <p
                      className="text-base font-bold"
                      style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}
                    >
                      {w.taskName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-muted)' }}>{w.project}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: avatarColor + '22', color: avatarColor, border: `1px solid ${avatarColor}44` }}
                      >
                        {freelancer?.initials ?? '??'}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--c-text)' }}>{freelancer?.name ?? w.freelancerId}</span>
                    </div>
                    <span className="font-mono-nums text-base font-semibold" style={{ color: 'var(--c-amber)' }}>
                      ${w.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--c-border)' }} />

                {/* Time entries sub-table */}
                <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--c-border)' }}>
                      {['Date', 'Description', 'Hours', 'Amount'].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-2.5 text-left text-[10px] uppercase tracking-widest font-medium"
                          style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry: any, idx: number) => (
                      <tr
                        key={entry.id}
                        className="border-b last:border-0"
                        style={{
                          borderColor: 'var(--c-border)',
                          background: idx % 2 === 0 ? 'transparent' : 'var(--c-row-alt)',
                        }}
                      >
                        <td className="px-5 py-3">
                          <span className="font-mono-nums text-xs" style={{ color: 'var(--c-text-muted)' }}>{entry.date}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm" style={{ color: 'var(--c-text)' }}>{entry.description}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-mono-nums text-sm" style={{ color: 'var(--c-text)' }}>{entry.hours}h</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-mono-nums text-sm" style={{ color: 'var(--c-amber)' }}>
                            ${entry.amount.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>

                {/* Footer row */}
                <div
                  className="px-5 py-3 flex items-center gap-5 border-t"
                  style={{ borderColor: 'var(--c-border)', background: 'var(--c-row-alt)' }}
                >
                  <span className="text-xs font-mono-nums" style={{ color: 'var(--c-text-muted)' }}>
                    Total Hours: <span style={{ color: 'var(--c-text)' }}>{totalHours}h</span>
                  </span>
                  <span className="text-xs font-mono-nums" style={{ color: 'var(--c-text-muted)' }}>
                    Subtotal: <span style={{ color: 'var(--c-amber)' }}>${subtotal.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sticky Bottom Bar */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-8 py-3 sm:py-4"
          style={{
            background: 'var(--c-surface-header)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--c-border)',
          }}
        >
          <div>
            <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>
              {selectedCount} worklogs · {freelancerCount} freelancers
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-2xl font-bold font-mono-nums"
              style={{ color: 'var(--c-amber)' }}
            >
              ${selectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => setIsConfirmed(true)}
            className="px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-150"
            style={{
              background: 'var(--c-amber)',
              color: '#08090C',
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = '')}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    )
  }

  // Configure screen
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }} className="pb-28">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}
        >
          Payment Batch
        </h1>
        <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>
          Configure and confirm a payment run for pending worklogs
        </p>
      </div>

      {/* Section: Date Range */}
      <section
        className="mb-6 rounded-lg border p-5"
        style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
      >
        <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--c-text-muted)' }}>Date Range</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm shrink-0" style={{ color: 'var(--c-text-muted)' }}>From</label>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || today}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-md text-sm border date-input"
              style={{
                background: 'var(--c-surface)',
                borderColor: 'var(--c-border-strong)',
                color: 'var(--c-text)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm shrink-0" style={{ color: 'var(--c-text-muted)' }}>To</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              max={today}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-md text-sm border date-input"
              style={{
                background: 'var(--c-surface)',
                borderColor: 'var(--c-border-strong)',
                color: 'var(--c-text)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          </div>
        </div>
      </section>

      {/* Section: Freelancer Toggles */}
      <section
        className="mb-6 rounded-lg border p-5"
        style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
      >
        <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--c-text-muted)' }}>Freelancers</h2>
        <div className="flex flex-wrap gap-2">
          {FREELANCERS.map((f: any) => {
            const isIncluded = !excludedFreelancers.has(f.id)
            return (
              <button
                key={f.id}
                onClick={() => toggleFreelancer(f.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-all duration-150"
                style={{
                  background: isIncluded ? 'var(--c-amber-bg)' : 'transparent',
                  color: isIncluded ? 'var(--c-text)' : 'var(--c-text-muted)',
                  borderColor: isIncluded ? 'var(--c-amber-border)' : 'var(--c-border)',
                  textDecoration: isIncluded ? 'none' : 'line-through',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isIncluded ? 'var(--c-amber-bg)' : 'var(--c-border)',
                    color: isIncluded ? 'var(--c-amber)' : 'var(--c-text-muted)',
                  }}
                >
                  {f.initials}
                </div>
                {f.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* Section: Eligible Worklogs */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase tracking-widest" style={{ color: 'var(--c-text-muted)' }}>Eligible Worklogs</h2>
          <span className="text-xs" style={{ color: 'var(--c-text-muted)' }}>
            {selectedCount} of {candidateWorklogs.length} selected
          </span>
        </div>

        {isLoading ? (
          <div
            className="rounded-lg border p-6 space-y-3"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 rounded shimmer-bg" />
            ))}
          </div>
        ) : candidateWorklogs.length === 0 ? (
          <div
            className="rounded-lg border p-12 text-center"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
          >
            <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>No pending worklogs in the selected date range.</p>
          </div>
        ) : (
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
          >
            <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--c-border)' }}>
                  <th className="px-4 py-3 text-left w-10"><span className="sr-only">Include</span></th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Task</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium hidden sm:table-cell" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Freelancer</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium hidden md:table-cell" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Hours</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Amount</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium hidden lg:table-cell" style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {candidateWorklogs.map((w: any, idx: number) => {
                  const freelancer = getFreelancerById(w.freelancerId)
                  const isWorklogIncluded = !excludedWorklogs.has(w.id)
                  const isFreelancerIncluded = !excludedFreelancers.has(w.freelancerId)
                  const isEffectivelyIncluded = isWorklogIncluded && isFreelancerIncluded

                  return (
                    <tr
                      key={w.id}
                      className="border-b last:border-0 transition-all duration-150"
                      style={{
                        borderColor: 'var(--c-border)',
                        background: idx % 2 === 0 ? 'transparent' : 'var(--c-row-alt)',
                        opacity: isEffectivelyIncluded ? 1 : 0.4,
                      }}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isEffectivelyIncluded}
                          disabled={!isFreelancerIncluded}
                          onChange={() => toggleWorklog(w.id, isWorklogIncluded)}
                          className="w-4 h-4 rounded cursor-pointer"
                          style={{ accentColor: 'var(--c-amber)' }}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>{w.taskName}</p>
                          <p className="text-xs mt-0.5 sm:hidden" style={{ color: 'var(--c-text-muted)' }}>{freelancer?.name ?? w.freelancerId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-sm" style={{ color: 'var(--c-text)' }}>{freelancer?.name ?? w.freelancerId}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="font-mono-nums text-sm" style={{ color: 'var(--c-text)' }}>{w.totalHours}h</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono-nums text-sm" style={{ color: isEffectivelyIncluded ? 'var(--c-amber)' : 'var(--c-text-muted)' }}>
                          ${w.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="font-mono-nums text-xs" style={{ color: 'var(--c-text-muted)' }}>{w.createdAt}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </section>

      {/* Sticky Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-8 py-3 sm:py-4"
        style={{
          background: 'var(--c-surface-header)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--c-border)',
        }}
      >
        <div>
          <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>
            {selectedCount} worklogs · {freelancerCount} freelancers
          </p>
        </div>
        <div className="text-center">
          <p
            className="text-2xl font-bold font-mono-nums"
            style={{ color: 'var(--c-amber)' }}
          >
            ${selectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <button
          onClick={() => {
            if (selectedCount > 0) setIsReviewing(true)
          }}
          disabled={selectedCount === 0}
          className="px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: selectedCount > 0 ? 'var(--c-amber)' : 'var(--c-amber-bg)',
            color: '#08090C',
            fontFamily: "'Outfit', sans-serif",
          }}
          onMouseOver={(e) => {
            if (selectedCount > 0) e.currentTarget.style.filter = 'brightness(1.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.filter = ''
          }}
        >
          Review Selection →
        </button>
      </div>
    </div>
  )
}
