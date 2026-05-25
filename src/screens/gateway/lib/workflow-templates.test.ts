import { describe, expect, it } from 'vitest'
import { BUILT_IN_TEMPLATES } from './workflow-templates'

describe('workflow templates built-ins', () => {
  it('contains roadmap templates for new features plan', () => {
    const ids = new Set(BUILT_IN_TEMPLATES.map((template) => template.id))
    expect(ids.has('tpl-weekly-operating-review')).toBe(true)
    expect(ids.has('tpl-business-memory')).toBe(true)
    expect(ids.has('tpl-kpi-copilot')).toBe(true)
    expect(ids.has('tpl-task-to-workflow-builder')).toBe(true)
    expect(ids.has('tpl-revenue-ops-hub')).toBe(true)
  })

  it('keeps built-in template ids unique', () => {
    const ids = BUILT_IN_TEMPLATES.map((template) => template.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('provides tags for roadmap templates to support template search', () => {
    const roadmapTemplates = BUILT_IN_TEMPLATES.filter((template) => (
      template.id.startsWith('tpl-weekly-operating-review')
      || template.id.startsWith('tpl-business-memory')
      || template.id.startsWith('tpl-kpi-copilot')
      || template.id.startsWith('tpl-task-to-workflow-builder')
      || template.id.startsWith('tpl-revenue-ops-hub')
    ))

    expect(roadmapTemplates).toHaveLength(5)
    for (const template of roadmapTemplates) {
      expect((template.tags?.length ?? 0) > 0).toBe(true)
    }
  })
})
