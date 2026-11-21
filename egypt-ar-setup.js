/* Only the Egypt scanner reads this setting. The two print layouts have different marker widths. */
(async function(){
  const select=document.getElementById('egypt-marker-size'),requested=new URLSearchParams(location.search).get('marker');
  select.value=requested==='16'?'16':'8';
  await Classroom.ready;
  function apply(){Classroom.markerWidthCm=select.value==='16'?16.002:8.001;}
  apply();select.addEventListener('change',apply);
})();
