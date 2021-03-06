"use strict";
!function () {
  var e = "@charset \"utf-8\";html{color:#000;background:#fff;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:''}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}",
    t = document.createElement("style");
  if (document.getElementsByTagName("head")[0].appendChild(t), t.styleSheet) t.styleSheet.disabled || (t.styleSheet.cssText = e); else try {
    t.innerHTML = e
  } catch (o) {
    t.innerText = e
  }
}();
!function (e, t) {
  function i() {
    var t = n.getBoundingClientRect().width;
    t / m > 540 && (t = 540 * m);
    var i = t / 10;
    n.style.fontSize = i + "px", d.rem = e.rem = i
  }

  var a, r = e.document, n = r.documentElement, o = r.querySelector('meta[name="viewport"]'),
    l = r.querySelector('meta[name="flexible"]'), m = 0, s = 0, d = t.flexible || (t.flexible = {});
  if (o) {
    console.warn("将根据已有的meta标签来设置缩放比例");
    var p = o.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
    p && (s = parseFloat(p[1]), m = parseInt(1 / s))
  } else if (l) {
    var c = l.getAttribute("content");
    if (c) {
      var u = c.match(/initial\-dpr=([\d\.]+)/), f = c.match(/maximum\-dpr=([\d\.]+)/);
      u && (m = parseFloat(u[1]), s = parseFloat((1 / m).toFixed(2))), f && (m = parseFloat(f[1]), s = parseFloat((1 / m).toFixed(2)))
    }
  }
  if (!m && !s) {
    var v = (e.navigator.appVersion.match(/android/gi), e.navigator.appVersion.match(/iphone/gi)),
      h = e.devicePixelRatio;
    m = v ? h >= 3 && (!m || m >= 3) ? 3 : h >= 2 && (!m || m >= 2) ? 2 : 1 : 1, s = 1 / m
  }
  if (n.setAttribute("data-dpr", m), !o) if (o = r.createElement("meta"), o.setAttribute("name", "viewport"), o.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), n.firstElementChild) n.firstElementChild.appendChild(o); else {
    var x = r.createElement("div");
    x.appendChild(o), r.write(x.innerHTML)
  }
  e.addEventListener("resize", function () {
    clearTimeout(a), a = setTimeout(i, 300)
  }, !1), e.addEventListener("pageshow", function (e) {
    e.persisted && (clearTimeout(a), a = setTimeout(i, 300))
  }, !1), "complete" === r.readyState ? r.body.style.fontSize = 12 * m + "px" : r.addEventListener("DOMContentLoaded", function (e) {
    r.body.style.fontSize = 12 * m + "px"
  }, !1), i(), d.dpr = e.dpr = m, d.refreshRem = i, d.rem2px = function (e) {
    var t = parseFloat(e) * this.rem;
    return "string" == typeof e && e.match(/rem$/) && (t += "px"), t
  }, d.px2rem = function (e) {
    var t = parseFloat(e) / this.rem;
    return "string" == typeof e && e.match(/px$/) && (t += "rem"), t
  }
}(window, window.lib || (window.lib = {}));
