# Teacher-supplied Meshy study models

Added 23 November 2026: fan, throwing sticks, alabaster perfume vessel, headrest, sandals, two separate model boats, crook-and-flail pair, an additional scarab pectoral, two separate shields, and chariot. AR cards were reordered on 23 November: the six teacher objects are now cards 1–6; additional objects follow as 7–24. Display identifications were supplied by the teacher; these models are AI reconstructions, not scans of excavated objects. Their exact ancient catalog matches are unverified. The perfume model currently has a gold-toned texture instead of translucent calcite. The Harvard headrest and earlier licensed pectoral remain separate references.

The original GLBs are preserved locally under `*-ai-original.glb`; each JSON source record includes its original filename and SHA-256. Only mobile derivatives are published. No Creative Commons license has been asserted for these user-supplied generated models.

Mobile meshes were simplified with meshoptimizer 1.3.0 (MIT) using the attribute-aware algorithm, original UVs and a 0.5% geometry-error limit. Actual normalized errors were below 0.2%. Copies retain about 25,000–40,000 triangles each. Three embedded material textures are resized to 1024 px. Source color detail up to 2048 or 4096 px loads on approach/capture, according to each manifest entry; full original textures remain in the local originals.

Tomb display stations are modern teaching copies rather than claims about excavation findspots. The two boats remain separate display copies; one is in the Treasury and the alternate is on an antechamber teaching stand. Hollow and paired artifacts are targeted at an actual surface when using Visit exhibit.

Validation: `tests/egypt-ar.test.cjs` checks every catalog asset, marker, source record and isolated Egypt settings. Run `scripts/make-egypt-ar-preview.py` before serving `tests/egypt-ar.html` to test real ARToolKit barcode detection with image input and no camera. `tests/tomb-ai-uploads.html` checks that the twelve copies are reachable, pick up, load their source detail and return.

The chariot asset was geometry-rendered offline and validated after browser automation became unavailable. Before the card reorder, 22 models and ten prior copies passed browser checks; the appended chariot requires a later browser/phone check. Its generated display supports are retained and disclosed.

A second openwork shield (card 24) is retained separately from the first shield (now card 23). Its shape was rendered offline; its browser pickup and AR detection checks remain pending with those for the appended chariot.

Room review: see `egypt-tomb-placements.js` and the 23 November table in `tomb-reconstruction-audit.html`. Annexe: sticks, headrest, generic Senet and shields. Burial chamber: fan, perfume comparison, gold-footwear study, crook/flail. Treasury: boats and alternate jewellery. Chariot: antechamber. Coordinates and stands are teaching offsets, not exact findspots. Earlier browser results do not validate the revised positions.
