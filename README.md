# Ötzi AR Field Lab

A static classroom AR activity for iPads. Place thirteen numbered cards beside a skeleton and use Safari to view an illustrative 3D artifact above each card.

## GitHub Pages

[Open the activity](https://ragingaxolotl-art.github.io/otiz-ar/) · [Teacher setup](https://ragingaxolotl-art.github.io/otiz-ar/teacher.html)

Publish the `main` branch from `/ (root)` in **Settings → Pages → Deploy from a branch**. GitHub Pages runs its built-in Jekyll build to publish saved card settings. No local installation, external database, or student account is required. All runtime scripts, reference images, and markers are included in this repository.

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
- `assets/mat.glb`: optimized teacher-supplied grass mat model for existing card 11
- `assets/axe.glb`: optimized teacher-supplied axe model for existing card 6
- `artifacts.js`: artifact names, short notes, and questions
- `assets/markers/`: ARToolKit 3x3 barcode markers 1–13
- `vendor/`: pinned A-Frame and AR.js libraries with licenses

## Accuracy and verification

Models are simplified reconstructions based on the teacher-supplied 12-page artifact PDF. They are not museum scans or measured replicas. The default scanner reads a card once and holds its model on screen over the camera view. This is a screen-held view, not persistent floor anchoring. On the card is a separate marker-tracked view that requires the square to remain visible. Life-size scale is calibrated to teacher reference dimensions and the printed marker width; some reference dimensions are estimates.

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

Card 11 now uses the supplied GLB grass mat. Its browser copy was reduced from 46,030,320 bytes / 1,404,774 triangles to 3,460,528 bytes / 84,282 triangles with an embedded 2048px JPEG texture. Its upright base pose turns a quarter turn around the vertical axis to show the woven surface. The source file, card 11 marker, and reference photograph are unchanged. Teacher poses, touch controls, 4× enlargement, and Reset use the shared loader.

The original twelve photographs come from the teacher-supplied artifact PDF. Retain its source credits when redistributing. Card 11 is labeled grass mat without treating the disputed cape interpretation as certain.

## Privacy and libraries

Camera frames are processed in the browser. This application does not record or upload them, collect student names, or save student responses. Internet is needed to load the website; GitHub applies its normal hosting and request handling.

A-Frame 1.6.0 and AR.js 3.4.7 are bundled under their included MIT licenses. Marker images: https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection/tree/master/3x3. The floor patterns are AR tracking markers; the launch QR separately opens the website.

## Saved starting views and life-size AR

Teacher Mode edits a draft locally. After the teacher connects GitHub for the tab session, **Save to cards** commits directly without opening GitHub. GitHub Pages publishes the latest saved settings to `classroom-defaults.json`. Student devices fetch that shared file without a login. The ordinary scanner URL and existing cards load the latest save after reloading, including older links that previously contained `setup` snapshots. The stable launch QR does not change after a save. Unsaved tests use a clearly labeled `preview` link.

Jekyll’s built-in `teacher_saves` collection reads immutable save records in `_teacher_saves/`; the JSON page outputs the record with the largest sequence number. The collection itself has no public output pages. No API credential is embedded in the app. Teacher writes require the repository’s normal GitHub permissions. Git history retains earlier saves. The app reports Saved only after the requested revision is actually published, and keeps pending publication state across reloads.

In On the card view at 100%, each object’s longest reference dimension is the configured number of centimeters. AR markers use the measured physical black-square width in meters; model geometry uses the same meter-based units. The default 8.001 cm calibration matches the new four-card print layout at 100%. For older printer-generated four-up cards, measure a black square and enter its actual width. The one-card print layout has 16.002 cm markers. All cards must use the same print scale.

Reference sizes are in `life-size.js`. Museum references cover container height, leggings, axe haft, dagger, pressure flaker, and bow. The other model dimensions are explicitly editable estimates, including the combined two-shoe model’s span. Generated models are illustrative and have not been measured from the museum originals. See the linked South Tyrol Museum equipment and clothing pages in Teacher Mode. Uniform scaling preserves the supplied model’s proportions.

In On the card view, teacher and student sizes use the same absolute percentage of reference life size, from 10–800%. Life size returns to 100%; Bigger doubles the current size; Reset restores the saved teacher orientation and percentage. Per-card selection remains available when several markers are visible. Pose grounding and normalization use precise transformed geometry bounds. The original teacher orientations were retained for cards 4, 6, and 11; old arbitrary size percentages were replaced with 100% of the new life-size references.

`cards.html` defaults to four cards per page with 8 cm markers; `?layout=1` prints the larger single-card layout. In the printer dialog use Actual size / 100% and one page per sheet for the four-card layout.

## Scan once and explore

`explore.js` supplies the default scanner view. The first recognized card loads one model, keeps its teacher orientation, and frames its actual posed geometry to approximately 72% of the available screen dimension at 100% view zoom. Paper size and physical reference dimensions do not determine this view’s framing. The model remains after marker loss, including when a GLB is still loading. Nearby detections do not replace it. Drag rotates; pinch, wheel, and Bigger change optical zoom with no 800% ceiling. Fit returns to a complete view. Reset restores the teacher’s orientation and initial zoom. Scan next card returns to recognition; On the card restores the calibrated meter-based marker view. The detail panel tucks away automatically and can return.

## Direct teacher saves

`github-save.js` commits an immutable save record to the same repository through GitHub’s Contents API. The teacher connects using a fine-grained token limited to `otiz-ar` with Contents write permission. The token is stored only in sessionStorage for that tab session and is sent only in the Authorization header to api.github.com; it never enters drafts, published settings, QR links, or commit content. Disconnect clears it. No token is bundled with the site. The user creates and enters their own connection key privately.

Save to cards no longer opens GitHub. Without a connection it opens the connection panel; with a connection it commits directly, then polls the published settings before reporting success. Old unconfirmed saves have an explicit Not saved state and can be dismissed without deleting a draft. Interrupted writes can be retried safely against the exact immutable record. Expired keys and write-permission failures remain visible instead of a generic indefinite waiting status. The confirmed-GitHub link remains only as recovery for an older pending manual save.
