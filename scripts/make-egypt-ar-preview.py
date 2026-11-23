"""Create a local-only image-input test of the actual scanner (no webcam permission)."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
(root/'tmp').mkdir(exist_ok=True)
html=(root/'egypt-scan.html').read_text().replace('<head>','<head><base href="../">').replace('src="scan.js?v=egypt-teacher-first-1"','src="tmp/egypt-scan-test.js?v=ai-twelve-1"')
html=html.replace('<script src="classroom.js', '<script>AR_COLLECTION.settingsUrl=new URL(AR_COLLECTION.settingsUrl,document.baseURI).href;</script><script src="classroom.js')
script=(root/'scan.js').read_text().replace('sourceType: webcam;','sourceType: image; sourceUrl: tests/tracking-board.png; maxDetectionRate: 15;')
(root/'tmp/egypt-scan-test.html').write_text(html)
(root/'tmp/egypt-scan-test.js').write_text(script)
