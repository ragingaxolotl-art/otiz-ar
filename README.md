# Ötzi AR Field Lab

A static classroom AR activity for iPads. Place thirteen numbered cards beside a skeleton and use Safari to view an illustrative 3D artifact above each card.

## GitHub Pages

[Open the activity](https://ragingaxolotl-art.github.io/otiz-ar/) · [Teacher setup](https://ragingaxolotl-art.github.io/otiz-ar/teacher.html)

Publish the `main` branch from `/ (root)` in **Settings → Pages → Deploy from a branch**. No installation, build system, external database, or student account is required. All runtime scripts, reference images, and markers are included in this repository.

1. Open the published HTTPS address in Safari on an iPad.
2. Open **Teacher setup**, then use **Print floor cards** and **Print launch QR**.
3. Print card 06 first (page 6 of the browser card view), tap **Start camera**, and allow camera access.
4. Hold the rear camera roughly 40–70 cm above the whole marker and move slowly.
5. Print the remaining cards and place them around the skeleton.

Print `cards.html` for the 13 floor cards and `launch.html` for the current launch QR. The teacher key is in `teacher.html`. The earlier `otzi-floor-cards.pdf` is an archived draft whose launch QR points to a draft address; use the browser print links for this deployment. Suggested positions are for classroom use, not original find locations.

## What is included

- `index.html`: 3D collection and reference photographs
- `scan.html`, `scan.js`: marker AR scanner, artifact-name reveal, and model-size control
- `teacher-mode.html`, `teacher-mode.js`, `teacher-mode.css`: starting-pose editor and printable classroom QR
- `classroom.js`: validated, versioned settings carried in classroom links
- `teacher.html`: printing, classroom setup, prompts, and troubleshooting
- `cards.html`: browser-printable floor cards
- `launch.html`: printable launch QR for the published scanner
- `models.js`: procedural teaching models and a cached GLB loader
- `assets/bow.glb`: optimized teacher-supplied bow model for card 13
- `assets/arrow.glb`: optimized teacher-supplied arrow model for existing card 4
- `assets/dagger.glb`: optimized teacher-supplied dagger model for existing card 7
- `assets/cap.glb`: optimized teacher-supplied cap model for existing card 3
- `assets/shoes.glb`: optimized teacher-supplied footwear model for existing card 10
- `assets/leggings.glb`: optimized teacher-supplied leggings model for existing card 2
- `assets/tassel.glb`: optimized teacher-supplied stone disc and tassel model for existing card 9
- `assets/frame.glb`: optimized teacher-supplied backpack frame model for existing card 12
- `assets/coat.glb`: optimized teacher-supplied coat model for existing card 5
- `assets/container.glb`: optimized teacher-supplied bark container model for existing card 1
- `assets/retoucheur.glb`: optimized teacher-supplied pressure flaker model for existing card 8
- `assets/axe.glb`: optimized teacher-supplied axe model for existing card 6
- `artifacts.js`: artifact names, short notes, and questions
- `assets/markers/`: ARToolKit 3x3 barcode markers 1–13
- `vendor/`: pinned A-Frame and AR.js libraries with licenses

## Accuracy and verification

Models are simplified reconstructions based on the teacher-supplied 12-page artifact PDF. They are not museum scans or measured replicas. The marker must remain visible; this is not persistent tracking after a marker leaves the camera view. Model scale is illustrative.

All twelve markers passed image-based detection checks with AR.js and all twelve model geometries loaded in the browser. Printing was visually reviewed. A live camera trial on the school's iPad hardware is still required.

Artifact identification was checked against the South Tyrol Museum of Archaeology:

- https://www.iceman.it/en/oetzi/equipment
- https://www.iceman.it/en/oetzi/clothing

Card 13 uses a teacher-supplied, generated GLB bow model. The browser copy was reduced from 26,554,668 to 2,576,212 bytes and from 773,798 to 61,902 triangles, with a 2048px embedded JPEG texture. The source file is unchanged. Its image is a rendered preview. Print only the new card at `cards.html?card=13`; the first twelve card numbers remain unchanged.

Card 4 now displays the teacher-supplied GLB arrow instead of the procedural pair of arrows. Its browser copy is 2,787,688 bytes (from 42,309,436) with 82,122 triangles (from 1,368,701) and an embedded 2048px JPEG texture. The original GLB is untouched. The long axis is oriented upright as its base pose; teacher settings are applied on top of this. Card numbers, the printed marker, and the original card 4 reference photograph are unchanged. It supports teacher starting poses, touch rotation, 4× enlargement, and Reset through the shared loader.

Card 7 now uses the teacher-supplied GLB dagger, optimized from 42,339,160 bytes / 1,431,430 triangles to 2,446,292 bytes / 85,884 triangles with an embedded 2048px JPEG texture. The base pose has the blade upright; teacher settings apply on top. The original source, card 7 marker, and reference photograph are unchanged. It uses the shared GLB loader and existing teacher and touch controls.

Card 3 now uses the teacher-supplied GLB cap, optimized from 45,390,476 bytes / 1,465,374 triangles to 2,929,228 bytes / 87,920 triangles with an embedded 2048px JPEG texture. It retains the source’s upright orientation and chin straps. The source file, card 3 marker, and reference photograph are unchanged. It uses the shared GLB loader with teacher poses, touch controls, 4× enlargement, and Reset.

Card 10 now uses the supplied GLB footwear model and is labeled Shoes. Its browser copy was reduced from 47,058,648 bytes / 1,451,201 triangles to 3,471,484 bytes / 87,072 triangles, with an embedded 2048px JPEG texture. It keeps the source’s upright orientation. The original source and marker are unchanged. The original photograph remains explicitly labeled inner shoe netting, with a note distinguishing it from the fuller 3D reconstruction. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

Card 2 now uses the supplied GLB leggings. Its browser copy was reduced from 47,890,788 bytes / 1,495,370 triangles to 3,357,752 bytes / 89,722 triangles with an embedded 2048px JPEG texture. The upright base pose turns a quarter turn around the vertical axis to show the two separate leggings. The source file, card 2 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

Card 9 now uses the supplied GLB stone disc and tassel. Its browser copy was reduced from 45,691,200 bytes / 1,472,981 triangles to 3,026,044 bytes / 88,377 triangles with an embedded 2048px JPEG texture. Its base pose turns the source upright so the disc sits above the hanging strands. The original file, card 9 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

Card 12 now uses the supplied GLB backpack frame. Its browser copy was reduced from 45,862,376 bytes / 1,479,851 triangles to 2,940,032 bytes / 88,790 triangles with an embedded 2048px JPEG texture. Its upright base pose turns a quarter turn around the vertical axis to show the frame face-on. The original file, card 12 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

Card 5 now uses the supplied GLB coat fragments. Its browser copy was reduced from 47,575,748 bytes / 1,472,625 triangles to 3,405,348 bytes / 88,356 triangles with an embedded 2048px JPEG texture. Its base pose turns the source upright so the surviving fragments face the viewer. The original file, card 5 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

Card 1 now uses the supplied GLB bark container. Its browser copy was reduced from 44,581,428 bytes / 1,434,990 triangles to 3,108,260 bytes / 86,098 triangles with an embedded 2048px JPEG texture. It keeps the source’s upright orientation. The original file, card 1 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

Card 8 now uses the supplied GLB pressure flaker (retoucheur). Its browser copy was reduced from 46,910,724 bytes / 1,481,418 triangles to 3,195,856 bytes / 88,884 triangles with an embedded 2048px JPEG texture. Its base pose turns the source upright with its working tip at the top. The original file, card 8 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

Card 6 now uses the supplied GLB axe. Its browser copy was reduced from 34,184,628 bytes / 1,089,138 triangles to 2,291,884 bytes / 65,344 triangles with an embedded 2048px JPEG texture. Its upright base pose turns a quarter turn around the vertical axis to show the axe head. The source file, card 6 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

The original twelve photographs come from the teacher-supplied artifact PDF. Retain its source credits when redistributing. Card 11 is labeled grass mat without treating the disputed cape interpretation as certain.

## Privacy and libraries

Camera frames are processed in the browser. This application does not record or upload them, collect student names, or save student responses. Internet is needed to load the website; GitHub applies its normal hosting and request handling.

A-Frame 1.6.0 and AR.js 3.4.7 are bundled under their included MIT licenses. Marker images: https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection/tree/master/3x3. The floor patterns are AR tracking markers; the launch QR separately opens the website.

## Teacher starting views and touch controls

Open `teacher-mode.html` to choose each artifact’s turn, tilt, roll, and starting size (25–400%). A draft saves to local browser storage. Copy its classroom link or print its QR sheet for student iPads; ordinary scanner links use original defaults. Changes require a newly shared link. Settings are carried in a validated `setup` query parameter, with no account or database. Existing floor cards do not change.

Student size is relative to the teacher’s chosen starting size. Both viewers support pinch enlargement up to 4× and a direct 4× button. Reset restores the starting pose. The scanner stores interaction state per artifact and applies scaling to the model pivot, independently of the tracked A-Frame entity. Another marker entering view does not steal the active controls. The bottom details panel can hide and return.

QR generation uses the bundled MIT-licensed qrcode-generator 1.4.4. Settings links do not upload camera images. Browser tests use a stationary marker fixture; physical Safari/iPad camera and multi-touch behavior still needs a classroom trial.
