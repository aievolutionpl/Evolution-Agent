# Seedance 2.5 Failure Diagnosis

Patch the first causal failure instead of rewriting the entire prompt.

| Failure | Likely cause | Prompt patch |
|---|---|---|
| Face changes between shots | identity reference not authoritative, too many transformations, subject too small | promote identity reference to a global lock; start with a readable face; reduce simultaneous changes |
| Outfit changes | wardrobe described as style instead of invariant | add exact wardrobe to continuity locks and repeat it near the end |
| Product shape mutates | product competes with style reference or is moving too aggressively | make product reference authoritative for geometry; reduce deformation-like motion; add a dedicated hero shot |
| Extra people appear | subject count ambiguous or crowd language too broad | state exact subject count and blocking; remove unnecessary crowd cues |
| Duplicate subject | transition or motion interpreted as another person | state one continuous subject; define start and end positions; avoid ambiguous reflection language |
| Hands are warped | grip/contact state is underspecified | name the hand, object, grip, and action order; simplify fast hand motion |
| Object passes through closed door/lid | state transition missing | explicitly open/unlock/remove obstacle before interaction, then define end state |
| Prop teleports | no start location or end state | define prop position before action, contact event, and final position |
| Camera becomes chaotic | multiple competing movement verbs | keep one primary move; move secondary styling into subtle micro-motion |
| Random jump cuts | prompt has multiple disconnected events | explicitly request one continuous take or define named cuts between shots |
| Video feels static | prompt uses mood words instead of body movement | convert emotion to posture, gesture, walking speed, eye line, and interaction |
| Too much happens | event density exceeds duration | reduce beats; one dominant action per shot; move secondary events to another clip |
| Transformation is mushy | no stages or intermediate states | split into before, initiation, intermediate lock-in, reveal; give each an end state |
| Subject changes scale unnaturally | camera distance and subject blocking conflict | define camera path relative to subject and preserve body scale unless perspective naturally changes |
| Background changes | environment is treated as decorative | lock architecture, important props, time of day, and light direction |
| Reflections create duplicate faces | reflective environment not constrained | specify controlled reflections and no duplicate recognizable faces in mirrors/glass |
| Product logo becomes random text | text generation overloaded | keep logo small but stable only if reference supports it; avoid asking for new text; use post-production for critical copy |
| Dialogue does not fit | line too long for duration | shorten dialogue or allocate a longer beat |
| Lip sync is poor | dialogue competes with fast movement/camera | stabilize composition during speech; reduce action complexity; keep one speaker per beat |
| Voices swap between characters | speaker mapping unclear | map each line explicitly to Character A/B and preserve voice identity |
| Music overpowers dialogue | audio hierarchy undefined | state dialogue foreground, music low under speech, ambience secondary |
| Physics looks floaty | motion lacks weight/contact | describe acceleration, impact, landing, surface contact, recoil, cloth or object inertia where relevant |
| Fast social video feels like AI slop | arbitrary camera changes and no payoff | reduce to 3–5 beats; make every perspective reveal new information; end on a deliberate hero/payoff frame |
| Final frame cuts off awkwardly | no end-state instruction | define final pose, camera distance, prop state, and whether motion settles |

## Diagnostic order

Review a failed generation in this order:

1. identity / product correctness
2. subject count and anatomy
3. scene continuity
4. action logic and physics
5. camera and cuts
6. timing
7. audio / dialogue
8. lighting and style polish
9. final frame

Stop at the first major failure. A prettier camera prompt will not repair a wrong identity or impossible interaction.

## Minimal patch method

When iterating, preserve all prompt sections that worked.

Use this structure:

```text
KEEP
- identity
- environment
- lighting
- successful shots

CHANGE ONLY
- [failed layer]

PATCH
- [specific observable instruction]

END STATE
- [visible target]
```

This reduces regressions during iterative prompting.
