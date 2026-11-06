# Capture photo backgrounds

Open Teacher Mode and click photos in **Choose the scenery**. All 30 gallery entries are available; numbers match the research gallery. Select all, clear, and random preview controls are included. Use **Preview edits** to try the unsaved selection, then **Save to cards** to publish. Students reload the usual scanner after saving.

Each successful Capture draws uniformly from the selected photo IDs, with replacement: repeats are possible. The background stays fixed while the artifact rotates and zooms. Release removes both the image and its credit and restores live card tracking. An empty selection retains the existing camera background. A failed external photo uses a plain background while keeping the artifact available.

Photo IDs are saved with the version-2 classroom configuration as `backgrounds`. Older settings load with an empty selection. Drafts, scanner preview links, direct GitHub saves, and publication checks include the selection. The current teacher selection applies to every artifact. Photos are loaded from their credited external sources, so availability depends on those sites. Credits and source links appear in the gallery and captured view.

## Validation

`node --test tests/backgrounds.test.cjs` checks backward compatibility, all 30 IDs, invalid inputs, save/preview serialization and random choices. Browser integration was also checked locally for teacher saving, draft reload, Capture/Release, marker loss, zoom/rotation, and failed-image fallback. Camera-free fixtures simulate marker events; physical iPad camera testing remains a classroom check.
