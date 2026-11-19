# Explorer player body

“Girl explorer” by EvgeshQa, [original model](https://skfb.ly/o8NMr), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

`girl-explorer-body.glb` is the first-person derivative used in the tomb. It retains the coherent body, shirt and pouch, corrects the shared head bind scale, removes the unseen neck tip, and excludes the head/hair and detached source accessories. Brown vertex colors stand in for shorts and boots. The 71-joint rig retains the native idle, walk, run and jump clips; there is no native crouch clip.

The original download is preserved locally as `girl-explorer-original.glb`; its hash is in the source record. With that file available, `scripts/prepare-explorer.py` rebuilds the derivative. The original has not been overwritten.

The avatar is adapted to the existing 1.75 m player / 1.60 m eye reference. These are application scale settings, not a real-world measurement of the stylized model. Physics and head tracking remain independent of body animation. The first-person camera hides head surfaces, renders front faces and keeps the feet on the physical player reference.
