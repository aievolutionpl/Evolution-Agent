# Agent Runtime Guide — Seedance 2.5 Director

This file is the lightweight adapter for Codex, Hermes-style agents and other systems that recognize `AGENTS.md`.

The full directing logic lives in `SKILL.md`.

## Load order

1. Read `SKILL.md`.
2. Identify the user's production mode.
3. Read only the relevant reference files.
4. Produce the requested deliverable.

Do not load every playbook unless the task genuinely spans them.

---

## Trigger this skill when

The user wants to:

- create or improve a Seedance 2.5 prompt
- animate an image
- generate a video from text
- decide whether to use T2V or I2V
- build a cinematic scene
- create an ad / product / service video
- create a Reel / TikTok / Short
- create a storyboard or script
- preserve a face / product / room / outfit / vehicle
- use multiple references
- create dialogue / music-led / transformation video
- diagnose a failed AI generation

Also trigger from vague requests such as:

```text
make this cinematic
animate this photo
make this into a luxury ad
make a viral 10-second video
turn this product into a Reel
write a Seedance prompt
```

Do not expect the user to know cinematography terminology.

---

# Runtime algorithm

## Step 1 — Resolve the actual job

Extract or infer:

```text
subject
purpose / audience
main message or story
starting assets
duration
aspect ratio
final payoff
hard constraints
```

If the user's intent is sufficiently clear, infer production choices instead of asking unnecessary questions.

## Step 2 — Route BEFORE prompt

Read `references/generation-routing.md`.

Choose the simplest route that protects valuable information:

```text
T2V
T2I → I2V
I2V
R2V
STORYBOARD / ANIMATIC
MOTION REFERENCE
EDIT / REPAIR
```

Important:

If the user provides an image, never automatically assume the task is "describe the image in more detail".

Decide whether to:

- preserve and animate it
- use it as one reference among several
- generate a better starting keyframe first
- ignore it only if the user explicitly wants a redesign

## Step 3 — Select leading production mode

Choose one lead:

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

Supporting modes may assist.

## Step 4 — Read relevant playbooks

```text
model / limits → references/model-profile.md
routing → references/generation-routing.md
cinematic → references/cinematic-playbook.md
ads → references/advertising-playbook.md
social → references/social-media-playbook.md
script/storyboard → references/script-storyboard.md
sound/music/dialogue → references/sound-music.md
anti-slop/humanizer → references/anti-ai-slop.md
patterns → references/prompt-patterns.md
repair → references/failure-diagnosis.md
```

## Step 5 — Solve story / marketing logic

If several events, dialogue, transformation, before/after or advertising message exist, create a compact scenario internally before writing shots.

Use one central idea.

Advertising priority:

```text
AUDIENCE
→ PROBLEM / DESIRE
→ ONE MESSAGE
→ PROOF / DEMONSTRATION
→ RESULT
→ HERO / CTA HANDOFF
```

Social priority:

```text
FIRST-FRAME HOOK
→ CURIOSITY
→ PROGRESSION
→ PAYOFF
→ CLEAN END / LOOP
```

## Step 6 — Bind references

Every input receives an explicit role.

Example:

```text
@Image1 = face identity
@Image2 = wardrobe only
@Image3 = product geometry
@Video1 = motion timing only
@Audio1 = beat structure only
@Storyboard1 = shot order only
```

Never silently merge conflicting face identities, products or architecture.

## Step 7 — Build shots

For each meaningful beat define:

```text
purpose
action
composition
camera
light
performance / physics
audio
end state
```

One dominant purpose per shot.

## Step 8 — Apply visual humanizer

Read `references/anti-ai-slop.md` whenever people, physical products, food, vehicles or architecture matter.

Look for:

- body weight
- ground contact
- grip logic
- eye line
- reaction timing
- fabric / hair inertia
- believable camera acceleration
- physically caused environmental motion

Remove decorative AI-looking effects that serve no story or commercial purpose.

## Step 9 — Direct sound

Read `references/sound-music.md` when sound is relevant.

Do not default to generic epic music.

Sound must support:

- contact
- space
- rhythm
- emotion
- dialogue clarity

## Step 10 — QA

Run the director gate from `SKILL.md`:

```text
route
story / message
references
continuity
physics
camera motivation
humanizer
anti-slop
timing
audio
commercial clarity
final frame
```

If multiple major checks fail, rewrite before output.

---

# Client-work rule

For real commercial assets:

```text
ACCURACY FIRST.
MESSAGE SECOND.
CINEMATIC POLISH THIRD.
```

Do not redesign a client's real product, room, vehicle, food item or brand asset for spectacle.

---

# Social rule

For many 8–15 second social concepts:

- use a strong still-readable opening
- keep product / face readable
- prefer 3–5 meaningful beats over constant cutting
- change perspective around meaningful information, not on a timer
- let the payoff settle

---

# First-frame rule

The first frame should make sense without motion.

Use a clear focal point, useful subject scale and immediate premise.

---

# Last-frame rule

End deliberately with one:

```text
hero frame
result
reaction
transformation reveal
loop point
dramatic finish
```

---

# Prompt compression rule

Delete:

- repeated facts
- contradictions
- style filler
- invisible technical trivia
- redundant descriptions already locked by an image
- too many simultaneous actions

Detailed where expensive. Concise elsewhere.

---

# Failure-repair rule

When a video partially fails:

```text
KEEP successful layers
CHANGE ONLY the causal failure
PATCH with observable direction
DEFINE a new end state
```

Do not restart a successful production because one local detail broke.

---

# Output behaviour

If the user asks for a full creative concept, return only the useful subset of:

```text
creative direction
recommended generation route
scenario / timeline
reference authority map
Seedance prompt
audio / music plan
overlay / CTA copy for editing
repair patch
```

If the user asks for prompt only, return prompt only.

Default production prompt language: English, unless the user requests otherwise.

Keep dialogue in the intended spoken language.

---

# Capability discipline

Do not invent current provider parameters.

When exact duration, resolution, reference count, native audio, local editing, extension or API fields matter, verify the selected Seedance 2.5 provider / interface first.

---

# Runtime mantra

```text
ROUTE BEFORE PROMPT.
STORY BEFORE CAMERA.
ACCURACY BEFORE SPECTACLE.
CAUSE BEFORE EFFECT.
DIRECT THE SCENE.
DO NOT DECORATE THE PROMPT.
```
