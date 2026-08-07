# Seedance 2.5 Model Profile

Use this file to reason about the model before writing execution-specific instructions.

## Target model

This skill is designed around **Seedance 2.5** prompting and production patterns.

Official Dreamina material positions Seedance 2.5 as a multimodal video workflow supporting:

- text-to-video
- image-to-video
- reference-to-video
- image, video, audio, script and storyboard references
- motion / blocking references including green-screen and white-model footage
- longer continuous scenes than earlier short-clip workflows
- stronger continuity and local refinement workflows
- ads, ecommerce, social media and cinematic storytelling use cases

## Important rollout rule

Provider controls, model availability, duration, resolution, editing and reference limits may differ by platform, account, region and rollout stage.

Therefore:

- creative planning may target Seedance 2.5 directly
- never invent a provider control
- verify current provider limits before execution-specific claims
- if the interface exposes different labels, preserve the creative logic and adapt the syntax

## Best-purpose mental model

Seedance 2.5 should not be treated as a slot machine that turns adjective-heavy text into a movie.

Treat it as a **multimodal production model** that benefits from:

1. a clear story or commercial objective
2. strong reference authority
3. planned shot order
4. observable actions
5. camera direction
6. continuity locks
7. audio intent
8. visible end states
9. targeted iteration

## What to prioritize

When instructions compete, prioritize in this order:

1. identity / product / architecture accuracy
2. story or advertising clarity
3. physical action and blocking
4. continuity
5. camera logic
6. audio timing
7. lighting and polish
8. decorative style

This prevents a spectacular-looking clip from becoming unusable because the product, person or scene changed.

## Prompt principle

The model should receive a directed brief, not a keyword cloud.

Prefer:

```text
Medium close-up, subject turns toward camera after hearing the door open. Camera makes a slow 40 cm dolly-in while focus stays on the eyes. Warm practical light remains behind the subject; cool window fill stays camera-left.
```

Over:

```text
epic cinematic ultra realistic insane movie lighting dynamic camera masterpiece
```

## Multimodal principle

When a fact matters visually, a clean reference often has more control value than another paragraph.

Use references deliberately:

```text
@Image1 = identity
@Image2 = exact product
@Video1 = motion timing only
@Audio1 = rhythm only
@Storyboard1 = shot order only
```

Never upload references without defining why they exist.

## Continuity principle

The longer or more complex the scene, the more explicit continuity needs to become.

Lock only expensive invariants:

- exact face
- outfit
- product geometry
- architecture
- prop positions
- time of day
- light direction
- subject count

Do not repeat decorative details in every beat.

## Social / ads principle

For marketing video, the first decision is not the lens. It is the communication job.

Determine:

```text
WHO is this for?
WHAT should they notice?
WHAT should they feel or understand?
WHAT is the proof / demonstration / payoff?
WHAT final frame should editing or CTA use?
```

Then direct the visuals.
