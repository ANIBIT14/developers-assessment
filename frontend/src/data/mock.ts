export type TimeEntry = {
  id: string
  worklogId: string
  description: string
  hours: number
  date: string // raw UTC ISO string
  amount: number
}

export type Worklog = {
  id: string
  taskName: string
  project: string
  freelancerId: string
  status: 'REMITTED' | 'UNREMITTED'
  totalHours: number
  totalAmount: number
  createdAt: string // raw UTC ISO string
  updatedAt: string // raw UTC ISO string
  entries: TimeEntry[]
}

export type Freelancer = {
  id: string
  name: string
  email: string
  initials: string
  hourlyRate: number
  role: string
}

export const FREELANCERS: Freelancer[] = [
  { id: 'f1', name: 'Aisha Patel', email: 'aisha@worklog.io', initials: 'AP', hourlyRate: 85, role: 'Full Stack Engineer' },
  { id: 'f2', name: 'Marcus Chen', email: 'marcus@worklog.io', initials: 'MC', hourlyRate: 120, role: 'Frontend Lead' },
  { id: 'f3', name: 'Priya Nair', email: 'priya@worklog.io', initials: 'PN', hourlyRate: 75, role: 'Backend Engineer' },
  { id: 'f4', name: 'Tobias Klein', email: 'tobias@worklog.io', initials: 'TK', hourlyRate: 95, role: 'DevOps Engineer' },
  { id: 'f5', name: 'Zara Osei', email: 'zara@worklog.io', initials: 'ZO', hourlyRate: 110, role: 'Mobile Engineer' },
]

export function getFreelancerById(id: string): Freelancer | undefined {
  return FREELANCERS.find((f) => f.id === id)
}

const WORKLOGS: Worklog[] = [
  // --- UNREMITTED (8) ---
  {
    id: 'wl-001',
    taskName: 'API Gateway Integration',
    project: 'Platform Core',
    freelancerId: 'f1',
    status: 'UNREMITTED',
    totalHours: 18,
    totalAmount: 1530,
    createdAt: '2026-03-02T08:00:00.000Z',
    updatedAt: '2026-03-10T17:30:00.000Z',
    entries: [
      { id: 'e-001-1', worklogId: 'wl-001', description: 'Set up API Gateway config and routing rules', hours: 4, date: '2026-03-02T08:00:00.000Z', amount: 340 },
      { id: 'e-001-2', worklogId: 'wl-001', description: 'Implement JWT auth middleware', hours: 5, date: '2026-03-04T09:00:00.000Z', amount: 425 },
      { id: 'e-001-3', worklogId: 'wl-001', description: 'Rate limiting and throttle policies', hours: 4, date: '2026-03-07T10:00:00.000Z', amount: 340 },
      { id: 'e-001-4', worklogId: 'wl-001', description: 'Integration testing and documentation', hours: 5, date: '2026-03-10T11:00:00.000Z', amount: 425 },
    ],
  },
  {
    id: 'wl-002',
    taskName: 'Dashboard Component Library',
    project: 'Design System',
    freelancerId: 'f2',
    status: 'UNREMITTED',
    totalHours: 22,
    totalAmount: 2640,
    createdAt: '2026-03-03T09:00:00.000Z',
    updatedAt: '2026-03-14T18:00:00.000Z',
    entries: [
      { id: 'e-002-1', worklogId: 'wl-002', description: 'Design token system and theming architecture', hours: 6, date: '2026-03-03T09:00:00.000Z', amount: 720 },
      { id: 'e-002-2', worklogId: 'wl-002', description: 'Build core form components (Input, Select, Checkbox)', hours: 6, date: '2026-03-07T09:00:00.000Z', amount: 720 },
      { id: 'e-002-3', worklogId: 'wl-002', description: 'Data visualization components (Charts, Sparklines)', hours: 6, date: '2026-03-11T09:00:00.000Z', amount: 720 },
      { id: 'e-002-4', worklogId: 'wl-002', description: 'Storybook documentation and visual regression tests', hours: 4, date: '2026-03-14T09:00:00.000Z', amount: 480 },
    ],
  },
  {
    id: 'wl-003',
    taskName: 'Database Schema Migration',
    project: 'Platform Core',
    freelancerId: 'f3',
    status: 'UNREMITTED',
    totalHours: 16,
    totalAmount: 1200,
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-12T16:00:00.000Z',
    entries: [
      { id: 'e-003-1', worklogId: 'wl-003', description: 'Analyze existing schema and identify migration paths', hours: 3, date: '2026-03-05T10:00:00.000Z', amount: 225 },
      { id: 'e-003-2', worklogId: 'wl-003', description: 'Write Alembic migration scripts', hours: 5, date: '2026-03-08T10:00:00.000Z', amount: 375 },
      { id: 'e-003-3', worklogId: 'wl-003', description: 'Staging environment migration and validation', hours: 4, date: '2026-03-10T10:00:00.000Z', amount: 300 },
      { id: 'e-003-4', worklogId: 'wl-003', description: 'Rollback procedures and production migration', hours: 4, date: '2026-03-12T10:00:00.000Z', amount: 300 },
    ],
  },
  {
    id: 'wl-004',
    taskName: 'Kubernetes Cluster Hardening',
    project: 'Infrastructure',
    freelancerId: 'f4',
    status: 'UNREMITTED',
    totalHours: 20,
    totalAmount: 1900,
    createdAt: '2026-03-06T11:00:00.000Z',
    updatedAt: '2026-03-18T15:00:00.000Z',
    entries: [
      { id: 'e-004-1', worklogId: 'wl-004', description: 'Network policy and pod security configuration', hours: 5, date: '2026-03-06T11:00:00.000Z', amount: 475 },
      { id: 'e-004-2', worklogId: 'wl-004', description: 'RBAC roles and service account hardening', hours: 5, date: '2026-03-10T11:00:00.000Z', amount: 475 },
      { id: 'e-004-3', worklogId: 'wl-004', description: 'Secret management with Vault integration', hours: 6, date: '2026-03-14T11:00:00.000Z', amount: 570 },
      { id: 'e-004-4', worklogId: 'wl-004', description: 'Monitoring dashboards and alerting rules', hours: 4, date: '2026-03-18T11:00:00.000Z', amount: 380 },
    ],
  },
  {
    id: 'wl-005',
    taskName: 'iOS Push Notification System',
    project: 'Mobile App',
    freelancerId: 'f5',
    status: 'UNREMITTED',
    totalHours: 14,
    totalAmount: 1540,
    createdAt: '2026-03-08T08:30:00.000Z',
    updatedAt: '2026-03-15T17:00:00.000Z',
    entries: [
      { id: 'e-005-1', worklogId: 'wl-005', description: 'APNs certificate setup and token authentication', hours: 3, date: '2026-03-08T08:30:00.000Z', amount: 330 },
      { id: 'e-005-2', worklogId: 'wl-005', description: 'Notification payload design and rich media support', hours: 4, date: '2026-03-11T08:30:00.000Z', amount: 440 },
      { id: 'e-005-3', worklogId: 'wl-005', description: 'Background fetch and silent notification handling', hours: 4, date: '2026-03-13T08:30:00.000Z', amount: 440 },
      { id: 'e-005-4', worklogId: 'wl-005', description: 'Analytics tracking and delivery receipts', hours: 3, date: '2026-03-15T08:30:00.000Z', amount: 330 },
    ],
  },
  {
    id: 'wl-006',
    taskName: 'Search Indexing Pipeline',
    project: 'Platform Core',
    freelancerId: 'f1',
    status: 'UNREMITTED',
    totalHours: 15,
    totalAmount: 1275,
    createdAt: '2026-03-10T09:00:00.000Z',
    updatedAt: '2026-03-20T16:30:00.000Z',
    entries: [
      { id: 'e-006-1', worklogId: 'wl-006', description: 'Elasticsearch index mapping and analyzer config', hours: 4, date: '2026-03-10T09:00:00.000Z', amount: 340 },
      { id: 'e-006-2', worklogId: 'wl-006', description: 'Document ingestion pipeline with Kafka consumer', hours: 5, date: '2026-03-14T09:00:00.000Z', amount: 425 },
      { id: 'e-006-3', worklogId: 'wl-006', description: 'Full-text search API with faceting and filters', hours: 4, date: '2026-03-18T09:00:00.000Z', amount: 340 },
      { id: 'e-006-4', worklogId: 'wl-006', description: 'Performance benchmarking and query optimization', hours: 2, date: '2026-03-20T09:00:00.000Z', amount: 170 },
    ],
  },
  {
    id: 'wl-007',
    taskName: 'Real-time Collaboration Engine',
    project: 'Collaboration Tools',
    freelancerId: 'f2',
    status: 'UNREMITTED',
    totalHours: 18,
    totalAmount: 2160,
    createdAt: '2026-03-12T10:00:00.000Z',
    updatedAt: '2026-03-22T17:00:00.000Z',
    entries: [
      { id: 'e-007-1', worklogId: 'wl-007', description: 'WebSocket server architecture and connection management', hours: 5, date: '2026-03-12T10:00:00.000Z', amount: 600 },
      { id: 'e-007-2', worklogId: 'wl-007', description: 'Operational transformation for concurrent edits', hours: 6, date: '2026-03-16T10:00:00.000Z', amount: 720 },
      { id: 'e-007-3', worklogId: 'wl-007', description: 'Presence indicators and cursor sync', hours: 4, date: '2026-03-19T10:00:00.000Z', amount: 480 },
      { id: 'e-007-4', worklogId: 'wl-007', description: 'Conflict resolution and offline support', hours: 3, date: '2026-03-22T10:00:00.000Z', amount: 360 },
    ],
  },
  {
    id: 'wl-008',
    taskName: 'CI/CD Pipeline Optimization',
    project: 'Infrastructure',
    freelancerId: 'f4',
    status: 'UNREMITTED',
    totalHours: 12,
    totalAmount: 1140,
    createdAt: '2026-03-15T11:00:00.000Z',
    updatedAt: '2026-03-23T15:00:00.000Z',
    entries: [
      { id: 'e-008-1', worklogId: 'wl-008', description: 'GitHub Actions workflow redesign and caching', hours: 3, date: '2026-03-15T11:00:00.000Z', amount: 285 },
      { id: 'e-008-2', worklogId: 'wl-008', description: 'Parallelized test matrix and artifact management', hours: 4, date: '2026-03-19T11:00:00.000Z', amount: 380 },
      { id: 'e-008-3', worklogId: 'wl-008', description: 'Automated deployment rollbacks and smoke tests', hours: 3, date: '2026-03-21T11:00:00.000Z', amount: 285 },
      { id: 'e-008-4', worklogId: 'wl-008', description: 'Pipeline metrics and build time reporting', hours: 2, date: '2026-03-23T11:00:00.000Z', amount: 190 },
    ],
  },

  // --- REMITTED (7) ---
  {
    id: 'wl-009',
    taskName: 'OAuth2 Provider Integration',
    project: 'Platform Core',
    freelancerId: 'f1',
    status: 'REMITTED',
    totalHours: 12,
    totalAmount: 1020,
    createdAt: '2026-01-06T09:00:00.000Z',
    updatedAt: '2026-01-13T17:00:00.000Z',
    entries: [
      { id: 'e-009-1', worklogId: 'wl-009', description: 'Google OAuth2 flow implementation', hours: 3, date: '2026-01-06T09:00:00.000Z', amount: 255 },
      { id: 'e-009-2', worklogId: 'wl-009', description: 'GitHub and Slack provider adapters', hours: 4, date: '2026-01-09T09:00:00.000Z', amount: 340 },
      { id: 'e-009-3', worklogId: 'wl-009', description: 'Session management and token refresh', hours: 3, date: '2026-01-12T09:00:00.000Z', amount: 255 },
      { id: 'e-009-4', worklogId: 'wl-009', description: 'Security audit and penetration testing', hours: 2, date: '2026-01-13T09:00:00.000Z', amount: 170 },
    ],
  },
  {
    id: 'wl-010',
    taskName: 'Design System v2.0 Rollout',
    project: 'Design System',
    freelancerId: 'f2',
    status: 'REMITTED',
    totalHours: 20,
    totalAmount: 2400,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-24T18:00:00.000Z',
    entries: [
      { id: 'e-010-1', worklogId: 'wl-010', description: 'Token migration from v1 to v2 design tokens', hours: 5, date: '2026-01-10T10:00:00.000Z', amount: 600 },
      { id: 'e-010-2', worklogId: 'wl-010', description: 'Component API breaking changes and deprecations', hours: 7, date: '2026-01-15T10:00:00.000Z', amount: 840 },
      { id: 'e-010-3', worklogId: 'wl-010', description: 'Migration guide and codemods', hours: 5, date: '2026-01-20T10:00:00.000Z', amount: 600 },
      { id: 'e-010-4', worklogId: 'wl-010', description: 'Consumer app migration support', hours: 3, date: '2026-01-24T10:00:00.000Z', amount: 360 },
    ],
  },
  {
    id: 'wl-011',
    taskName: 'GraphQL API Layer',
    project: 'Platform Core',
    freelancerId: 'f3',
    status: 'REMITTED',
    totalHours: 18,
    totalAmount: 1350,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-28T17:00:00.000Z',
    entries: [
      { id: 'e-011-1', worklogId: 'wl-011', description: 'Schema design and resolver architecture', hours: 5, date: '2026-01-15T08:00:00.000Z', amount: 375 },
      { id: 'e-011-2', worklogId: 'wl-011', description: 'DataLoader implementation for N+1 prevention', hours: 5, date: '2026-01-19T08:00:00.000Z', amount: 375 },
      { id: 'e-011-3', worklogId: 'wl-011', description: 'Subscriptions with WebSocket transport', hours: 5, date: '2026-01-23T08:00:00.000Z', amount: 375 },
      { id: 'e-011-4', worklogId: 'wl-011', description: 'Persisted queries and client optimization', hours: 3, date: '2026-01-28T08:00:00.000Z', amount: 225 },
    ],
  },
  {
    id: 'wl-012',
    taskName: 'Terraform Infrastructure as Code',
    project: 'Infrastructure',
    freelancerId: 'f4',
    status: 'REMITTED',
    totalHours: 16,
    totalAmount: 1520,
    createdAt: '2026-02-02T09:00:00.000Z',
    updatedAt: '2026-02-13T16:00:00.000Z',
    entries: [
      { id: 'e-012-1', worklogId: 'wl-012', description: 'VPC, subnets and networking modules', hours: 4, date: '2026-02-02T09:00:00.000Z', amount: 380 },
      { id: 'e-012-2', worklogId: 'wl-012', description: 'EKS cluster and node group provisioning', hours: 5, date: '2026-02-06T09:00:00.000Z', amount: 475 },
      { id: 'e-012-3', worklogId: 'wl-012', description: 'RDS, ElastiCache and S3 resource modules', hours: 4, date: '2026-02-10T09:00:00.000Z', amount: 380 },
      { id: 'e-012-4', worklogId: 'wl-012', description: 'State management with S3 backend and DynamoDB locking', hours: 3, date: '2026-02-13T09:00:00.000Z', amount: 285 },
    ],
  },
  {
    id: 'wl-013',
    taskName: 'Android Offline-First Architecture',
    project: 'Mobile App',
    freelancerId: 'f5',
    status: 'REMITTED',
    totalHours: 22,
    totalAmount: 2420,
    createdAt: '2026-02-05T08:30:00.000Z',
    updatedAt: '2026-02-20T17:00:00.000Z',
    entries: [
      { id: 'e-013-1', worklogId: 'wl-013', description: 'Room database schema and DAO layer', hours: 5, date: '2026-02-05T08:30:00.000Z', amount: 550 },
      { id: 'e-013-2', worklogId: 'wl-013', description: 'WorkManager sync jobs and conflict resolution', hours: 6, date: '2026-02-10T08:30:00.000Z', amount: 660 },
      { id: 'e-013-3', worklogId: 'wl-013', description: 'Network connectivity detection and retry logic', hours: 5, date: '2026-02-15T08:30:00.000Z', amount: 550 },
      { id: 'e-013-4', worklogId: 'wl-013', description: 'UI state management with Flow and StateFlow', hours: 6, date: '2026-02-20T08:30:00.000Z', amount: 660 },
    ],
  },
  {
    id: 'wl-014',
    taskName: 'Billing and Subscription Engine',
    project: 'Platform Core',
    freelancerId: 'f3',
    status: 'REMITTED',
    totalHours: 20,
    totalAmount: 1500,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-25T17:00:00.000Z',
    entries: [
      { id: 'e-014-1', worklogId: 'wl-014', description: 'Stripe subscription plans and webhook handlers', hours: 5, date: '2026-02-10T10:00:00.000Z', amount: 375 },
      { id: 'e-014-2', worklogId: 'wl-014', description: 'Proration logic for plan upgrades/downgrades', hours: 5, date: '2026-02-15T10:00:00.000Z', amount: 375 },
      { id: 'e-014-3', worklogId: 'wl-014', description: 'Invoice generation and PDF export', hours: 5, date: '2026-02-20T10:00:00.000Z', amount: 375 },
      { id: 'e-014-4', worklogId: 'wl-014', description: 'Dunning management and failed payment recovery', hours: 5, date: '2026-02-25T10:00:00.000Z', amount: 375 },
    ],
  },
  {
    id: 'wl-015',
    taskName: 'Performance Monitoring Setup',
    project: 'Infrastructure',
    freelancerId: 'f4',
    status: 'REMITTED',
    totalHours: 14,
    totalAmount: 1330,
    createdAt: '2026-02-18T09:00:00.000Z',
    updatedAt: '2026-02-27T16:00:00.000Z',
    entries: [
      { id: 'e-015-1', worklogId: 'wl-015', description: 'Prometheus metrics instrumentation across services', hours: 4, date: '2026-02-18T09:00:00.000Z', amount: 380 },
      { id: 'e-015-2', worklogId: 'wl-015', description: 'Grafana dashboards for latency, throughput, errors', hours: 4, date: '2026-02-21T09:00:00.000Z', amount: 380 },
      { id: 'e-015-3', worklogId: 'wl-015', description: 'Distributed tracing with OpenTelemetry', hours: 4, date: '2026-02-24T09:00:00.000Z', amount: 380 },
      { id: 'e-015-4', worklogId: 'wl-015', description: 'On-call runbooks and alert escalation policies', hours: 2, date: '2026-02-27T09:00:00.000Z', amount: 190 },
    ],
  },
]

export async function getMockWorklogs(): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return WORKLOGS as any
}

export async function getMockWorklog(id: string): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return (WORKLOGS.find((w) => w.id === id) ?? null) as any
}
