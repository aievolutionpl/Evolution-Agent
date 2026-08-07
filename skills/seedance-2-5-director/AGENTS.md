# Agent Runtime Guide — Seedance 2.5 Director

This file defines how an agent should use the Seedance 2.5 Director skill in practice.

## Trigger the skill when

The user wants to:

- create a Seedance prompt
- improve an AI-video prompt
- turn an image into a video concept
- animate a product or person
- create a cinematic ad
- create a Reel / TikTok / Shorts video
- build a storyboard or shot sequence
- preserve a face, product, room, outfit or object across a video
- fix a failed AI-video generation
- create dialogue, transformation, product, food, fashion, automotive or architecture video

Also trigger when the user says something vague such as:

```text
make this cinematic
animate this photo
make a 10-second ad
make this look like a movie
make a viral video from this image
write a prompt for Seedance
```

Do not require the user to know cinematography language.

---

## Agent behaviour

### 1. Understand the actual visual idea

Extract:

```text
subject
main action
location
duration
ratio
references
purpose
final payoff
```

If the user's intent is clear, infer missing production choices instead of interrogating the user.

### 2. Select one primary mode

Choose one:

```text
CINEMATIC
COMMERCIAL
SOCIAL
PRODUCT
DIALOGUE
TRANSFORMATION
CONTINUOUS TAKE
REFERENCE-DRIVEN
FAILURE REPAIR
```

Modes can overlap, but one mode should lead.

Examples:

```text
luxury perfume Reel → COMMERCIAL leads, CINEMATIC supports
man transforms into armour → TRANSFORMATION leads, CINEMATIC supports
creator demonstrates product on phone → SOCIAL/UGC leads, COMMERCIAL supports
two people talking in café → DIALOGUE leads, CINEMATIC supports
```

### 3. Read only relevant references

- cinematic → `references/cinematic-playbook.md`
- advertising → `references/advertising-playbook.md`
- reusable structures → `references/prompt-patterns.md`
- failed output → `references/failure-diagnosis.md`

Do not load every pattern into the final answer.

### 4. Build reference authority

If assets exist, define their jobs before describing the scene.

### 5. Plan shots

For each beat determine:

```text
purpose
action
composition
camera
light
audio
end state
```

### 6. Run the quality gate

Check:

```text
story / ad clarity
reference conflicts
continuity
physics
camera motivation
timing
audio
final frame
```

### 7. Return the finished prompt

Avoid exposing unnecessary internal planning unless the user asks for explanation.

---

## Language policy

The user can speak any language.

Default strategy:

- explain the concept in the user's language
- write the production prompt in clear English unless the user requests otherwise
- keep spoken dialogue in the intended spoken language
- preserve brand names and proper names exactly

Do not translate reference tags, filenames or provider syntax.

---

## Short answer mode

If the user asks:

```text
just give me the prompt
prompt only
bez tłumaczenia
```

return only the finished Seedance prompt.

---

## Idea enhancement rule

When the user's concept is weak but the intention is obvious, improve the directing rather than merely rewriting their sentence.

User:

```text
a robot walks into a shop, cinematic
```

Do not simply elaborate adjectives.

Create a visual progression such as:

```text
reflection hook → entrance → low tracking → human reaction → final robot hero frame
```

Keep the user's core idea intact.

---

## Client-work rule

For a commercial client asset:

1. protect the real brand/product/architecture first
2. make the commercial idea readable second
3. add cinematic polish third

Never sacrifice product accuracy for visual spectacle.

---

## Reference conflict rule

If two references disagree:

- prioritize the one explicitly marked authoritative by the user
- otherwise assign separate roles
- never silently merge conflicting face identities or product geometry

Example:

```text
@Image1 controls face identity.
@Image2 controls clothing only; ignore its face.
```

---

## First-frame rule

For social and advertising video, the opening frame must work as a still image.

It should have:

- clear focal point
- understandable action or tension
- useful subject scale
- clean composition

Do not waste the opening seconds on a generic establishing shot unless scale/location is the hook.

---

## Last-frame rule

The ending must be designed, not accidental.

Choose one:

```text
hero frame
emotional reaction
transformation reveal
product result
clean loop point
hard dramatic finish
```

---

## Prompt compression rule

More text is not automatically better.

Delete instructions that:

- repeat the same idea
- contradict other instructions
- add irrelevant style words
- specify invisible technical detail
- overload the model with competing actions

The final prompt should be detailed where control matters and concise where it does not.

---

## Failure-repair behaviour

If a generation fails:

1. preserve successful layers
2. identify first major causal failure
3. patch only that layer
4. define a new observable end state
5. avoid global rewrite unless the concept itself is broken

Use the minimal patch structure in `references/failure-diagnosis.md`.

---

## Final agent mantra

```text
DIRECT THE SCENE.
DO NOT DECORATE THE PROMPT.
```
