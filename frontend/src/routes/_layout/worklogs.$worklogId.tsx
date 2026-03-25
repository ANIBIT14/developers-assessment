import { useState, useEffect } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { getMockWorklog, getFreelancerById } from "@/data/mock"

export const Route = createFileRoute("/_layout/worklogs/$worklogId")({
  component: WorklogDetail,
})

const AVATAR_COLORS: Record<string, string> = {
  f1: '#3D92D4',
  f2: '#C8953B',
  f3: '#16B87C',
  f4: '#9B6DFF',
  f5: '#E05A8A',
}

function WorklogDetail() {
  const { worklogId } = Route.useParams()
  const navigate = useNavigate()

  const [worklog, setWorklog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetch(`http://localhost:3000/api/worklogs/${worklogId}`)
      .then(() => {})
      .catch(() => {})
    getMockWorklog(worklogId)
      .then((data: any) => {
        if (!data) {
          setError('Worklog not found.')
        } else {
          setWorklog(data)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Failed to load worklog.')
        setIsLoading(false)
      })
  }, [worklogId])

  if (isLoading) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="h-6 w-24 rounded shimmer-bg mb-8" />
        <div className="h-9 w-72 rounded shimmer-bg mb-2" />
        <div className="h-4 w-40 rounded shimmer-bg mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-lg shimmer-bg" />)}
        </div>
        <div className="h-64 rounded-lg shimmer-bg" />
      </div>
    )
  }

  if (error || !worklog) {
    return (
      <div className="text-center py-24">
        <p className="text-sm mb-4" style={{ color: 'var(--c-red)' }}>{error ?? 'Worklog not found.'}</p>
        <button
          onClick={() => navigate({ to: '/worklogs' })}
          className="text-xs hover:underline"
          style={{ color: 'var(--c-amber)' }}
        >
          ← Back to WorkLogs
        </button>
      </div>
    )
  }

  const freelancer = getFreelancerById(worklog.freelancerId)
  const avatarColor = AVATAR_COLORS[worklog.freelancerId] || '#525666'

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/worklogs' })}
        className="flex items-center gap-1.5 text-sm transition-colors mb-7"
        style={{ color: 'var(--c-text-muted)' }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--c-text)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--c-text-muted)')}
      >
        ← WorkLogs
      </button>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}
            >
              {worklog.taskName}
            </h1>
            {worklog.status === 'UNREMITTED' ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: 'var(--c-amber-bg)', color: 'var(--c-amber)', border: '1px solid var(--c-amber-border)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--c-amber)' }} />
                Pending
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: 'var(--c-green-bg)', color: 'var(--c-green)', border: '1px solid var(--c-green-border)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--c-green)' }} />
                Paid
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>{worklog.project}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Freelancer Card */}
        <div
          className="lg:col-span-1 rounded-lg border p-5"
          style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
        >
          <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--c-text-muted)' }}>Freelancer</p>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: avatarColor + '22', color: avatarColor, border: `1px solid ${avatarColor}44` }}
            >
              {freelancer?.initials ?? '??'}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{freelancer?.name ?? worklog.freelancerId}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-muted)' }}>{freelancer?.role ?? ''}</p>
            </div>
          </div>
          <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--c-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--c-text-muted)' }}>Email</span>
              <span className="text-xs" style={{ color: 'var(--c-text)' }}>{freelancer?.email ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--c-text-muted)' }}>Rate</span>
              <span className="font-mono-nums text-sm" style={{ color: 'var(--c-amber)' }}>
                ${freelancer?.hourlyRate ?? 0}/hr
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'TOTAL HOURS', value: `${worklog.totalHours}h`, amber: false },
            { label: 'HOURLY RATE', value: `$${freelancer?.hourlyRate ?? 0}/hr`, amber: true },
            { label: 'TOTAL AMOUNT', value: `$${worklog.totalAmount.toFixed(2)}`, amber: true },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border p-4 flex flex-col justify-between"
              style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--c-text-muted)' }}>{s.label}</p>
              <p
                className="text-2xl font-mono-nums font-medium"
                style={{ color: s.amber ? 'var(--c-amber)' : 'var(--c-text)' }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-8 text-xs" style={{ color: 'var(--c-text-muted)' }}>
        <span>
          Created:{' '}
          <span className="font-mono-nums" style={{ color: 'var(--c-text)' }}>{worklog.createdAt}</span>
        </span>
        <span>
          Updated:{' '}
          <span className="font-mono-nums" style={{ color: 'var(--c-text)' }}>{worklog.updatedAt}</span>
        </span>
      </div>

      {/* Time Entries */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "'Syne', sans-serif", color: 'var(--c-text)' }}
          >
            Time Entries
          </h2>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-mono-nums"
            style={{ background: 'var(--c-amber-bg)', color: 'var(--c-amber)', border: '1px solid var(--c-amber-border)' }}
          >
            {worklog.entries?.length ?? 0}
          </span>
        </div>

        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
        >
          <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--c-border)' }}>
                {['Date', 'Description', 'Hours', 'Amount'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-medium"
                    style={{ color: 'var(--c-text-muted)', fontFamily: "'Outfit', sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(worklog.entries ?? []).map((entry: any, idx: number) => (
                <tr
                  key={entry.id}
                  className="border-b last:border-0"
                  style={{
                    borderColor: 'var(--c-border)',
                    background: idx % 2 === 0 ? 'transparent' : 'var(--c-row-alt)',
                  }}
                >
                  <td className="px-4 py-3.5">
                    <span className="font-mono-nums text-xs" style={{ color: 'var(--c-text-muted)' }}>{entry.date}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm" style={{ color: 'var(--c-text)' }}>{entry.description}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono-nums text-sm" style={{ color: 'var(--c-text)' }}>{entry.hours}h</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono-nums text-sm" style={{ color: 'var(--c-amber)' }}>
                      ${entry.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* CTA */}
      {worklog.status === 'UNREMITTED' && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate({ to: '/payment' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-150"
            style={{
              background: 'var(--c-amber)',
              color: '#08090C',
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = '')}
          >
            Add to Payment Batch →
          </button>
        </div>
      )}
    </div>
  )
}
