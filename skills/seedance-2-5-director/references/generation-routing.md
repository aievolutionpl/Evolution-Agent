# Generation Routing — T2I, T2V, I2V, R2V

The agent must choose the production route **before** writing the final video prompt.

## Routing question

Ask internally:

> What information is expensive to recreate, and what input type gives the model the clearest control over it?

## Route A — Text to Video (T2V)

Use when:

- no exact person, product, room or design must be preserved
- the scene is concept-first
- the user wants exploration
- the action and environment can be described cleanly in text

Best for:

- concept films
- atmospheric scenes
- generic cinematic B-roll
- abstract transitions
- fictional environments

Avoid T2V as the default when exact identity or product geometry matters.

### T2V prompt focus

```text
subject
observable action
environment
shot design
camera path
light
sound
end state
```

## Route B — Text to Image → Image to Video (T2I → I2V)

Use when the scene needs a strong opening composition before motion.

Choose this route when:

- the user has an idea but no good source image
- product / character art direction needs approval first
- exact framing matters
- social content needs a strong thumbnail / first frame
- a cinematic world or hero image should be solved before animation

### Keyframe rule

The generated still is not just pretty artwork. It must be **animatable**.

Design it with:

- clear subject separation
- physically plausible pose
- visible joints / hands when they need to move
- room in the frame for intended camera travel
- coherent light sources
- no impossible overlaps
- a background with depth layers
- no critical text baked into the frame unless essential

### Text-to-image keyframe template

```text
SUBJECT
[exact appearance / product / object]

COMPOSITION
[shot size, angle, placement, negative space]

ENVIRONMENT
[architecture, foreground, midground, background]

LIGHT
[direction, source, softness, colour temperature]

CAMERA FEEL
[lens perspective and depth]

MOTION AFFORDANCE
[leave physical room for the planned movement]

PRESERVE
[identity / product / material / architecture]

AVOID
[only relevant visual failure modes]
```

After the keyframe exists, write an I2V prompt that animates it rather than redescribing the entire image.

## Route C — Image to Video (I2V)

Use when the supplied image already contains something valuable that should remain the source of truth.

Typical valuable anchors:

- real person's identity
- product shape
- food build
- interior architecture
- vehicle body
- fashion styling
- composition

### I2V principle

**Preserve first, animate second.**

Do not ask the model to redesign the same asset while animating it unless transformation is the actual goal.

### Motion budget

Choose a motion budget:

#### LOW
For portraits, luxury products, interiors, architecture, food hero shots.

Use:
- breathing
- micro expression
- fabric movement
- small hand action
- controlled slider / dolly
- rack focus

#### MEDIUM
For walking, demonstrations, service ads, creator content, fashion.

Use:
- one clear body action
- short camera travel
- purposeful perspective change
- simple interaction

#### HIGH
For transformations, action, game-world transitions, VFX, vehicles.

Requires:
- staged beats
- strong end states
- motion references when available
- stricter continuity constraints

### I2V prompt focus

Do not waste tokens describing visible static facts already defined by the image.

Focus on:

```text
what changes
what must NOT change
how the subject moves
how the camera moves
what happens to light / environment
how the motion ends
what should be heard
```

## Route D — Reference to Video (R2V)

Use when several inputs each control a different production layer.

Best for:

- recurring people
- exact products
- choreography
- camera / blocking references
- ads with brand assets
- storyboard-to-video
- music-led content

### Reference authority map

Always create one before the final prompt.

```text
@Image1 = exact face identity only
@Image2 = outfit only; ignore its face
@Image3 = product geometry and label placement
@Video1 = body movement and timing only
@Audio1 = beat / rhythm only
@Storyboard1 = shot order and framing only
```

Do not let style references silently override identity or product accuracy.

## Route E — Storyboard / Animatic to Video

Use when:

- there are multiple shots
- shot order matters
- a narrative needs beginning → development → payoff
- client approval matters
- camera coverage should be planned before generation

A storyboard should define:

```text
shot purpose
subject placement
action
camera angle
transition logic
end state
```

Numbers, arrows and notes may be useful planning metadata, but avoid asking the final video to render them unless needed.

## Route F — Motion-reference / green-screen / blockout

Use when body movement, choreography, product handling or spatial blocking is harder to communicate with text than with a reference clip.

The agent should prefer a clean motion reference when:

- hands manipulate a product
- dance / sport / choreography matters
- several characters interact
- timing needs to follow a performance
- the camera and body need synchronized movement

Bind the reference narrowly:

```text
@Video1 controls motion timing and body blocking only.
Do not inherit wardrobe, face, background or colour from Video1.
```

## Route G — Edit / repair / extend

Use when most of the existing video already works.

Do not regenerate the entire piece because one hand, logo, face or transition failed.

Apply:

```text
KEEP
successful layers

CHANGE ONLY
failed layer

PATCH
observable correction

END STATE
visible target
```

Provider support must be verified before promising local editing or extension.

## Decision table

| Need | Best first route |
|---|---|
| New fictional scene | T2V |
| Strong art-directed first frame | T2I → I2V |
| Animate a supplied photo | I2V |
| Preserve person + product + movement | R2V |
| Multi-shot story | storyboard → R2V or staged generation |
| Complex body action | motion reference / R2V |
| Fix one failed detail | edit / patch if provider supports it |
| Exact start and end composition | start/end keyframe workflow if supported |

## Final routing rule

Do not choose the most technically impressive route.

Choose the **simplest route that protects the information the user cannot afford to lose**.
