import{S as Ie,i as we,s as He,k as d,q as I,a as k,y as Pe,l as u,m as p,r as w,h as f,c as D,z as Ve,n as y,K as be,b as C,D as s,A as Te,u as K,g as Ae,d as Se,B as $e,I as Le,o as Ne}from"../chunks/index.f3b06f47.js";import{p as qe}from"../chunks/stores.fcb3ce1c.js";import{w as ze}from"../chunks/store.26750aee.js";import{P as Be,N as Ge}from"../chunks/index.ec3c65db.js";import{L as Re}from"../chunks/Loader.d36557e7.js";function Ee(n){var h,c;let e,l=((h=n[0])==null?void 0:h.sender.substring(0,6))+"......"+((c=n[0])==null?void 0:c.sender.slice(-4)),o;return{c(){e=d("p"),o=I(l)},l(a){e=u(a,"P",{});var r=p(e);o=w(r,l),r.forEach(f)},m(a,r){C(a,e,r),s(e,o)},p(a,r){var t,m;r&1&&l!==(l=((t=a[0])==null?void 0:t.sender.substring(0,6))+"......"+((m=a[0])==null?void 0:m.sender.slice(-4)))&&K(o,l)},d(a){a&&f(e)}}}function ye(n){var h,c;let e,l=((h=n[0])==null?void 0:h.hash.substring(0,8))+"......"+((c=n[0])==null?void 0:c.hash.slice(-4)),o;return{c(){e=d("p"),o=I(l)},l(a){e=u(a,"P",{});var r=p(e);o=w(r,l),r.forEach(f)},m(a,r){C(a,e,r),s(e,o)},p(a,r){var t,m;r&1&&l!==(l=((t=a[0])==null?void 0:t.hash.substring(0,8))+"......"+((m=a[0])==null?void 0:m.hash.slice(-4)))&&K(o,l)},d(a){a&&f(e)}}}function ke(n){var h;let e,l=parseInt((h=n[0])==null?void 0:h.payload.arguments[1])/1e5+"",o;return{c(){e=d("p"),o=I(l)},l(c){e=u(c,"P",{});var a=p(e);o=w(a,l),a.forEach(f)},m(c,a){C(c,e,a),s(e,o)},p(c,a){var r;a&1&&l!==(l=parseInt((r=c[0])==null?void 0:r.payload.arguments[1])/1e5+"")&&K(o,l)},d(c){c&&f(e)}}}function De(n){var h,c;let e,l=((h=n[0])==null?void 0:h.payload.arguments[0].substring(0,8))+"......"+((c=n[0])==null?void 0:c.payload.arguments[0].slice(-4)),o;return{c(){e=d("p"),o=I(l)},l(a){e=u(a,"P",{});var r=p(e);o=w(r,l),r.forEach(f)},m(a,r){C(a,e,r),s(e,o)},p(a,r){var t,m;r&1&&l!==(l=((t=a[0])==null?void 0:t.payload.arguments[0].substring(0,8))+"......"+((m=a[0])==null?void 0:m.payload.arguments[0].slice(-4)))&&K(o,l)},d(a){a&&f(e)}}}function je(n){let e,l,o,h,c,a,r,t,m,L,W,X,Y,P,N,Z,x,ee,A,q,ae,se,R,j=n[0].gas_unit_price+"",M,le,V,z,te,re,ne,T,B,oe,ie,ce,S,$,G,v=n[0].sender&&Ee(n),g=n[0].hash&&ye(n),b=n[0].payload&&n[0].payload.arguments&&ke(n),E=n[0].payload&&n[0].payload.arguments&&De(n);return $=new Re({}),{c(){e=d("div"),l=d("a"),o=I("back"),h=k(),c=d("h3"),a=I("Transaction Details"),r=k(),t=d("div"),m=d("div"),L=d("h3"),W=I("Sender:"),X=k(),v&&v.c(),Y=k(),P=d("div"),N=d("h3"),Z=I("Hash:"),x=k(),g&&g.c(),ee=k(),A=d("div"),q=d("h3"),ae=I("Gas:"),se=k(),R=d("p"),M=I(j),le=k(),V=d("div"),z=d("h3"),te=I("Amount:"),re=k(),b&&b.c(),ne=k(),T=d("div"),B=d("h3"),oe=I("Receiver:"),ie=k(),E&&E.c(),ce=k(),S=d("div"),Pe($.$$.fragment),this.h()},l(i){e=u(i,"DIV",{class:!0});var _=p(e);l=u(_,"A",{href:!0,class:!0});var fe=p(l);o=w(fe,"back"),fe.forEach(f),h=D(_),c=u(_,"H3",{class:!0});var de=p(c);a=w(de,"Transaction Details"),de.forEach(f),r=D(_),t=u(_,"DIV",{class:!0});var H=p(t);m=u(H,"DIV",{class:!0});var F=p(m);L=u(F,"H3",{class:!0});var ue=p(L);W=w(ue,"Sender:"),ue.forEach(f),X=D(F),v&&v.l(F),F.forEach(f),Y=D(H),P=u(H,"DIV",{class:!0});var J=p(P);N=u(J,"H3",{class:!0});var pe=p(N);Z=w(pe,"Hash:"),pe.forEach(f),x=D(J),g&&g.l(J),J.forEach(f),ee=D(H),A=u(H,"DIV",{class:!0});var O=p(A);q=u(O,"H3",{class:!0});var he=p(q);ae=w(he,"Gas:"),he.forEach(f),se=D(O),R=u(O,"P",{});var me=p(R);M=w(me,j),me.forEach(f),O.forEach(f),le=D(H),V=u(H,"DIV",{class:!0});var Q=p(V);z=u(Q,"H3",{class:!0});var _e=p(z);te=w(_e,"Amount:"),_e.forEach(f),re=D(Q),b&&b.l(Q),Q.forEach(f),ne=D(H),T=u(H,"DIV",{class:!0});var U=p(T);B=u(U,"H3",{class:!0});var ve=p(B);oe=w(ve,"Receiver:"),ve.forEach(f),ie=D(U),E&&E.l(U),U.forEach(f),H.forEach(f),ce=D(_),S=u(_,"DIV",{class:!0});var ge=p(S);Ve($.$$.fragment,ge),ge.forEach(f),_.forEach(f),this.h()},h(){y(l,"href","/wallet"),y(l,"class","text-gray-900 dark:text-white no-underline"),y(c,"class","text-center font-bold"),y(L,"class","basis-1/4"),y(m,"class","flex gap-4"),y(N,"class","basis-1/4"),y(P,"class","flex gap-4"),y(q,"class","basis-1/4"),y(A,"class","flex gap-4"),y(z,"class","basis-1/4"),y(V,"class","flex gap-4"),y(B,"class","basis-1/4"),y(T,"class","flex gap-4"),y(t,"class","p-4 my-8 border border-white rounded-lg"),y(S,"class","modal h-screen z-10 absolute top-0 flex justify-center items-center"),be(S,"modal-open",n[1]),y(e,"class","p-8")},m(i,_){C(i,e,_),s(e,l),s(l,o),s(e,h),s(e,c),s(c,a),s(e,r),s(e,t),s(t,m),s(m,L),s(L,W),s(m,X),v&&v.m(m,null),s(t,Y),s(t,P),s(P,N),s(N,Z),s(P,x),g&&g.m(P,null),s(t,ee),s(t,A),s(A,q),s(q,ae),s(A,se),s(A,R),s(R,M),s(t,le),s(t,V),s(V,z),s(z,te),s(V,re),b&&b.m(V,null),s(t,ne),s(t,T),s(T,B),s(B,oe),s(T,ie),E&&E.m(T,null),s(e,ce),s(e,S),Te($,S,null),G=!0},p(i,[_]){i[0].sender?v?v.p(i,_):(v=Ee(i),v.c(),v.m(m,null)):v&&(v.d(1),v=null),i[0].hash?g?g.p(i,_):(g=ye(i),g.c(),g.m(P,null)):g&&(g.d(1),g=null),(!G||_&1)&&j!==(j=i[0].gas_unit_price+"")&&K(M,j),i[0].payload&&i[0].payload.arguments?b?b.p(i,_):(b=ke(i),b.c(),b.m(V,null)):b&&(b.d(1),b=null),i[0].payload&&i[0].payload.arguments?E?E.p(i,_):(E=De(i),E.c(),E.m(T,null)):E&&(E.d(1),E=null),(!G||_&2)&&be(S,"modal-open",i[1])},i(i){G||(Ae($.$$.fragment,i),G=!0)},o(i){Se($.$$.fragment,i),G=!1},d(i){i&&f(e),v&&v.d(),g&&g.d(),b&&b.d(),E&&E.d(),$e($)}}}function Ce(n,e,l){let o;Le(n,qe,t=>l(3,o=t));let h=[],{params:c}=o,a=!1;ze.subscribe(t=>t);const r=async()=>{l(1,a=!0);try{const t=new Be(Ge.TESTNET);l(0,h=await t.getTransactionByHash(c.hash))}catch{}finally{l(1,a=!1)}};return Ne(()=>{r()}),[h,a]}class Qe extends Ie{constructor(e){super(),we(this,e,Ce,je,He,{})}}export{Qe as component};
