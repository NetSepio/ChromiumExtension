import{S as re,i as le,s as ae,k as x,y as oe,a as D,O as g,l as L,m as i,z as se,c as P,P as C,h as s,n as e,b as q,A as ne,D as r,g as ie,d as de,B as ue,q as O,r as A,K as j,u as te,L as Y,M as ee,N as fe}from"../chunks/index.89e71670.js";import{H as ce,a as he}from"../chunks/Header.cf7b0240.js";import{m as pe}from"../chunks/store.b194c171.js";const me=v=>{const t="mnemonic.txt",a=new Blob([v],{type:"text/plain"}),u=window.URL.createObjectURL(a),f=document.createElement("a");f.href=u,f.download=t,f.click(),window.URL.revokeObjectURL(u)};function _e(v){let t,a,u,f,p,h,l,c,_,b,E;return{c(){t=x("div"),a=x("h1"),u=O("Show Seed Phrase"),f=D(),p=x("div"),h=O(v[2]),l=D(),c=x("button"),_=O("Export mnemonic"),this.h()},l(m){t=L(m,"DIV",{class:!0});var o=i(t);a=L(o,"H1",{class:!0});var n=i(a);u=A(n,"Show Seed Phrase"),n.forEach(s),f=P(o),p=L(o,"DIV",{class:!0});var d=i(p);h=A(d,v[2]),d.forEach(s),l=P(o),c=L(o,"BUTTON",{class:!0});var B=i(c);_=A(B,"Export mnemonic"),B.forEach(s),o.forEach(s),this.h()},h(){e(a,"class","text-2xl text-center font-bold text-black dark:text-white"),e(p,"class","p-2 overflow-hidden text-sm border border-[#11D9C5] rounded-full my-5 mx-4 font-semibold"),e(c,"class","btn primary-button"),e(t,"class","mt-28")},m(m,o){q(m,t,o),r(t,a),r(a,u),r(t,f),r(t,p),r(p,h),r(t,l),r(t,c),r(c,_),b||(E=j(c,"click",v[4]),b=!0)},p(m,o){o&4&&te(h,m[2])},d(m){m&&s(t),b=!1,E()}}}function ve(v){let t,a,u,f,p,h,l,c,_,b,E,m,o,n,d,B,M,T,Z,S,R=(v[1].length>1?v[1]:"Enter Password")+"",F,H,y,N,I,V,$,K;return{c(){t=x("div"),a=g("svg"),u=g("path"),f=g("g"),p=g("path"),h=g("defs"),l=g("filter"),c=g("feFlood"),_=g("feColorMatrix"),b=g("feOffset"),E=g("feGaussianBlur"),m=g("feComposite"),o=g("feColorMatrix"),n=g("feBlend"),d=g("feBlend"),B=D(),M=x("h1"),T=O("Seed Phrase"),Z=D(),S=x("label"),F=O(R),H=D(),y=x("input"),N=D(),I=x("button"),V=O("Unlock"),this.h()},l(k){t=L(k,"DIV",{});var w=i(t);a=C(w,"svg",{width:!0,height:!0,viewBox:!0,fill:!0,xmlns:!0,class:!0});var G=i(a);u=C(G,"path",{d:!0}),i(u).forEach(s),f=C(G,"g",{filter:!0});var z=i(f);p=C(z,"path",{d:!0}),i(p).forEach(s),z.forEach(s),h=C(G,"defs",{});var J=i(h);l=C(J,"filter",{id:!0,x:!0,y:!0,width:!0,height:!0,filterUnits:!0,"color-interpolation-filters":!0});var U=i(l);c=C(U,"feFlood",{"flood-opacity":!0,result:!0}),i(c).forEach(s),_=C(U,"feColorMatrix",{in:!0,type:!0,values:!0,result:!0}),i(_).forEach(s),b=C(U,"feOffset",{dy:!0}),i(b).forEach(s),E=C(U,"feGaussianBlur",{stdDeviation:!0}),i(E).forEach(s),m=C(U,"feComposite",{in2:!0,operator:!0}),i(m).forEach(s),o=C(U,"feColorMatrix",{type:!0,values:!0}),i(o).forEach(s),n=C(U,"feBlend",{mode:!0,in2:!0,result:!0}),i(n).forEach(s),d=C(U,"feBlend",{mode:!0,in:!0,in2:!0,result:!0}),i(d).forEach(s),U.forEach(s),J.forEach(s),G.forEach(s),B=P(w),M=L(w,"H1",{class:!0});var Q=i(M);T=A(Q,"Seed Phrase"),Q.forEach(s),Z=P(w),S=L(w,"LABEL",{for:!0,class:!0});var W=i(S);F=A(W,R),W.forEach(s),H=P(w),y=L(w,"INPUT",{name:!0,type:!0,class:!0}),N=P(w),I=L(w,"BUTTON",{class:!0});var X=i(I);V=A(X,"Unlock"),X.forEach(s),w.forEach(s),this.h()},h(){e(u,"d","M44.8252 29.875L42.91 37.5427C45.0773 38.0819 51.7647 40.2877 52.8466 35.9462C53.974 31.4261 46.989 30.4177 44.8252 29.875ZM41.9472 41.4151L39.8359 49.8706C42.4374 50.5183 50.4692 53.0952 51.6561 48.3266C52.8991 43.3478 44.5521 42.0628 41.9472 41.4151Z"),e(p,"d","M53.466 7.04704C34.7099 2.37287 15.7226 13.7869 11.0484 32.5431C6.37079 51.2923 17.7848 70.2865 36.527 74.9642C55.2832 79.6383 74.2809 68.2278 78.9516 49.4716C83.6292 30.719 72.2152 11.7247 53.466 7.04704ZM60.437 36.0198C59.9293 39.43 58.0351 41.0791 55.5283 41.6603C58.977 43.453 60.7276 46.205 59.061 50.9771C56.9883 56.8978 52.0655 57.3984 45.5112 56.159L43.9216 62.5313L40.0843 61.5754L41.6493 55.2942C40.6255 55.0384 39.6042 54.7723 38.5857 54.4959L37.0137 60.8121L33.1798 59.8493L34.7694 53.4665C33.8696 53.2355 32.9592 52.9904 32.0314 52.7593L27.0281 51.5163L28.9398 47.1188C28.9398 47.1188 31.7688 47.8715 31.7303 47.8155C32.8192 48.0851 33.2989 47.3779 33.4879 46.9017L36.0053 36.8356L36.408 36.9372C36.2781 36.8848 36.1447 36.8415 36.0088 36.8076L37.8015 29.6196C37.847 28.8003 37.5704 27.7709 36.0123 27.3823C36.0753 27.3438 33.2218 26.689 33.2218 26.689L34.2407 22.5856L39.5416 23.909L39.5381 23.9265C40.3329 24.1261 41.1521 24.3152 41.9889 24.5042L43.561 18.195L47.4019 19.1508L45.8613 25.334C46.8907 25.5686 47.9306 25.8067 48.9389 26.0588L50.4725 19.9141L54.3133 20.8699L52.7413 27.1792C57.587 28.8563 61.1302 31.3632 60.437 36.0198Z"),e(f,"filter","url(#filter0_d_6870_4111)"),e(c,"flood-opacity","0"),e(c,"result","BackgroundImageFix"),e(_,"in","SourceAlpha"),e(_,"type","matrix"),e(_,"values","0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"),e(_,"result","hardAlpha"),e(b,"dy","4"),e(E,"stdDeviation","5"),e(m,"in2","hardAlpha"),e(m,"operator","out"),e(o,"type","matrix"),e(o,"values","0 0 0 0 0.0666667 0 0 0 0 0.85098 0 0 0 0 0.772549 0 0 0 0.1 0"),e(n,"mode","normal"),e(n,"in2","BackgroundImageFix"),e(n,"result","effect1_dropShadow_6870_4111"),e(d,"mode","normal"),e(d,"in","SourceGraphic"),e(d,"in2","effect1_dropShadow_6870_4111"),e(d,"result","shape"),e(l,"id","filter0_d_6870_4111"),e(l,"x","0"),e(l,"y","0"),e(l,"width","90"),e(l,"height","90.0117"),e(l,"filterUnits","userSpaceOnUse"),e(l,"color-interpolation-filters","sRGB"),e(a,"width","90"),e(a,"height","91"),e(a,"viewBox","0 0 90 91"),e(a,"fill","none"),e(a,"xmlns","http://www.w3.org/2000/svg"),e(a,"class","block mx-auto my-8 fill-[#263238] dark:fill-[#11D9C5] drop-shadow-lg dark:drop-shadow-none"),e(M,"class","text-2xl text-center font-bold text-black dark:text-white"),e(S,"for","password"),e(S,"class","text-md my-6 block dark:text-white"),Y(S,"text-red-500",v[1].length>1),e(y,"name","password"),e(y,"type","password"),e(y,"class","bg-transparent border-b border-b-black dark:border-b-[#11D9C5] outline-none rounded-none w-full text-black dark:text-white"),e(I,"class","btn primary-button mt-8")},m(k,w){q(k,t,w),r(t,a),r(a,u),r(a,f),r(f,p),r(a,h),r(h,l),r(l,c),r(l,_),r(l,b),r(l,E),r(l,m),r(l,o),r(l,n),r(l,d),r(t,B),r(t,M),r(M,T),r(t,Z),r(t,S),r(S,F),r(t,H),r(t,y),ee(y,v[0]),r(t,N),r(t,I),r(I,V),$||(K=[j(y,"input",v[6]),j(I,"click",v[5])],$=!0)},p(k,w){w&2&&R!==(R=(k[1].length>1?k[1]:"Enter Password")+"")&&te(F,R),w&2&&Y(S,"text-red-500",k[1].length>1),w&1&&y.value!==k[0]&&ee(y,k[0])},d(k){k&&s(t),$=!1,fe(K)}}}function we(v){let t,a,u,f,p,h,l,c,_,b;a=new ce({});function E(n,d){return n[3]?_e:ve}let m=E(v),o=m(v);return{c(){t=x("div"),oe(a.$$.fragment),u=D(),f=x("br"),p=D(),h=x("a"),l=g("svg"),c=g("path"),_=D(),o.c(),this.h()},l(n){t=L(n,"DIV",{});var d=i(t);se(a.$$.fragment,d),u=P(d),f=L(d,"BR",{}),p=P(d),h=L(d,"A",{href:!0});var B=i(h);l=C(B,"svg",{width:!0,height:!0,viewBox:!0,fill:!0,xmlns:!0,class:!0});var M=i(l);c=C(M,"path",{d:!0}),i(c).forEach(s),M.forEach(s),B.forEach(s),_=P(d),o.l(d),d.forEach(s),this.h()},h(){e(c,"d","M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"),e(l,"width","24"),e(l,"height","24"),e(l,"viewBox","0 0 24 24"),e(l,"fill","none"),e(l,"xmlns","http://www.w3.org/2000/svg"),e(l,"class","fill-[#263238] dark:fill-[#11D9C5]"),e(h,"href","/settings")},m(n,d){q(n,t,d),ne(a,t,null),r(t,u),r(t,f),r(t,p),r(t,h),r(h,l),r(l,c),r(t,_),o.m(t,null),b=!0},p(n,[d]){m===(m=E(n))&&o?o.p(n,d):(o.d(1),o=m(n),o&&(o.c(),o.m(t,null)))},i(n){b||(ie(a.$$.fragment,n),b=!0)},o(n){de(a.$$.fragment,n),b=!1},d(n){n&&s(t),ue(a),o.d()}}}function ge(v,t,a){let u="",f="",p="",h=!1;const l=()=>{me(p)},c=async()=>{u.length>=6?(a(3,h=he(u)),h?a(2,p=await pe.get()):a(1,f="Invalid password")):a(1,f="Invalid password")};function _(){u=this.value,a(0,u)}return[u,f,p,h,l,c,_]}class Le extends re{constructor(t){super(),le(this,t,ge,we,ae,{})}}export{Le as component};