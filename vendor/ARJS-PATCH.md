# Local AR.js 3.4.7 patch

The bundled `aframe-ar.js` retains its upstream license. In the A-Frame `arjs-anchor` adapter, `C.size=A.data.size` is added immediately before `C.minConfidence=A.data.minConfidence`. This forwards the marker width to ARjs.Anchor and ArMarkerControls; the barcode branch previously replaced its option object without copying size. The declared A-Frame size therefore remained disconnected from the detection engine, whose default width is one unit.

The scanner cache key is `marker-meters-2`. `tests/capture-tracking-report.js` verifies both the control parameter and the detection engine's actual barcode marker width, together with capture and reacquisition.

When a barcode width changes, its previous-pose flags are cleared before storing the new width, so the next solve does not reuse a pose fitted at the old unit scale. This covers detections that occur before the anchor finishes initializing. The bundled engine and worker copies receive the same change.
