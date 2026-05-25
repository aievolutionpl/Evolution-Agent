export type WorkflowTemplate = {
  id: string
  name: string
  description: string
  icon: string
  goal: string
  tags?: string[]
  teamConfigId?: string
  tasks: Array<{
    title: string
    description?: string
  }>
  createdAt: number
  updatedAt: number
  isBuiltIn?: boolean
}

const STORAGE_KEY = 'clawsuite:workflow-templates'

// Built-in templates that ship with ClawSuite
export const BUILT_IN_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'tpl-code-review',
    name: 'Code Review',
    description: 'Review codebase for bugs, performance issues, and code quality',
    icon: '🔍',
    goal: 'Review the codebase for bugs, performance issues, and code quality improvements',
    tags: ['review', 'quality', 'audit'],
    tasks: [
      { title: 'Read all source files and understand architecture' },
      { title: 'Identify bugs and logic errors' },
      { title: 'Check for security vulnerabilities' },
      { title: 'Suggest code quality improvements' },
      { title: 'Write summary report with prioritized findings' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-bug-fix',
    name: 'Bug Fix',
    description: 'Diagnose and fix a specific bug with tests',
    icon: '🐛',
    goal: 'Investigate the reported bug, identify the root cause, implement a fix, and verify it works. Write tests if appropriate.',
    tasks: [
      { title: 'Reproduce the bug and understand the symptoms' },
      { title: 'Trace the code path to find root cause' },
      { title: 'Implement the fix' },
      { title: 'Run type check (npx tsc --noEmit)' },
      { title: 'Commit with descriptive message' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-feature-build',
    name: 'Feature Build',
    description: 'Plan and implement a new feature end-to-end',
    icon: '🏗️',
    goal: 'Plan, implement, test, and document the new feature',
    tags: ['build', 'feature', 'implementation'],
    tasks: [
      { title: 'Analyze existing code patterns and architecture' },
      { title: 'Create new files and components' },
      { title: 'Wire up routes, state management, and API calls' },
      { title: 'Add error handling and edge cases' },
      { title: 'Run type check and fix any issues' },
      { title: 'Commit and push' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-research',
    name: 'Research & Analysis',
    description: 'Research a topic and produce a structured report',
    icon: '📊',
    goal: 'Research the given topic thoroughly. Analyze findings and produce a structured report with key insights, comparisons, and recommendations.',
    tasks: [
      { title: 'Search for relevant sources and documentation' },
      { title: 'Analyze and compare approaches' },
      { title: 'Write structured findings report' },
      { title: 'Add recommendations section' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-refactor',
    name: 'Refactor',
    description: 'Refactor code for better organization, performance, or readability',
    icon: '♻️',
    goal: 'Refactor the specified code area to improve organization, reduce complexity, and maintain existing functionality. No behavioral changes.',
    tasks: [
      { title: 'Read and understand current implementation' },
      { title: 'Identify refactoring opportunities' },
      { title: 'Implement changes incrementally' },
      { title: 'Verify no behavioral changes (type check + manual review)' },
      { title: 'Commit with clear refactoring message' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-audit',
    name: 'Security Audit',
    description: 'Audit codebase for security vulnerabilities and best practices',
    icon: '🛡️',
    goal: 'Perform a security audit of the codebase. Check for common vulnerabilities (XSS, injection, auth bypass, secrets exposure, dependency issues). Produce a severity-ranked report.',
    tasks: [
      { title: 'Scan for hardcoded secrets and API keys' },
      { title: 'Check input validation and sanitization' },
      { title: 'Review authentication and authorization flows' },
      { title: 'Check dependency vulnerabilities' },
      { title: 'Write security audit report with severity ratings' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-weekly-operating-review',
    name: 'Weekly Operating Review',
    description: 'Generate a recurring executive weekly report across sales, marketing, finance, and risks',
    icon: '📅',
    goal: 'Compile weekly activity into an operating review with KPI highlights, risks, and next actions.',
    tags: ['operations', 'reporting', 'kpi', 'executive'],
    tasks: [
      { title: 'Collect weekly data from sales, marketing, finance, and delivery activity' },
      { title: 'Summarize KPI trends and key deltas versus prior week' },
      { title: 'Flag risks, blockers, and owners' },
      { title: 'Draft next steps for the upcoming 7 days' },
      { title: 'Export final report as markdown and share with stakeholders' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-business-memory',
    name: 'Business Memory Setup',
    description: 'Build a reusable client/project memory profile for future tasks',
    icon: '🧠',
    goal: 'Create and maintain persistent client context including goals, tone, KPI baselines, and decision history.',
    tags: ['memory', 'client', 'context', 'knowledge'],
    tasks: [
      { title: 'Create client profile with business model, offer, and communication tone' },
      { title: 'Capture decision timeline and major milestones' },
      { title: 'Store KPI baselines and success criteria' },
      { title: 'Define reusable kickoff brief template for new tasks' },
      { title: 'Review and refresh memory profile after each major delivery' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-kpi-copilot',
    name: 'Executive KPI Copilot',
    description: 'Monitor KPI deviations and generate safe/base/aggressive recommendations',
    icon: '🚨',
    goal: 'Detect KPI anomalies early and produce risk-scored recommendations for leadership decisions.',
    tags: ['executive', 'kpi', 'alerts', 'risk'],
    tasks: [
      { title: 'Define KPI alert thresholds and anomaly windows' },
      { title: 'Score deviation impact and urgency level' },
      { title: 'Generate action options in safe, base, and aggressive variants' },
      { title: 'Assign owners and deadlines for selected response' },
      { title: 'Track outcomes and tune alert sensitivity' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-task-to-workflow-builder',
    name: 'Task-to-Workflow Builder',
    description: 'Convert a single task brief into a validated multi-stage workflow',
    icon: '🧩',
    goal: 'Turn a plain-language task into a reliable workflow with stage inputs/outputs, SLA, and retries.',
    tags: ['workflow', 'no-code', 'automation', 'process'],
    tasks: [
      { title: 'Parse the task brief into outcome, constraints, and dependencies' },
      { title: 'Define workflow stages with explicit input/output contracts' },
      { title: 'Set retry policy, escalation rules, and SLA for each stage' },
      { title: 'Run validation checks for missing artifacts and handoff gaps' },
      { title: 'Publish the workflow template and onboarding notes' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
  {
    id: 'tpl-revenue-ops-hub',
    name: 'Revenue Ops Hub',
    description: 'Unify CRM, payments, and support signals into a weekly action list',
    icon: '💼',
    goal: 'Consolidate revenue pipeline visibility and prioritize retention and churn-prevention actions.',
    tags: ['revenue', 'crm', 'support', 'forecasting'],
    tasks: [
      { title: 'Aggregate pipeline, invoice, and support ticket data' },
      { title: 'Calculate account health score and churn risk indicators' },
      { title: 'Create top-priority intervention list for next 7 days' },
      { title: 'Draft renewal and expansion opportunities by segment' },
      { title: 'Publish weekly RevOps dashboard summary' },
    ],
    createdAt: 0,
    updatedAt: 0,
    isBuiltIn: true,
  },
]

export function loadCustomTemplates(): WorkflowTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WorkflowTemplate[]
  } catch {
    return []
  }
}

export function saveCustomTemplates(templates: WorkflowTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch { /* ignore */ }
}

export function getAllTemplates(): WorkflowTemplate[] {
  return [...BUILT_IN_TEMPLATES, ...loadCustomTemplates()]
}

export function saveAsTemplate(template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>): WorkflowTemplate {
  const newTemplate: WorkflowTemplate = {
    ...template,
    id: `tpl-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const existing = loadCustomTemplates()
  saveCustomTemplates([newTemplate, ...existing])
  return newTemplate
}

export function deleteTemplate(id: string): void {
  const existing = loadCustomTemplates()
  saveCustomTemplates(existing.filter((t) => t.id !== id))
}
