# Sound, Music & Dialogue Direction

Audio is part of directing, not decoration added at the end.

Use this file when the workflow supports native audio, audio references, dialogue, music-led timing or when the final prompt should communicate post-production intent.

## Audio hierarchy

Choose the hierarchy before describing sound.

### Dialogue-led

```text
1. dialogue
2. essential foley
3. ambience
4. music under dialogue
```

### Product-led

```text
1. tactile product sounds
2. controlled ambience
3. restrained music
```

### Cinematic-led

```text
1. story-critical sound events
2. ambience / space
3. music arc
4. texture
```

### Music-led social

```text
1. beat / rhythm reference
2. visible action sync
3. accents / impacts
4. ambience where useful
```

## Prompt audio block

Use only relevant fields:

```text
AUDIO
Dialogue: [speaker + exact short line]
Ambience: [room / street / wind / crowd / nature]
Foley: [footsteps / fabric / object handling]
SFX: [portal / impact / mechanical cue]
Music: [genre, tempo feel, energy curve, instrumentation]
Mix: [what stays foreground / background]
Sync cues: [visible event matched to sound]
```

## Dialogue rules

- Keep lines short enough for the shot.
- One speaker per beat is safer when lip sync matters.
- Reduce complex camera movement during important dialogue.
- Map speaker identity explicitly.
- Describe delivery, not just emotion labels.

Prefer:

```text
Character A says quietly, slightly breathless: "We need to go."
```

Over:

```text
Character A says dramatically and cinematically...
```

## Natural dialogue performance

Useful direction:

- short intake of breath before speaking
- eye line toward listener
- small pause before final word
- jaw / mouth motion appropriate to speech
- subtle body movement rather than frozen torso

Do not overload speech beats with unrelated action.

## Music direction

Do not default to "epic cinematic music".

Specify useful musical properties:

```text
tempo feel
energy curve
instrument family
rhythmic density
when the music enters
where it rises
where it drops or resolves
```

Examples:

### Luxury
```text
restrained electronic pulse, sparse low synth, soft glassy texture, no aggressive drums, energy stays controlled until a subtle final accent
```

### Technology
```text
precise modular synth rhythm, light percussive ticks, low sub pulse, gradual intensity increase without trailer-style brass
```

### Food
```text
minimal warm groove under foreground grill and cutting sounds; music remains secondary to tactile food audio
```

### Social comedy
```text
light rhythmic bed with one clean beat accent timed to the visual payoff; avoid oversized trailer impacts
```

## Foley makes AI video feel physical

Use sound to reinforce contact and weight:

- shoe contact with floor
- jacket / fabric movement
- bottle touching marble
- tool contacting wall
- door latch before opening
- tyre noise appropriate to speed
- knife through crust / food
- chair movement
- keyboard / button press

The sound should correspond to a visible physical event.

## Ambience establishes space

Examples:

- quiet room air + distant traffic
- shop refrigeration hum + street outside
- soft hotel lobby reverb + distant footsteps
- open coast wind + distant surf
- workshop ventilation + subtle tool noise

Avoid a completely dead sound bed unless silence is intentional.

## Sound transition design

Use sound bridges to make scene transitions feel edited rather than generated.

Examples:

- next-scene ambience begins slightly before the cut
- tool scrape becomes a transition texture
- car pass-by masks a cut
- door close motivates a sound hit
- music beat lands on a planned perspective change

## Social timing

If music determines the cut structure, switch to timed-beat prompting.

Example:

```text
0–2s: hook before first strong beat
2s: beat accent matches product reveal
5s: rhythmic drop supports demonstration
8s: final accent lands on hero frame
```

Treat timestamps as guidance, not guaranteed frame-accurate edit points.

## Avoid audio slop

Do not add:

- random background music when clean dialogue is requested
- cinematic booms on every cut
- constant whooshes
- oversized bass impacts for small movements
- crowd noise in an empty space
- footsteps that do not match movement
- fake product sounds that imply features the product does not have

## Audio final rule

**Sound should explain space, contact, rhythm or emotion. If it explains nothing, it probably does not belong.**
