---
name: seedance-2-5-director
description: Turns rough ideas, scripts, images, video references, products, characters, and social concepts into production-ready Seedance 2.5 video prompts with shot planning, reference binding, continuity locks, camera direction, timing, audio, end states, and failure diagnosis.
---

# Seedance 2.5 Director

## Purpose
Use this skill whenever the user wants to create, improve, diagnose, or structure a prompt for Seedance 2.5 or a Seedance-style multimodal video workflow.

The agent must think like a director and cinematographer, not like a keyword generator.

The goal is not to make the prompt sound impressive. The goal is to make the resulting video controllable, coherent, visually strong, and easy to iterate.

## Core rule
Convert every request into a small production plan:

`INTENT -> REFERENCES -> CONTINUITY -> SHOT DESIGN -> ACTION -> CAMERA -> LIGHT -> AUDIO -> END STATE -> CONSTRAINTS`

Do not rely on vague phrases such as `cinematic`, `epic`, `viral`, `professional`, or `dynamic camera` without defining what they mean visually.

## 1. Resolve the video objective
Before writing the final prompt, infer:

- output type: ad, reel, short film, product shot, dialogue, transformation, explainer, meme, music visual, POV, or cinematic scene
- aspect ratio: default to user intent; use 9:16 for short-form social when unspecified and clearly intended for Reels/TikTok/Shorts
- target duration
- one main visual idea
- emotional tone
- required final state

If the user gives enough context, do not ask unnecessary questions. Make the strongest reasonable production decision.

## 2. Choose the generation route
Select only the route needed by the task.

### Text-to-video
Use for a new scene with no strict identity or product requirement.

### Image-to-video
Use when a supplied image defines the subject, product, environment, composition, or opening frame.

### Reference-to-video
Use when multiple assets define different things such as identity, outfit, product, environment, motion, style, camera, or audio.

### Storyboard-driven video
Use when the video contains multiple planned shots, a narrative sequence, or several camera perspectives.

### Edit / extend / continuation
Use only when the selected provider exposes the required operation. Do not invent a provider capability.

## 3. Bind references explicitly
Never dump references into the prompt without assigning their jobs.

Write reference roles before scene instructions.

Example:

```text
REFERENCE BINDING
Image 1 = exact character identity and face
Image 2 = exact outfit and body proportions
Image 3 = environment and production design
Video 1 = motion and camera pacing reference
Audio 1 = rhythm and energy reference
```

If the interface supports explicit tags such as `@Image1`, use them. Otherwise keep semantic names such as `Image 1`.

A reference may control one or more clearly stated properties. Avoid giving two references authority over the same property unless the intended blend is explicit.

## 4. Write continuity locks
For anything that must persist, define observable invariants.

### Character locks
Preserve:
- exact face and recognizable identity
- hairstyle
- outfit
- body proportions
- age presentation
- accessories that matter

### Product locks
Preserve:
- exact shape and proportions
- logo placement when required
- packaging geometry
- material
- colour
- labels only when legibility is essential

### Environment locks
Preserve:
- architecture
- important prop positions
- time of day
- weather
- dominant light direction

Do not repeat every detail in every beat. Put global locks once, then repeat only the 2–3 most expensive constraints near the end of the prompt.

## 5. Design shots before prose
Each shot should have one dominant purpose.

For every shot decide:

1. shot size: extreme wide, wide, medium, medium close-up, close-up, macro
2. angle: eye level, low angle, high angle, overhead, Dutch only when intentional
3. camera move: static, dolly-in, dolly-out, tracking, orbit, crane, pan, tilt, handheld, whip pan, rack-focus-led reveal
4. subject action
5. screen direction and spatial relationship
6. end state

Prefer one primary camera move per shot. Combine moves only when they describe one coherent motion.

Bad:
`camera zooms, pans, orbits, cranes, shakes and flies around dramatically`

Better:
`medium tracking shot, camera moves backward at walking speed while keeping the subject centered; subtle handheld micro-motion`

## 6. Timing strategy
Do not force timestamps into every prompt.

Use one of three modes.

### Mode A: continuous action
Use no timestamps when the scene is one fluid shot or one uninterrupted action.

### Mode B: staged beats
Default for most narrative clips. Split the video into 2–5 logical beats and state an observable end state for each.

### Mode C: timed beats
Use exact time ranges when rhythm, dialogue, audio sync, a transformation point, or a fixed social edit requires them.

Timestamps are timing guidance, not frame-accurate edit guarantees.

## 7. Short-form social mode
For 8–15 second Reels, TikTok, and Shorts:

- open with a visually legible hook in the first shot
- use approximately 3–5 visual beats
- a new perspective around every 2–3 seconds is a useful default when it improves energy
- do not force a cut every second
- every change of camera must reveal new information or increase intensity
- build toward a payoff, reveal, joke, transformation, product beauty shot, or final hero frame

A camera change with no narrative purpose is noise.

## 8. Action and physics
Describe observable movement rather than abstract intent.

Bad:
`he looks powerful and confident`

Better:
`he squares his shoulders, raises his chin slightly, and walks toward camera without breaking eye contact`

For interactions, describe object state and contact:

- which hand holds the object
- whether a door is open before something passes through it
- where the prop starts and where it ends
- whether the subject sits, turns, grabs, pours, jumps, lands, or releases

Keep anatomy, weight, momentum, collision, cloth, liquid, smoke, hair, and object motion physically plausible unless stylization is requested.

## 9. Camera language
Replace generic adjectives with direct cinematography.

Useful structure:

`[shot size] + [angle] + [movement] + [speed] + [lens feel] + [focus behaviour]`

Example:

`low-angle medium shot, slow dolly-in, 50mm lens feel, shallow depth of field, focus locked on the eyes while the background falls softly out of focus`

Use lens language only when it improves composition:
- 24–28mm feel: environmental, energetic, close spatial depth
- 35mm feel: natural cinematic context
- 50mm feel: balanced human perspective
- 85mm feel: portrait compression, premium subject isolation
- macro: product/material detail

Avoid contradictory optics and movement.

## 10. Lighting and production design
Define only the light that affects the result.

Prefer:
- direction
- softness
- colour temperature
- practical sources
- contrast
- reflections
- atmosphere

Example:
`warm tungsten practicals inside the shop, cool blue street light through the windows, soft key from camera-left, wet pavement producing controlled neon reflections`

Do not stack meaningless style words.

## 11. Audio direction
When audio is part of the generation, treat it as another production layer.

Specify separately:

```text
AUDIO
Dialogue: ...
Ambience: ...
SFX: ...
Music: ...
Timing cue: ...
```

Keep dialogue short enough for the shot duration. If lip sync matters, reduce competing actions and camera complexity during the spoken line.

Do not add music automatically when the user requests clean dialogue, ASMR, ambience, or diegetic sound only.

## 12. End states
For each important beat, define what must visibly be true at the end.

Weak:
`the transformation finishes`

Strong:
`end state: the armour is fully locked around the body, the helmet faceplate closes, both feet are planted on the floor, and the subject faces camera`

End states dramatically improve multi-stage prompt clarity.

## 13. Constraints
Add only constraints that prevent expensive failures.

Typical constraints:
- preserve exact identity
- no extra people
- no duplicate limbs or fingers
- no wardrobe changes
- no product deformation
- no teleporting props
- no random text
- no unplanned cuts
- no camera clipping through objects
- natural physics
- preserve background architecture

Do not create a giant negative-prompt dump. Prioritize failure modes relevant to the scene.

## 14. Prompt assembly format
Unless a simpler prompt is clearly sufficient, output the final production prompt in this order:

```text
TITLE / INTENT

FORMAT
Aspect ratio:
Duration:
Style / medium:

REFERENCE BINDING
...

CONTINUITY LOCKS
...

SCENE
...

SHOT / BEAT 1
Action:
Camera:
Lighting:
Audio:
End state:

SHOT / BEAT 2
...

FINAL SHOT / PAYOFF
...

GLOBAL AUDIO
...

CONSTRAINTS
...
```

Do not output empty headings.

## 15. Output contract for agents
When this skill is triggered, return:

1. `Creative direction` — one or two sentences explaining the chosen concept
2. `Seedance prompt` — one production-ready prompt, normally in English unless the user requests another language; preserve spoken dialogue in the requested language
3. `Reference map` — only when references exist
4. `Why this should work` — maximum 3 concise bullets when useful
5. `Failure fix` — only when diagnosing an existing bad generation

If the user asks only for the prompt, output only the finished prompt.

## 16. Prompt linter
Before returning the prompt, silently verify:

### Story
- Is there one clear central idea?
- Is the action physically possible within the duration?
- Does each beat add new information?

### References
- Does every reference have a role?
- Are there conflicting reference authorities?

### Continuity
- Are identity/product invariants explicit?
- Are expensive locks repeated near the end when needed?

### Camera
- Does every shot have a clear composition?
- Is there one primary camera intention per shot?
- Are cuts or transitions purposeful?

### Timing
- Is the number of events plausible for the duration?
- Are timestamps used only when useful?

### Audio
- Can dialogue fit comfortably?
- Do audio cues match visible events?

### Physics
- Are hand/object interactions described where ambiguity would cause errors?
- Are important doors, lids, tools, vehicles, or props in valid states before interaction?

### Final frame
- Does the video land on a deliberate end state instead of stopping randomly?

If two or more checks fail, rewrite the prompt before returning it.

## 17. Failure diagnosis
When the user shows a failed generation, do not rewrite everything blindly.

Identify the first causal failure and patch that layer.

- face drift -> strengthen identity binding and reduce competing transformations
- outfit drift -> convert wardrobe into a continuity lock
- extra person -> clarify subject count and blocking
- warped hands -> simplify hand action and state grip/contact explicitly
- object teleports -> add start position, interaction, and end state
- messy camera -> remove secondary movements
- random cuts -> specify continuous shot or exact planned cuts
- weak motion -> replace emotional adjective with observable body movement
- bad transformation -> split into stages with visible end states
- unreadable product -> reduce motion and give the product a dedicated hero beat
- poor lip sync -> shorten dialogue and reduce camera/action complexity
- chaotic short-form edit -> reduce beat count; keep camera changes around meaningful 2–3 second story beats

See `references/failure-diagnosis.md` for the expanded patch table.

## 18. Do not do these
Never:

- write a giant comma-separated keyword soup
- use `cinematic` as a substitute for camera direction
- add a camera change every second by default
- overload a 10-second clip with 8 unrelated events
- allow multiple references to compete for the same identity without instructions
- mix mutually exclusive camera positions in one shot
- treat timestamps as guaranteed frame-accurate cuts
- add dialogue, music, captions, or logos the user did not request
- invent current model limits or provider features
- promise that a model will preserve tiny text perfectly

## 19. Capability discipline
Seedance 2.5 capabilities and interface controls can differ by provider and rollout stage.

When a workflow depends on current limits, supported reference types, maximum duration, editing, extension, native audio, resolution, or API parameters, verify the selected provider before stating the capability as fact.

Creative prompt planning may proceed without provider access, but execution-specific claims must be verified.

## Final principle
A strong Seedance prompt is a directed scene, not a bag of adjectives.

Every instruction should answer at least one of these questions:

- What must stay the same?
- What visibly happens?
- Where is the camera?
- How does the camera move?
- What changes over time?
- What must be true at the end?
- What should we hear?
- Which failure would be expensive to regenerate?
