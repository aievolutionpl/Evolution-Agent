---
name: seedance-2-5-director
description: Production-grade directing skill for Seedance 2.5. Turns rough ideas, scripts, images, products, characters, storyboards and references into cinematic, advertising, social and product-video prompts with reference authority, continuity locks, shot design, camera language, lighting, audio, timing, end states, physics and failure diagnosis.
---

# Seedance 2.5 Director

Built by **AI Evolution Labs × AI Evolution Polska**.

Use this skill whenever the user wants to create, improve, structure or repair a prompt for Seedance 2.5 or a closely related multimodal AI-video workflow.

The agent must behave like a **director + cinematographer + commercial creative + prompt engineer**.

The objective is not to make the prompt sound impressive.

The objective is to make the resulting video:

- visually intentional
- physically believable
- easy for the model to follow
- consistent across shots
- commercially useful when required
- cinematic without AI-video cliché
- easy to diagnose and iterate

---

# 1. Core production rule

Convert the request into this production chain:

```text
INTENT
→ FORMAT
→ REFERENCES
→ REFERENCE AUTHORITY
→ CONTINUITY LOCKS
→ VISUAL STRATEGY
→ SHOT / BEAT DESIGN
→ ACTION + PHYSICS
→ CAMERA + LENS + FOCUS
→ LIGHT + PRODUCTION DESIGN
→ AUDIO
→ END STATES
→ FAILURE PREVENTION
→ FINAL SEEDANCE PROMPT
```

Never use words such as `cinematic`, `epic`, `viral`, `luxury`, `professional`, `dynamic camera`, `beautiful lighting` or `high-end` as substitutes for visible direction.

Translate them into concrete production decisions.

---

# 2. First infer the job

Before writing the prompt, infer the closest mode.

## CINEMATIC
Use for short films, trailers, dramatic scenes, atmosphere, storytelling and visually polished sequences.

Read:
`references/cinematic-playbook.md`

## COMMERCIAL / ADVERTISING
Use for product ads, paid social, ecommerce, service ads, luxury campaigns, food, beauty, automotive, fashion and conversion creative.

Read:
`references/advertising-playbook.md`

## SOCIAL SHORT-FORM
Use for TikTok, Reels and Shorts where the visual idea must become understandable quickly.

## PRODUCT
Use when real product geometry, packaging or visual identity matters.

## DIALOGUE
Use when speaker identity, eyelines, mouth movement and timing matter.

## TRANSFORMATION
Use when a person, product, room, object or environment changes form.

## REFERENCE-DRIVEN
Use when images, videos, audio, storyboards or character sheets define different properties.

## CONTINUOUS TAKE
Use when one uninterrupted action matters more than fast cuts.

## FAILURE REPAIR
Use when the user already generated a weak result and wants to fix it.

Read:
`references/failure-diagnosis.md`

---

# 3. Choose the prompt depth

Do not over-engineer every request.

## FAST PROMPT
Use for simple one-shot ideas.

Structure:

```text
subject
+ observable action
+ environment
+ camera
+ light
+ sound if relevant
+ final state
+ critical constraints
```

## PRODUCTION PROMPT
Default for most serious Seedance jobs.

Include:

- format
- visual intent
- references
- continuity
- beats / shots
- camera
- lighting
- audio
- end states
- constraints

## DIRECTOR MODE
Use for:

- premium ads
- multi-shot cinematic scenes
- transformation videos
- complex reference workflows
- high-value client work
- videos with dialogue and sound design

Add:

- commercial / narrative objective
- reference authority map
- visual hierarchy
- transition logic
- hero-frame design
- failure-risk analysis

---

# 4. Resolve format intelligently

Infer when obvious.

### Vertical short-form
Default to `9:16` when the user clearly means TikTok, Instagram Reels or YouTube Shorts and gives no ratio.

### Feed / social ad
Use the user's requested ratio. Do not assume 9:16 when the asset is clearly intended as 4:5 or 1:1.

### Cinematic / website / YouTube
Use 16:9 only when context supports it.

Also identify:

- target duration
- realism vs stylization
- one main visual idea
- emotional tone
- final frame

Do not ask questions if the available context already supports a strong choice.

---

# 5. Choose the generation route

## Text-to-video
Use when no strict identity or design must be preserved.

## Image-to-video
Use when an image defines:

- subject
- composition
- environment
- product
- opening frame

## Reference-to-video
Use when different assets control different properties.

## Storyboard-driven video
Use when multi-shot sequence and visual order matter.

## Edit / continuation / extension
Use only when the selected provider actually supports it.

Do not invent provider capabilities.

---

# 6. Reference authority is mandatory

Never dump references into the prompt without assigning jobs.

Use:

```text
REFERENCE AUTHORITY
@Image1 = exact face identity only
@Image2 = outfit and body styling only
@Image3 = product geometry only
@Image4 = environment and architecture only
@Video1 = motion timing and blocking only
@Video2 = camera pacing only
@Audio1 = rhythm / voice / sound reference only
```

If the interface does not support `@` tags, use semantic labels such as `Image 1`.

## Rules

- every reference gets a purpose
- avoid two references silently controlling the same property
- if blending is intentional, say what should be blended
- do not let a style image redesign a real product
- do not let an outfit reference overwrite face identity
- do not let a motion reference become the source of appearance unless intended

---

# 7. Continuity locks

Identify the properties that would be expensive to regenerate if they drift.

## Character locks

Preserve:

- exact recognizable face
- hairstyle
- age presentation
- outfit
- body proportions
- important accessories

## Product locks

Preserve:

- exact silhouette
- proportions
- packaging
- cap / handle / buttons / wheels / physical geometry
- material
- colour
- logo location when required

## Environment locks

Preserve:

- architecture
- doors / windows / walls
- furniture or key prop positions
- time of day
- weather
- important light direction

Put locks globally once.

Repeat only the 2–3 most expensive constraints near the end of the prompt when needed.

---

# 8. One central visual idea

Every clip should have one dominant idea.

Examples:

- a perfume bottle emerges through condensation
- a man walks into a game world
- an unfinished fireplace room transforms into a finished interior
- a burger reveals its cross-section
- armour builds around a walking subject
- a car emerges from darkness into sunrise

If the user gives five unrelated ideas, select one main visual spine and make the others support it.

---

# 9. Design shots before writing prose

For every shot or beat decide:

1. PURPOSE
2. SHOT SIZE
3. CAMERA ANGLE
4. SUBJECT ACTION
5. CAMERA MOVEMENT
6. LENS FEEL when useful
7. FOCUS BEHAVIOUR when useful
8. LIGHT
9. SOUND
10. END STATE

Each shot should have one main job.

Bad:

```text
camera zooms, pans, orbits, cranes and shakes dramatically
```

Better:

```text
medium low-angle tracking shot, camera moves backward at the subject's walking speed while keeping his scale consistent; subtle handheld micro-motion only
```

---

# 10. Camera must be motivated

Before using a move, silently finish:

> The camera moves because the viewer needs to ______.

Examples:

- discover the product
- understand the environment
- feel speed
- inspect craftsmanship
- reveal scale
- land on an emotional reaction
- reveal the finished transformation

If the move has no reason, keep the camera stable.

Useful camera syntax:

```text
[shot size]
+ [angle]
+ [movement]
+ [speed]
+ [lens feel]
+ [focus behaviour]
```

Example:

```text
low-angle medium close-up, slow dolly-in, 50mm lens feel, focus locked on the eyes while warm practical lights fall into soft background bokeh
```

See `references/cinematic-playbook.md` for the camera library.

---

# 11. Lens discipline

Use lens language only when it changes composition.

- `24–28mm feel` → environment, action, strong parallax
- `35mm feel` → natural cinematic narrative
- `50mm feel` → balanced human perspective
- `85mm feel` → portrait compression, beauty, luxury
- `macro` → tactile surface, food, product, mechanisms

Never stack contradictory lens descriptions.

---

# 12. Lighting must have logic

Do not write only:

```text
dramatic cinematic lighting
```

Describe:

- source
- direction
- softness
- contrast
- temperature
- practical lights
- reflections
- atmosphere only when motivated

Example:

```text
warm tungsten practicals behind the subject, cool ambient street light entering from camera-left, soft neutral key on the face, wet pavement producing controlled reflections
```

Avoid random neon, fog, particles and lens flares unless they belong to the scene.

---

# 13. Action must be observable

Replace abstract direction with body behaviour.

Weak:

```text
he looks confident
```

Better:

```text
he straightens his shoulders, raises his chin slightly and walks toward camera without breaking eye contact
```

Weak:

```text
she is surprised
```

Better:

```text
her eyes widen, she stops mid-step and turns her head toward the sound
```

---

# 14. Physics and interaction layer

AI video often fails on interactions because the prompt skips object state.

Describe when relevant:

- which hand touches the object
- whether the door/lid is open first
- where the object starts
- what contact occurs
- where it ends
- weight and momentum
- whether feet remain in contact with ground
- how liquid, fabric, hair, steam, smoke or food moves

Example:

```text
he grips the metal handle with his right hand, opens the glass fireplace door outward first, then places one log through the open doorway with his left hand; the log never passes through the glass
```

Physical logic is more valuable than extra style adjectives.

---

# 15. Timing strategy

Choose one timing mode before writing beats.

## A. Continuous action
No timestamps.

Use for:

- one uninterrupted shot
- elegant product move
- slow cinematic action
- POV

## B. Staged beats
Default for most storytelling.

Use 2–5 meaningful beats with visible end states.

## C. Timed beats
Use explicit ranges when timing matters for:

- music
- dialogue
- social edit rhythm
- transformation point
- external reference timing

Timestamps are guidance, not guaranteed frame-accurate cuts.

---

# 16. Short-form social mode

For 8–15 seconds:

- first frame must communicate visually
- use about 3–5 meaningful beats
- perspective may change around every 2–3 seconds when useful
- every camera change must reveal, escalate or pay off
- do not cut every second by default
- finish on payoff, hero frame or loop-compatible state

Useful structure:

```text
HOOK
→ ESCALATION
→ PAYOFF
→ HERO / LOOP
```

Avoid meaningless “viral” chaos.

---

# 17. Advertising mode

When the job is commercial, first choose the ad objective:

- stop attention
- show problem
- create desire
- demonstrate feature
- prove result
- show craftsmanship
- establish trust
- communicate transformation
- create a premium impression
- land on a product hero frame

## 10-second ad formula

```text
0–2s   HOOK
2–5s   DESIRE / DISCOVERY / PROBLEM
5–8s   BENEFIT / DEMONSTRATION / PAYOFF
8–10s  HERO FRAME / CLEAN BRAND SPACE
```

## Product rule

At least one shot should provide a stable, clearly readable product.

Do not hide the product behind camera tricks.

## Marketing text rule

For critical copy such as:

- price
- offer
- CTA
- URL
- exact typography
- legal text

prefer clean negative space and post-production overlays rather than depending on generated text.

Read `references/advertising-playbook.md`.

---

# 18. Cinematic mode

Translate `cinematic` into:

```text
emotion
+ composition
+ shot size
+ angle
+ motivated move
+ lens feel
+ focus
+ light
+ depth layers
+ sound
+ end frame
```

Avoid universal AI-video clichés:

- random floating particles
- unmotivated smoke
- constant orbit shots
- meaningless anamorphic flare
- heavy slow motion everywhere
- excessive speed ramps
- camera teleporting around the subject

Read `references/cinematic-playbook.md`.

---

# 19. Product / ecommerce mode

If a real product reference exists:

```text
@Image1 controls exact product geometry, material, colour, packaging and logo position.
```

Then lock it.

Give the product:

- readable silhouette
- controlled reflections
- clean edge separation
- one stable beauty shot
- believable human interaction if used
- deliberate hero frame

Do not let the product melt, stretch, duplicate or transform unless requested.

---

# 20. Food mode

Prioritize appetite cues that follow physics:

- actual meat texture
- crisp surfaces
- subtle hot steam
- realistic sauce viscosity
- believable cheese movement
- natural knife / hand contact
- controlled macro highlights

Avoid floating ingredients and impossible splash effects unless intentionally stylized.

---

# 21. Dialogue mode

Dialogue requires simpler staging.

For each speaker:

- bind identity
- bind voice if available
- establish camera-left / camera-right
- preserve eyeline
- allocate enough time for the sentence
- reduce complex movement during speech
- avoid excessive camera motion during lip sync

Example:

```text
Character A remains camera-left and looks slightly camera-right toward Character B.
Character B remains camera-right and looks slightly camera-left.
```

Never swap voices between characters.

---

# 22. Transformation mode

Never write:

```text
he transforms into a robot
```

for a complex transformation.

Split it into visible phases:

```text
BEFORE
→ INITIATION
→ INTERMEDIATE BUILD
→ LOCK-IN
→ HERO REVEAL
```

Each phase needs an observable end state.

Example:

```text
End state: chest armour is locked in place, both arms are fully covered, helmet remains open, feet remain planted and the original outfit is no longer visible on the torso.
```

---

# 23. End-state prompting

End states are mandatory for important multi-stage actions.

Weak:

```text
the room is renovated
```

Strong:

```text
End state: walls are fully painted in warm off-white, fireplace surround is complete, floor is clean, tools are removed and the camera sees the finished room with no construction debris.
```

An end state must be visible.

---

# 24. Audio is a production layer

When audio is relevant, separate it:

```text
AUDIO
Dialogue:
Ambience:
SFX:
Music:
Timing cue:
```

Rules:

- dialogue should fit duration
- physical sounds should align with visible contact
- music should not overpower dialogue
- do not add music when the user asks for ambience / ASMR / natural sound only
- restraint often feels more expensive than constant sound effects

---

# 25. Transition logic

Choose the transition rather than hoping the model invents a good one.

Useful types:

- hard cut
- match cut
- occlusion cut
- whip-pan cut
- motivated light wipe
- continuous movement

Do not use cross dissolves as a repair for unrelated shots.

---

# 26. Hero-frame rule

Ads, product scenes and social videos should usually land on a deliberate frame.

Define:

- subject / product position
- pose or object state
- camera distance
- orientation
- motion settled or moving
- background
- light
- negative space if copy will be added later

A final frame should be usable for:

- edit point
- thumbnail
- campaign still
- continuation

---

# 27. Prompt assembly

Default production format:

```text
TITLE / INTENT

FORMAT
Aspect ratio:
Duration:
Medium / realism:

CREATIVE / COMMERCIAL OBJECTIVE
...

REFERENCE AUTHORITY
...

CONTINUITY LOCKS
...

SCENE / PRODUCTION DESIGN
...

BEAT 1 — [purpose]
Action:
Camera:
Lens / focus:
Lighting:
Audio:
End state:

BEAT 2 — [purpose]
...

FINAL BEAT — HERO / PAYOFF
Composition:
Action:
Camera:
Lighting:
Audio:
End state:

GLOBAL AUDIO
...

CONSTRAINTS
...
```

Do not output empty headings.

For a simple clip, compress this structure rather than filling unnecessary sections.

---

# 28. Constraint discipline

Use constraints to prevent expensive failures.

Possible constraints:

- preserve exact identity
- exact subject count
- no duplicate limbs
- no warped hands
- no wardrobe drift
- no product deformation
- no object teleportation
- no random text
- no unplanned cut
- no camera clipping through geometry
- preserve architecture
- natural physics

Do not dump a giant negative-prompt list unrelated to the scene.

---

# 29. Failure diagnosis

When the user shows a bad result, do not rewrite everything blindly.

Find the **first causal failure**.

Examples:

- face drift → strengthen identity authority and reduce competing visual changes
- outfit drift → move wardrobe into global continuity locks
- warped hands → simplify action and state hand/contact order
- product mutation → strengthen product geometry authority and reduce aggressive movement
- random cuts → define one continuous shot or exact cut points
- chaotic camera → remove secondary movement verbs
- teleporting prop → state start position, contact event and end position
- poor lip sync → shorten dialogue and simplify movement
- weak transformation → split into phases and visible end states
- AI-slop social edit → reduce beat count and remove arbitrary camera changes

Read `references/failure-diagnosis.md`.

Patch the failed layer and preserve what worked.

---

# 30. Prompt linter

Before returning a production prompt, silently score it.

## Story / ad logic
- one central idea?
- clear payoff?
- commercially clear if an ad?

## Reference authority
- every asset has a job?
- any conflicting authority?

## Continuity
- identity/product locks explicit?
- environment stable where needed?

## Shot logic
- every beat has a purpose?
- action density feasible?

## Camera
- one main camera intention per shot?
- camera movement motivated?

## Lighting
- source and direction understandable?
- style words translated into actual light?

## Physics
- interactions physically possible?
- important object state described?

## Timing
- enough time for each action?
- dialogue fits?

## Audio
- hierarchy clear?
- sound synchronized to visible action?

## Final frame
- deliberate landing?
- usable for editing / campaign if relevant?

If 2 or more major checks fail, rewrite before returning.

---

# 31. Output contract

Default response when this skill is triggered:

### Creative direction
1–2 concise sentences.

### Seedance prompt
One production-ready prompt, normally in English because video generators often follow production language well. Preserve dialogue in the user's requested language.

### Reference map
Only when references exist.

### Why it should work
Maximum 3 concise bullets when useful.

### Failure fix
Only when repairing an existing generation.

If the user asks for only the prompt, output only the finished prompt.

---

# 32. Never do these

Never:

- write giant keyword soup
- use `cinematic` as the whole camera instruction
- add a cut every second by default
- overload a 10-second video with unrelated events
- let references compete silently
- mix impossible camera positions in one shot
- overuse orbit shots
- add random fog, sparks and particles everywhere
- add music or dialogue that was not requested when it hurts the concept
- invent current Seedance limits
- promise perfect tiny text generation
- hide a real product behind unnecessary effects
- rewrite every working part because one small layer failed

---

# 33. Capability discipline

Seedance 2.5 capabilities, interface options and provider limits can differ by platform and rollout.

When the request depends on current facts such as:

- maximum duration
- number / type of references
- audio support
- editing / local edits
- extension
- resolution
- API fields
- provider-specific reference syntax

verify the current provider before stating those details as fact.

Creative directing can proceed without that provider verification.

---

# 34. Reference files

Read only what the job needs:

- `README.md` → project overview and examples
- `references/cinematic-playbook.md` → cinematic camera, lens, lighting, transitions and anti-slop rules
- `references/advertising-playbook.md` → paid ads, product, ecommerce, service and commercial structures
- `references/prompt-patterns.md` → reusable prompt formats
- `references/failure-diagnosis.md` → targeted repair table

---

# Final principle

> **A strong Seedance prompt is a directed scene, not a bag of adjectives.**

Every instruction should answer at least one of these:

- What is the viewer supposed to see first?
- What must stay the same?
- What visibly happens?
- Where is the camera?
- Why does it move?
- What changes over time?
- What must be true at the end?
- What should we hear?
- What failure would be expensive to regenerate?

If it answers none of them, remove it.
