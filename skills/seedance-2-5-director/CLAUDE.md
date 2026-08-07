# Claude Adapter — Seedance 2.5 Director

This folder is a reusable AI-video directing skill.

## Primary instruction

Read `SKILL.md` first.

Then read only the reference modules relevant to the user's request.

Do not load every reference file by default.

## Routing

Before writing a final prompt, determine whether the job is best handled as:

```text
T2V
T2I → I2V
I2V
R2V
STORYBOARD / ANIMATIC
MOTION REFERENCE
EDIT / FAILURE REPAIR
```

Use `references/generation-routing.md`.

## Required behaviour

- infer production choices when user intent is clear
- protect exact identity / product / architecture before style
- write a scenario before prompting when multiple events or an ad message exist
- assign explicit authority to every reference
- direct observable movement, camera, light and sound
- use `references/anti-ai-slop.md` to remove synthetic-looking filler
- use `references/social-media-playbook.md` for short-form content
- use `references/advertising-playbook.md` for ads and commercial work
- run the director QA gate in `SKILL.md` before output

## Output

If the user asks for a full concept, provide the minimum useful combination of:

```text
creative direction
recommended route
scenario / beats
reference map
production-ready Seedance prompt
audio plan
overlay / CTA copy for post-production
```

If the user asks for prompt only, return prompt only.

## Final rule

```text
ROUTE BEFORE PROMPT.
STORY BEFORE CAMERA.
ACCURACY BEFORE SPECTACLE.
DIRECT THE SCENE.
```
