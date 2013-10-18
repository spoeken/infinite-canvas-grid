// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function(){var e=0,t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"]}window.requestAnimationFrame||(window.requestAnimationFrame=function(t,n){var r=(new Date).getTime(),i=Math.max(0,16-(r-e)),s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})})();Object.prototype.clone=function(){var e=this instanceof Array?[]:{};for(var t in this){if(t==="clone")continue;this[t]&&typeof this[t]=="object"?e[t]=this[t].clone():e[t]=this[t]}return e};window.onload=function(){function m(){ctx.clearRect(0,0,t,n);for(var e=r.length-1;e>=0;e--){ctx.beginPath();ctx.moveTo(r[e].tlX,r[e].tlY);ctx.lineTo(r[e].trX,r[e].trY);ctx.lineTo(r[e].brX,r[e].brY);ctx.lineTo(r[e].blX,r[e].blY);ctx.closePath();ctx.fillStyle=r[e].color1;ctx.fill();ctx.stroke()}}function g(){m();E();for(var e=r.length-1;e>=0;e--){r[e].tlX=v[e].tlX;r[e].tlY=v[e].tlY;r[e].trX=v[e].trX;r[e].trY=v[e].trY;r[e].brX=v[e].brX;r[e].brY=v[e].brY;r[e].blX=v[e].blX;r[e].blY=v[e].blY}requestAnimationFrame(g)}function E(){var e=[];for(var t=r.length-1;t>=0;t--){var n=r[t].tlX,s=r[t].tlY;if(n<-i){console.log(t+" says: Im negatively off X");S(t)}if(s<-i){console.log(t+" says: Im negatively off Y");x(t)}}}function S(e){var t=i*s;r[e].tlX+=t;v[e].tlX+=t;r[e].trX+=t;v[e].trX+=t;r[e].brX+=t;v[e].brX+=t;r[e].blX+=t;v[e].blX+=t}function x(e){var t=i*s;r[e].tlY+=t;v[e].tlY+=t;r[e].trY+=t;v[e].trY+=t;r[e].brY+=t;v[e].brY+=t;r[e].blY+=t;v[e].blY+=t}console.log("We are ready!");var e=1;$(".container").scrollLeft(100);$(".container").scrollTop(100);c=document.getElementById("c");ctx=c.getContext("2d");var t=window.innerWidth,n=window.innerHeight;ctx.canvas.width=t;ctx.canvas.height=n;window.onresize=function(e){t=window.innerWidth;n=window.innerHeight;ctx.canvas.width=t;ctx.canvas.height=n};var r=[],i=300,s=10,o=10,u=s*o,a=["105B63","F4FFBE","FFD34E","DB7004","BD342D"];ctx.strokeStyle="rgba(0, 0, 0, 0.3)";for(var f=u-1;f>=0;f--){r[f]={};var l=(s-f%s)*i-i,h=(o-Math.floor(f/s))*i-i;r[f].tlX=l;r[f].tlY=h;r[f].trX=l+i;r[f].trY=h;r[f].brX=l+i;r[f].brY=h+i;r[f].blX=l;r[f].blY=h+i;var p=a[Math.floor(Math.random()*a.length)],d=a[Math.floor(Math.random()*a.length)];r[f].color1="#"+p;r[f].color2="#"+d}var v=r.clone();requestAnimationFrame(g);var y=0,b=!1,w=[];c.addEventListener("mousedown",function(){y=0;b=!0},!1);c.addEventListener("mousemove",function(e){y=1;if(b){var t=e.x/i,n=e.y/i,r=t%1,u=n%1,a=Math.ceil(r+u),f=Math.floor(n)*s+Math.ceil(t);f=s*o-f;console.log("Id: "+f+"Side:"+a)}},!1);c.addEventListener("mouseup",function(){b=!1;y===0?console.log("click"):y===1&&console.log("drag done")},!1);$(".container").on("scroll",function(t){var n=($(".container").scrollLeft()-100)/e;n*=-1;var i=($(".container").scrollTop()-100)/e;i*=-1;console.log(n);$(".container").scrollLeft(100);$(".container").scrollTop(100);for(var s=r.length-1;s>=0;s--){v[s].tlX+=n;v[s].tlY+=i;v[s].trX+=n;v[s].trY+=i;v[s].brX+=n;v[s].brY+=i;v[s].blX+=n;v[s].blY+=i}clearTimeout($.data(this,"scrollTimer"));$.data(this,"scrollTimer",setTimeout(function(){console.log("Haven't scrolled in 250ms!");$("html").removeClass("zoom");setTimeout(function(){},500)},250));t.preventDefault();return!1})};