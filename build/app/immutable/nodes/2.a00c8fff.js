import{S as M,i as z,s as F,k as b,q as A,l as v,m as h,r as L,h as f,n as p,b as S,D as m,J as Z,H as q,C as ae,E as re,F as ie,G as oe,g as k,d as I,I as X,K as Te,o as ue,j as Pe,L as je,M as he,N as Ee,t as De,w as Ne,v as ke,f as ye,y as O,a as j,z as W,c as D,A as G,u as Ae,B as H,e as $e,O as Le}from"../chunks/index.6d6f7c47.js";import{H as Ce}from"../chunks/Header.0600e04e.js";import{P as Ve}from"../chunks/public.70178949.js";import{j as Re,o as Ue}from"../chunks/store.86bf157a.js";import{w as ne}from"../chunks/index.4eebbfc1.js";const qe=!0,kt=Object.freeze(Object.defineProperty({__proto__:null,prerender:qe},Symbol.toStringTag,{value:"Module"}));function Be(o){let e,t,l,s,n;return{c(){e=b("div"),t=b("button"),l=A("read reviews"),this.h()},l(i){e=v(i,"DIV",{class:!0});var a=h(e);t=v(a,"BUTTON",{class:!0});var r=h(t);l=L(r,"read reviews"),r.forEach(f),a.forEach(f),this.h()},h(){p(t,"class","btn secondary-button"),p(e,"class","grid flex-grow")},m(i,a){S(i,e,a),m(e,t),m(t,l),s||(n=Z(t,"click",o[0]),s=!0)},p:q,i:q,o:q,d(i){i&&f(e),s=!1,n()}}}function Oe(o,e,t){let{urlWithoutProtocol:l}=e;function s(){window.open(`https://testnet.netsepio.com/#/reviews/${l}`,"_blank")}return o.$$set=n=>{"urlWithoutProtocol"in n&&t(1,l=n.urlWithoutProtocol)},[s,l]}class We extends M{constructor(e){super(),z(this,e,Oe,Be,F,{urlWithoutProtocol:1})}}function Ge(o){let e,t,l,s,n;return{c(){e=b("div"),t=b("button"),l=A("Submit Review"),this.h()},l(i){e=v(i,"DIV",{class:!0});var a=h(e);t=v(a,"BUTTON",{class:!0});var r=h(t);l=L(r,"Submit Review"),r.forEach(f),a.forEach(f),this.h()},h(){p(t,"class","btn primary-button"),p(e,"class","grid flex-grow")},m(i,a){S(i,e,a),m(e,t),m(t,l),s||(n=Z(t,"click",o[0]),s=!0)},p:q,i:q,o:q,d(i){i&&f(e),s=!1,n()}}}function He(o,e,t){let{url:l}=e;function s(){window.open(`https://app.netsepio.com/#/my-reviews?siteUrl=${l}`,"_blank")}return o.$$set=n=>{"url"in n&&t(1,l=n.url)},[s,l]}class xe extends M{constructor(e){super(),z(this,e,He,Ge,F,{url:1})}}let Me=1;function Ie(){return`svelte-tabs-${Me++}`}function ze(o){let e,t,l,s;const n=o[4].default,i=ae(n,o,o[3],null);return{c(){e=b("div"),i&&i.c(),this.h()},l(a){e=v(a,"DIV",{class:!0});var r=h(e);i&&i.l(r),r.forEach(f),this.h()},h(){p(e,"class","svelte-tabs")},m(a,r){S(a,e,r),i&&i.m(e,null),t=!0,l||(s=Z(e,"keydown",o[1]),l=!0)},p(a,[r]){i&&i.p&&(!t||r&8)&&re(i,n,a,a[3],t?oe(n,a[3],r,null):ie(a[3]),null)},i(a){t||(k(i,a),t=!0)},o(a){I(i,a),t=!1},d(a){a&&f(e),i&&i.d(a),l=!1,s()}}}const fe={};function Fe(o,e,t){const l=o.indexOf(e);o.splice(l,1),t.update(s=>s===e?o[l]||o[o.length-1]:s)}function Ke(o,e,t){let l,{$$slots:s={},$$scope:n}=e,{initialSelectedIndex:i=0}=e;const a=[],r=[],u=[],c=ne({}),_=ne({}),w=ne(null);X(o,w,d=>t(5,l=d));const y=ne(null);function T(d,$,R){d.push($),R.update(P=>P||$),je(()=>Fe(d,$,R))}function E(d){const $=r.indexOf(d);w.set(d),y.set(u[$])}Te(fe,{registerTab(d){T(r,d,w)},registerTabElement(d){a.push(d)},registerPanel(d){T(u,d,y)},selectTab:E,selectedTab:w,selectedPanel:y,controls:c,labeledBy:_}),ue(()=>{E(r[i])}),Pe(()=>{for(let d=0;d<r.length;d++)c.update($=>({...$,[r[d].id]:u[d].id})),_.update($=>({...$,[u[d].id]:r[d].id}))});async function N(d){if(d.target.classList.contains("svelte-tabs__tab")){let $=r.indexOf(l);switch(d.key){case"ArrowRight":$+=1,$>r.length-1&&($=0),E(r[$]),a[$].focus();break;case"ArrowLeft":$-=1,$<0&&($=r.length-1),E(r[$]),a[$].focus()}}}return o.$$set=d=>{"initialSelectedIndex"in d&&t(2,i=d.initialSelectedIndex),"$$scope"in d&&t(3,n=d.$$scope)},[w,N,i,n,s]}class Je extends M{constructor(e){super(),z(this,e,Ke,ze,F,{initialSelectedIndex:2})}}function Ye(o){let e,t,l,s,n,i;const a=o[9].default,r=ae(a,o,o[8],null);return{c(){e=b("li"),r&&r.c(),this.h()},l(u){e=v(u,"LI",{role:!0,id:!0,"aria-controls":!0,"aria-selected":!0,tabindex:!0,class:!0});var c=h(e);r&&r.l(c),c.forEach(f),this.h()},h(){p(e,"role","tab"),p(e,"id",o[3].id),p(e,"aria-controls",t=o[2][o[3].id]),p(e,"aria-selected",o[1]),p(e,"tabindex",l=o[1]?0:-1),p(e,"class","svelte-tabs__tab svelte-1fbofsd"),he(e,"svelte-tabs__selected",o[1])},m(u,c){S(u,e,c),r&&r.m(e,null),o[10](e),s=!0,n||(i=Z(e,"click",o[11]),n=!0)},p(u,[c]){r&&r.p&&(!s||c&256)&&re(r,a,u,u[8],s?oe(a,u[8],c,null):ie(u[8]),null),(!s||c&4&&t!==(t=u[2][u[3].id]))&&p(e,"aria-controls",t),(!s||c&2)&&p(e,"aria-selected",u[1]),(!s||c&2&&l!==(l=u[1]?0:-1))&&p(e,"tabindex",l),(!s||c&2)&&he(e,"svelte-tabs__selected",u[1])},i(u){s||(k(r,u),s=!0)},o(u){I(r,u),s=!1},d(u){u&&f(e),r&&r.d(u),o[10](null),n=!1,i()}}}function Qe(o,e,t){let l,s,{$$slots:n={},$$scope:i}=e,a;const r={id:Ie()},{registerTab:u,registerTabElement:c,selectTab:_,selectedTab:w,controls:y}=Ee(fe);X(o,w,d=>t(7,l=d)),X(o,y,d=>t(2,s=d));let T;u(r),ue(async()=>{await De(),c(a)});function E(d){Ne[d?"unshift":"push"](()=>{a=d,t(0,a)})}const N=()=>_(r);return o.$$set=d=>{"$$scope"in d&&t(8,i=d.$$scope)},o.$$.update=()=>{o.$$.dirty&128&&t(1,T=l===r)},[a,T,s,r,_,w,y,l,i,n,E,N]}class ge extends M{constructor(e){super(),z(this,e,Qe,Ye,F,{})}}function Xe(o){let e,t;const l=o[1].default,s=ae(l,o,o[0],null);return{c(){e=b("ul"),s&&s.c(),this.h()},l(n){e=v(n,"UL",{role:!0,class:!0});var i=h(e);s&&s.l(i),i.forEach(f),this.h()},h(){p(e,"role","tablist"),p(e,"class","svelte-tabs__tab-list svelte-12yby2a")},m(n,i){S(n,e,i),s&&s.m(e,null),t=!0},p(n,[i]){s&&s.p&&(!t||i&1)&&re(s,l,n,n[0],t?oe(l,n[0],i,null):ie(n[0]),null)},i(n){t||(k(s,n),t=!0)},o(n){I(s,n),t=!1},d(n){n&&f(e),s&&s.d(n)}}}function Ze(o,e,t){let{$$slots:l={},$$scope:s}=e;return o.$$set=n=>{"$$scope"in n&&t(0,s=n.$$scope)},[s,l]}class et extends M{constructor(e){super(),z(this,e,Ze,Xe,F,{})}}function we(o){let e;const t=o[6].default,l=ae(t,o,o[5],null);return{c(){l&&l.c()},l(s){l&&l.l(s)},m(s,n){l&&l.m(s,n),e=!0},p(s,n){l&&l.p&&(!e||n&32)&&re(l,t,s,s[5],e?oe(t,s[5],n,null):ie(s[5]),null)},i(s){e||(k(l,s),e=!0)},o(s){I(l,s),e=!1},d(s){l&&l.d(s)}}}function tt(o){let e,t,l,s=o[1]===o[2]&&we(o);return{c(){e=b("div"),s&&s.c(),this.h()},l(n){e=v(n,"DIV",{id:!0,"aria-labelledby":!0,class:!0,role:!0});var i=h(e);s&&s.l(i),i.forEach(f),this.h()},h(){p(e,"id",o[2].id),p(e,"aria-labelledby",t=o[0][o[2].id]),p(e,"class","svelte-tabs__tab-panel svelte-epfyet"),p(e,"role","tabpanel")},m(n,i){S(n,e,i),s&&s.m(e,null),l=!0},p(n,[i]){n[1]===n[2]?s?(s.p(n,i),i&2&&k(s,1)):(s=we(n),s.c(),k(s,1),s.m(e,null)):s&&(ke(),I(s,1,1,()=>{s=null}),ye()),(!l||i&1&&t!==(t=n[0][n[2].id]))&&p(e,"aria-labelledby",t)},i(n){l||(k(s),l=!0)},o(n){I(s),l=!1},d(n){n&&f(e),s&&s.d()}}}function st(o,e,t){let l,s,{$$slots:n={},$$scope:i}=e;const a={id:Ie()},{registerPanel:r,selectedPanel:u,labeledBy:c}=Ee(fe);return X(o,u,_=>t(1,s=_)),X(o,c,_=>t(0,l=_)),r(a),o.$$set=_=>{"$$scope"in _&&t(5,i=_.$$scope)},[l,s,a,u,c,i,n]}class Se extends M{constructor(e){super(),z(this,e,st,tt,F,{})}}function lt(o){let e;return{c(){e=A("AI summary")},l(t){e=L(t,"AI summary")},m(t,l){S(t,e,l)},d(t){t&&f(e)}}}function nt(o){let e;return{c(){e=A("Reviews")},l(t){e=L(t,"Reviews")},m(t,l){S(t,e,l)},d(t){t&&f(e)}}}function at(o){let e,t,l,s;return e=new ge({props:{$$slots:{default:[lt]},$$scope:{ctx:o}}}),l=new ge({props:{$$slots:{default:[nt]},$$scope:{ctx:o}}}),{c(){O(e.$$.fragment),t=j(),O(l.$$.fragment)},l(n){W(e.$$.fragment,n),t=D(n),W(l.$$.fragment,n)},m(n,i){G(e,n,i),S(n,t,i),G(l,n,i),s=!0},p(n,i){const a={};i&128&&(a.$$scope={dirty:i,ctx:n}),e.$set(a);const r={};i&128&&(r.$$scope={dirty:i,ctx:n}),l.$set(r)},i(n){s||(k(e.$$.fragment,n),k(l.$$.fragment,n),s=!0)},o(n){I(e.$$.fragment,n),I(l.$$.fragment,n),s=!1},d(n){H(e,n),n&&f(t),H(l,n)}}}function rt(o){let e,t,l;return{c(){e=b("div"),t=b("p"),l=A(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla lacinia\r
					vehicula. Phasellus euismod ligula sed justo fringilla, eget lacinia nisi consectetur.\r
					Nunc ac tincidunt justo. Fusce fringilla libero nec justo posuere, vel hendrerit sapien\r
					tincidunt. Suspendisse potenti. Integer tincidunt justo et tellus fermentum, in ultrices\r
					libero varius. Sed vestibulum tincidunt justo, non consequat orci venenatis a. Sed feugiat\r
					elit at justo vehicula, eu ullamcorper ex eleifend. Curabitur dapibus quam vel libero\r
					finibus, id cursus urna varius. ger tincidunt justo et tellus fermentum, in ultrices\r
					libero varius. Sed vestibulum tincidunt justo, non consequat orci venenatis a. Sed feugiat\r
					elit at justo vehicula, eu ullamcorper ex eleifend. Curabitur dapibus quam vel libero\r
					finibus, id cursus urna varius.`),this.h()},l(s){e=v(s,"DIV",{class:!0});var n=h(e);t=v(n,"P",{});var i=h(t);l=L(i,`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla lacinia\r
					vehicula. Phasellus euismod ligula sed justo fringilla, eget lacinia nisi consectetur.\r
					Nunc ac tincidunt justo. Fusce fringilla libero nec justo posuere, vel hendrerit sapien\r
					tincidunt. Suspendisse potenti. Integer tincidunt justo et tellus fermentum, in ultrices\r
					libero varius. Sed vestibulum tincidunt justo, non consequat orci venenatis a. Sed feugiat\r
					elit at justo vehicula, eu ullamcorper ex eleifend. Curabitur dapibus quam vel libero\r
					finibus, id cursus urna varius. ger tincidunt justo et tellus fermentum, in ultrices\r
					libero varius. Sed vestibulum tincidunt justo, non consequat orci venenatis a. Sed feugiat\r
					elit at justo vehicula, eu ullamcorper ex eleifend. Curabitur dapibus quam vel libero\r
					finibus, id cursus urna varius.`),i.forEach(f),n.forEach(f),this.h()},h(){p(e,"class","reviews")},m(s,n){S(s,e,n),m(e,t),m(t,l)},p:q,d(s){s&&f(e)}}}function it(o){let e,t,l,s,n,i,a,r,u,c,_,w,y,T,E,N,d,$,R,P,B,Y,K,V,U,ce,x,ee;return U=new We({props:{urlWithoutProtocol:o[1]}}),x=new xe({props:{url:o[0]}}),{c(){e=b("div"),t=b("div"),l=b("h3"),s=A("Ratings"),n=j(),i=b("span"),a=A("99% safe"),r=j(),u=b("progress"),c=j(),_=b("div"),w=b("h3"),y=A("Reviews"),T=j(),E=b("div"),N=b("div"),d=b("p"),$=A(`“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla\r
							lacinia vehicula”`),R=j(),P=b("div"),B=b("p"),Y=A(`“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla\r
							lacinia vehicula”`),K=j(),V=b("div"),O(U.$$.fragment),ce=j(),O(x.$$.fragment),this.h()},l(g){e=v(g,"DIV",{});var C=h(e);t=v(C,"DIV",{class:!0});var J=h(t);l=v(J,"H3",{class:!0});var Q=h(l);s=L(Q,"Ratings"),Q.forEach(f),n=D(J),i=v(J,"SPAN",{class:!0});var de=h(i);a=L(de,"99% safe"),de.forEach(f),J.forEach(f),r=D(C),u=v(C,"PROGRESS",{class:!0,max:!0}),h(u).forEach(f),C.forEach(f),c=D(g),_=v(g,"DIV",{class:!0});var te=h(_);w=v(te,"H3",{class:!0});var pe=h(w);y=L(pe,"Reviews"),pe.forEach(f),T=D(te),E=v(te,"DIV",{class:!0});var se=h(E);N=v(se,"DIV",{class:!0});var me=h(N);d=v(me,"P",{});var _e=h(d);$=L(_e,`“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla\r
							lacinia vehicula”`),_e.forEach(f),me.forEach(f),R=D(se),P=v(se,"DIV",{class:!0});var be=h(P);B=v(be,"P",{});var ve=h(B);Y=L(ve,`“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla\r
							lacinia vehicula”`),ve.forEach(f),be.forEach(f),se.forEach(f),te.forEach(f),K=D(g),V=v(g,"DIV",{class:!0});var le=h(V);W(U.$$.fragment,le),ce=D(le),W(x.$$.fragment,le),le.forEach(f),this.h()},h(){p(l,"class","text-xl font-bold"),p(i,"class","text-xs"),p(t,"class","flex justify-between items-center mt-2"),p(u,"class","progress bg-white progress-[#263238] dark:bg-slate-800 progress-accent w-full shadow-md dark:shadow-[#11D9C5]/20"),u.value="99",p(u,"max","100"),p(w,"class","text-xl font-bold"),p(N,"class","reviews"),p(P,"class","reviews"),p(E,"class","flex flex-col gap-4"),p(_,"class","my-8"),p(V,"class","grid grid-cols-2 gap-x-2")},m(g,C){S(g,e,C),m(e,t),m(t,l),m(l,s),m(t,n),m(t,i),m(i,a),m(e,r),m(e,u),S(g,c,C),S(g,_,C),m(_,w),m(w,y),m(_,T),m(_,E),m(E,N),m(N,d),m(d,$),m(E,R),m(E,P),m(P,B),m(B,Y),S(g,K,C),S(g,V,C),G(U,V,null),m(V,ce),G(x,V,null),ee=!0},p(g,C){const J={};C&2&&(J.urlWithoutProtocol=g[1]),U.$set(J);const Q={};C&1&&(Q.url=g[0]),x.$set(Q)},i(g){ee||(k(U.$$.fragment,g),k(x.$$.fragment,g),ee=!0)},o(g){I(U.$$.fragment,g),I(x.$$.fragment,g),ee=!1},d(g){g&&f(e),g&&f(c),g&&f(_),g&&f(K),g&&f(V),H(U),H(x)}}}function ot(o){let e,t,l,s,n,i;return e=new et({props:{$$slots:{default:[at]},$$scope:{ctx:o}}}),l=new Se({props:{$$slots:{default:[rt]},$$scope:{ctx:o}}}),n=new Se({props:{$$slots:{default:[it]},$$scope:{ctx:o}}}),{c(){O(e.$$.fragment),t=j(),O(l.$$.fragment),s=j(),O(n.$$.fragment)},l(a){W(e.$$.fragment,a),t=D(a),W(l.$$.fragment,a),s=D(a),W(n.$$.fragment,a)},m(a,r){G(e,a,r),S(a,t,r),G(l,a,r),S(a,s,r),G(n,a,r),i=!0},p(a,r){const u={};r&128&&(u.$$scope={dirty:r,ctx:a}),e.$set(u);const c={};r&128&&(c.$$scope={dirty:r,ctx:a}),l.$set(c);const _={};r&131&&(_.$$scope={dirty:r,ctx:a}),n.$set(_)},i(a){i||(k(e.$$.fragment,a),k(l.$$.fragment,a),k(n.$$.fragment,a),i=!0)},o(a){I(e.$$.fragment,a),I(l.$$.fragment,a),I(n.$$.fragment,a),i=!1},d(a){H(e,a),a&&f(t),H(l,a),a&&f(s),H(n,a)}}}function ut(o){let e,t,l,s,n,i,a,r;return t=new Ce({}),a=new Je({props:{$$slots:{default:[ot]},$$scope:{ctx:o}}}),{c(){e=b("div"),O(t.$$.fragment),l=j(),s=b("h2"),n=A(o[1]),i=j(),O(a.$$.fragment),this.h()},l(u){e=v(u,"DIV",{});var c=h(e);W(t.$$.fragment,c),l=D(c),s=v(c,"H2",{class:!0});var _=h(s);n=L(_,o[1]),_.forEach(f),i=D(c),W(a.$$.fragment,c),c.forEach(f),this.h()},h(){p(s,"class","pb-2 text-center text-black dark:text-white my-6 text-2xl")},m(u,c){S(u,e,c),G(t,e,null),m(e,l),m(e,s),m(s,n),m(e,i),G(a,e,null),r=!0},p(u,[c]){(!r||c&2)&&Ae(n,u[1]);const _={};c&131&&(_.$$scope={dirty:c,ctx:u}),a.$set(_)},i(u){r||(k(t.$$.fragment,u),k(a.$$.fragment,u),r=!0)},o(u){I(t.$$.fragment,u),I(a.$$.fragment,u),r=!1},d(u){u&&f(e),H(t),H(a)}}}function ct(o,e,t){let l,s,n=[];const i=async()=>{var r;try{const[u]=await chrome.tabs.query({active:!0,currentWindow:!0});t(0,s=(r=u.url)==null?void 0:r.toLocaleLowerCase())}catch(u){console.log(u)}finally{}};let a=async()=>{let r="";Re.subscribe(w=>r=w);const u={method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`}};return n=(await(await fetch(`${Ve}/stats?domain=${l}`,u)).json()).payload,n};return ue(async()=>{await i(),await a()}),o.$$.update=()=>{o.$$.dirty&1&&t(1,l=s==null?void 0:s.replace(/^https?:\/\/([^/]+)\/.*/,"$1"))},[s,l]}class ft extends M{constructor(e){super(),z(this,e,ct,ut,F,{})}}function dt(o){let e,t;return e=new ft({}),{c(){O(e.$$.fragment)},l(l){W(e.$$.fragment,l)},m(l,s){G(e,l,s),t=!0},p:q,i(l){t||(k(e.$$.fragment,l),t=!0)},o(l){I(e.$$.fragment,l),t=!1},d(l){H(e,l)}}}function pt(o){let e,t,l,s,n,i,a,r,u,c,_,w,y,T,E,N,d;return{c(){e=b("div"),t=b("div"),l=b("div"),s=b("img"),i=j(),a=b("h1"),r=A("Netsepio"),u=j(),c=b("p"),_=A("AI Crypto Security, Advanced Tech Shields Against Crypto Scams and Rug Pulls"),w=j(),y=b("a"),T=b("button"),E=A("Get Started"),this.h()},l($){e=v($,"DIV",{});var R=h(e);t=v(R,"DIV",{class:!0});var P=h(t);l=v(P,"DIV",{class:!0});var B=h(l);s=v(B,"IMG",{src:!0,alt:!0,class:!0}),i=D(B),a=v(B,"H1",{class:!0});var Y=h(a);r=L(Y,"Netsepio"),Y.forEach(f),B.forEach(f),u=D(P),c=v(P,"P",{class:!0});var K=h(c);_=L(K,"AI Crypto Security, Advanced Tech Shields Against Crypto Scams and Rug Pulls"),K.forEach(f),w=D(P),y=v(P,"A",{href:!0,class:!0});var V=h(y);T=v(V,"BUTTON",{class:!0});var U=h(T);E=L(U,"Get Started"),U.forEach(f),V.forEach(f),P.forEach(f),R.forEach(f),this.h()},h(){Le(s.src,n=_t)||p(s,"src",n),p(s,"alt","NetSepio logo"),p(s,"class","w-3/4 mx-auto block"),p(a,"class","text-3xl font-bold text-center"),p(l,"class","mt-40 mb-8"),p(c,"class","text-sm text-center"),p(T,"class","bg-[#11D9C5] btn btn-wide text-black hover:text-white hover:bg-[#11d9c5]/50"),p(y,"href","/"),p(y,"class","block mt-40"),p(t,"class","homepage")},m($,R){S($,e,R),m(e,t),m(t,l),m(l,s),m(l,i),m(l,a),m(a,r),m(t,u),m(t,c),m(c,_),m(t,w),m(t,y),m(y,T),m(T,E),N||(d=Z(T,"click",o[1]),N=!0)},p:q,i:q,o:q,d($){$&&f(e),N=!1,d()}}}function mt(o){let e,t,l,s;const n=[pt,dt],i=[];function a(r,u){return r[0]<=0?0:1}return e=a(o),t=i[e]=n[e](o),{c(){t.c(),l=$e()},l(r){t.l(r),l=$e()},m(r,u){i[e].m(r,u),S(r,l,u),s=!0},p(r,[u]){let c=e;e=a(r),e===c?i[e].p(r,u):(ke(),I(i[c],1,1,()=>{i[c]=null}),ye(),t=i[e],t?t.p(r,u):(t=i[e]=n[e](r),t.c()),k(t,1),t.m(l.parentNode,l))},i(r){s||(k(t),s=!0)},o(r){I(t),s=!1},d(r){i[e].d(r),r&&f(l)}}}let _t="/vector-logo.png",bt=0;function vt(){typeof localStorage<"u"?localStorage.setItem("newUser",String(bt+1)):console.warn("localStorage is not available in this environment.")}function ht(o,e,t){let l;return ue(()=>{t(0,l=Number(localStorage.getItem("newUser")))}),[l,()=>{Ue.set(3),vt()}]}class yt extends M{constructor(e){super(),z(this,e,ht,mt,F,{})}}export{yt as component,kt as universal};
