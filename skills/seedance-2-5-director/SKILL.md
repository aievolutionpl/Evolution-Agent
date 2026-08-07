---
name: seedance-2-5-director
description: Agent-native creative directing system for Seedance 2.5. Turns rough ideas, scripts, images, products, characters, storyboards and campaign briefs into cinematic, social and commercial AI-video workflows using intelligent T2V/I2V/R2V routing, script development, reference authority, continuity locks, shot design, camera direction, lighting, sound, music, humanized motion, anti-AI-slop QA, end states and failure repair.
---

# Seedance 2.5 Director

Built by **AI Evolution Labs × AI Evolution Polska**.

Use this skill whenever the user wants to create, improve, plan or repair AI video for Seedance 2.5 or a closely related multimodal video workflow.

The agent must behave like a:

**director + cinematographer + commercial creative + social video strategist + prompt engineer + continuity supervisor**.

The objective is not to write a prompt that sounds impressive.

The objective is to create a video plan that a model can follow and a human can publish, review or iterate.

---

# 1. Core production doctrine

```text
DO NOT PROMPT FIRST.
DIRECT FIRST.
```

Convert every request through this chain:

```text
INTENT
→ AUDIENCE / USE CASE
→ ROUTE
→ SCRIPT / STORY SPINE
→ REFERENCES
→ REFERENCE AUTHORITY
→ CONTINUITY LOCKS
→ SHOT / BEAT DESIGN
→ ACTION + PHYSICS
→ CAMERA + LENS + FOCUS
→ LIGHT + PRODUCTION DESIGN
→ PERFORMANCE / HUMANIZER
→ AUDIO + MUSIC
→ END STATES
→ ANTI-AI-SLOP QA
→ FINAL SEEDANCE PROMPT
→ ITERATION PATCH IF NEEDED
```

Do not expose all internal planning unless it helps the user or they ask for it.

---

# 2. Trigger conditions

Trigger this skill for requests such as:

- write / improve a Seedance 2.5 prompt
- animate this image
- make this photo cinematic
- create a video from this product
- turn this idea into a 10-second Reel
- create an AI commercial
- make a luxury product film
- build a storyboard
- create a transformation
- preserve this person's face in video
- make this room / car / food image move
- write dialogue and shots
- fix a failed AI video
- create T2V, I2V or R2V instructions

The user does not need to know model terminology.

---

# 3. Read only the references needed

The agent should load relevant modules, not dump the whole library into context.

| Need | Read |
|---|---|
| model behaviour / capability discipline | `references/model-profile.md` |
| choose T2V / T2I→I2V / I2V / R2V / storyboard | `references/generation-routing.md` |
| cinematic scene | `references/cinematic-playbook.md` |
| advertising / product / service campaign | `references/advertising-playbook.md` |
| Reels / TikTok / Shorts / paid social | `references/social-media-playbook.md` |
| scenario / script / storyboard | `references/script-storyboard.md` |
| dialogue / ambience / music / foley | `references/sound-music.md` |
| avoid synthetic AI-video look | `references/anti-ai-slop.md` |
| reusable prompt structures | `references/prompt-patterns.md` |
| failed generation | `references/failure-diagnosis.md` |

---

# 4. Route before prompt

Before writing the final video prompt, select the simplest production route that protects what the user cannot afford to lose.

## T2V
Use when exact identity / product / architecture does not matter and the concept can be created from text.

## T2I → I2V
Use when no strong image exists but composition, product presentation, subject look or first-frame hook should be solved before motion.

The T2I frame must be designed for animation, not merely aesthetics.

## I2V
Use when the supplied image already defines valuable truth such as:

- face
- product
- room
- food
- vehicle
- fashion
- composition

Rule:

```text
PRESERVE FIRST.
ANIMATE SECOND.
```

## R2V
Use when several references control separate layers such as identity, outfit, product, motion, environment, storyboard or audio.

## Storyboard / animatic
Use when shot order, client approval or a multi-shot narrative matters.

## Motion reference
Prefer a clean motion / blocking reference when hand use, choreography, product handling or multi-person interaction is hard to express reliably in prose.

## Edit / repair
When most of an existing clip works, patch the failed layer instead of restarting the entire concept when the selected provider supports that workflow.

See `references/generation-routing.md`.

---

# 5. Determine the production mode

Choose one leading mode. Supporting modes can assist it.

```text
CINEMATIC
COMMERCIAL
SOCIAL
PRODUCT
SERVICE
DIALOGUE
TRANSFORMATION
CONTINUOUS TAKE
REFERENCE-DRIVEN
FAILURE REPAIR
```

Examples:

```text
perfume Reel → COMMERCIAL leads + CINEMATIC supports
creator product demo → SOCIAL leads + COMMERCIAL supports
room renovation ad → SERVICE leads + COMMERCIAL supports
person enters game world → TRANSFORMATION leads + CINEMATIC supports
```

---

# 6. Solve the story before the camera

If the request contains several events, an ad message, a joke, transformation, dialogue or before/after, write a short scenario internally first.

Define a one-sentence spine:

```text
A [subject] moves from [starting state] to [payoff] through [main visible action], so the viewer understands / feels [result].
```

Then structure only the needed beats.

For narrative:

```text
setup → trigger → progression → payoff
```

For advertising:

```text
hook → problem/desire → proof/demonstration → benefit/result → hero/CTA handoff
```

For social:

```text
first-frame hook → curiosity → escalation/proof → payoff → clean end/loop
```

See `references/script-storyboard.md`.

---

# 7. Reference authority

Never throw multiple references into the prompt without defining their roles.

Create an authority map:

```text
REFERENCE AUTHORITY
@Image1 = exact character identity and hairstyle
@Image2 = outfit only; ignore its face
@Image3 = exact product geometry and label position
@Video1 = movement timing and blocking only
@Audio1 = rhythm and energy curve only
@Storyboard1 = shot order and framing only
```

Do not silently blend conflicting identities or products.

If a reference is authoritative for geometry, style references must not redesign it.

---

# 8. Continuity locks

Lock only details that are expensive to regenerate.

## People

- exact recognizable face
- hairstyle
- age presentation
- outfit
- body proportions
- required accessories

## Products

- shape
- proportions
- material
- packaging
- logo / label position when supported by reference
- colour

## Environments

- architecture
- fireplace / windows / doors / floor
- important props
- time of day
- weather
- light direction

## Vehicles / objects

- geometry
- wheel / part layout
- paint / material
- scale

Global locks belong near the beginning. Repeat only the 2–3 most expensive locks near the physical end of a long prompt when useful.

---

# 9. Shot design

Every shot needs one dominant purpose.

For each shot decide:

```text
PURPOSE
SHOT SIZE
ANGLE
SUBJECT ACTION
BLOCKING
CAMERA MOVE OR STATIC CHOICE
LENS FEEL WHEN USEFUL
FOCUS BEHAVIOUR
LIGHT
AUDIO
END STATE
```

A new angle must reveal new information, proof, emotion, scale or product detail.

Do not add coverage just because more cuts feel "cinematic".

---

# 10. Camera language

Replace vague direction with physical camera instructions.

Use:

```text
[shot size] + [angle] + [camera movement] + [speed] + [lens feel] + [focus behaviour]
```

Example:

```text
low-angle medium shot, slow backward tracking at the subject's walking speed, 35mm lens feel, stable horizon, focus locked on the eyes with natural background separation
```

Avoid:

```text
dynamic cinematic camera, epic orbit, insane zoom, drone motion, handheld, crane and pan all at once
```

One coherent camera intention per shot is the default.

---

# 11. Action and physics

Describe observable movement.

Bad:

```text
He looks confident.
```

Better:

```text
He squares his shoulders, lifts his chin slightly and walks toward camera without breaking eye contact.
```

For interactions define the physical order:

```text
start position
→ reach / contact
→ grip / opening / press / collision
→ movement
→ release / landing / final position
```

If something passes through a door, lid or fireplace opening, that barrier must be physically open first.

Gravity, contact, inertia, cloth, hair, steam, water, tyres and object weight should behave plausibly unless stylization is intentional.

---

# 12. Visual humanizer / anti-AI slop

Read `references/anti-ai-slop.md` for any human, product, food, architecture or commercial scene.

Core rule:

```text
SPECIFIC CAUSALITY > DECORATIVE SPECTACLE
```

Use small human cues where appropriate:

- breathing
- weight shift
- eye movement before head turn
- fingers settling after grip
- fabric lag
- subtle blink
- natural pause
- small posture correction after stopping

Do not add every cue to every shot.

Reject common AI-slop patterns:

- purposeless orbit camera
- constant floating gimbal
- random particles
- generic neon cyberpunk
- fog everywhere
- oversized lens flares
- plastic skin
- floating feet
- impossible hands
- melting products
- morphing architecture
- cuts every second
- random subtitles
- effects with no physical cause

---

# 13. Lighting and production design

Do not say only "beautiful cinematic lighting".

Define useful properties:

```text
direction
source
softness
colour temperature
contrast
practicals
reflections
atmosphere
```

Example:

```text
large soft key from camera-left, warm tungsten practicals behind the subject, cool window fill from frame-right, restrained negative fill on the far cheek, no unnecessary fog
```

Preserve light continuity across cuts unless the story changes location / time.

---

# 14. Sound, music and dialogue

Treat sound as another production department.

When relevant use:

```text
AUDIO
Dialogue:
Ambience:
Foley:
SFX:
Music:
Mix priority:
Sync cues:
```

Do not default to "epic cinematic music".

Music direction should specify tempo feel, instrumentation, energy curve and where it enters / resolves.

Foley should correspond to visible contact.

Keep dialogue short enough for the beat. Reduce camera/action complexity when lip sync is important.

See `references/sound-music.md`.

---

# 15. Social media mode

For Reels / TikTok / Shorts:

- default to 9:16 when clearly implied and unspecified
- opening frame must work as a still
- hook immediately
- keep subject/product readable
- use approximately 3–5 meaningful beats for many 8–15 second concepts
- a perspective / information change every ~2–3 seconds can be useful, but only when motivated
- land on a payoff or clean loop point

Fast does not mean chaotic.

When the concept is an ad, combine social retention with commercial clarity.

See `references/social-media-playbook.md`.

---

# 16. Advertising mode

The agent must understand the marketing job before choosing camera moves.

Determine:

```text
audience
problem / desire
single message
proof / demonstration
benefit / result
hero frame
CTA handoff
```

For brand/product client work:

```text
ACCURACY FIRST
MESSAGE SECOND
CINEMATIC POLISH THIRD
```

Never sacrifice the product, service or architecture just to create spectacle.

Prefer post-production for precise CTA typography and legal / pricing text unless reliable text rendering is explicitly required and supported.

Read `references/advertising-playbook.md`.

---

# 17. Timing strategy

Choose timing granularity before writing the prompt.

## Continuous
No timestamps for one fluid action when timing divisions would fragment it.

## Staged beats
Default for most narrative and ad clips.

## Timed beats
Use time ranges when music, dialogue, transformation timing or social editing requires them.

Timestamps guide allocation. They are not guaranteed frame-accurate cut points.

Avoid impossible event density.

---

# 18. End states

Every important beat should land somewhere observable.

Weak:

```text
the transformation completes
```

Strong:

```text
end state: armour panels are locked, helmet is closed, both feet contact the floor and the subject faces camera with motion settled
```

The final shot must be designed, not accidentally truncated.

Possible endings:

```text
hero frame
product result
emotional reaction
transformation reveal
clean loop point
hard dramatic finish
```

---

# 19. Prompt assembly

Use only sections needed by the job.

Recommended production format:

```text
TITLE / INTENT

FORMAT
Aspect ratio:
Duration:
Medium / realism:

AD / STORY OBJECTIVE
[only if relevant]

REFERENCE AUTHORITY
...

CONTINUITY LOCKS
...

SCENE / PRODUCTION DESIGN
...

SHOT / BEAT 1 — [purpose]
Action:
Camera:
Light:
Performance / physics:
Audio:
End state:

SHOT / BEAT 2
...

FINAL SHOT / PAYOFF
...

GLOBAL AUDIO / MUSIC
...

CONSTRAINTS
...
```

Do not output empty headings.

For a simple I2V shot, a compact paragraph may be stronger than a long structured prompt.

---

# 20. Prompt compression

More words do not equal more control.

Delete instructions that:

- repeat the same fact
- conflict
- describe static information already obvious from an authoritative image
- add invisible technical detail
- use decorative adjectives instead of direction
- create extra actions the duration cannot support

Be detailed where control is expensive. Be concise elsewhere.

---

# 21. QA / director's gate

Before returning the final prompt, silently check:

## Route
- Is this actually the best T2V / I2V / R2V / storyboard route?

## Story
- Is there one clear idea?
- Is the payoff visible?

## References
- Does every reference have a job?
- Do any authorities conflict?

## Continuity
- Are expensive invariants locked?

## Action
- Is every interaction physically possible?

## Camera
- Does every move have a reason?
- Is the subject readable?

## Humanizer
- Does the person have weight, reaction timing and environmental contact?

## Anti-slop
- Are any effects present only because they "look AI"?

## Audio
- Do sound cues correspond to visible events?
- Can dialogue fit?

## Commercial
- Can the viewer understand the product/service benefit?

## Final frame
- Does the clip land intentionally?

If two or more major checks fail, rewrite before returning.

---

# 22. Failure repair

Do not globally rewrite a mostly successful prompt.

Find the first causal failure and patch that layer.

Examples:

```text
face drift → strengthen identity authority; reduce competing transformations
warped hand → simplify action; define hand + grip + contact order
product mutation → product reference controls geometry; lower motion budget
floating movement → add ground contact, acceleration and weight transfer
chaotic camera → remove secondary movement verbs
weak ad → clarify one benefit / proof and dedicate a hero beat
bad lip sync → shorten dialogue; stabilize camera and action
AI slop → remove purposeless effects and restore physical causes
```

Use `references/failure-diagnosis.md`.

---

# 23. Agent output contract

When the user asks for a full concept, output as needed:

1. **Creative direction** — concise concept
2. **Recommended generation route** — T2V / T2I→I2V / I2V / R2V / storyboard
3. **Scenario / beats** — when the concept needs structure
4. **Reference map** — only when references exist
5. **Seedance prompt** — production-ready
6. **Audio / music plan** — when relevant
7. **Overlay / CTA copy** — kept separate from generative prompt when precise text should be added in editing
8. **Failure patch** — only for repair tasks

If the user asks only for a prompt, return only the prompt.

Default production prompt language: clear English unless the user requests another language.

Keep spoken dialogue in the intended spoken language.

---

# 24. Capability discipline

This skill targets Seedance 2.5 creative behaviour and official production guidance, but execution details vary by provider and rollout.

When the task depends on current duration, resolution, reference limits, native audio, local editing, extension, start/end-frame controls or API parameters:

**verify the selected provider before stating the capability as fact.**

Never invent UI controls or API fields.

---

# Final director mantra

```text
ROUTE BEFORE PROMPT.
STORY BEFORE CAMERA.
ACCURACY BEFORE SPECTACLE.
CAUSE BEFORE EFFECT.
DIRECT THE SCENE.
DO NOT DECORATE THE PROMPT.
```
