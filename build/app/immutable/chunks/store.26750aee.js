import{w as t}from"./index.3a682f2f.js";const l=!0,u=l;var P=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function L(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function g(e){if(e.__esModule)return e;var r=e.default;if(typeof r=="function"){var o=function s(){return this instanceof s?Reflect.construct(r,arguments,this.constructor):r.apply(this,arguments)};o.prototype=r.prototype}else o={};return Object.defineProperty(o,"__esModule",{value:!0}),Object.keys(e).forEach(function(s){var c=Object.getOwnPropertyDescriptor(e,s);Object.defineProperty(o,s,c.get?c:{enumerable:!0,get:function(){return e[s]}})}),o}function T(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}const m={},b=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"})),M=g(b),f=t(localStorage.getItem("walletAddress")||"");f.subscribe(e=>localStorage.setItem("walletAddress",e));const d=t(sessionStorage.getItem("privateKey")||""),p=t(sessionStorage.getItem("publicKey")||"");d.subscribe(e=>sessionStorage.setItem("privateKey",e));p.subscribe(e=>sessionStorage.setItem("publicKey",e));async function S(e){try{return u&&sessionStorage.setItem("mnemonicPhrase",e),!0}catch{return!1}}async function y(){try{return sessionStorage.getItem("mnemonicPhrase")}catch{return}}async function w(){try{return sessionStorage.removeItem("mnemonicPhrase"),!0}catch{return!1}}const $={get:y,set:S,remove:w},i=t(localStorage.getItem("jwtToken")||"");i.subscribe(e=>localStorage.setItem("jwtToken",e));const q=e=>{localStorage.setItem("jwtToken",`${e}`),i.set(e)},n=t(Number(localStorage.getItem("onboardingStepsLeft"))||4);n.subscribe(e=>localStorage.setItem("onboardingStepsLeft",e));const I=e=>{localStorage.setItem("onboardingStepsLeft",`${e}`),n.set(e)},h=()=>{n.update(e=>(localStorage.setItem("onboardingStepsLeft",`${e-1}`),e-1))},v=()=>{n.update(e=>(localStorage.setItem("onboardingStepsLeft",e+1),e+1))},E={subscribe:n.subscribe,set:I,decrease:h,increase:v},j=t(localStorage.getItem("iv")||"");j.subscribe(e=>localStorage.setItem("iv",e));const a=t(localStorage.getItem("avatar")||"");a.subscribe(e=>localStorage.setItem("avatar",e));const _=e=>{localStorage.setItem("avatar",`${e}`),a.set(e)},K={set:_,subscribe:a.subscribe};export{g as a,p as b,P as c,K as d,T as e,L as g,i as j,$ as m,E as o,d as p,M as r,q as s,f as w};