/* Preserve links that previously opened an Ötzi object at the site root. */
(function(){const params=new URLSearchParams(location.search);if(['artifact','preview','setup'].some(key=>params.has(key))||location.hash==='#collection')location.replace('otzi.html'+location.search+location.hash);})();
