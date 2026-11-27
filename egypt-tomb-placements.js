/* Evidence-based rooms; display coordinates preserve examination space. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EgyptTombPlacements=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const data={
  "revision": "canopic-opening-1",
  "teacherOrder": [
    "throwing-sticks-ai",
    "headrest-ai",
    "fan-ai",
    "senet",
    "painted-chest",
    "chariot-ai"
  ],
  "notice": "Objects rest on the room floor or documented burial support without modern exhibit stands. Room associations follow the cited evidence; exact coordinates and unverified model matches remain approximate.",
  "entries": [
    {
      "id": "burial-shrine-207-ai",
      "room": "burial",
      "comparison": "207",
      "display": {
        "pos": [
          -3.3765,
          -3.3678
        ],
        "floor": 0,
        "size": 5.265,
        "displayDimensions": [
          3.63,
          2.98,
          5.265
        ],
        "yaw": 3.141592653589793,
        "stand": false,
        "interaction": "burial-layer"
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/207.html",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/207-c207-01.html",
        "https://www.griffith.ox.ac.uk/learning/look/burial-chamber-plan.html"
      ],
      "confidence": "Documented nesting order; approximate model fit and shared display center",
      "note": "Burial chamber · Carter 207, nested around the sarcophagus and three coffins. Meshy teaching reconstruction; decoration, hidden surfaces and exact fit are approximate."
    },
    {
      "id": "burial-shrine-237-ai",
      "room": "burial",
      "comparison": "237",
      "display": {
        "pos": [
          -3.3765,
          -3.3678
        ],
        "floor": 0,
        "size": 4.03,
        "displayDimensions": [
          2.75,
          2.35,
          4.03
        ],
        "yaw": 3.141592653589793,
        "stand": false,
        "interaction": "burial-layer"
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/237.html",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/237-c237-01.html",
        "https://www.griffith.ox.ac.uk/learning/look/burial-chamber-plan.html"
      ],
      "confidence": "Documented nesting order; approximate model fit and shared display center",
      "note": "Burial chamber · Carter 237, nested around the sarcophagus and three coffins. Meshy teaching reconstruction; decoration, hidden surfaces and exact fit are approximate."
    },
    {
      "id": "burial-shrine-238-ai",
      "room": "burial",
      "comparison": "238",
      "display": {
        "pos": [
          -3.3765,
          -3.3678
        ],
        "floor": 0,
        "size": 3.565,
        "displayDimensions": [
          2.29,
          2.08,
          3.565
        ],
        "yaw": 3.141592653589793,
        "stand": false,
        "interaction": "burial-layer"
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/238.html",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/238-c238-01.html",
        "https://www.griffith.ox.ac.uk/learning/look/burial-chamber-plan.html"
      ],
      "confidence": "Documented nesting order; approximate model fit and shared display center",
      "note": "Burial chamber · Carter 238, nested around the sarcophagus and three coffins. Meshy teaching reconstruction; decoration, hidden surfaces and exact fit are approximate."
    },
    {
      "id": "burial-shrine-239-ai",
      "room": "burial",
      "comparison": "239",
      "display": {
        "pos": [
          -3.3765,
          -3.3678
        ],
        "floor": 0,
        "size": 3.09,
        "displayDimensions": [
          1.81,
          1.92,
          3.09
        ],
        "yaw": 3.141592653589793,
        "stand": false,
        "interaction": "burial-layer"
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/239.html",
        "https://www.griffith.ox.ac.uk/gri/4tutshr23.html",
        "https://www.griffith.ox.ac.uk/learning/look/burial-chamber-plan.html"
      ],
      "confidence": "Documented nesting order; approximate model fit and shared display center",
      "note": "Burial chamber · Carter 239, nested around the sarcophagus and three coffins. Meshy teaching reconstruction; decoration, hidden surfaces and exact fit are approximate."
    },
    {
      "id": "nested-coffins-ai",
      "room": "burial",
      "comparison": "253–255",
      "display": {
        "pos": [
          -3.3765,
          -3.3678
        ],
        "size": 2.24,
        "yaw": 3.141592653589793,
        "floor": 0,
        "baseY": 0.64,
        "depthScale": 0.6636799694,
        "restRotation": [
          -1.5707963267948966,
          0,
          0
        ],
        "stand": false,
        "interaction": "burial-layer"
      },
      "evidence": [
        "https://www.griffith.ox.ac.uk/gri/carter/250-299.html",
        "https://www.griffith.ox.ac.uk/learning/look/burial-chamber-plan.html"
      ],
      "confidence": "Documented nesting order; approximate reconstructed fit",
      "note": "Burial chamber · the existing three-coffin teaching assembly, Carter 253–255, inside the stone sarcophagus with its head west. Includes the wrapped teaching mummy, mask, crook and flail. The old souvenir coffin replica has been removed from this game."
    },
    {
      "id": "painted-chest",
      "room": "antechamber",
      "comparison": "21",
      "display": {
        "pos": [
          -0.65,
          -6.1
        ],
        "size": 0.61,
        "floor": 0.6,
        "stand": false
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/021-c021-1.html"
      ],
      "confidence": "Documented near guardian 22; approximate display coordinate",
      "note": "Antechamber · painted chest, Carter 21, close to the nemes guardian (Carter 22). Carter recorded its north–south orientation and believed ancient robbers had displaced it; the displayed coordinate is approximate."
    },
    {
      "id": "guardian-khat-ai",
      "room": "antechamber",
      "display": {
        "pos": [
          -0.65,
          -3.4
        ],
        "size": 1.9,
        "floor": 0.6,
        "stand": false,
        "yaw": 3.141592653589793
      },
      "evidence": [
        "https://gem.eg/en/collection/artefacts/guardian-statue-with-khat-headdress",
        "https://www.griffith.ox.ac.uk/discoveringTut/burton5/burtoncolour.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Antechamber · AI comparison for Tutankhamun’s guardian statue with khat headdress, mace and staff. The original pair flanked the sealed burial-chamber doorway. This companion faces the nemes guardian near the burial entrance; coordinates are approximate teaching positions. The generated all-gold finish differs from the originals’ black-and-gold surfaces; exact catalog match is unverified."
    },
    {
      "id": "guardian-statue-ai",
      "room": "antechamber",
      "display": {
        "pos": [
          -0.65,
          -5.3
        ],
        "size": 1.9,
        "floor": 0.6,
        "stand": false,
        "yaw": 0
      },
      "evidence": [
        "https://gem.eg/en/collection/artefacts/guardian-statue-with-nemes-headcloth",
        "https://www.griffith.ox.ac.uk/discoveringTut/burton5/burtoncolour.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Antechamber · AI comparison for Tutankhamun’s guardian (ka) statue with nemes headcloth, mace and staff. The original pair flanked the sealed burial-chamber doorway. Shown near the burial entrance at an approximate teaching position; this generated mesh is not a verified catalog match and its all-gold finish differs from the originals’ black-and-gold surfaces."
    },
    {
      "id": "throwing-sticks-ai",
      "room": "annexe",
      "display": {
        "pos": [
          6.5,
          -1
        ],
        "size": 0.65,
        "floor": -0.34,
        "stand": false,
        "restRotation": [
          1.5707963267948966,
          0,
          0
        ]
      },
      "evidence": [
        "https://tutankhamun.griffith.ox.ac.uk/journals-and-diaries/taa-i2428-51-6th-season/taa-i2439",
        "https://tutankhamun.griffith.ox.ac.uk/rooms/annexe"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Annexe · AI teaching copy near the weapons group. Carter recorded throw sticks below the doorway; this pair has no verified object-number match. Shown on the floor near the documented group; exact position is approximate."
    },
    {
      "id": "headrest-ai",
      "room": "annexe",
      "display": {
        "pos": [
          4.4,
          -0.4
        ],
        "size": 0.3,
        "floor": -0.34,
        "stand": false
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/403c-c403c-1.html",
        "https://tutankhamun.griffith.ox.ac.uk/journals-and-diaries/taa-i2428-51-6th-season/taa-i2439"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Annexe · AI comparison for the Shu-and-lions headrest, Carter 403c. The original was in a cabinet containing four headrests. Shown on the Annexe floor at the cabinet group; the original was inside a cabinet, which is not reconstructed.",
      "comparison": "403c"
    },
    {
      "id": "fan-ai",
      "room": "burial",
      "display": {
        "pos": [
          -1.95,
          -2.3
        ],
        "size": 0.95,
        "floor": 0,
        "stand": false,
        "restRotation": [
          1.5707963267948966,
          0,
          0
        ]
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/245-c245-1.html",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/245-c245-2.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Burial chamber · AI comparison for decorated fan 245, recorded on the south side between the two inner shrines, feathers east. Shown at floor level near the recorded southern group; missing feathers, shrines and exact geometry are not reconstructed.",
      "comparison": "245"
    },
    {
      "id": "senet",
      "room": "annexe",
      "display": {
        "pos": [
          5.1,
          -1.2
        ],
        "size": 0.5,
        "floor": -0.34,
        "stand": false
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/345-c345-01.html",
        "https://tutankhamun.griffith.ox.ac.uk/rooms/annexe"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Annexe · generic Senet teaching copy. Tutankhamun’s game-box 345 and its separated parts were found in this room. This model is not that particular board; floor position is approximate.",
      "comparison": "345"
    },
    {
      "id": "chariot-ai",
      "room": "antechamber",
      "display": {
        "pos": [
          5.9,
          -4.4
        ],
        "size": 1.1,
        "floor": 0.6,
        "stand": false
      },
      "evidence": [
        "https://www.griffith.ox.ac.uk/discoveringTut/burton5/burtoncolour.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Antechamber · AI chariot comparison in the southern equipment area. Burial photographs show disassembled chariots here. This assembled study copy retains generated display supports; exact chariot identity and ancient position are unverified."
    },
    {
      "id": "lotus-ai",
      "room": "burial",
      "display": {
        "pos": [
          -4.55,
          -5.3
        ],
        "size": 0.7,
        "floor": 0,
        "stand": false
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/210-c210-1.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Burial chamber · AI perfume-vessel comparison for Carter 210, recorded inside the outer shrine before the next shrine’s north door. Exact model match is unverified; its gold-toned texture differs from calcite. Shown on the floor; exact position is approximate.",
      "comparison": "210"
    },
    {
      "id": "sandals-ai",
      "room": "burial",
      "display": {
        "pos": [
          -2.65,
          -3.37
        ],
        "size": 0.4,
        "floor": 0,
        "stand": false,
        "baseY": 0.64
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/250-299.html",
        "https://tutankhamun.griffith.ox.ac.uk/stories/unwrapping-tutankhamuns-mummified-body-november-1925"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Burial chamber · AI golden-footwear study. Gold funerary sandals were on the mummy’s feet inside the coffins. This exposed teaching copy is not a verified match to those sandals or a separate floor find. Displayed with the coffin assemblage rather than as a separate floor find; body and wrappings are not reconstructed."
    },
    {
      "id": "model-boat-ai",
      "room": "treasury",
      "display": {
        "pos": [
          -6.25,
          -9.7
        ],
        "size": 0.7,
        "floor": 0,
        "stand": false
      },
      "evidence": [
        "https://www.griffith.ox.ac.uk/discoveringTut/burton5/burtoncolour.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Treasury · AI model-boat comparison near the southern group. Boats are documented in this room, including Burton photograph 1097b. Exact boat identity is unverified; floor coordinate is approximate."
    },
    {
      "id": "model-boat-2-ai",
      "room": "treasury",
      "display": {
        "pos": [
          -3.9,
          -9.1
        ],
        "size": 0.7,
        "floor": 0,
        "stand": false
      },
      "evidence": [
        "https://www.griffith.ox.ac.uk/discoveringTut/burton5/burtoncolour.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Treasury · second AI model-boat comparison, retained separately. Boats are documented in this room and also in the Annexe. No specific Carter number or exact findspot is assigned to this mesh; floor position is approximate."
    },
    {
      "id": "crook-staff-ai",
      "room": "burial",
      "display": {
        "pos": [
          -3.05,
          -3.37
        ],
        "size": 0.9,
        "floor": 0,
        "stand": false,
        "name": "Crook and flail · AI reconstruction",
        "baseY": 0.64,
        "restRotation": [
          1.5707963267948966,
          0,
          0
        ]
      },
      "evidence": [
        "https://tutankhamun.griffith.ox.ac.uk/sites/default/files/2026-03/Carter_The_Tomb_of_Tut.ankh_.amen_Volume_II.pdf"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Burial chamber · AI crook-and-flail comparison. Carter described a crook and flail held by the gold hands on the mummy’s wrappings. This is a separate teaching copy; exact dimensions and object match are unverified. Displayed with the coffin assemblage rather than as a separate floor find; body and wrappings are not reconstructed."
    },
    {
      "id": "pectoral-ai",
      "room": "treasury",
      "display": {
        "pos": [
          -6.25,
          -8.4
        ],
        "size": 0.3,
        "floor": 0,
        "stand": false,
        "restRotation": [
          1.5707963267948966,
          0,
          0
        ]
      },
      "evidence": [
        "https://www.griffith.ox.ac.uk/discoveringTut/burton5/burtoncolour.html",
        "https://www.globalegyptianmuseum.org/detail.aspx?id=14836"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Treasury · alternate AI pectoral study beside the jewellery collection. Pectorals are documented in Treasury containers, but this mesh has no secure catalog match; this is a teaching placement, not a claimed findspot."
    },
    {
      "id": "shield-ai",
      "room": "annexe",
      "display": {
        "pos": [
          6.6,
          0.55
        ],
        "size": 0.7,
        "floor": -0.34,
        "stand": false,
        "restRotation": [
          1.5707963267948966,
          0,
          0
        ]
      },
      "evidence": [
        "https://tutankhamun.griffith.ox.ac.uk/object-records/379",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/488b-c488b.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Annexe · AI ceremonial-shield comparison in the weapons room. Shields 379 and 488b belong to the Annexe group. This mesh’s exact catalog match is unverified; floor position is approximate."
    },
    {
      "id": "shield-2-ai",
      "room": "annexe",
      "display": {
        "pos": [
          3.5,
          0.55
        ],
        "size": 0.7,
        "floor": -0.34,
        "stand": false,
        "restRotation": [
          1.5707963267948966,
          0,
          0
        ]
      },
      "evidence": [
        "https://tutankhamun.griffith.ox.ac.uk/object-records/379",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/488b-c488b.html"
      ],
      "confidence": "Documented comparison/type room; approximate teaching position",
      "note": "Annexe · AI ceremonial-shield comparison in the weapons room. Shields 379 and 488b belong to the Annexe group. This mesh’s exact catalog match is unverified; floor position is approximate."
    },
    {
      "id": "canopic",
      "room": "treasury",
      "comparison": "266 / 266a / 266b",
      "display": {
        "pos": [
          -4.509,
          -10.124
        ],
        "size": 1.98,
        "floor": 0,
        "stand": false,
        "yaw": 0
      },
      "evidence": [
        "https://www-griffith.ames.ox.ac.uk/gri/carter/266-c266-01.html",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/266-p1144.html",
        "https://www-griffith.ames.ox.ac.uk/gri/carter/266-p1169.html"
      ],
      "confidence": "Documented east-wall centre and nesting; fitted to this room’s geometry with approximate generated face details",
      "note": "Treasury · nested canopy (266), bottomless wooden shrine (266a) and calcite canopic chest (266b), at the centre of the east wall behind Anubis. The lid starts fitted to the box; pick up to lift each enclosure and the stone lid. Carter/Burton photographs guide the group; model surfaces and exact fit remain approximate."
    }
  ]
};
 function apply(defs){
  const byId=new Map(data.entries.map(p=>[p.id,p]));
  for(const d of defs){const p=byId.get(d.id);if(p)Object.assign(d,p.display,{note:p.note,placement:p});}
  const rank=new Map(data.teacherOrder.map((id,i)=>[id,i]));
  defs.sort((a,b)=>(rank.get(a.id)??100)-(rank.get(b.id)??100));
  return defs;
 }
 return {...data,apply};
});
