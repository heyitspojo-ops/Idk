# You Have Fucking Head Lice

- **Reel folder:** `reels/you-have-fucking-head/`
- **Length:** 45 s · 1080×1920 · 30 fps
- **Look:** soft 3D low-poly toy diorama
- **Voice:** `audio/you-have-fucking-head-vo.wav` generated: Chatterbox, unhinged delivery (exaggeration 1.2–1.7), line 7 whispered; louse = same voice pitched up 6 semitones; verified takes cached in `audio/takes/you-have-fucking-head/`, script `reels/you-have-fucking-head/vo-script.json`, timing `vo-timing.json`, leveled to -16 LUFS in `audio/you-have-fucking-head-vo-leveled.wav`
- **Reuses from `bucket-shared/`:** nothing yet (library is empty). New builders go there: `world-bathroom` (diorama), `world-scalp` (hair forest), `rig-toy-person`, `rig-louse`, `synth-toy`.

## Hook (0–3 s)

Tight on the scalp: a forest of chunky low-poly hair strands. A louse pops up between two strands, looks straight into the lens, waves. Hard cut to a giant fingernail slamming down through the hair like a meteor — the louse dodges, pockets a dandruff flake, grins. Text slams in. The viewer stays because the bug is clearly a *person*.

## Time table

| # | Time | Shot | Action | VO (recorded) | On-screen text |
|---|------|------|--------|----|----------------|
| 1 | 0.0–3.0 | Scalp forest, close on one louse | Louse pops up, waves at lens; fingernail slams down, louse dodges | "Oh, fuck. You have fucking head lice!" (0.0–2.2) | **YOU HAVE FUCKING HEAD LICE** |
| 2 | 3.0–8.0 | Bathroom diorama, 3/4 wide | Toy you scratches with both hands, faster and faster; hair wobbles | "So you scratch. And scratch. And scratch, god damn it!" (3.1–6.2) | — |
| 3 | 8.0–13.0 | Scalp forest, low angle | Fingernails sweep through like a combine harvester; lice ride them like surfboards, cheering | "But these little shits? They think it's a fucking theme park!" (7.9–11.1) | "WHEEE" (speech bubble) |
| 4 | 13.0–19.0 | Bathroom → scalp | You lather shampoo; inside, lice float on dandruff rafts in the foam, tiny sunglasses, pool party | "Shampoo? Ha ha! That's their god damn pool party!" (13.1–16.4) | — |
| 5 | 19.0–25.0 | Scalp forest, wide | Comb teeth drag through; lice swing from them like monkey bars, then build a tiny town of flake-houses with a flag | "The comb? Those motherfuckers built a town. With a flag!" (19.1–22.4) | Flag: **LICE NATION** |
| 6 | 25.0–30.0 | Scalp town square | Lead louse on a soapbox with a megaphone; crowd of lice cheers | "We live here now, bitch! Fuck you!" (24.9–26.9) — louse, pitched up | — |
| 7 | 30.0–34.3 | Bathroom diorama, slow push-in | You sit on the tub edge, defeated; then a light bulb pops above your head | "You're fucked. Totally fucked. Unless." (30.0–34.4) — whispered, then normal "Unless." | — |
| 8 | 34.3–39.0 | Bathroom diorama | You set a mannequin head in a fluffy wig on the counter with a tiny sign | "Luxury real estate, baby! Free wig. Zero fucking scratching." (34.4–38.0) | Sign: **FREE WIG · POOL · NO SCRATCHING** |
| 9 | 39.0–42.5 | Side angle, comb as a bridge | Lice march single-file over a comb bridge with tiny suitcases into the wig; last one tips its hat | "And the little bastards just... moved the fuck out." (38.9–41.3) | — |
| 10 | 42.5–45.0 | Close on your clean head | Hair sparkles; you exhale; end card | "Lice free! Rent free! Fuck, yes!" (42.3–44.8) | End card (below) |

## End card

42.5–45.0 s. Your clean toy head, a sparkle pops on the hair, camera eases back. Text rises letter by letter: **LICE-FREE. RENT-FREE.** In the last 10 frames a single louse peeks out of the wig in the background and waves — the same wave as frame 1, so the loop reads as a callback.

## Look notes

- Flat-shaded low-poly primitives, rounded silhouettes (bevelled boxes, low-segment spheres), no textures, no outlines.
- Pastel palette: mint tiles, butter-yellow tub, coral towel; hair warm chocolate brown; lice a soft greige with big white eyes.
- Warm key light from upper left, soft shadows, light ambient occlusion feel; slight tilt-shift blur top and bottom so it reads as a toy.
- Perspective camera with a long lens (≈25–30° FOV) for the miniature look; arrivals pop in with a bounce (~25 % overshoot).
- Type: rounded heavy sans, warm white with a soft dark shadow; titles pop in letter by letter.

## Safe zones

Keep text and key action inside x 60–940, y 250–1500 (platform UI covers the top, bottom and right edge).
