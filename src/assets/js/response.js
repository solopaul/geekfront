function htRem() {
  var ww = document.documentElement.clientWidth;
  if (ww < 1000) {
    ww = 1000;
  }
  document.documentElement.style.fontSize = ww / 90 + "px";
  //window.mainboxh = document.getElementById("mainbox").offsetHeight;
}
htRem();
//document.getElementById("cms_header").addEventListener('mousedown',function(e){ startDrag()});
window.onresize = function() {
  htRem();
};
