import{S as C,i as q,s as U,a as j,e as d,c as z,b as E,d as h,f as L,g,h as w,j as W,o as F,k as G,l as H,m as J,n as I,p,q as K,r as M,u as Q,v as P,t as X,w as A,x as v,y as k,z as D,A as O,B as R}from"../chunks/index.0c2a1aba.js";const Y="modulepreload",Z=function(a,e){return new URL(a,e).href},T={},m=function(e,n,i){if(!n||n.length===0)return e();const r=document.getElementsByTagName("link");return Promise.all(n.map(_=>{if(_=Z(_,i),_ in T)return;T[_]=!0;const t=_.endsWith(".css"),o=t?'[rel="stylesheet"]':"";if(!!i)for(let l=r.length-1;l>=0;l--){const u=r[l];if(u.href===_&&(!t||u.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${_}"]${o}`))return;const s=document.createElement("link");if(s.rel=t?"stylesheet":Y,t||(s.as="script",s.crossOrigin=""),s.href=_,document.head.appendChild(s),t)return new Promise((l,u)=>{s.addEventListener("load",l),s.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${_}`)))})})).then(()=>e()).catch(_=>{const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=_,window.dispatchEvent(t),!t.defaultPrevented)throw _})},re={};function $(a){let e,n,i;var r=a[1][0];function _(t){return{props:{data:t[3],form:t[2]}}}return r&&(e=v(r,_(a)),a[12](e)),{c(){e&&k(e.$$.fragment),n=d()},l(t){e&&D(e.$$.fragment,t),n=d()},m(t,o){e&&O(e,t,o),E(t,n,o),i=!0},p(t,o){const c={};if(o&8&&(c.data=t[3]),o&4&&(c.form=t[2]),o&2&&r!==(r=t[1][0])){if(e){P();const s=e;h(s.$$.fragment,1,0,()=>{R(s,1)}),L()}r?(e=v(r,_(t)),t[12](e),k(e.$$.fragment),g(e.$$.fragment,1),O(e,n.parentNode,n)):e=null}else r&&e.$set(c)},i(t){i||(e&&g(e.$$.fragment,t),i=!0)},o(t){e&&h(e.$$.fragment,t),i=!1},d(t){a[12](null),t&&w(n),e&&R(e,t)}}}function x(a){let e,n,i;var r=a[1][0];function _(t){return{props:{data:t[3],$$slots:{default:[ee]},$$scope:{ctx:t}}}}return r&&(e=v(r,_(a)),a[11](e)),{c(){e&&k(e.$$.fragment),n=d()},l(t){e&&D(e.$$.fragment,t),n=d()},m(t,o){e&&O(e,t,o),E(t,n,o),i=!0},p(t,o){const c={};if(o&8&&(c.data=t[3]),o&8215&&(c.$$scope={dirty:o,ctx:t}),o&2&&r!==(r=t[1][0])){if(e){P();const s=e;h(s.$$.fragment,1,0,()=>{R(s,1)}),L()}r?(e=v(r,_(t)),t[11](e),k(e.$$.fragment),g(e.$$.fragment,1),O(e,n.parentNode,n)):e=null}else r&&e.$set(c)},i(t){i||(e&&g(e.$$.fragment,t),i=!0)},o(t){e&&h(e.$$.fragment,t),i=!1},d(t){a[11](null),t&&w(n),e&&R(e,t)}}}function ee(a){let e,n,i;var r=a[1][1];function _(t){return{props:{data:t[4],form:t[2]}}}return r&&(e=v(r,_(a)),a[10](e)),{c(){e&&k(e.$$.fragment),n=d()},l(t){e&&D(e.$$.fragment,t),n=d()},m(t,o){e&&O(e,t,o),E(t,n,o),i=!0},p(t,o){const c={};if(o&16&&(c.data=t[4]),o&4&&(c.form=t[2]),o&2&&r!==(r=t[1][1])){if(e){P();const s=e;h(s.$$.fragment,1,0,()=>{R(s,1)}),L()}r?(e=v(r,_(t)),t[10](e),k(e.$$.fragment),g(e.$$.fragment,1),O(e,n.parentNode,n)):e=null}else r&&e.$set(c)},i(t){i||(e&&g(e.$$.fragment,t),i=!0)},o(t){e&&h(e.$$.fragment,t),i=!1},d(t){a[10](null),t&&w(n),e&&R(e,t)}}}function V(a){let e,n=a[6]&&y(a);return{c(){e=G("div"),n&&n.c(),this.h()},l(i){e=H(i,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var r=J(e);n&&n.l(r),r.forEach(w),this.h()},h(){I(e,"id","svelte-announcer"),I(e,"aria-live","assertive"),I(e,"aria-atomic","true"),p(e,"position","absolute"),p(e,"left","0"),p(e,"top","0"),p(e,"clip","rect(0 0 0 0)"),p(e,"clip-path","inset(50%)"),p(e,"overflow","hidden"),p(e,"white-space","nowrap"),p(e,"width","1px"),p(e,"height","1px")},m(i,r){E(i,e,r),n&&n.m(e,null)},p(i,r){i[6]?n?n.p(i,r):(n=y(i),n.c(),n.m(e,null)):n&&(n.d(1),n=null)},d(i){i&&w(e),n&&n.d()}}}function y(a){let e;return{c(){e=K(a[7])},l(n){e=M(n,a[7])},m(n,i){E(n,e,i)},p(n,i){i&128&&Q(e,n[7])},d(n){n&&w(e)}}}function te(a){let e,n,i,r,_;const t=[x,$],o=[];function c(l,u){return l[1][1]?0:1}e=c(a),n=o[e]=t[e](a);let s=a[5]&&V(a);return{c(){n.c(),i=j(),s&&s.c(),r=d()},l(l){n.l(l),i=z(l),s&&s.l(l),r=d()},m(l,u){o[e].m(l,u),E(l,i,u),s&&s.m(l,u),E(l,r,u),_=!0},p(l,[u]){let b=e;e=c(l),e===b?o[e].p(l,u):(P(),h(o[b],1,1,()=>{o[b]=null}),L(),n=o[e],n?n.p(l,u):(n=o[e]=t[e](l),n.c()),g(n,1),n.m(i.parentNode,i)),l[5]?s?s.p(l,u):(s=V(l),s.c(),s.m(r.parentNode,r)):s&&(s.d(1),s=null)},i(l){_||(g(n),_=!0)},o(l){h(n),_=!1},d(l){o[e].d(l),l&&w(i),s&&s.d(l),l&&w(r)}}}function ne(a,e,n){let{stores:i}=e,{page:r}=e,{constructors:_}=e,{components:t=[]}=e,{form:o}=e,{data_0:c=null}=e,{data_1:s=null}=e;W(i.page.notify);let l=!1,u=!1,b=null;F(()=>{const f=i.page.subscribe(()=>{l&&(n(6,u=!0),X().then(()=>{n(7,b=document.title||"untitled page")}))});return n(5,l=!0),f});function N(f){A[f?"unshift":"push"](()=>{t[1]=f,n(0,t)})}function S(f){A[f?"unshift":"push"](()=>{t[0]=f,n(0,t)})}function B(f){A[f?"unshift":"push"](()=>{t[0]=f,n(0,t)})}return a.$$set=f=>{"stores"in f&&n(8,i=f.stores),"page"in f&&n(9,r=f.page),"constructors"in f&&n(1,_=f.constructors),"components"in f&&n(0,t=f.components),"form"in f&&n(2,o=f.form),"data_0"in f&&n(3,c=f.data_0),"data_1"in f&&n(4,s=f.data_1)},a.$$.update=()=>{a.$$.dirty&768&&i.page.set(r)},[t,_,o,c,s,l,u,b,i,r,N,S,B]}class oe extends C{constructor(e){super(),q(this,e,ne,te,U,{stores:8,page:9,constructors:1,components:0,form:2,data_0:3,data_1:4})}}const se=[()=>m(()=>import("../nodes/0.3441ed3d.js"),["..\\nodes\\0.3441ed3d.js","..\\chunks\\index.0c2a1aba.js","..\\assets\\0.b1296a57.css"],import.meta.url),()=>m(()=>import("../nodes/1.4317ea52.js"),["..\\nodes\\1.4317ea52.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\singletons.de086457.js","..\\chunks\\index.2d02f203.js"],import.meta.url),()=>m(()=>import("../nodes/2.69a6f0d6.js"),["..\\nodes\\2.69a6f0d6.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\NoReviewFound.b9857e63.js","..\\chunks\\public.6087a87e.js","..\\chunks\\Loader.57958918.js"],import.meta.url),()=>m(()=>import("../nodes/3.7ae97a20.js"),["..\\nodes\\3.7ae97a20.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\NoReviewFound.b9857e63.js","..\\chunks\\public.6087a87e.js","..\\chunks\\Loader.57958918.js"],import.meta.url),()=>m(()=>import("../nodes/4.b323200d.js"),["..\\nodes\\4.b323200d.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\public.6087a87e.js","..\\chunks\\AskToLogin.018b8994.js"],import.meta.url),()=>m(()=>import("../nodes/5.a256461f.js"),["..\\nodes\\5.a256461f.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js"],import.meta.url),()=>m(()=>import("../nodes/6.d8c884f1.js"),["..\\nodes\\6.d8c884f1.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\index.f2ad3899.js"],import.meta.url),()=>m(()=>import("../nodes/7.95888021.js"),["..\\nodes\\7.95888021.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\functionsForLogin.57e3b922.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\public.6087a87e.js","..\\chunks\\index.f2ad3899.js","..\\chunks\\Header.d46f388f.js"],import.meta.url),()=>m(()=>import("../nodes/8.fcb7cf81.js"),["..\\nodes\\8.fcb7cf81.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\index.f2ad3899.js"],import.meta.url),()=>m(()=>import("../nodes/9.3f259771.js"),["..\\nodes\\9.3f259771.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\functionsForLogin.57e3b922.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\public.6087a87e.js","..\\chunks\\index.f2ad3899.js","..\\chunks\\Header.d46f388f.js"],import.meta.url),()=>m(()=>import("../nodes/10.ee217928.js"),["..\\nodes\\10.ee217928.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\qrCode.d9948610.js","..\\chunks\\public.6087a87e.js","..\\chunks\\AskToLogin.018b8994.js"],import.meta.url),()=>m(()=>import("../nodes/11.5412c5e3.js"),["..\\nodes\\11.5412c5e3.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js"],import.meta.url),()=>m(()=>import("../nodes/12.6b8e1338.js"),["..\\nodes\\12.6b8e1338.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\Header.d46f388f.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js"],import.meta.url),()=>m(()=>import("../nodes/13.b12fdf8b.js"),["..\\nodes\\13.b12fdf8b.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js"],import.meta.url),()=>m(()=>import("../nodes/14.3e93413e.js"),["..\\nodes\\14.3e93413e.js","..\\chunks\\index.0c2a1aba.js","..\\chunks\\secondAuth.737b4a35.js","..\\chunks\\index.2d02f203.js","..\\chunks\\qrCode.d9948610.js","..\\chunks\\index.f2ad3899.js","..\\chunks\\public.6087a87e.js","..\\chunks\\Loader.57958918.js","..\\chunks\\Header.d46f388f.js"],import.meta.url)],ae=[],le={"/":[2],"/Onboarding":[5],"/Onboarding/get-secret-key":[6],"/Onboarding/get-secret-key/create-password":[7],"/Onboarding/import-old-wallet":[8],"/Onboarding/import-old-wallet/create-password":[9],"/dashboard":[3],"/feedback":[4],"/profile":[10],"/settings":[11],"/settings/show-secret-key":[12],"/signIn":[13],"/wallet":[14]},_e={handleError:({error:a})=>{console.error(a)}};export{le as dictionary,_e as hooks,re as matchers,se as nodes,oe as root,ae as server_loads};
