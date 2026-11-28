# Explorer

“Girl explorer” by EvgeshQa, [original model](https://skfb.ly/o8NMr), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The tomb loads `girl-explorer-restored.glb`: all 17 original meshes, 193,165 triangles, original materials, clothing, accessories and five native animation clips. The earlier local export incorrectly shared one skin across different mesh bindings. The restored export keeps 15 individual skins. Its rigid eyes are parented to the original animated eye bones rather than static placement nodes.

The field notebook shows a complete idle-pose display copy. Walking keeps the source rig and limb animation. Only head, facial, hair and headwear surfaces are hidden in first person. The camera stays under the existing controls; the body aligns its authored eye centers to it. Scale follows the 1.60 m eye reference; the hat extends above the 1.75 m collider reference. There is no source crouch clip: crouching lowers the camera/body without compressing the limbs.

`girl-explorer-original.glb` is the unchanged earlier broken local export, retained for diagnosis. `girl-explorer-body.glb` and `prepare-explorer.py` are legacy cut-down derivatives and are no longer loaded.

## Rebuild

The complete per-mesh-skin export was rebuilt from the public CC BY viewer scene using the MIT-licensed [sfrip exporter](https://github.com/Corpocore/sfrip) with `--no-merge`. Run `python3 scripts/restore-explorer.py /path/to/Girl_explorer.glb` on that complete export to restore both rigid eye attachments and write the runtime GLB. The script validates that all 17 meshes and 15 skins remain. Asset hashes and counts are in `girl-explorer.source.json`.

Validation: `node tests/tomb-player.test.cjs`; open `tests/tomb-player.html` for full-book and walking previews plus movement/camera regression checks.

The interactive preview includes camera-height (0.50–1.90 m) and camera-clearance (0–0.60 m radius) sliders. The height adjustment moves the camera independently of the avatar. First-person materials hide fragments within the clearance sphere and render front faces only; the complete notebook materials are unchanged.

Preview slider values are saved in localStorage under `explorer-preview-settings-v1`, across reloads and query-string variants on the same origin. Initial saved profile: camera height 1.27 m, Z 0 m, forearms 1.72×, clearance radius 0.04 m. Reset position preserves slider settings. While running, an index-only body geometry hides the torso and upper accessories while retaining limb weights; original geometry returns for other motions. The full book copy is unaffected.

## User-provided adventurer

`adventurer-mixamo.glb` is a byte-for-byte copy of the supplied Meshy/Mixamo GLB: one mesh, 28 joints and all 18 animations retained. Open `tests/adventurer-player.html` for the same adjustment controls and movement preview. Its saved settings use `adventurer-preview-settings-v1`, independent of the explorer. Camera placement estimates eye level from the head markers; use the sliders to tune it. The tomb still uses the existing explorer until the new character is selected for integration.

The adventurer first-person defaults selected by the user are camera height 1.36 m, camera Z −0.32 m, forearm length 1.41×, clearance radius 0 m. Later saved slider adjustments take precedence. Its animation selector exposes all 18 source clips in both walking and a live complete Book view. Drag the Book view to rotate the animated character.
