/* DEMO 10.108.301.102 — make standalone learning pages return to Home. */
(function(){
  try{history.pushState({koepandaFixedHomeBack:true},'',location.href)}catch(e){}
  window.addEventListener('popstate',function(){location.replace('./index.html')});
})();
