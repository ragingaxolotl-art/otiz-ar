/* Curated external photographs. IDs are stable shared classroom settings. */
(function(){
  const photos=[
  {
    "id": "photo-01",
    "title": "Recovery hollow · red dot",
    "category": "Findspot",
    "url": "https://cdn.mos.cms.futurecdn.net/rPVndrnyq5h72wKiWNEBqN-970-80.jpg",
    "source": "https://www.livescience.com/otzi-iceman-death-revisited",
    "credit": "Walter Leitner / Secrets of the Ice"
  },
  {
    "id": "photo-02",
    "title": "Archaeologists at the 1992 excavation",
    "category": "Findspot",
    "url": "https://s17838.pcdn.co/wp-content/uploads/sites/2/2018/06/Prestige.Item_.1.10542433-1024x701.jpg",
    "source": "https://secretsoftheice.com/news/2022/11/07/otzi/",
    "credit": "Provincial Archaeology Office, Bolzano"
  },
  {
    "id": "photo-03",
    "title": "Excavation photo plate",
    "category": "Findspot",
    "url": "https://www.wissenschaft.de/wp-content/uploads/2/2/22-11-oetzi-990x652.jpg",
    "source": "https://journals.sagepub.com/doi/full/10.1177/09596836221126133",
    "credit": "Pilø et al. · Figure 3; see source for panel credits"
  },
  {
    "id": "photo-04",
    "title": "Discovery area · museum photograph",
    "category": "Findspot",
    "url": "https://www.iceman.it/%C3%B6tzi/Il%20ritrovamento/159/image-thumb__159__thumbnail-gallery-image-1/ritrovamento_3%402x.5257adee.jpg",
    "source": "https://www.iceman.it/en/oetzi/the-discovery",
    "credit": "South Tyrol Museum of Archaeology"
  },
  {
    "id": "photo-05",
    "title": "Memorial and rocky landscape",
    "category": "Memorial",
    "url": "https://www.soelden.com/cache-buster-0/infrastruktur/vent/otzi---fundstelle/117547/image-thumb__117547__nuiLightboxImage/fundstelle-otzi-97cddcec.ec3c9487.jpg",
    "source": "https://www.soelden.com/en/region-villages/soelden-a-z/oetzi-place-of-discovery.i-121c02ff-4098-4c49-8b13-124f8eda5b6f",
    "credit": "Sölden / Ötztal Tourism · see source"
  },
  {
    "id": "photo-06",
    "title": "Memorial with snowfields",
    "category": "Memorial",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/1424/DSC_5179_41109.jpg",
    "source": "https://www.almenrausch.at/touren/detail/fineilspitze-3516-m-von-vernagt/",
    "credit": "Almenrausch · see source"
  },
  {
    "id": "photo-07",
    "title": "Wide view around the monument",
    "category": "Memorial",
    "url": "https://www.age-of-the-sage.org/archaeology/oetzi/otzi_monument.jpg",
    "source": "https://www.age-of-the-sage.org/archaeology/otzi_the_iceman_map.html",
    "credit": "See source for photo credit"
  },
  {
    "id": "photo-08",
    "title": "Stone memorial markers",
    "category": "Memorial",
    "url": "https://www.asi-reisen.de/Presse/20210901/ASI_Oetzi%20_Trek_Fundstelle_copyright_OetztalTourismus.jpg",
    "source": "https://www.asi-reisen.de/news/press/alpenuberquerung-auf-oetzis-spuren",
    "credit": "Ötztal Tourismus / ASI Reisen"
  },
  {
    "id": "photo-09",
    "title": "Overcast rocks · August 2022",
    "category": "Seasons",
    "url": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/08/31/1130_lm.jpg",
    "source": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/08/31/1130",
    "credit": "University of Innsbruck / foto-webcam.eu"
  },
  {
    "id": "photo-10",
    "title": "Warm afternoon snow · October 2022",
    "category": "Seasons",
    "url": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/10/31/1600_lm.jpg",
    "source": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/10/31/1600",
    "credit": "University of Innsbruck / foto-webcam.eu"
  },
  {
    "id": "photo-11",
    "title": "Snowy ridge at dusk · October 2022",
    "category": "Seasons",
    "url": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/10/30/1630_lm.jpg",
    "source": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/10/30/1630",
    "credit": "University of Innsbruck / foto-webcam.eu"
  },
  {
    "id": "photo-12",
    "title": "Spring snow · May 2023",
    "category": "Seasons",
    "url": "https://www.foto-webcam.eu/webcam/tisenjoch/2023/05/04/1630_lm.jpg",
    "source": "https://www.foto-webcam.eu/webcam/tisenjoch/2023/05/04/1630",
    "credit": "University of Innsbruck / foto-webcam.eu"
  },
  {
    "id": "photo-13",
    "title": "Winter conditions · November 2022",
    "category": "Seasons",
    "url": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/11/21/1000_lm.jpg",
    "source": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/11/21/1000",
    "credit": "University of Innsbruck / foto-webcam.eu"
  },
  {
    "id": "photo-14",
    "title": "Fresh snow · September 2022",
    "category": "Seasons",
    "url": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/09/27/1100_lm.jpg",
    "source": "https://www.foto-webcam.eu/webcam/tisenjoch/2022/09/27/1100",
    "credit": "University of Innsbruck / foto-webcam.eu"
  },
  {
    "id": "photo-15",
    "title": "Labeled regional overview",
    "category": "Surroundings",
    "url": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Tisenjoch_%26_Hauslabjoch.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Tisenjoch_%26_Hauslabjoch.jpg",
    "credit": "Kogo / Wikimedia Commons · GFDL"
  },
  {
    "id": "photo-16",
    "title": "Rocky foreground and glaciers",
    "category": "Surroundings",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/3000/Similaunhuette-Finailspitze-Hochjochhospiz-022.jpg",
    "source": "https://www.almenrausch.at/touren/detail/similaunhuette-finailspitze-hochjoch-hospiz/",
    "credit": "Almenrausch · see source"
  },
  {
    "id": "photo-17",
    "title": "Glacier, small lake and fractured rock",
    "category": "Surroundings",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/1432/DSC_5205_41135_01.jpg",
    "source": "https://www.almenrausch.at/touren/detail/fineilspitze-3516-m-von-der-similaunhuette/",
    "credit": "Almenrausch · see source"
  },
  {
    "id": "photo-18",
    "title": "Snowy peaks above clouds",
    "category": "Surroundings",
    "url": "https://www.masterplan-mountaineering.co.uk/b/assets/uploads/2022/03/17-DSCF8614-Looking-at-the-Hintere-Schwarze-and-Similaun-with-the-Italian-cloud-inversion.jpg",
    "source": "https://www.masterplan-mountaineering.co.uk/2022/03/fineilspitze/",
    "credit": "Alastair Begley / MasterPlan Mountaineering"
  },
  {
    "id": "photo-19",
    "title": "Fineilspitze route ridges",
    "category": "Surroundings",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/4379/Similaun-Fineilspitze-Vent_61079.jpg",
    "source": "https://www.almenrausch.at/touren/detail/tag-3-similaunhuette-oetzifundstelle-fineilspitze-martin-busch-huette-vent/",
    "credit": "Almenrausch · see source"
  },
  {
    "id": "photo-20",
    "title": "High alpine route",
    "category": "Surroundings",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/3831/SimilaunFinailsp_30759.jpg",
    "source": "https://www.almenrausch.at/touren/detail/tag-1-bergstation-grawand-fineilkopf-fineilspitze-similaunhuette/",
    "credit": "Almenrausch · see source"
  },
  {
    "id": "photo-21",
    "title": "Fineilspitze snow ridge",
    "category": "Surroundings",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/1417/DSC_3832_20744_03.jpg",
    "source": "https://www.almenrausch.at/touren/detail/fineilspitze-3514-m-von-der-similaunhuette/",
    "credit": "Almenrausch · see source"
  },
  {
    "id": "photo-22",
    "title": "Fineilspitze summit",
    "category": "Surroundings",
    "url": "https://www.suedtirol.info/content/dam/idm/im/images/experiences/activities/b/b_1/smgpoi2c24291f24a44db38925c280b24bf779/6DD26216A6CFC6A997B09C90A8AF9313.jpeg",
    "source": "https://www.suedtirol.info/en/en/experiences-and-events/plp-experiences/experiences-south-tyrol/pdp-experience.smgpoi2c24291f24a44db38925c280b24bf779.hiking-tour-to-finail-summit.maso-corto-kurzras",
    "credit": "South Tyrol tourism · see source"
  },
  {
    "id": "photo-23",
    "title": "Rocky ridge panorama",
    "category": "Surroundings",
    "url": "https://www.deine-berge.de/fotos/tour/original/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht_88157.jpg",
    "source": "https://www.deine-berge.de/Fotos/tour/54175/88206/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht.html",
    "credit": "Deine Berge contributor · see source"
  },
  {
    "id": "photo-24",
    "title": "Exposed rock and snow",
    "category": "Surroundings",
    "url": "https://www.deine-berge.de/fotos/tour/original/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht_88115.jpg",
    "source": "https://www.deine-berge.de/Fotos/tour/54175/88206/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht.html",
    "credit": "Deine Berge contributor · see source"
  },
  {
    "id": "photo-25",
    "title": "Traverse landscape",
    "category": "Surroundings",
    "url": "https://www.deine-berge.de/fotos/tour/original/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht_88066.jpg",
    "source": "https://www.deine-berge.de/Fotos/tour/54175/88206/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht.html",
    "credit": "Deine Berge contributor · see source"
  },
  {
    "id": "photo-26",
    "title": "Glacier between rocky slopes",
    "category": "Surroundings",
    "url": "https://www.deine-berge.de/fotos/tour/original/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht_88058.jpg",
    "source": "https://www.deine-berge.de/Fotos/tour/54175/88365/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht.html",
    "credit": "Deine Berge contributor · see source"
  },
  {
    "id": "photo-27",
    "title": "Hikers on alpine terrain",
    "category": "Surroundings",
    "url": "https://www.deine-berge.de/fotos/tour/original/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht_88116.jpg",
    "source": "https://www.deine-berge.de/Fotos/tour/54175/88263/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht.html",
    "credit": "Deine Berge contributor · see source"
  },
  {
    "id": "photo-28",
    "title": "People beside the glacier",
    "category": "Surroundings",
    "url": "https://www.deine-berge.de/fotos/tour/original/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht_88060.jpg",
    "source": "https://www.deine-berge.de/Fotos/tour/54175/88105/Similaunhuette-Ueberschreitung-Fineilspitze-Schoene-Aussicht.html",
    "credit": "Deine Berge contributor · see source"
  },
  {
    "id": "photo-29",
    "title": "Cairn and snowfield",
    "category": "Surroundings",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/3000/Similaunhuette-Finailspitze-Hochjochhospiz-014.jpg",
    "source": "https://www.almenrausch.at/touren/detail/similaunhuette-finailspitze-hochjoch-hospiz/",
    "credit": "Almenrausch · see source"
  },
  {
    "id": "photo-30",
    "title": "View toward the valley and lake",
    "category": "Surroundings",
    "url": "https://www.almenrausch.at/uploads/tx_webxhousingv2/trips/1408/DSC_5221_01.jpg",
    "source": "https://www.almenrausch.at/touren/detail/oetzi-fundstelle-tisenjoch-3210-m-von-der-martin-busch-huette/",
    "credit": "Almenrausch · see source"
  }
];
  const byId=new Map(photos.map(p=>[p.id,Object.freeze(p)]));
  function pick(ids,random=Math.random){const available=(ids||[]).map(id=>byId.get(id)).filter(Boolean);return available.length?available[Math.floor(random()*available.length)]:null;}
  window.CapturePhotos={photos:Object.freeze(photos),get:id=>byId.get(id)||null,pick};
})();
