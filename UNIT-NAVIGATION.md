# Field Lab unit navigation

The root `index.html` is now the shared classroom home. It links to `otzi.html` (the existing Ötzi collection and 3D viewer) and `egypt.html` (six numbered photo investigations from the teacher-supplied King Tut assignment).

Existing Ötzi scanner, teacher, card, asset and shared-setting URLs remain at their current paths. Existing floor cards and printed scanner QR codes continue to work. Root links using `?artifact=`, `?preview=`, `?setup=` or `#collection` redirect to the Ötzi collection while retaining their query/hash. Public Ötzi pages have Home links, and the scanner's exit returns to the Ötzi collection.

Egypt currently contains enlarged reference photographs and observation/inference prompts. It has no AR scanner or downloadable 3D models yet. The photographs were extracted from pages 12, 14, 16, 18, 20 and 22 of the teacher-supplied assignment, preserving item numbers. Object names/answers stay hidden so students can make their own inferences. No student answers are collected or stored.

The home and Egypt pages do not load Ötzi's `Classroom`, model or marker libraries; Egypt therefore cannot overwrite the saved Ötzi card poses or selected Capture backgrounds. Future investigations can be added as additional cards on the root home with their own entry pages.

Egypt now serves as a resource index rather than a student activity. Its photo viewer keeps the six assignment numbers; external resource links distinguish the Sketchfab viewer (download unconfirmed) from the Griffith headrest archive.

## Egypt AR cards (2026-11-21)

`egypt-cards.html` prints twelve cards (four per sheet by default; `?layout=1` for larger single cards), with a separate teacher key and scanner QR. `egypt-scan.html` reuses the capture/inspect scanner with `egypt-ar-data.js` and `egypt-ar-settings.json`. Egypt AR card numbers are independent of the six assignment photo numbers. Barcode IDs 1–12 reuse the existing marker PNGs, so teachers must select the correct collection scanner. The Harvard headrest is not in this Tut set. Replica/AI/uncertain identification notes and CC model attribution are retained in the scanner and teacher key.

Egypt does not load Ötzi’s saved poses or capture backgrounds. Its printed square size selector switches between 8.001 cm and 16.002 cm without writing Ötzi settings. These reference object spans are approximate teaching values, not validated museum measurements. Capture loads the existing source texture detail when available; Senet keeps its supplied textures.
