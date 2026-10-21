# Local AR.js 3.4.7 patch

The bundled `aframe-ar.js` retains its upstream license. In the A-Frame `arjs-anchor` adapter, `C.size=A.data.size` is added immediately before `C.minConfidence=A.data.minConfidence`. This forwards the marker width to ARjs.Anchor and ArMarkerControls; the barcode branch previously replaced its option object without copying size. The declared A-Frame size therefore remained disconnected from the detection engine, whose default width is one unit.

The scanner cache key is `marker-follow-3`. `tests/capture-tracking-report.js` verifies both the control parameter and the detection engine's actual barcode marker width, together with capture and reacquisition.

When a barcode width changes, its previous-pose flags are cleared before storing the new width, so the next solve does not reuse a pose fitted at the old unit scale. This covers detections that occur before the anchor finishes initializing. The bundled engine and worker copies receive the same change.

For markers with `smooth: false`, the anchor wrapper now copies each detected position, rotation, scale, and visibility directly. Upstream applied a second smoothing layer even when smoothing was disabled, and retained lost poses briefly. Live scanner markers disable the thresholded matrix smoother as well: its 0.01 meter tolerance and two-component threshold can freeze single-axis movement. Captured inspection continues in its separate renderer.

Native square-pose calls with widths below one (such as 0.04001 meters) produced failed solves in the bundled build and left the shared pose buffer unchanged, placing multiple card IDs at the last successfully solved position. Both the main and worker JS wrappers now solve at width 1, then scale only translation entries 3, 7, and 11 by the requested marker width. The continuous wrapper first divides previous translations by that width, solves at width 1, and scales the result back to meters. This retains rotation and exact fractional marker calibration while giving every ID a fresh independent pose. Regression checks exercise both wrappers and three simultaneously detected markers.
