# Field Lab unit navigation

The root `index.html` is now the shared classroom home. It links to `otzi.html` (the existing Ötzi collection and 3D viewer) and `egypt.html` (six numbered photo investigations from the teacher-supplied King Tut assignment).

Existing Ötzi scanner, teacher, card, asset and shared-setting URLs remain at their current paths. Existing floor cards and printed scanner QR codes continue to work. Root links using `?artifact=`, `?preview=`, `?setup=` or `#collection` redirect to the Ötzi collection while retaining their query/hash. Public Ötzi pages have Home links, and the scanner's exit returns to the Ötzi collection.

Egypt currently contains enlarged reference photographs and observation/inference prompts. It has no AR scanner or downloadable 3D models yet. The photographs were extracted from pages 12, 14, 16, 18, 20 and 22 of the teacher-supplied assignment, preserving item numbers. Object names/answers stay hidden so students can make their own inferences. No student answers are collected or stored.

The home and Egypt pages do not load Ötzi's `Classroom`, model or marker libraries; Egypt therefore cannot overwrite the saved Ötzi card poses or selected Capture backgrounds. Future investigations can be added as additional cards on the root home with their own entry pages.
