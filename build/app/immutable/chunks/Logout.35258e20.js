import{S as W,i as z,s as C,k as h,q as T,a as D,l as m,m as b,r as y,h as i,c as R,n as u,K as J,b as V,D as r,Q as M,J as w,H as S,L as K}from"./index.f3b06f47.js";import{m as Q,s as j,w as F,o as G,d as X}from"./store.26750aee.js";function Y(d){let t,e,l;return{c(){t=h("div"),e=h("button"),l=T("Reset"),this.h()},l(o){t=m(o,"DIV",{class:!0});var a=b(t);e=m(a,"BUTTON",{class:!0});var s=b(e);l=y(s,"Reset"),s.forEach(i),a.forEach(i),this.h()},h(){u(e,"class","btn"),e.disabled=!0,u(t,"class","modal-action")},m(o,a){V(o,t,a),r(t,e),r(e,l)},p:S,d(o){o&&i(t)}}}function Z(d){let t,e,l,o,a,s;return{c(){t=h("div"),e=h("a"),l=h("button"),o=T("Reset"),this.h()},l(n){t=m(n,"DIV",{class:!0});var v=b(t);e=m(v,"A",{href:!0});var k=b(e);l=m(k,"BUTTON",{class:!0});var g=b(l);o=y(g,"Reset"),g.forEach(i),k.forEach(i),v.forEach(i),this.h()},h(){u(l,"class","btn"),u(e,"href","/"),u(t,"class","modal-action")},m(n,v){V(n,t,v),r(t,e),r(e,l),r(l,o),a||(s=w(l,"click",d[3]),a=!0)},p:S,d(n){n&&i(t),a=!1,s()}}}function $(d){let t,e,l,o,a,s,n,v,k,g,x,L,f,N,U,B;function O(c,_){return c[1]?Z:Y}let I=O(d),p=I(d);return{c(){t=h("div"),e=h("button"),l=T("Reset Wallet"),o=D(),a=h("div"),s=h("div"),n=h("button"),v=T("✕"),k=D(),g=h("p"),x=T("Enter 'reset'"),L=D(),f=h("input"),N=D(),p.c(),this.h()},l(c){t=m(c,"DIV",{});var _=b(t);e=m(_,"BUTTON",{class:!0});var P=b(e);l=y(P,"Reset Wallet"),P.forEach(i),o=R(_),a=m(_,"DIV",{class:!0});var q=b(a);s=m(q,"DIV",{class:!0});var E=b(s);n=m(E,"BUTTON",{class:!0});var A=b(n);v=y(A,"✕"),A.forEach(i),k=R(E),g=m(E,"P",{class:!0});var H=b(g);x=y(H,"Enter 'reset'"),H.forEach(i),L=R(E),f=m(E,"INPUT",{type:!0,placeholder:!0,class:!0}),N=R(E),p.l(E),E.forEach(i),q.forEach(i),_.forEach(i),this.h()},h(){u(e,"class","block rounded-lg shadow-lg bg-red-500 dark:bg-red-500 text-white p-2 w-full h-auto hover:bg-slate-600 active:bg-slate-500 text-xl text-center"),u(n,"class","btn btn-sm btn-circle absolute right-2 top-2"),u(g,"class","text-md mt-5 mb-3 text-center"),u(f,"type","text"),u(f,"placeholder","reset"),u(f,"class","input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"),u(s,"class","modal-box dark:bg-gray-900 dark:text-white"),u(a,"class","modal modal-bottom sm:modal-middle"),J(a,"modal-open",d[0])},m(c,_){V(c,t,_),r(t,e),r(e,l),r(t,o),r(t,a),r(a,s),r(s,n),r(n,v),r(s,k),r(s,g),r(g,x),r(s,L),r(s,f),M(f,d[2]),r(s,N),p.m(s,null),U||(B=[w(e,"click",d[4]),w(n,"click",d[5]),w(f,"input",d[6]),w(f,"change",d[7])],U=!0)},p(c,[_]){_&4&&f.value!==c[2]&&M(f,c[2]),I===(I=O(c))&&p?p.p(c,_):(p.d(1),p=I(c),p&&(p.c(),p.m(s,null))),_&1&&J(a,"modal-open",c[0])},i:S,o:S,d(c){c&&i(t),p.d(),U=!1,K(B)}}}function ee(d,t,e){let l=!1,o=!1,a="";const s=async()=>{await Q.remove(),j(""),F.set(""),G.set(3),localStorage.removeItem("encryptedMnemonic"),localStorage.removeItem("iv"),localStorage.removeItem("mnemonicHash"),X.set(""),e(0,l=!1)},n=()=>e(0,l=!0),v=()=>{e(0,l=!1)};function k(){a=this.value,e(2,a)}return[l,o,a,s,n,v,k,()=>{a=="reset"&&e(1,o=!0)}]}class se extends W{constructor(t){super(),z(this,t,ee,$,C,{})}}export{se as L};