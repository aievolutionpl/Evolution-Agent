<div align="center">

# 🎬 Seedance 2.5 Director

### Production-grade prompting skill for cinematic AI video, advertising and social content

**Built by [AI Evolution Labs](https://aievolutionlabs.io) × AI Evolution Polska**

[![Seedance](https://img.shields.io/badge/Seedance-2.5-111111?style=for-the-badge)](#)
[![AI Video](https://img.shields.io/badge/AI_Video-Director-7c3aed?style=for-the-badge)](#)
[![Ads](https://img.shields.io/badge/Cinematic-Ads-f59e0b?style=for-the-badge)](#)
[![Social](https://img.shields.io/badge/Reels-Shorts-ec4899?style=for-the-badge)](#)
[![Skill](https://img.shields.io/badge/Agent-Skill-10b981?style=for-the-badge)](#)

**Turn a rough idea, image, product shot or script into a directed Seedance prompt with shot logic, camera movement, lighting, audio, continuity and a deliberate final frame.**

</div>

---

## What this is

Most AI video prompts are adjective soup:

```text
cinematic, epic, ultra realistic, dynamic camera, dramatic lighting...
```

That is not directing.

**Seedance 2.5 Director** teaches an AI agent to think like a director, cinematographer and commercial creative before it writes the prompt.

The core production pipeline is:

```text
IDEA
  ↓
OBJECTIVE
  ↓
REFERENCE AUTHORITY
  ↓
CONTINUITY LOCKS
  ↓
SHOT DESIGN
  ↓
ACTION + PHYSICS
  ↓
CAMERA + LENS
  ↓
LIGHT + PRODUCTION DESIGN
  ↓
AUDIO
  ↓
END STATES
  ↓
FAILURE PREVENTION
  ↓
SEEDANCE PROMPT
```

The result is a prompt that is easier for a video model to follow and easier for a human to iterate.

---

## Built for

- 🎬 cinematic scenes
- 📱 TikTok, Instagram Reels and YouTube Shorts
- 📣 paid social and performance ads
- 🛍️ product and ecommerce commercials
- 💎 luxury campaigns
- 🍔 food cinematography
- 🚗 automotive videos
- 👗 fashion and beauty
- 🏠 architecture and interiors
- 🤖 technology and futuristic scenes
- 🗣️ dialogue and lip-sync scenes
- ⚡ transformations and VFX-style sequences
- 🎥 image-to-video and reference-to-video workflows
- 🧩 multi-reference prompting
- 🛠️ repairing weak AI generations

---

## The main idea

A strong video prompt should answer these questions:

1. **What is the viewer supposed to feel or understand?**
2. **Which references control identity, product, wardrobe, environment, motion or style?**
3. **What must never drift?**
4. **What visibly happens in each beat?**
5. **Where is the camera?**
6. **Why does the camera move?**
7. **What lighting creates the intended look?**
8. **What should we hear?**
9. **What must visibly be true at the end of each important beat?**
10. **What expensive failure should the prompt prevent?**

If an instruction does not help answer one of those questions, it is probably noise.

---

# Quick start

Give your agent an idea such as:

```text
Create a 10-second vertical ad for a luxury perfume.
I have one product image and one marble bathroom reference.
Make it expensive, cinematic and suitable for Instagram Reels.
```

The skill should turn that into something closer to:

```text
FORMAT
9:16 vertical, 10 seconds, premium live-action perfume commercial.

REFERENCE AUTHORITY
@Image1 = exact perfume bottle geometry, cap, label position and glass colour.
@Image2 = marble bathroom architecture, material palette and warm practical lighting only.

CONTINUITY LOCKS
Preserve exact bottle proportions and label position in every shot. No redesign, no duplicate bottle, no warped glass.

0–2.5s — HOOK
Macro shot through a foreground water droplet. Rack focus reveals the perfume bottle standing on wet dark marble. A narrow warm rim light traces the glass edges. Camera performs a slow 85mm-feel push-in.
End state: bottle silhouette and cap are clearly readable.

2.5–5s — MATERIAL DESIRE
Extreme close-up of condensation sliding down the bottle. Controlled highlights move across the glass while the camera makes a subtle lateral slider move.
End state: premium glass texture and liquid colour are clearly visible.

5–7.5s — HUMAN INTERACTION
A clean hand enters from camera-right and lifts the bottle naturally by the base. No finger intersections. Camera tracks upward with the bottle.
End state: bottle remains undeformed and fully controlled in the hand.

7.5–10s — HERO FRAME
Cut to a stable 85mm beauty shot. Bottle returns to the marble surface. Slow micro push-in. Warm practical bokeh behind it, crisp edge separation, clean negative space above for post-production copy.
End state: campaign-ready product hero frame, motion settled.

AUDIO
Soft room ambience, one delicate glass contact sound, restrained luxury electronic pulse, subtle low-frequency finish.

CONSTRAINTS
Exact product geometry throughout. No random text. No extra hands. No melting glass. No camera clipping. Natural reflections and physically plausible contact.
```

The difference is simple: **the second prompt directs a scene.**

---

# Three prompting modes

## 1. FAST PROMPT

Use when the user needs a quick generation and the idea is simple.

Output:

```text
Subject + observable action + environment + camera + light + end frame + constraints
```

## 2. PRODUCTION PROMPT

Default for ads, social videos and scenes with references.

Includes:

- format
- reference binding
- continuity locks
- scene
- beats / shots
- camera
- light
- audio
- end states
- constraints

## 3. DIRECTOR MODE

Use for high-value commercials, complex transformations, story scenes or multi-reference projects.

Adds:

- creative objective
- visual strategy
- shot hierarchy
- transition logic
- sound design
- reference authority map
- continuity plan
- hero-frame strategy
- failure-risk analysis

---

# Cinematic prompting

The skill does **not** use `cinematic` as a substitute for cinematography.

It chooses:

```text
emotion
+ composition
+ shot size
+ camera angle
+ motivated camera move
+ lens feel
+ focus behaviour
+ lighting direction
+ foreground/background depth
+ atmosphere
+ sound
+ final composition
```

Example:

❌ Weak:

```text
cinematic man walking through city, dramatic, epic, dynamic camera
```

✅ Directed:

```text
low-angle medium tracking shot, camera moving backward at the subject's walking speed, 35mm lens feel, wet pavement creating foreground reflections, soft cyan storefront light camera-left and warm tungsten practicals behind him, shallow atmospheric haze, focus locked on his eyes while background lights stretch into soft bokeh
```

See [`references/cinematic-playbook.md`](references/cinematic-playbook.md).

---

# Advertising mode

For advertising, pretty footage is not enough.

The skill first decides what the ad is doing:

- stop the scroll
- create desire
- demonstrate a benefit
- show proof
- create product trust
- reveal a transformation
- make the brand feel premium
- land on a conversion-ready hero frame

A useful 10-second commercial structure:

```text
0–2s    PATTERN INTERRUPT / HOOK
2–5s    DESIRE / PROBLEM / DISCOVERY
5–8s    BENEFIT / DEMONSTRATION / PAYOFF
8–10s   PRODUCT HERO / BRAND FRAME / EDITING SPACE
```

The model should not be trusted to generate critical marketing copy perfectly. When copy matters, the skill prefers a clean composition with negative space so text can be added in post.

See [`references/advertising-playbook.md`](references/advertising-playbook.md).

---

# Short-form social mode

For 8–15 second social video:

- lead with a visually understandable first frame
- use about 3–5 meaningful beats
- change perspective roughly every 2–3 seconds when it improves retention
- never cut only because “viral videos need cuts”
- every new camera angle should reveal information, escalate action or improve payoff
- land on a deliberate ending rather than stopping randomly

Recommended structure:

```text
HOOK → ESCALATION → PAYOFF → HERO / LOOP
```

---

# Reference authority

One of the most important rules in this project:

> **Every reference gets a job.**

Example:

```text
REFERENCE AUTHORITY
@Image1 controls exact face identity only.
@Image2 controls wardrobe only.
@Image3 controls product geometry only.
@Image4 controls environment only.
@Video1 controls movement timing and camera pacing only.
@Audio1 controls rhythm only.
```

Do not let references silently compete with each other.

---

# Continuity locks

For recurring subjects, the agent identifies the expensive properties that must stay fixed.

### Character

```text
exact face
hair
wardrobe
body proportions
age presentation
key accessories
```

### Product

```text
geometry
proportions
packaging
logo position
materials
colour
```

### Environment

```text
architecture
important prop positions
time of day
weather
light direction
```

---

# Camera philosophy

Every camera move needs a reason.

| Goal | Useful moves |
|---|---|
| Reveal | dolly-in, rack focus, foreground slide, crane-down |
| Energy | side tracking, low backward tracking, controlled handheld |
| Product luxury | macro slider, slow orbit, top-down descent, micro push-in |
| Scale | wide low-angle, crane-up, foreground parallax |
| Intimacy | locked close-up, subtle breathing handheld, slow push-in |
| Impact | rapid push-in, whip into planned cut, low-angle reveal |

Avoid prompts that stack unrelated camera verbs.

---

# End-state prompting

A major part of this skill is **end-state design**.

Weak:

```text
the transformation finishes
```

Better:

```text
End state: the armour is fully locked around the torso and arms, the faceplate closes, both feet are planted on the floor, the subject faces camera and all moving parts settle before the final beat.
```

Visible end states give complex generations a target.

---

# Physics and interaction

The skill explicitly describes interactions when ambiguity would cause AI errors.

Instead of:

```text
he puts wood into the fireplace
```

Use:

```text
he reaches for the metal handle with his right hand, opens the glass fireplace door outward first, then uses his left hand to place one log through the open doorway onto the existing embers; the log never passes through the glass
```

Small physical details often decide whether a generated scene feels believable.

---

# Prompt libraries

This skill includes dedicated playbooks:

- [`references/prompt-patterns.md`](references/prompt-patterns.md) — production prompt templates
- [`references/cinematic-playbook.md`](references/cinematic-playbook.md) — cinematography, camera, lens and lighting
- [`references/advertising-playbook.md`](references/advertising-playbook.md) — ads, products, ecommerce and conversion creative
- [`references/failure-diagnosis.md`](references/failure-diagnosis.md) — repair weak generations without destroying what already works

---

# Agent output contract

When the user asks for a Seedance prompt, the agent should normally return:

```text
CREATIVE DIRECTION
One concise explanation of the idea.

SEEDANCE PROMPT
The finished production-ready prompt.

REFERENCE MAP
Only when references exist.

WHY IT SHOULD WORK
Up to 3 useful notes when needed.
```

If the user says “just give me the prompt”, return only the prompt.

---

# Quality gate

Before returning a prompt, the skill silently checks:

- one clear idea
- feasible action density
- correct reference authority
- identity/product continuity
- useful shot progression
- motivated camera movement
- plausible physics
- readable product/subject
- manageable dialogue length
- deliberate sound hierarchy
- visible end states
- clean final frame

If several checks fail, it rewrites the prompt before showing it.

---

# Example use cases

### Luxury ad

```text
Turn this perfume photo into a 10-second vertical cinematic ad.
```

### Food commercial

```text
Create a macro burger commercial. Make the meat, steam and sauce look believable, not AI-generated.
```

### Social transformation

```text
I walk toward camera and transform into futuristic armour. 10 seconds, 9:16.
```

### Architecture

```text
Turn this finished interior photo into a premium renovation reel with three camera perspectives.
```

### Dialogue

```text
Two people talk in a café. Keep both faces consistent and preserve eyelines between cuts.
```

### Reference-driven video

```text
Image 1 is my face. Image 2 is the outfit. Image 3 is the environment. Video 1 is the movement reference. Build the best Seedance prompt.
```

---

# Capability discipline

Seedance capabilities and limits may vary by provider and rollout stage.

The skill therefore separates:

**Creative planning**

from

**provider-specific execution claims**.

If a workflow depends on current duration, number/type of references, editing, audio, resolution, extension or API parameters, the agent should verify the selected provider instead of inventing a limit.

Official Dreamina materials currently describe structured cinematic prompts, `@` reference tagging, multimodal reference workflows, camera direction, audio, ads and social production as core Seedance 2.5 workflows.

---

# Philosophy

> **A strong AI video prompt is not a bag of adjectives. It is a directed scene.**

We want AI-generated video to feel intentional:

- cleaner motion
- better continuity
- stronger composition
- fewer random model decisions
- easier iteration
- better commercial usability

---

<div align="center">

## AI Evolution Labs × AI Evolution Polska

**Practical AI systems, creative workflows and production tools.**

Built for creators, marketers, agencies and AI agents that need to ship better work.

</div>
