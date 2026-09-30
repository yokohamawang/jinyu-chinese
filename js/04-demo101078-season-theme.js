/* DEMO 10.107.8 — seasonal visual hook only. */
(function(){
  function seasonForMonth(month){
    if(month===12 || month<=2) return 'winter';
    if(month<=5) return 'spring';
    if(month<=8) return 'summer';
    return 'autumn';
  }
  var season=seasonForMonth((new Date()).getMonth()+1);
  document.documentElement.setAttribute('data-kp-season',season);
  document.documentElement.setAttribute('data-kp-season-month',String((new Date()).getMonth()+1));
})();
