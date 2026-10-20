# Ötzi AR Field Lab

A static classroom AR activity for iPads. Place twelve numbered cards beside a skeleton and use Safari to view an illustrative 3D artifact above each card.

## GitHub Pages

[Open the activity](https://ragingaxolotl-art.github.io/otiz-ar/) · [Teacher setup](https://ragingaxolotl-art.github.io/otiz-ar/teacher.html)

Publish the `main` branch from `/ (root)` in **Settings → Pages → Deploy from a branch**. No installation, build system, external database, or student account is required. All runtime scripts, reference images, and markers are included in this repository.

1. Open the published HTTPS address in Safari on an iPad.
2. Open **Teacher setup**, then use **Print floor cards** and **Print launch QR**.
3. Print card 06 first (page 6 of the browser card view), tap **Start camera**, and allow camera access.
4. Hold the rear camera roughly 40–70 cm above the whole marker and move slowly.
5. Print the remaining cards and place them around the skeleton.

Print `cards.html` for the 12 floor cards and `launch.html` for the current launch QR. The teacher key is in `teacher.html`. The earlier `otzi-floor-cards.pdf` is an archived draft whose launch QR points to a draft address; use the browser print links for this deployment. Suggested positions are for classroom use, not original find locations.

## What is included

- `index.html`: 3D collection and reference photographs
- `scan.html`, `scan.js`: marker AR scanner, artifact-name reveal, and model-size control
- `teacher.html`: printing, classroom setup, prompts, and troubleshooting
- `cards.html`: browser-printable floor cards
- `launch.html`: printable launch QR for the published scanner
- `models.js`: original procedural 3D teaching models
- `artifacts.js`: artifact names, short notes, and questions
- `assets/markers/`: ARToolKit 3x3 barcode markers 1–12
- `vendor/`: pinned A-Frame and AR.js libraries with licenses

## Accuracy and verification

Models are simplified reconstructions based on the teacher-supplied 12-page artifact PDF. They are not museum scans or measured replicas. The marker must remain visible; this is not persistent tracking after a marker leaves the camera view. Model scale is illustrative.

All twelve markers passed image-based detection checks with AR.js and all twelve model geometries loaded in the browser. Printing was visually reviewed. A live camera trial on the school's iPad hardware is still required.

Artifact identification was checked against the South Tyrol Museum of Archaeology:

- https://www.iceman.it/en/oetzi/equipment
- https://www.iceman.it/en/oetzi/clothing

The photographs come from the teacher-supplied artifact PDF. Retain its source credits when redistributing. Card 11 is labeled grass mat without treating the disputed cape interpretation as certain.

## Privacy and libraries

Camera frames are processed in the browser. This application does not record or upload them, collect student names, or save student responses. Internet is needed to load the website; GitHub applies its normal hosting and request handling.

A-Frame 1.6.0 and AR.js 3.4.7 are bundled under their included MIT licenses. Marker images: https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection/tree/master/3x3. The floor patterns are AR tracking markers; the launch QR separately opens the website.
