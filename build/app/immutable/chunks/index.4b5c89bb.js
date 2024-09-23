import{p as cs,s as Me,w as ls,H as us,n as lt,u as ds,e as ut,t as hs,b as _s,o as fs,d as ys,f as gs,h as ps,i as vs,j as ws,k as mt,l as bt,m as he,q as ms,v as Tt,x as bs}from"./index.browser.2780c866.js";function Ut(n){if(typeof n!="string")throw new TypeError(`Invalid mnemonic type: ${typeof n}`);return n.normalize("NFKD")}function Ts(n){const e=Ut(n),t=e.split(" ");if(![12,15,18,21,24].includes(t.length))throw new Error("Invalid mnemonic");return{nfkd:e,words:t}}const Us=n=>Ut(`mnemonic${n}`);function As(n,e=""){return cs(Me,Ts(n).nfkd,Us(e),{c:2048,dkLen:64})}const[At,St,Bt]=[[],[],[]],Ss=BigInt(0),J=BigInt(1),Bs=BigInt(2),Es=BigInt(7),zs=BigInt(256),Is=BigInt(113);for(let n=0,e=J,t=1,s=0;n<24;n++){[t,s]=[s,(2*t+3*s)%5],At.push(2*(5*s+t)),St.push((n+1)*(n+2)/2%64);let i=Ss;for(let r=0;r<7;r++)e=(e<<J^(e>>Es)*Is)%zs,e&Bs&&(i^=J<<(J<<BigInt(r))-J);Bt.push(i)}const[ks,$s]=ys(Bt,!0),dt=(n,e,t)=>t>32?gs(n,e,t):ps(n,e,t),ht=(n,e,t)=>t>32?vs(n,e,t):ws(n,e,t);function xs(n,e=24){const t=new Uint32Array(10);for(let s=24-e;s<24;s++){for(let o=0;o<10;o++)t[o]=n[o]^n[o+10]^n[o+20]^n[o+30]^n[o+40];for(let o=0;o<10;o+=2){const a=(o+8)%10,c=(o+2)%10,l=t[c],d=t[c+1],m=dt(l,d,1)^t[a],b=ht(l,d,1)^t[a+1];for(let v=0;v<50;v+=10)n[o+v]^=m,n[o+v+1]^=b}let i=n[2],r=n[3];for(let o=0;o<24;o++){const a=St[o],c=dt(i,r,a),l=ht(i,r,a),d=At[o];i=n[d],r=n[d+1],n[d]=c,n[d+1]=l}for(let o=0;o<50;o+=10){for(let a=0;a<10;a++)t[a]=n[o+a];for(let a=0;a<10;a++)n[o+a]^=~t[(a+2)%10]&t[(a+4)%10]}n[0]^=ks[s],n[1]^=$s[s]}t.fill(0)}class qe extends us{constructor(e,t,s,i=!1,r=24){if(super(),this.blockLen=e,this.suffix=t,this.outputLen=s,this.enableXOF=i,this.rounds=r,this.pos=0,this.posOut=0,this.finished=!1,this.destroyed=!1,lt(s),0>=this.blockLen||this.blockLen>=200)throw new Error("Sha3 supports only keccak-f1600 function");this.state=new Uint8Array(200),this.state32=ds(this.state)}keccak(){xs(this.state32,this.rounds),this.posOut=0,this.pos=0}update(e){ut(this);const{blockLen:t,state:s}=this;e=hs(e);const i=e.length;for(let r=0;r<i;){const o=Math.min(t-this.pos,i-r);for(let a=0;a<o;a++)s[this.pos++]^=e[r++];this.pos===t&&this.keccak()}return this}finish(){if(this.finished)return;this.finished=!0;const{state:e,suffix:t,pos:s,blockLen:i}=this;e[s]^=t,t&128&&s===i-1&&this.keccak(),e[i-1]^=128,this.keccak()}writeInto(e){ut(this,!1),_s(e),this.finish();const t=this.state,{blockLen:s}=this;for(let i=0,r=e.length;i<r;){this.posOut>=s&&this.keccak();const o=Math.min(s-this.posOut,r-i);e.set(t.subarray(this.posOut,this.posOut+o),i),this.posOut+=o,i+=o}return e}xofInto(e){if(!this.enableXOF)throw new Error("XOF is not possible for this instance");return this.writeInto(e)}xof(e){return lt(e),this.xofInto(new Uint8Array(e))}digestInto(e){if(fs(e,this),this.finished)throw new Error("digest() was already called");return this.writeInto(e),this.destroy(),e}digest(){return this.digestInto(new Uint8Array(this.outputLen))}destroy(){this.destroyed=!0,this.state.fill(0)}_cloneInto(e){const{blockLen:t,suffix:s,outputLen:i,rounds:r,enableXOF:o}=this;return e||(e=new qe(t,s,i,o,r)),e.state32.set(this.state32),e.pos=this.pos,e.posOut=this.posOut,e.finished=this.finished,e.rounds=r,e.suffix=s,e.outputLen=i,e.enableXOF=o,e.destroyed=this.destroyed,e}}const Cs=(n,e,t)=>ls(()=>new qe(e,n,t)),G=Cs(6,136,256/8);var Et=Object.defineProperty,Ps=Object.getOwnPropertyDescriptor,me=(n,e)=>{for(var t in e)Et(n,t,{get:e[t],enumerable:!0})},h=(n,e,t,s)=>{for(var i=s>1?void 0:s?Ps(e,t):e,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&Et(e,t,i),i},Ns=/^m(\/[0-9]+')+$/,zt=n=>n.replace("'",""),Os="ed25519 seed",Ms=2147483648,qs=n=>{const t=Tt.create(Me,Os).update(bt(n)).digest(),s=t.slice(0,32),i=t.slice(32);return{key:s,chainCode:i}},Ds=({key:n,chainCode:e},t)=>{const s=new ArrayBuffer(4);new DataView(s).setUint32(0,t);const i=new Uint8Array(s),r=new Uint8Array([0]),o=new Uint8Array([...r,...n,...i]),a=Tt.create(Me,e).update(o).digest(),c=a.slice(0,32),l=a.slice(32);return{key:c,chainCode:l}},Fs=n=>Ns.test(n)?!n.split("/").slice(1).map(zt).some(Number.isNaN):!1,Rs=(n,e,t=Ms)=>{if(!Fs(n))throw new Error("Invalid derivation path");const{key:s,chainCode:i}=qs(e);return n.split("/").slice(1).map(zt).map(o=>parseInt(o,10)).reduce((o,a)=>Ds(o,a+t),{key:s,chainCode:i})},Hs="1.21.0";async function Ls(n){return new Promise(e=>{setTimeout(e,n)})}var _t="/v1";function Gs(n){let e=`${n}`;return e.endsWith("/")&&(e=e.substring(0,e.length-1)),e.endsWith(_t)||(e=`${e}${_t}`),e}var It=2e5,kt=20,Ks=20,Ws="0x1::aptos_coin::AptosCoin";function be(n){let e,t,s;return typeof n=="object"?(e=n.hashFunction,t=n.ttlMs,s=n.tags):e=n,(i,r,o)=>{if(o.value!=null)o.value=ft(o.value,e,t,s);else if(o.get!=null)o.get=ft(o.get,e,t,s);else throw new Error("Only put a Memoize() decorator on a method or get accessor.")}}function $t(n,e){return be({ttlMs:n,hashFunction:e})}var _e=new Map;function js(n){const e=new Set;for(const t of n){const s=_e.get(t);if(s)for(const i of s)e.has(i)||(i.clear(),e.add(i))}return e.size}function ft(n,e,t=0,s){const i=Symbol("__memoized_map__");return function(...r){let o;const a=this;a.hasOwnProperty(i)||Object.defineProperty(a,i,{configurable:!1,enumerable:!1,writable:!1,value:new Map});const c=a[i];if(Array.isArray(s))for(const l of s)_e.has(l)?_e.get(l).push(c):_e.set(l,[c]);if(e||r.length>0||t>0){let l;e===!0?l=r.map(b=>b.toString()).join("!"):e?l=e.apply(a,r):l=r[0];const d=`${l}__timestamp`;let m=!1;if(t>0)if(!c.has(d))m=!0;else{const b=c.get(d);m=Date.now()-b>t}c.has(l)&&!m?o=c.get(l):(o=n.apply(a,r),c.set(l,o),t>0&&c.set(d,Date.now()))}else{const l=a;c.has(l)?o=c.get(l):(o=n.apply(a,r),c.set(l,o))}return o}}var xt=class extends Error{constructor(n,e,t){super(t),this.name="AptosApiError",this.url=e.url,this.status=e.status,this.statusText=e.statusText,this.data=e.data,this.request=n}},Qs={400:"Bad Request",401:"Unauthorized",403:"Forbidden",404:"Not Found",429:"Too Many Requests",500:"Internal Server Error",502:"Bad Gateway",503:"Service Unavailable"};async function Xs(n,e,t,s,i,r){const o={...r==null?void 0:r.HEADERS,"x-aptos-client":`aptos-ts-sdk/${Hs}`,"content-type":s??"application/json"};return r!=null&&r.TOKEN&&(o.Authorization=`Bearer ${r==null?void 0:r.TOKEN}`),await bs({url:n,method:e,body:t,params:i,headers:o,overrides:r})}async function Ct(n){const{url:e,endpoint:t,method:s,body:i,contentType:r,params:o,overrides:a}=n,c=`${e}/${t??""}`,l=await Xs(c,s,i,r,o,a),d={status:l.status,statusText:l.statusText,data:l.data,headers:l.headers,config:l.config,url:c};if(d.status>=200&&d.status<300)return d;const m=Qs[d.status];throw new xt(n,d,m??"Generic Error")}async function B(n){return await Ct({...n,method:"GET"})}async function Y(n){return await Ct({...n,method:"POST"})}async function yt(n){const e=[];let t;const s=n.params;for(;;){s.start=t;const i=await B({url:n.url,endpoint:n.endpoint,params:s,originMethod:n.originMethod,overrides:n.overrides});if(t=i.headers["x-aptos-cursor"],delete i.headers,e.push(...i.data),t==null)break}return e}var Vs={mainnet:"https://indexer.mainnet.aptoslabs.com/v1/graphql",testnet:"https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",devnet:"https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",local:"http://127.0.0.1:8090/v1/graphql"},Js={mainnet:"https://fullnode.mainnet.aptoslabs.com/v1",testnet:"https://fullnode.testnet.aptoslabs.com/v1",devnet:"https://fullnode.devnet.aptoslabs.com/v1",local:"http://127.0.0.1:8080/v1"},Ys=(n=>(n.MAINNET="mainnet",n.TESTNET="testnet",n.DEVNET="devnet",n.LOCAL="local",n))(Ys||{}),u=class fe{static fromBuffer(e){return fe.fromUint8Array(e)}static fromUint8Array(e){return new fe(mt(e))}static ensure(e){return typeof e=="string"?new fe(e):e}constructor(e){e.startsWith("0x")?this.hexString=e:this.hexString=`0x${e}`}hex(){return this.hexString}noPrefix(){return this.hexString.slice(2)}toString(){return this.hex()}toShortString(){return`0x${this.hexString.replace(/^0x0*/,"")}`}toUint8Array(){return Uint8Array.from(bt(this.noPrefix()))}},f={};me(f,{AccountAddress:()=>_,AccountAuthenticator:()=>P,AccountAuthenticatorEd25519:()=>Wt,AccountAuthenticatorMultiEd25519:()=>Qt,ArgumentABI:()=>Be,AuthenticationKey:()=>Ne,ChainId:()=>Ve,ChangeSet:()=>vi,Ed25519PublicKey:()=>z,Ed25519Signature:()=>k,EntryFunction:()=>Ue,EntryFunctionABI:()=>ne,FeePayerRawTransaction:()=>je,Identifier:()=>A,Module:()=>pi,ModuleId:()=>te,MultiAgentRawTransaction:()=>We,MultiEd25519PublicKey:()=>Te,MultiEd25519Signature:()=>Fe,MultiSig:()=>gn,MultiSigTransactionPayload:()=>fn,RawTransaction:()=>V,RawTransactionWithData:()=>Ke,RotationProofChallenge:()=>mi,Script:()=>Ge,ScriptABI:()=>Ee,SignedTransaction:()=>Ae,StructTag:()=>X,Transaction:()=>On,TransactionArgument:()=>I,TransactionArgumentAddress:()=>st,TransactionArgumentBool:()=>rt,TransactionArgumentU128:()=>tt,TransactionArgumentU16:()=>Ye,TransactionArgumentU256:()=>nt,TransactionArgumentU32:()=>Ze,TransactionArgumentU64:()=>et,TransactionArgumentU8:()=>Je,TransactionArgumentU8Vector:()=>it,TransactionAuthenticator:()=>K,TransactionAuthenticatorEd25519:()=>Re,TransactionAuthenticatorFeePayer:()=>Gt,TransactionAuthenticatorMultiAgent:()=>Ht,TransactionAuthenticatorMultiEd25519:()=>He,TransactionPayload:()=>le,TransactionPayloadEntryFunction:()=>Xe,TransactionPayloadMultisig:()=>An,TransactionPayloadScript:()=>Qe,TransactionScriptABI:()=>ot,TypeArgumentABI:()=>Se,TypeTag:()=>U,TypeTagAddress:()=>M,TypeTagBool:()=>W,TypeTagParser:()=>ce,TypeTagParserError:()=>dn,TypeTagSigner:()=>on,TypeTagStruct:()=>q,TypeTagU128:()=>Q,TypeTagU16:()=>ie,TypeTagU256:()=>oe,TypeTagU32:()=>re,TypeTagU64:()=>j,TypeTagU8:()=>N,TypeTagVector:()=>ae,UserTransaction:()=>Mn,WriteSet:()=>wi,objectStructTag:()=>_i,optionStructTag:()=>hi,stringStructTag:()=>Le});var Zs={};me(Zs,{Deserializer:()=>De,Serializer:()=>y,bcsSerializeBool:()=>li,bcsSerializeBytes:()=>x,bcsSerializeFixedBytes:()=>di,bcsSerializeStr:()=>ui,bcsSerializeU128:()=>ai,bcsSerializeU16:()=>ri,bcsSerializeU256:()=>ci,bcsSerializeU32:()=>oi,bcsSerializeU8:()=>$e,bcsSerializeUint64:()=>ii,bcsToBytes:()=>$,deserializeVector:()=>S,serializeVector:()=>T,serializeVectorWithFunc:()=>si});var ei=2**8-1,ti=2**16-1,ee=2**32-1,Pt=BigInt(2**64)-BigInt(1),Nt=BigInt(2**128)-BigInt(1),ni=BigInt(2**256)-BigInt(1),y=class{constructor(){this.buffer=new ArrayBuffer(64),this.offset=0}ensureBufferWillHandleSize(n){for(;this.buffer.byteLength<this.offset+n;){const e=new ArrayBuffer(this.buffer.byteLength*2);new Uint8Array(e).set(new Uint8Array(this.buffer)),this.buffer=e}}serialize(n){this.ensureBufferWillHandleSize(n.length),new Uint8Array(this.buffer,this.offset).set(n),this.offset+=n.length}serializeWithFunction(n,e,t){this.ensureBufferWillHandleSize(e);const s=new DataView(this.buffer,this.offset);n.apply(s,[0,t,!0]),this.offset+=e}serializeStr(n){const e=new TextEncoder;this.serializeBytes(e.encode(n))}serializeBytes(n){this.serializeU32AsUleb128(n.length),this.serialize(n)}serializeFixedBytes(n){this.serialize(n)}serializeBool(n){if(typeof n!="boolean")throw new Error("Value needs to be a boolean");const e=n?1:0;this.serialize(new Uint8Array([e]))}serializeU8(n){this.serialize(new Uint8Array([n]))}serializeU16(n){this.serializeWithFunction(DataView.prototype.setUint16,2,n)}serializeU32(n){this.serializeWithFunction(DataView.prototype.setUint32,4,n)}serializeU64(n){const e=BigInt(n.toString())&BigInt(ee),t=BigInt(n.toString())>>BigInt(32);this.serializeU32(Number(e)),this.serializeU32(Number(t))}serializeU128(n){const e=BigInt(n.toString())&Pt,t=BigInt(n.toString())>>BigInt(64);this.serializeU64(e),this.serializeU64(t)}serializeU256(n){const e=BigInt(n.toString())&Nt,t=BigInt(n.toString())>>BigInt(128);this.serializeU128(e),this.serializeU128(t)}serializeU32AsUleb128(n){let e=n;const t=[];for(;e>>>7;)t.push(e&127|128),e>>>=7;t.push(e),this.serialize(new Uint8Array(t))}getBytes(){return new Uint8Array(this.buffer).slice(0,this.offset)}};h([D(0,ei)],y.prototype,"serializeU8",1);h([D(0,ti)],y.prototype,"serializeU16",1);h([D(0,ee)],y.prototype,"serializeU32",1);h([D(BigInt(0),Pt)],y.prototype,"serializeU64",1);h([D(BigInt(0),Nt)],y.prototype,"serializeU128",1);h([D(BigInt(0),ni)],y.prototype,"serializeU256",1);h([D(0,ee)],y.prototype,"serializeU32AsUleb128",1);function D(n,e,t){return(s,i,r)=>{const o=r.value;return r.value=function(c){const l=BigInt(c.toString());if(l>BigInt(e.toString())||l<BigInt(n.toString()))throw new Error(t||"Value is out of range");o.apply(this,[c])},r}}var De=class{constructor(n){this.buffer=new ArrayBuffer(n.length),new Uint8Array(this.buffer).set(n,0),this.offset=0}read(n){if(this.offset+n>this.buffer.byteLength)throw new Error("Reached to the end of buffer");const e=this.buffer.slice(this.offset,this.offset+n);return this.offset+=n,e}deserializeStr(){const n=this.deserializeBytes();return new TextDecoder().decode(n)}deserializeBytes(){const n=this.deserializeUleb128AsU32();return new Uint8Array(this.read(n))}deserializeFixedBytes(n){return new Uint8Array(this.read(n))}deserializeBool(){const n=new Uint8Array(this.read(1))[0];if(n!==1&&n!==0)throw new Error("Invalid boolean value");return n===1}deserializeU8(){return new DataView(this.read(1)).getUint8(0)}deserializeU16(){return new DataView(this.read(2)).getUint16(0,!0)}deserializeU32(){return new DataView(this.read(4)).getUint32(0,!0)}deserializeU64(){const n=this.deserializeU32(),e=this.deserializeU32();return BigInt(BigInt(e)<<BigInt(32)|BigInt(n))}deserializeU128(){const n=this.deserializeU64(),e=this.deserializeU64();return BigInt(e<<BigInt(64)|n)}deserializeU256(){const n=this.deserializeU128(),e=this.deserializeU128();return BigInt(e<<BigInt(128)|n)}deserializeUleb128AsU32(){let n=BigInt(0),e=0;for(;n<ee;){const t=this.deserializeU8();if(n|=BigInt(t&127)<<BigInt(e),!(t&128))break;e+=7}if(n>ee)throw new Error("Overflow while parsing uleb128-encoded uint32 value");return Number(n)}};function T(n,e){e.serializeU32AsUleb128(n.length),n.forEach(t=>{t.serialize(e)})}function si(n,e){const t=new y;t.serializeU32AsUleb128(n.length);const s=t[e];return n.forEach(i=>{s.call(t,i)}),t.getBytes()}function S(n,e){const t=n.deserializeUleb128AsU32(),s=[];for(let i=0;i<t;i+=1)s.push(e.deserialize(n));return s}function $(n){const e=new y;return n.serialize(e),e.getBytes()}function ii(n){const e=new y;return e.serializeU64(n),e.getBytes()}function $e(n){const e=new y;return e.serializeU8(n),e.getBytes()}function ri(n){const e=new y;return e.serializeU16(n),e.getBytes()}function oi(n){const e=new y;return e.serializeU32(n),e.getBytes()}function ai(n){const e=new y;return e.serializeU128(n),e.getBytes()}function ci(n){const e=new y;return e.serializeU256(n),e.getBytes()}function li(n){const e=new y;return e.serializeBool(n),e.getBytes()}function ui(n){const e=new y;return e.serializeStr(n),e.getBytes()}function x(n){const e=new y;return e.serializeBytes(n),e.getBytes()}function di(n){const e=new y;return e.serializeFixedBytes(n),e.getBytes()}var we=class E{constructor(e){if(e.length!==E.LENGTH)throw new Error("Expected address of length 32");this.address=e}static fromHex(e){let t=u.ensure(e);t.noPrefix().length%2!==0&&(t=new u(`0${t.noPrefix()}`));const s=t.toUint8Array();if(s.length>E.LENGTH)throw new Error("Hex string is too long. Address's length is 32 bytes.");if(s.length===E.LENGTH)return new E(s);const i=new Uint8Array(E.LENGTH);return i.set(s,E.LENGTH-s.length),new E(i)}static isValid(e){if(e==="")return!1;let t=u.ensure(e);return t.noPrefix().length%2!==0&&(t=new u(`0${t.noPrefix()}`)),t.toUint8Array().length<=E.LENGTH}toHexString(){return u.fromUint8Array(this.address).hex()}serialize(e){e.serializeFixedBytes(this.address)}static deserialize(e){return new E(e.deserializeFixedBytes(E.LENGTH))}static standardizeAddress(e){const t=e.toLowerCase();return`0x${(t.startsWith("0x")?t.slice(2):t).padStart(64,"0")}`}};we.LENGTH=32;we.CORE_CODE_ADDRESS=we.fromHex("0x1");var _=we,Ot=class ye{constructor(e){if(e.length!==ye.LENGTH)throw new Error(`Ed25519PublicKey length should be ${ye.LENGTH}`);this.value=e}toBytes(){return this.value}serialize(e){e.serializeBytes(this.value)}static deserialize(e){const t=e.deserializeBytes();return new ye(t)}};Ot.LENGTH=32;var z=Ot,Mt=class ge{constructor(e){if(this.value=e,e.length!==ge.LENGTH)throw new Error(`Ed25519Signature length should be ${ge.LENGTH}`)}serialize(e){e.serializeBytes(this.value)}static deserialize(e){const t=e.deserializeBytes();return new ge(t)}};Mt.LENGTH=64;var k=Mt,xe=32,Te=class qt{constructor(e,t){if(this.public_keys=e,this.threshold=t,t>xe)throw new Error(`"threshold" cannot be larger than ${xe}`)}toBytes(){const e=new Uint8Array(this.public_keys.length*z.LENGTH+1);return this.public_keys.forEach((t,s)=>{e.set(t.value,s*z.LENGTH)}),e[this.public_keys.length*z.LENGTH]=this.threshold,e}serialize(e){e.serializeBytes(this.toBytes())}static deserialize(e){const t=e.deserializeBytes(),s=t[t.length-1],i=[];for(let r=0;r<t.length-1;r+=z.LENGTH){const o=r;i.push(new z(t.subarray(o,o+z.LENGTH)))}return new qt(i,s)}},Dt=class Z{constructor(e,t){if(this.signatures=e,this.bitmap=t,t.length!==Z.BITMAP_LEN)throw new Error(`"bitmap" length should be ${Z.BITMAP_LEN}`)}toBytes(){const e=new Uint8Array(this.signatures.length*k.LENGTH+Z.BITMAP_LEN);return this.signatures.forEach((t,s)=>{e.set(t.value,s*k.LENGTH)}),e.set(this.bitmap,this.signatures.length*k.LENGTH),e}static createBitmap(e){const s=new Uint8Array([0,0,0,0]),i=new Set;return e.forEach(r=>{if(r>=xe)throw new Error(`Invalid bit value ${r}.`);if(i.has(r))throw new Error("Duplicated bits detected.");i.add(r);const o=Math.floor(r/8);let a=s[o];a|=128>>r%8,s[o]=a}),s}serialize(e){e.serializeBytes(this.toBytes())}static deserialize(e){const t=e.deserializeBytes(),s=t.subarray(t.length-4),i=[];for(let r=0;r<t.length-s.length;r+=k.LENGTH){const o=r;i.push(new k(t.subarray(o,o+k.LENGTH)))}return new Z(i,s)}};Dt.BITMAP_LEN=4;var Fe=Dt,K=class{static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return Re.load(n);case 1:return He.load(n);case 2:return Ht.load(n);case 3:return Gt.load(n);default:throw new Error(`Unknown variant index for TransactionAuthenticator: ${e}`)}}},Re=class Ft extends K{constructor(e,t){super(),this.public_key=e,this.signature=t}serialize(e){e.serializeU32AsUleb128(0),this.public_key.serialize(e),this.signature.serialize(e)}static load(e){const t=z.deserialize(e),s=k.deserialize(e);return new Ft(t,s)}},He=class Rt extends K{constructor(e,t){super(),this.public_key=e,this.signature=t}serialize(e){e.serializeU32AsUleb128(1),this.public_key.serialize(e),this.signature.serialize(e)}static load(e){const t=Te.deserialize(e),s=Fe.deserialize(e);return new Rt(t,s)}},Ht=class Lt extends K{constructor(e,t,s){super(),this.sender=e,this.secondary_signer_addresses=t,this.secondary_signers=s}serialize(e){e.serializeU32AsUleb128(2),this.sender.serialize(e),T(this.secondary_signer_addresses,e),T(this.secondary_signers,e)}static load(e){const t=P.deserialize(e),s=S(e,_),i=S(e,P);return new Lt(t,s,i)}},Gt=class Kt extends K{constructor(e,t,s,i){super(),this.sender=e,this.secondary_signer_addresses=t,this.secondary_signers=s,this.fee_payer=i}serialize(e){e.serializeU32AsUleb128(3),this.sender.serialize(e),T(this.secondary_signer_addresses,e),T(this.secondary_signers,e),this.fee_payer.address.serialize(e),this.fee_payer.authenticator.serialize(e)}static load(e){const t=P.deserialize(e),s=S(e,_),i=S(e,P),r=_.deserialize(e),o=P.deserialize(e),a={address:r,authenticator:o};return new Kt(t,s,i,a)}},P=class{static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return Wt.load(n);case 1:return Qt.load(n);default:throw new Error(`Unknown variant index for AccountAuthenticator: ${e}`)}}},Wt=class jt extends P{constructor(e,t){super(),this.public_key=e,this.signature=t}serialize(e){e.serializeU32AsUleb128(0),this.public_key.serialize(e),this.signature.serialize(e)}static load(e){const t=z.deserialize(e),s=k.deserialize(e);return new jt(t,s)}},Qt=class Xt extends P{constructor(e,t){super(),this.public_key=e,this.signature=t}serialize(e){e.serializeU32AsUleb128(1),this.public_key.serialize(e),this.signature.serialize(e)}static load(e){const t=Te.deserialize(e),s=Fe.deserialize(e);return new Xt(t,s)}},A=class Vt{constructor(e){this.value=e}serialize(e){e.serializeStr(this.value)}static deserialize(e){const t=e.deserializeStr();return new Vt(t)}},U=class{static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return W.load(n);case 1:return N.load(n);case 2:return j.load(n);case 3:return Q.load(n);case 4:return M.load(n);case 5:return on.load(n);case 6:return ae.load(n);case 7:return q.load(n);case 8:return ie.load(n);case 9:return re.load(n);case 10:return oe.load(n);default:throw new Error(`Unknown variant index for TypeTag: ${e}`)}}},W=class Jt extends U{serialize(e){e.serializeU32AsUleb128(0)}static load(e){return new Jt}},N=class Yt extends U{serialize(e){e.serializeU32AsUleb128(1)}static load(e){return new Yt}},ie=class Zt extends U{serialize(e){e.serializeU32AsUleb128(8)}static load(e){return new Zt}},re=class en extends U{serialize(e){e.serializeU32AsUleb128(9)}static load(e){return new en}},j=class tn extends U{serialize(e){e.serializeU32AsUleb128(2)}static load(e){return new tn}},Q=class nn extends U{serialize(e){e.serializeU32AsUleb128(3)}static load(e){return new nn}},oe=class sn extends U{serialize(e){e.serializeU32AsUleb128(10)}static load(e){return new sn}},M=class rn extends U{serialize(e){e.serializeU32AsUleb128(4)}static load(e){return new rn}},on=class an extends U{serialize(e){e.serializeU32AsUleb128(5)}static load(e){return new an}},ae=class cn extends U{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(6),this.value.serialize(e)}static load(e){const t=U.deserialize(e);return new cn(t)}},q=class ln extends U{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(7),this.value.serialize(e)}static load(e){const t=X.deserialize(e);return new ln(t)}isStringTypeTag(){return this.value.module_name.value==="string"&&this.value.name.value==="String"&&this.value.address.toHexString()===_.CORE_CODE_ADDRESS.toHexString()}},X=class Ce{constructor(e,t,s,i){this.address=e,this.module_name=t,this.name=s,this.type_args=i}static fromString(e){const t=new ce(e).parseTypeTag();return new Ce(t.value.address,t.value.module_name,t.value.name,t.value.type_args)}serialize(e){this.address.serialize(e),this.module_name.serialize(e),this.name.serialize(e),T(this.type_args,e)}static deserialize(e){const t=_.deserialize(e),s=A.deserialize(e),i=A.deserialize(e),r=S(e,U);return new Ce(t,s,i,r)}},Le=new X(_.fromHex("0x1"),new A("string"),new A("String"),[]);function hi(n){return new X(_.fromHex("0x1"),new A("option"),new A("Option"),[n])}function _i(n){return new X(_.fromHex("0x1"),new A("object"),new A("Object"),[n])}function C(n){throw new dn(n)}function gt(n){return!!n.match(/\s/)}function pt(n){return!!n.match(/[_A-Za-z0-9]/g)}function fi(n){return!!n.match(/T\d+/g)}function yi(n,e){const t=n[e];if(t===":"){if(n.slice(e,e+2)==="::")return[["COLON","::"],2];C("Unrecognized token.")}else{if(t==="<")return[["LT","<"],1];if(t===">")return[["GT",">"],1];if(t===",")return[["COMMA",","],1];if(gt(t)){let s="";for(let i=e;i<n.length;i+=1){const r=n[i];if(gt(r))s=`${s}${r}`;else break}return[["SPACE",s],s.length]}else if(pt(t)){let s="";for(let i=e;i<n.length;i+=1){const r=n[i];if(pt(r))s=`${s}${r}`;else break}return fi(s)?[["GENERIC",s],s.length]:[["IDENT",s],s.length]}}throw new Error("Unrecognized token.")}function gi(n){let e=0;const t=[];for(;e<n.length;){const[s,i]=yi(n,e);s[0]!=="SPACE"&&t.push(s),e+=i}return t}var ce=class un{constructor(e,t){this.typeTags=[],this.tokens=gi(e),this.typeTags=t||[]}consume(e){const t=this.tokens.shift();(!t||t[1]!==e)&&C("Invalid type tag.")}consumeWholeGeneric(){for(this.consume("<");this.tokens[0][1]!==">";)this.tokens[0][1]==="<"?this.consumeWholeGeneric():this.tokens.shift();this.consume(">")}parseCommaList(e,t){const s=[];for(this.tokens.length<=0&&C("Invalid type tag.");this.tokens[0][1]!==e&&(s.push(this.parseTypeTag()),!(this.tokens.length>0&&this.tokens[0][1]===e||(this.consume(","),this.tokens.length>0&&this.tokens[0][1]===e&&t)));)this.tokens.length<=0&&C("Invalid type tag.");return s}parseTypeTag(){this.tokens.length===0&&C("Invalid type tag.");const[e,t]=this.tokens.shift();if(t==="u8")return new N;if(t==="u16")return new ie;if(t==="u32")return new re;if(t==="u64")return new j;if(t==="u128")return new Q;if(t==="u256")return new oe;if(t==="bool")return new W;if(t==="address")return new M;if(t==="vector"){this.consume("<");const s=this.parseTypeTag();return this.consume(">"),new ae(s)}if(t==="string")return new q(Le);if(e==="IDENT"&&(t.startsWith("0x")||t.startsWith("0X"))){const s=_.fromHex(t);this.consume("::");const[i,r]=this.tokens.shift();i!=="IDENT"&&C("Invalid type tag."),this.consume("::");const[o,a]=this.tokens.shift();if(o!=="IDENT"&&C("Invalid type tag."),_.CORE_CODE_ADDRESS.toHexString()===s.toHexString()&&r==="object"&&a==="Object")return this.consumeWholeGeneric(),new M;let c=[];this.tokens.length>0&&this.tokens[0][1]==="<"&&(this.consume("<"),c=this.parseCommaList(">",!0),this.consume(">"));const l=new X(s,new A(r),new A(a),c);return new q(l)}if(e==="GENERIC"){this.typeTags.length===0&&C("Can't convert generic type since no typeTags were specified.");const s=parseInt(t.substring(1),10);return new un(this.typeTags[s]).parseTypeTag()}throw new Error("Invalid type tag.")}},dn=class extends Error{constructor(n){super(n),this.name="TypeTagParserError"}},V=class hn{constructor(e,t,s,i,r,o,a){this.sender=e,this.sequence_number=t,this.payload=s,this.max_gas_amount=i,this.gas_unit_price=r,this.expiration_timestamp_secs=o,this.chain_id=a}serialize(e){this.sender.serialize(e),e.serializeU64(this.sequence_number),this.payload.serialize(e),e.serializeU64(this.max_gas_amount),e.serializeU64(this.gas_unit_price),e.serializeU64(this.expiration_timestamp_secs),this.chain_id.serialize(e)}static deserialize(e){const t=_.deserialize(e),s=e.deserializeU64(),i=le.deserialize(e),r=e.deserializeU64(),o=e.deserializeU64(),a=e.deserializeU64(),c=Ve.deserialize(e);return new hn(t,s,i,r,o,a,c)}},Ge=class _n{constructor(e,t,s){this.code=e,this.ty_args=t,this.args=s}serialize(e){e.serializeBytes(this.code),T(this.ty_args,e),T(this.args,e)}static deserialize(e){const t=e.deserializeBytes(),s=S(e,U),i=S(e,I);return new _n(t,s,i)}},Ue=class pe{constructor(e,t,s,i){this.module_name=e,this.function_name=t,this.ty_args=s,this.args=i}static natural(e,t,s,i){return new pe(te.fromStr(e),new A(t),s,i)}static natual(e,t,s,i){return pe.natural(e,t,s,i)}serialize(e){this.module_name.serialize(e),this.function_name.serialize(e),T(this.ty_args,e),e.serializeU32AsUleb128(this.args.length),this.args.forEach(t=>{e.serializeBytes(t)})}static deserialize(e){const t=te.deserialize(e),s=A.deserialize(e),i=S(e,U),r=e.deserializeUleb128AsU32(),o=[];for(let c=0;c<r;c+=1)o.push(e.deserializeBytes());const a=o;return new pe(t,s,i,a)}},fn=class yn{constructor(e){this.transaction_payload=e}serialize(e){e.serializeU32AsUleb128(0),this.transaction_payload.serialize(e)}static deserialize(e){return e.deserializeUleb128AsU32(),new yn(Ue.deserialize(e))}},gn=class pn{constructor(e,t){this.multisig_address=e,this.transaction_payload=t}serialize(e){this.multisig_address.serialize(e),this.transaction_payload===void 0?e.serializeBool(!1):(e.serializeBool(!0),this.transaction_payload.serialize(e))}static deserialize(e){const t=_.deserialize(e),s=e.deserializeBool();let i;return s&&(i=fn.deserialize(e)),new pn(t,i)}},pi=class vn{constructor(e){this.code=e}serialize(e){e.serializeBytes(this.code)}static deserialize(e){const t=e.deserializeBytes();return new vn(t)}},te=class Pe{constructor(e,t){this.address=e,this.name=t}static fromStr(e){const t=e.split("::");if(t.length!==2)throw new Error("Invalid module id.");return new Pe(_.fromHex(new u(t[0])),new A(t[1]))}serialize(e){this.address.serialize(e),this.name.serialize(e)}static deserialize(e){const t=_.deserialize(e),s=A.deserialize(e);return new Pe(t,s)}},vi=class{serialize(n){throw new Error("Not implemented.")}static deserialize(n){throw new Error("Not implemented.")}},wi=class{serialize(n){throw new Error("Not implmented.")}static deserialize(n){throw new Error("Not implmented.")}},Ae=class wn{constructor(e,t){this.raw_txn=e,this.authenticator=t}serialize(e){this.raw_txn.serialize(e),this.authenticator.serialize(e)}static deserialize(e){const t=V.deserialize(e),s=K.deserialize(e);return new wn(t,s)}},Ke=class{static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return We.load(n);case 1:return je.load(n);default:throw new Error(`Unknown variant index for RawTransactionWithData: ${e}`)}}},We=class mn extends Ke{constructor(e,t){super(),this.raw_txn=e,this.secondary_signer_addresses=t}serialize(e){e.serializeU32AsUleb128(0),this.raw_txn.serialize(e),T(this.secondary_signer_addresses,e)}static load(e){const t=V.deserialize(e),s=S(e,_);return new mn(t,s)}},je=class bn extends Ke{constructor(e,t,s){super(),this.raw_txn=e,this.secondary_signer_addresses=t,this.fee_payer_address=s}serialize(e){e.serializeU32AsUleb128(1),this.raw_txn.serialize(e),T(this.secondary_signer_addresses,e),this.fee_payer_address.serialize(e)}static load(e){const t=V.deserialize(e),s=S(e,_),i=_.deserialize(e);return new bn(t,s,i)}},le=class{static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return Qe.load(n);case 2:return Xe.load(n);case 3:return An.load(n);default:throw new Error(`Unknown variant index for TransactionPayload: ${e}`)}}},Qe=class Tn extends le{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(0),this.value.serialize(e)}static load(e){const t=Ge.deserialize(e);return new Tn(t)}},Xe=class Un extends le{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(2),this.value.serialize(e)}static load(e){const t=Ue.deserialize(e);return new Un(t)}},An=class Sn extends le{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(3),this.value.serialize(e)}static load(e){const t=gn.deserialize(e);return new Sn(t)}},Ve=class Bn{constructor(e){this.value=e}serialize(e){e.serializeU8(this.value)}static deserialize(e){const t=e.deserializeU8();return new Bn(t)}},I=class{static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return Je.load(n);case 1:return et.load(n);case 2:return tt.load(n);case 3:return st.load(n);case 4:return it.load(n);case 5:return rt.load(n);case 6:return Ye.load(n);case 7:return Ze.load(n);case 8:return nt.load(n);default:throw new Error(`Unknown variant index for TransactionArgument: ${e}`)}}},Je=class En extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(0),e.serializeU8(this.value)}static load(e){const t=e.deserializeU8();return new En(t)}},Ye=class zn extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(6),e.serializeU16(this.value)}static load(e){const t=e.deserializeU16();return new zn(t)}},Ze=class In extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(7),e.serializeU32(this.value)}static load(e){const t=e.deserializeU32();return new In(t)}},et=class kn extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(1),e.serializeU64(this.value)}static load(e){const t=e.deserializeU64();return new kn(t)}},tt=class $n extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(2),e.serializeU128(this.value)}static load(e){const t=e.deserializeU128();return new $n(t)}},nt=class xn extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(8),e.serializeU256(this.value)}static load(e){const t=e.deserializeU256();return new xn(t)}},st=class Cn extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(3),this.value.serialize(e)}static load(e){const t=_.deserialize(e);return new Cn(t)}},it=class Pn extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(4),e.serializeBytes(this.value)}static load(e){const t=e.deserializeBytes();return new Pn(t)}},rt=class Nn extends I{constructor(e){super(),this.value=e}serialize(e){e.serializeU32AsUleb128(5),e.serializeBool(this.value)}static load(e){const t=e.deserializeBool();return new Nn(t)}},On=class{getHashSalt(){const n=G.create();return n.update("APTOS::Transaction"),n.digest()}static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return Mn.load(n);default:throw new Error(`Unknown variant index for Transaction: ${e}`)}}},Mn=class qn extends On{constructor(e){super(),this.value=e}hash(){const e=G.create();return e.update(this.getHashSalt()),e.update($(this)),e.digest()}serialize(e){e.serializeU32AsUleb128(0),this.value.serialize(e)}static load(e){return new qn(Ae.deserialize(e))}},Se=class Dn{constructor(e){this.name=e}serialize(e){e.serializeStr(this.name)}static deserialize(e){const t=e.deserializeStr();return new Dn(t)}},Be=class Fn{constructor(e,t){this.name=e,this.type_tag=t}serialize(e){e.serializeStr(this.name),this.type_tag.serialize(e)}static deserialize(e){const t=e.deserializeStr(),s=U.deserialize(e);return new Fn(t,s)}},Ee=class{static deserialize(n){const e=n.deserializeUleb128AsU32();switch(e){case 0:return ot.load(n);case 1:return ne.load(n);default:throw new Error(`Unknown variant index for TransactionPayload: ${e}`)}}},ot=class Rn extends Ee{constructor(e,t,s,i,r){super(),this.name=e,this.doc=t,this.code=s,this.ty_args=i,this.args=r}serialize(e){e.serializeU32AsUleb128(0),e.serializeStr(this.name),e.serializeStr(this.doc),e.serializeBytes(this.code),T(this.ty_args,e),T(this.args,e)}static load(e){const t=e.deserializeStr(),s=e.deserializeStr(),i=e.deserializeBytes(),r=S(e,Se),o=S(e,Be);return new Rn(t,s,i,r,o)}},ne=class Hn extends Ee{constructor(e,t,s,i,r){super(),this.name=e,this.module_name=t,this.doc=s,this.ty_args=i,this.args=r}serialize(e){e.serializeU32AsUleb128(1),e.serializeStr(this.name),this.module_name.serialize(e),e.serializeStr(this.doc),T(this.ty_args,e),T(this.args,e)}static load(e){const t=e.deserializeStr(),s=te.deserialize(e),i=e.deserializeStr(),r=S(e,Se),o=S(e,Be);return new Hn(t,s,i,r,o)}},ue=class F{constructor(e){if(e.length!==F.LENGTH)throw new Error("Expected a byte array of length 32");this.bytes=e}static fromMultiEd25519PublicKey(e){const t=e.toBytes(),s=new Uint8Array(t.length+1);s.set(t),s.set([F.MULTI_ED25519_SCHEME],t.length);const i=G.create();return i.update(s),new F(i.digest())}static fromEd25519PublicKey(e){const t=e.value,s=new Uint8Array(t.length+1);s.set(t),s.set([F.ED25519_SCHEME],t.length);const i=G.create();return i.update(s),new F(i.digest())}derivedAddress(){return u.fromUint8Array(this.bytes)}};ue.LENGTH=32;ue.MULTI_ED25519_SCHEME=1;ue.ED25519_SCHEME=0;ue.DERIVE_RESOURCE_ACCOUNT_SCHEME=255;var Ne=ue,mi=class{constructor(n,e,t,s,i,r,o){this.accountAddress=n,this.moduleName=e,this.structName=t,this.sequenceNumber=s,this.originator=i,this.currentAuthKey=r,this.newPublicKey=o}serialize(n){this.accountAddress.serialize(n),n.serializeStr(this.moduleName),n.serializeStr(this.structName),n.serializeU64(this.sequenceNumber),this.originator.serialize(n),this.currentAuthKey.serialize(n),n.serializeBytes(this.newPublicKey)}},Ln=class ve{static fromAptosAccountObject(e){return new ve(u.ensure(e.privateKeyHex).toUint8Array(),e.address)}static isValidPath(e){return/^m\/44'\/637'\/[0-9]+'\/[0-9]+'\/[0-9]+'+$/.test(e)}static fromDerivePath(e,t){if(!ve.isValidPath(e))throw new Error("Invalid derivation path");const s=t.trim().split(/\s+/).map(r=>r.toLowerCase()).join(" "),{key:i}=Rs(e,mt(As(s)));return new ve(i)}constructor(e,t){e?this.signingKey=he.sign.keyPair.fromSeed(e.slice(0,32)):this.signingKey=he.sign.keyPair(),this.accountAddress=u.ensure(t||this.authKey().hex())}address(){return this.accountAddress}authKey(){const e=new z(this.signingKey.publicKey);return Ne.fromEd25519PublicKey(e).derivedAddress()}static getResourceAccountAddress(e,t){const s=$(_.fromHex(e)),i=new Uint8Array([...s,...t,Ne.DERIVE_RESOURCE_ACCOUNT_SCHEME]),r=G.create();return r.update(i),u.fromUint8Array(r.digest())}static getCollectionID(e,t){const s=new TextEncoder().encode(`${e}::${t}`),i=ms.create();return i.update(s),u.fromUint8Array(i.digest())}pubKey(){return u.fromUint8Array(this.signingKey.publicKey)}signBuffer(e){const t=he.sign.detached(e,this.signingKey.secretKey);return u.fromUint8Array(t)}signHexString(e){const t=u.ensure(e).toUint8Array();return this.signBuffer(t)}verifySignature(e,t){const s=u.ensure(e).toUint8Array(),i=u.ensure(t).toUint8Array();return he.sign.detached.verify(s,i,this.signingKey.publicKey)}toPrivateKeyObject(){return{address:this.address().hex(),publicKeyHex:this.pubKey().hex(),privateKeyHex:u.fromUint8Array(this.signingKey.secretKey.slice(0,32)).hex()}}};h([be()],Ln.prototype,"authKey",1);var vt=Ln,de=`
    fragment CurrentTokenOwnershipFields on current_token_ownerships_v2 {
  token_standard
  token_properties_mutated_v1
  token_data_id
  table_type_v1
  storage_id
  property_version_v1
  owner_address
  last_transaction_version
  last_transaction_timestamp
  is_soulbound_v2
  is_fungible_v2
  amount
  current_token_data {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `,bi=`
    fragment TokenDataFields on current_token_datas {
  creator_address
  collection_name
  description
  metadata_uri
  name
  token_data_id_hash
  collection_data_id_hash
}
    `,Ti=`
    fragment CollectionDataFields on current_collection_datas {
  metadata_uri
  supply
  description
  collection_name
  collection_data_id_hash
  table_handle
  creator_address
}
    `,Gn=`
    fragment TokenActivitiesFields on token_activities_v2 {
  after_value
  before_value
  entry_function_id_str
  event_account_address
  event_index
  from_address
  is_fungible_v2
  property_version_v1
  to_address
  token_amount
  token_data_id
  token_standard
  transaction_timestamp
  transaction_version
  type
}
    `,Ui=`
    query getAccountCoinsDataCount($address: String) {
  current_fungible_asset_balances_aggregate(
    where: {owner_address: {_eq: $address}}
  ) {
    aggregate {
      count
    }
  }
}
    `,Ai=`
    query getAccountCoinsData($where_condition: current_fungible_asset_balances_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_fungible_asset_balances_order_by!]) {
  current_fungible_asset_balances(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    amount
    asset_type
    is_frozen
    is_primary
    last_transaction_timestamp
    last_transaction_version
    owner_address
    storage_id
    token_standard
    metadata {
      token_standard
      symbol
      supply_aggregator_table_key_v1
      supply_aggregator_table_handle_v1
      project_uri
      name
      last_transaction_version
      last_transaction_timestamp
      icon_uri
      decimals
      creator_address
      asset_type
    }
  }
}
    `,Si=`
    query getAccountCurrentTokens($address: String!, $offset: Int, $limit: Int) {
  current_token_ownerships(
    where: {owner_address: {_eq: $address}, amount: {_gt: 0}}
    order_by: [{last_transaction_version: desc}, {creator_address: asc}, {collection_name: asc}, {name: asc}]
    offset: $offset
    limit: $limit
  ) {
    amount
    current_token_data {
      ...TokenDataFields
    }
    current_collection_data {
      ...CollectionDataFields
    }
    last_transaction_version
    property_version
  }
}
    ${bi}
${Ti}`,Bi=`
    query getAccountTokensCount($where_condition: current_token_ownerships_v2_bool_exp, $offset: Int, $limit: Int) {
  current_token_ownerships_v2_aggregate(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    aggregate {
      count
    }
  }
}
    `,Ei=`
    query getAccountTransactionsCount($address: String) {
  account_transactions_aggregate(where: {account_address: {_eq: $address}}) {
    aggregate {
      count
    }
  }
}
    `,zi=`
    query getAccountTransactionsData($where_condition: account_transactions_bool_exp!, $offset: Int, $limit: Int, $order_by: [account_transactions_order_by!]) {
  account_transactions(
    where: $where_condition
    order_by: $order_by
    limit: $limit
    offset: $offset
  ) {
    token_activities_v2 {
      ...TokenActivitiesFields
    }
    transaction_version
    account_address
  }
}
    ${Gn}`,Ii=`
    query getCollectionData($where_condition: current_collections_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collections_v2_order_by!]) {
  current_collections_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    collection_id
    collection_name
    creator_address
    current_supply
    description
    last_transaction_timestamp
    last_transaction_version
    max_supply
    mutable_description
    mutable_uri
    table_handle_v1
    token_standard
    total_minted_v2
    uri
  }
}
    `,ki=`
    query getCollectionsWithOwnedTokens($where_condition: current_collection_ownership_v2_view_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collection_ownership_v2_view_order_by!]) {
  current_collection_ownership_v2_view(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      mutable_description
      max_supply
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
    collection_id
    collection_name
    collection_uri
    creator_address
    distinct_tokens
    last_transaction_version
    owner_address
    single_token_uri
  }
}
    `,$i=`
    query getCurrentObjects($where_condition: current_objects_bool_exp, $offset: Int, $limit: Int, $order_by: [current_objects_order_by!]) {
  current_objects(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    allow_ungated_transfer
    state_key_hash
    owner_address
    object_address
    last_transaction_version
    last_guid_creation_num
    is_deleted
  }
}
    `,xi=`
    query getDelegatedStakingActivities($delegatorAddress: String, $poolAddress: String) {
  delegated_staking_activities(
    where: {delegator_address: {_eq: $delegatorAddress}, pool_address: {_eq: $poolAddress}}
  ) {
    amount
    delegator_address
    event_index
    event_type
    pool_address
    transaction_version
  }
}
    `,Ci=`
    query getIndexerLedgerInfo {
  ledger_infos {
    chain_id
  }
}
    `,Pi=`
    query getNumberOfDelegators($poolAddress: String) {
  num_active_delegator_per_pool(
    where: {pool_address: {_eq: $poolAddress}, num_active_delegator: {_gt: "0"}}
    distinct_on: pool_address
  ) {
    num_active_delegator
    pool_address
  }
}
    `,Ni=`
    query getOwnedTokens($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${de}`,Oi=`
    query getOwnedTokensByTokenData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${de}`,Mi=`
    query getTokenActivities($where_condition: token_activities_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [token_activities_v2_order_by!]) {
  token_activities_v2(
    where: $where_condition
    order_by: $order_by
    offset: $offset
    limit: $limit
  ) {
    ...TokenActivitiesFields
  }
}
    ${Gn}`,qi=`
    query getTokenActivitiesCount($token_id: String) {
  token_activities_v2_aggregate(where: {token_data_id: {_eq: $token_id}}) {
    aggregate {
      count
    }
  }
}
    `,Di=`
    query getTokenCurrentOwnerData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${de}`,Fi=`
    query getTokenData($where_condition: current_token_datas_v2_bool_exp, $offset: Int, $limit: Int, $order_by: [current_token_datas_v2_order_by!]) {
  current_token_datas_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `,Ri=`
    query getTokenOwnedFromCollection($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${de}`,Hi=`
    query getTokenOwnersData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${de}`,Li=`
    query getTopUserTransactions($limit: Int) {
  user_transactions(limit: $limit, order_by: {version: desc}) {
    version
  }
}
    `,Gi=`
    query getUserTransactions($where_condition: user_transactions_bool_exp!, $offset: Int, $limit: Int, $order_by: [user_transactions_order_by!]) {
  user_transactions(
    order_by: $order_by
    where: $where_condition
    limit: $limit
    offset: $offset
  ) {
    version
  }
}
    `;function ze(n,e,t){if(!(e!=null&&e.includes(typeof n)))throw new Error(t||`Invalid arg: ${n} type should be ${e instanceof Array?e.join(" or "):e}`)}function Kn(n){if(ze(n,["boolean","string"]),typeof n=="boolean")return n;if(n==="true")return!0;if(n==="false")return!1;throw new Error("Invalid boolean string.")}function H(n){if(ze(n,["number","string"]),typeof n=="number")return n;const e=Number.parseInt(n,10);if(Number.isNaN(e))throw new Error("Invalid number string.");return e}function L(n){return ze(n,["number","bigint","string"]),BigInt(n)}function Ki(n,e,t){at(n,e,t)}function at(n,e,t,s){if(e instanceof W)t.serializeBool(Kn(n));else if(e instanceof N)t.serializeU8(H(n));else if(e instanceof ie)t.serializeU16(H(n));else if(e instanceof re)t.serializeU32(H(n));else if(e instanceof j)t.serializeU64(L(n));else if(e instanceof Q)t.serializeU128(L(n));else if(e instanceof oe)t.serializeU256(L(n));else if(e instanceof M)Wn(n,t);else if(e instanceof ae)Wi(n,e,t);else if(e instanceof q)ji(n,e,t);else throw new Error("Unsupported arg type.")}function Wn(n,e){let t;if(typeof n=="string"||n instanceof u)t=_.fromHex(n);else if(n instanceof _)t=n;else throw new Error("Invalid account address.");t.serialize(e)}function Wi(n,e,t,s){if(e.value instanceof N){if(n instanceof Uint8Array){t.serializeBytes(n);return}if(n instanceof u){t.serializeBytes(n.toUint8Array());return}if(typeof n=="string"){t.serializeStr(n);return}}if(!Array.isArray(n))throw new Error("Invalid vector args.");t.serializeU32AsUleb128(n.length),n.forEach(i=>at(i,e.value,t))}function ji(n,e,t,s){const{address:i,module_name:r,name:o,type_args:a}=e.value,c=`${u.fromUint8Array(i.address).toShortString()}::${r.value}::${o.value}`;if(c==="0x1::string::String")ze(n,["string"]),t.serializeStr(n);else if(c==="0x1::object::Object")Wn(n,t);else if(c==="0x1::option::Option"){if(a.length!==1)throw new Error(`Option has the wrong number of type arguments ${a.length}`);Qi(n,a[0],t)}else throw new Error("Unsupported struct type in function argument")}function Qi(n,e,t,s){n==null?t.serializeU32AsUleb128(0):(t.serializeU32AsUleb128(1),at(n,e,t))}function Xi(n,e){if(e instanceof W)return new rt(Kn(n));if(e instanceof N)return new Je(H(n));if(e instanceof ie)return new Ye(H(n));if(e instanceof re)return new Ze(H(n));if(e instanceof j)return new et(L(n));if(e instanceof Q)return new tt(L(n));if(e instanceof oe)return new nt(L(n));if(e instanceof M){let t;if(typeof n=="string"||n instanceof u)t=_.fromHex(n);else if(n instanceof _)t=n;else throw new Error("Invalid account address.");return new st(t)}if(e instanceof ae&&e.value instanceof N){if(!(n instanceof Uint8Array))throw new Error(`${n} should be an instance of Uint8Array`);return new it(n)}throw new Error("Unknown type for TransactionArgument.")}var Vi="APTOS::RawTransaction",wt="APTOS::RawTransactionWithData",se=class{constructor(n,e){this.rawTxnBuilder=e,this.signingFunction=n}build(n,e,t){if(!this.rawTxnBuilder)throw new Error("this.rawTxnBuilder doesn't exist.");return this.rawTxnBuilder.build(n,e,t)}static getSigningMessage(n){const e=G.create();if(n instanceof V)e.update(Vi);else if(n instanceof We)e.update(wt);else if(n instanceof je)e.update(wt);else throw new Error("Unknown transaction type.");const t=e.digest(),s=$(n),i=new Uint8Array(t.length+s.length);return i.set(t),i.set(s,t.length),i}},ke=class extends se{constructor(n,e,t){super(n,t),this.publicKey=e}rawToSigned(n){const e=se.getSigningMessage(n),t=this.signingFunction(e),s=new Re(new z(this.publicKey),t);return new Ae(n,s)}sign(n){return $(this.rawToSigned(n))}},Ji=class extends se{constructor(n,e){super(n),this.publicKey=e}rawToSigned(n){const e=se.getSigningMessage(n),t=this.signingFunction(e),s=new He(this.publicKey,t);return new Ae(n,s)}sign(n){return $(this.rawToSigned(n))}},Yi=class Oe{constructor(e,t){this.abiMap=new Map,e.forEach(s=>{const i=new De(s),r=Ee.deserialize(i);let o;if(r instanceof ne){const a=r,{address:c,name:l}=a.module_name;o=`${u.fromUint8Array(c.address).toShortString()}::${l.value}::${a.name}`}else o=r.name;if(this.abiMap.has(o))throw new Error("Found conflicting ABI interfaces");this.abiMap.set(o,r)}),this.builderConfig={maxGasAmount:BigInt(It),expSecFromNow:kt,...t}}static toBCSArgs(e,t){if(e.length!==t.length)throw new Error("Wrong number of args provided.");return t.map((s,i)=>{const r=new y;return Ki(s,e[i].type_tag,r),r.getBytes()})}static toTransactionArguments(e,t){if(e.length!==t.length)throw new Error("Wrong number of args provided.");return t.map((s,i)=>Xi(s,e[i].type_tag))}setSequenceNumber(e){this.builderConfig.sequenceNumber=BigInt(e)}buildTransactionPayload(e,t,s){const i=t.map(a=>new ce(a).parseTypeTag());let r;if(!this.abiMap.has(e))throw new Error(`Cannot find function: ${e}`);const o=this.abiMap.get(e);if(o instanceof ne){const a=o,c=Oe.toBCSArgs(a.args,s);r=new Xe(new Ue(a.module_name,new A(a.name),i,c))}else if(o instanceof ot){const a=o,c=Oe.toTransactionArguments(a.args,s);r=new Qe(new Ge(a.code,i,c))}else throw new Error("Unknown ABI format.");return r}build(e,t,s){const{sender:i,sequenceNumber:r,gasUnitPrice:o,maxGasAmount:a,expSecFromNow:c,chainId:l}=this.builderConfig;if(!o)throw new Error("No gasUnitPrice provided.");const d=i instanceof _?i:_.fromHex(i),m=BigInt(Math.floor(Date.now()/1e3)+Number(c)),b=this.buildTransactionPayload(e,t,s);if(b)return new V(d,BigInt(r),b,BigInt(a),BigInt(o),m,new Ve(Number(l)));throw new Error("Invalid ABI.")}},jn=class{constructor(n,e){this.aptosClient=n,this.builderConfig=e}async fetchABI(n){const t=(await this.aptosClient.getAccountModules(n)).map(i=>i.abi).flatMap(i=>i.exposed_functions.filter(r=>r.is_entry).map(r=>({fullName:`${i.address}::${i.name}::${r.name}`,...r}))),s=new Map;return t.forEach(i=>{s.set(i.fullName,i)}),s}async build(n,e,t){if(n=(O=>O.replace(/^0[xX]0*/g,"0x"))(n),n.split("::").length!==3)throw new Error("'func' needs to be a fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer");const[r,o]=n.split("::"),a=await this.fetchABI(r);if(!a.has(n))throw new Error(`${n} doesn't exist.`);const c=a.get(n),d=c.params.filter(O=>O!=="signer"&&O!=="&signer").map((O,Ie)=>new Be(`var${Ie}`,new ce(O,e).parseTypeTag())),m=new ne(c.name,te.fromStr(`${r}::${o}`),"",c.generic_type_params.map((O,Ie)=>new Se(`${Ie}`)),d),{sender:b,...v}=this.builderConfig,is=b instanceof _?u.fromUint8Array(b.address):b,[{sequence_number:rs},os,{gas_estimate:as}]=await Promise.all([v!=null&&v.sequenceNumber?Promise.resolve({sequence_number:v==null?void 0:v.sequenceNumber}):this.aptosClient.getAccount(is),v!=null&&v.chainId?Promise.resolve(v==null?void 0:v.chainId):this.aptosClient.getChainId(),v!=null&&v.gasUnitPrice?Promise.resolve({gas_estimate:v==null?void 0:v.gasUnitPrice}):this.aptosClient.estimateGasPrice()]);return new Yi([$(m)],{sender:b,sequenceNumber:rs,chainId:os,gasUnitPrice:BigInt(as),...v}).build(n,e,t)}};h([$t(10*60*1e3)],jn.prototype,"fetchABI",1);var g=class R{constructor(e,t,s=!1){if(!e)throw new Error("Node URL cannot be empty.");s?this.nodeUrl=e:this.nodeUrl=Gs(e),this.config=t==null?{}:{...t}}async getAccount(e){const{data:t}=await B({url:this.nodeUrl,endpoint:`accounts/${u.ensure(e).hex()}`,originMethod:"getAccount",overrides:{...this.config}});return t}async getAccountTransactions(e,t){const{data:s}=await B({url:this.nodeUrl,endpoint:`accounts/${u.ensure(e).hex()}/transactions`,originMethod:"getAccountTransactions",params:{start:t==null?void 0:t.start,limit:t==null?void 0:t.limit},overrides:{...this.config}});return s}async getAccountModules(e,t){return await yt({url:this.nodeUrl,endpoint:`accounts/${e}/modules`,params:{ledger_version:t==null?void 0:t.ledgerVersion,limit:1e3},originMethod:"getAccountModules",overrides:{...this.config}})}async getAccountModule(e,t,s){const{data:i}=await B({url:this.nodeUrl,endpoint:`accounts/${u.ensure(e).hex()}/module/${t}`,originMethod:"getAccountModule",params:{ledger_version:s==null?void 0:s.ledgerVersion},overrides:{...this.config}});return i}async getAccountResources(e,t){return await yt({url:this.nodeUrl,endpoint:`accounts/${e}/resources`,params:{ledger_version:t==null?void 0:t.ledgerVersion,limit:9999},originMethod:"getAccountResources",overrides:{...this.config}})}async getAccountResource(e,t,s){const{data:i}=await B({url:this.nodeUrl,endpoint:`accounts/${u.ensure(e).hex()}/resource/${t}`,originMethod:"getAccountResource",params:{ledger_version:s==null?void 0:s.ledgerVersion},overrides:{...this.config}});return i}static generateBCSTransaction(e,t){return new ke(i=>{const r=e.signBuffer(i);return new f.Ed25519Signature(r.toUint8Array())},e.pubKey().toUint8Array()).sign(t)}static generateBCSSimulation(e,t){return new ke(i=>{const r=new Uint8Array(64);return new f.Ed25519Signature(r)},e.pubKey().toUint8Array()).sign(t)}async generateTransaction(e,t,s){const i={sender:e};if(s!=null&&s.sequence_number&&(i.sequenceNumber=s.sequence_number),s!=null&&s.gas_unit_price&&(i.gasUnitPrice=s.gas_unit_price),s!=null&&s.max_gas_amount&&(i.maxGasAmount=s.max_gas_amount),s!=null&&s.expiration_timestamp_secs){const o=Number.parseInt(s.expiration_timestamp_secs,10);i.expSecFromNow=o-Math.floor(Date.now()/1e3)}return new jn(this,i).build(t.function,t.type_arguments,t.arguments)}async generateFeePayerTransaction(e,t,s,i=[],r){const o=await this.generateTransaction(e,t,r),a=i.map(l=>_.fromHex(l));return new f.FeePayerRawTransaction(o,a,_.fromHex(s))}async submitFeePayerTransaction(e,t,s,i=[]){const r=new f.TransactionAuthenticatorFeePayer(t,e.secondary_signer_addresses,i,{address:e.fee_payer_address,authenticator:s}),o=$(new f.SignedTransaction(e.raw_txn,r));return await this.submitSignedBCSTransaction(o)}async signMultiTransaction(e,t){const s=new f.Ed25519Signature(e.signBuffer(se.getSigningMessage(t)).toUint8Array()),i=new f.AccountAuthenticatorEd25519(new f.Ed25519PublicKey(e.signingKey.publicKey),s);return Promise.resolve(i)}async signTransaction(e,t){return Promise.resolve(R.generateBCSTransaction(e,t))}async getEventsByCreationNumber(e,t,s){const{data:i}=await B({url:this.nodeUrl,endpoint:`accounts/${u.ensure(e).hex()}/events/${t}`,originMethod:"getEventsByCreationNumber",params:{start:s==null?void 0:s.start,limit:s==null?void 0:s.limit},overrides:{...this.config}});return i}async getEventsByEventHandle(e,t,s,i){const{data:r}=await B({url:this.nodeUrl,endpoint:`accounts/${u.ensure(e).hex()}/events/${t}/${s}`,originMethod:"getEventsByEventHandle",params:{start:i==null?void 0:i.start,limit:i==null?void 0:i.limit},overrides:{...this.config}});return r}async submitTransaction(e){return this.submitSignedBCSTransaction(e)}async simulateTransaction(e,t,s){let i;return e instanceof vt?i=R.generateBCSSimulation(e,t):e instanceof Te?i=new Ji(()=>{const{threshold:o}=e,a=[],c=[];for(let d=0;d<o;d+=1)a.push(d),c.push(new f.Ed25519Signature(new Uint8Array(64)));const l=f.MultiEd25519Signature.createBitmap(a);return new f.MultiEd25519Signature(c,l)},e).sign(t):i=new ke(()=>{const o=new Uint8Array(64);return new f.Ed25519Signature(o)},e.toBytes()).sign(t),this.submitBCSSimulation(i,s)}async submitSignedBCSTransaction(e){const{data:t}=await Y({url:this.nodeUrl,body:e,endpoint:"transactions",originMethod:"submitSignedBCSTransaction",contentType:"application/x.aptos.signed_transaction+bcs",overrides:{...this.config}});return t}async submitBCSSimulation(e,t){var s,i,r;const o={estimate_gas_unit_price:(s=t==null?void 0:t.estimateGasUnitPrice)!=null?s:!1,estimate_max_gas_amount:(i=t==null?void 0:t.estimateMaxGasAmount)!=null?i:!1,estimate_prioritized_gas_unit_price:(r=t==null?void 0:t.estimatePrioritizedGasUnitPrice)!=null?r:!1},{data:a}=await Y({url:this.nodeUrl,body:e,endpoint:"transactions/simulate",params:o,originMethod:"submitBCSSimulation",contentType:"application/x.aptos.signed_transaction+bcs",overrides:{...this.config}});return a}async getTransactions(e){var t;const{data:s}=await B({url:this.nodeUrl,endpoint:"transactions",originMethod:"getTransactions",params:{start:(t=e==null?void 0:e.start)==null?void 0:t.toString(),limit:e==null?void 0:e.limit},overrides:{...this.config}});return s}async getTransactionByHash(e){const{data:t}=await B({url:this.nodeUrl,endpoint:`transactions/by_hash/${e}`,originMethod:"getTransactionByHash",overrides:{...this.config}});return t}async getTransactionByVersion(e){const{data:t}=await B({url:this.nodeUrl,endpoint:`transactions/by_version/${e}`,originMethod:"getTransactionByVersion",overrides:{...this.config}});return t}async transactionPending(e){try{return(await this.getTransactionByHash(e)).type==="pending_transaction"}catch(t){if((t==null?void 0:t.status)===404)return!0;throw t}}async waitForTransactionWithResult(e,t){var s,i;const r=(s=t==null?void 0:t.timeoutSecs)!=null?s:Ks,o=(i=t==null?void 0:t.checkSuccess)!=null?i:!1;let a=!0,c=0,l;for(;a&&!(c>=r);){try{if(l=await this.getTransactionByHash(e),a=l.type==="pending_transaction",!a)break}catch(d){const m=d instanceof ct,b=m&&d.status!==404&&d.status>=400&&d.status<500;if(!m||b)throw d}await Ls(1e3),c+=1}if(l===void 0)throw new Error(`Waiting for transaction ${e} failed`);if(a)throw new Zi(`Waiting for transaction ${e} timed out after ${r} seconds`,l);if(!o)return l;if(!(l!=null&&l.success))throw new er(`Transaction ${e} failed with an error: ${l.vm_status}`,l);return l}async waitForTransaction(e,t){await this.waitForTransactionWithResult(e,t)}async getLedgerInfo(){const{data:e}=await B({url:this.nodeUrl,originMethod:"getLedgerInfo",overrides:{...this.config}});return e}async getChainId(){return(await this.getLedgerInfo()).chain_id}async getTableItem(e,t,s){var i;return(await Y({url:this.nodeUrl,body:t,endpoint:`tables/${e}/item`,originMethod:"getTableItem",params:{ledger_version:(i=s==null?void 0:s.ledgerVersion)==null?void 0:i.toString()},overrides:{...this.config}})).data}async generateRawTransaction(e,t,s){const[{sequence_number:i},r,{gas_estimate:o}]=await Promise.all([s!=null&&s.providedSequenceNumber?Promise.resolve({sequence_number:s.providedSequenceNumber}):this.getAccount(e),this.getChainId(),s!=null&&s.gasUnitPrice?Promise.resolve({gas_estimate:s.gasUnitPrice}):this.estimateGasPrice()]),{maxGasAmount:a,gasUnitPrice:c,expireTimestamp:l}={maxGasAmount:BigInt(It),gasUnitPrice:BigInt(o),expireTimestamp:BigInt(Math.floor(Date.now()/1e3)+kt),...s};return new f.RawTransaction(f.AccountAddress.fromHex(e),BigInt(i),t,a,c,l,new f.ChainId(r))}async generateSignSubmitTransaction(e,t,s){const i=await this.generateRawTransaction(e.address(),t,s),r=R.generateBCSTransaction(e,i);return(await this.submitSignedBCSTransaction(r)).hash}async signAndSubmitTransaction(e,t){const s=R.generateBCSTransaction(e,t);return(await this.submitSignedBCSTransaction(s)).hash}async publishPackage(e,t,s,i){const r=new y;T(s,r);const o=new f.TransactionPayloadEntryFunction(f.EntryFunction.natural("0x1::code","publish_package_txn",[],[x(t),r.getBytes()]));return this.generateSignSubmitTransaction(e,o,i)}async createResourceAccountAndPublishPackage(e,t,s,i,r){const o=new y;T(i,o);const a=new f.TransactionPayloadEntryFunction(f.EntryFunction.natural("0x1::resource_account","create_resource_account_and_publish_package",[],[x(t),x(s),o.getBytes()]));return this.generateSignSubmitTransaction(e,a,r)}async generateSignSubmitWaitForTransaction(e,t,s){const i=await this.generateSignSubmitTransaction(e,t,s);return this.waitForTransactionWithResult(i,s)}async estimateGasPrice(){const{data:e}=await B({url:this.nodeUrl,endpoint:"estimate_gas_price",originMethod:"estimateGasPrice",overrides:{...this.config}});return e}async estimateMaxGasAmount(e){const t=`0x1::coin::CoinStore<${Ws}>`,[{gas_estimate:s},i]=await Promise.all([this.estimateGasPrice(),this.getAccountResources(e)]),r=i.find(a=>a.type===t);return BigInt(r.data.coin.value)/BigInt(s)}async rotateAuthKeyEd25519(e,t,s){const{sequence_number:i,authentication_key:r}=await this.getAccount(e.address()),o=new vt(t),a=new f.RotationProofChallenge(f.AccountAddress.CORE_CODE_ADDRESS,"account","RotationProofChallenge",BigInt(i),f.AccountAddress.fromHex(e.address()),new f.AccountAddress(new u(r).toUint8Array()),o.pubKey().toUint8Array()),c=u.fromUint8Array($(a)),l=e.signHexString(c),d=o.signHexString(c),m=new f.TransactionPayloadEntryFunction(f.EntryFunction.natural("0x1::account","rotate_authentication_key",[],[$e(0),x(e.pubKey().toUint8Array()),$e(0),x(o.pubKey().toUint8Array()),x(l.toUint8Array()),x(d.toUint8Array())])),b=await this.generateRawTransaction(e.address(),m,s),v=R.generateBCSTransaction(e,b);return this.submitSignedBCSTransaction(v)}async lookupOriginalAddress(e){const t=await this.getAccountResource("0x1","0x1::account::OriginatingAddress"),{address_map:{handle:s}}=t.data,i=await this.getTableItem(s,{key_type:"address",value_type:"address",key:u.ensure(e).hex()});return new u(i)}async getBlockByHeight(e,t){const{data:s}=await B({url:this.nodeUrl,endpoint:`blocks/by_height/${e}`,originMethod:"getBlockByHeight",params:{with_transactions:t},overrides:{...this.config}});return s}async getBlockByVersion(e,t){const{data:s}=await B({url:this.nodeUrl,endpoint:`blocks/by_version/${e}`,originMethod:"getBlockByVersion",params:{with_transactions:t},overrides:{...this.config}});return s}async view(e,t){const{data:s}=await Y({url:this.nodeUrl,body:e,endpoint:"view",originMethod:"getTableItem",params:{ledger_version:t},overrides:{...this.config}});return s}clearCache(e){js(e)}};h([w],g.prototype,"getAccount",1);h([w],g.prototype,"getAccountTransactions",1);h([w,$t(10*60*1e3)],g.prototype,"getAccountModules",1);h([w],g.prototype,"getAccountModule",1);h([w],g.prototype,"getAccountResources",1);h([w],g.prototype,"getAccountResource",1);h([w],g.prototype,"getEventsByCreationNumber",1);h([w],g.prototype,"getEventsByEventHandle",1);h([w],g.prototype,"submitSignedBCSTransaction",1);h([w],g.prototype,"submitBCSSimulation",1);h([w],g.prototype,"getTransactions",1);h([w],g.prototype,"getTransactionByHash",1);h([w],g.prototype,"getTransactionByVersion",1);h([w],g.prototype,"getLedgerInfo",1);h([be()],g.prototype,"getChainId",1);h([w],g.prototype,"getTableItem",1);h([w,be({ttlMs:5*60*1e3,tags:["gas_estimates"]})],g.prototype,"estimateGasPrice",1);h([w],g.prototype,"estimateMaxGasAmount",1);h([w],g.prototype,"getBlockByHeight",1);h([w],g.prototype,"getBlockByVersion",1);h([w],g.prototype,"view",1);var Qn=g,Zi=class extends Error{constructor(n,e){super(n),this.lastSubmittedTransaction=e}},er=class extends Error{constructor(n,e){super(n),this.transaction=e}},ct=class extends Error{constructor(n,e,t,s){super(e),this.status=n,this.message=e,this.errorCode=t,this.vmErrorCode=s}};function w(n,e,t){const s=t.value;return t.value=async function(...r){var o,a;try{return await s.apply(this,[...r])}catch(c){throw c instanceof xt?new ct(c.status,JSON.stringify({message:c.message,...c.data}),(o=c.data)==null?void 0:o.error_code,(a=c.data)==null?void 0:a.vm_error_code):c}},t}var Xn=class p{constructor(e,t){this.endpoint=e,this.config=t}static validateAddress(e){if(e.length<66)throw new Error(`${e} is less than 66 chars long.`)}async queryIndexer(e){const t=await Y({url:this.endpoint,body:e,overrides:{WITH_CREDENTIALS:!1,...this.config}});if(t.data.errors)throw new ct(t.data.errors[0].extensions.code,JSON.stringify({message:t.data.errors[0].message,error_code:t.data.errors[0].extensions.code}));return t.data.data}async getIndexerLedgerInfo(){const e={query:Ci};return this.queryIndexer(e)}async getAccountNFTs(e,t){const s=u.ensure(e).hex();p.validateAddress(s);const i={query:Si,variables:{address:s,offset:t==null?void 0:t.offset,limit:t==null?void 0:t.limit}};return this.queryIndexer(i)}async getTokenActivities(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const o={token_data_id:{_eq:r}};t!=null&&t.tokenStandard&&(o.token_standard={_eq:t==null?void 0:t.tokenStandard});const a={query:Mi,variables:{where_condition:o,offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}async getTokenActivitiesCount(e){const t={query:qi,variables:{token_id:e}};return this.queryIndexer(t)}async getAccountTokensCount(e,t){var s,i;const r={owner_address:{_eq:e},amount:{_gt:"0"}};t!=null&&t.tokenStandard&&(r.token_standard={_eq:t==null?void 0:t.tokenStandard});const o=u.ensure(e).hex();p.validateAddress(o);const a={query:Bi,variables:{where_condition:r,offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit}};return this.queryIndexer(a)}async getTokenData(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const o={token_data_id:{_eq:r}};t!=null&&t.tokenStandard&&(o.token_standard={_eq:t==null?void 0:t.tokenStandard});const a={query:Fi,variables:{where_condition:o,offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}async getTokenOwnersData(e,t,s){var i,r;const o=u.ensure(e).hex();p.validateAddress(o);const a={token_data_id:{_eq:o},amount:{_gt:"0"}};t&&(a.property_version_v1={_eq:t}),s!=null&&s.tokenStandard&&(a.token_standard={_eq:s==null?void 0:s.tokenStandard});const c={query:Hi,variables:{where_condition:a,offset:(i=s==null?void 0:s.options)==null?void 0:i.offset,limit:(r=s==null?void 0:s.options)==null?void 0:r.limit,order_by:s==null?void 0:s.orderBy}};return this.queryIndexer(c)}async getTokenCurrentOwnerData(e,t,s){var i,r;const o=u.ensure(e).hex();p.validateAddress(o);const a={token_data_id:{_eq:o},amount:{_gt:"0"}};t&&(a.property_version_v1={_eq:t}),s!=null&&s.tokenStandard&&(a.token_standard={_eq:s==null?void 0:s.tokenStandard});const c={query:Di,variables:{where_condition:a,offset:(i=s==null?void 0:s.options)==null?void 0:i.offset,limit:(r=s==null?void 0:s.options)==null?void 0:r.limit,order_by:s==null?void 0:s.orderBy}};return this.queryIndexer(c)}async getOwnedTokens(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const o={owner_address:{_eq:r},amount:{_gt:0}};t!=null&&t.tokenStandard&&(o.token_standard={_eq:t==null?void 0:t.tokenStandard});const a={query:Ni,variables:{where_condition:o,offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}async getOwnedTokensByTokenData(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const o={token_data_id:{_eq:r},amount:{_gt:0}};t!=null&&t.tokenStandard&&(o.token_standard={_eq:t==null?void 0:t.tokenStandard});const a={query:Oi,variables:{where_condition:o,offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}async getTokenOwnedFromCollectionAddress(e,t,s){var i,r;const o=u.ensure(e).hex();p.validateAddress(o);const a=u.ensure(t).hex();p.validateAddress(a);const c={owner_address:{_eq:o},current_token_data:{collection_id:{_eq:a}},amount:{_gt:0}};s!=null&&s.tokenStandard&&(c.token_standard={_eq:s==null?void 0:s.tokenStandard});const l={query:Ri,variables:{where_condition:c,offset:(i=s==null?void 0:s.options)==null?void 0:i.offset,limit:(r=s==null?void 0:s.options)==null?void 0:r.limit,order_by:s==null?void 0:s.orderBy}};return this.queryIndexer(l)}async getTokenOwnedFromCollectionNameAndCreatorAddress(e,t,s,i){const r=await this.getCollectionAddress(s,t,i);return await this.getTokenOwnedFromCollectionAddress(e,r,i)}async getCollectionData(e,t,s){var i,r;const o=u.ensure(e).hex();p.validateAddress(o);const a={collection_name:{_eq:t},creator_address:{_eq:o}};s!=null&&s.tokenStandard&&(a.token_standard={_eq:s==null?void 0:s.tokenStandard});const c={query:Ii,variables:{where_condition:a,offset:(i=s==null?void 0:s.options)==null?void 0:i.offset,limit:(r=s==null?void 0:s.options)==null?void 0:r.limit,order_by:s==null?void 0:s.orderBy}};return this.queryIndexer(c)}async getCollectionAddress(e,t,s){return(await this.getCollectionData(e,t,s)).current_collections_v2[0].collection_id}async getCollectionsWithOwnedTokens(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const o={owner_address:{_eq:r}};t!=null&&t.tokenStandard&&(o.current_collection={token_standard:{_eq:t==null?void 0:t.tokenStandard}});const a={query:ki,variables:{where_condition:o,offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}async getAccountTransactionsCount(e){const t=u.ensure(e).hex();p.validateAddress(t);const s={query:Ei,variables:{address:t}};return this.queryIndexer(s)}async getAccountTransactionsData(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const a={query:zi,variables:{where_condition:{account_address:{_eq:r}},offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}async getTopUserTransactions(e){const t={query:Li,variables:{limit:e}};return this.queryIndexer(t)}async getUserTransactions(e){var t,s;const i={version:{_lte:e==null?void 0:e.startVersion}},r={query:Gi,variables:{where_condition:i,offset:(t=e==null?void 0:e.options)==null?void 0:t.offset,limit:(s=e==null?void 0:e.options)==null?void 0:s.limit,order_by:e==null?void 0:e.orderBy}};return this.queryIndexer(r)}async getDelegatedStakingActivities(e,t){const s=u.ensure(e).hex(),i=u.ensure(t).hex();p.validateAddress(s),p.validateAddress(i);const r={query:xi,variables:{delegatorAddress:s,poolAddress:i}};return this.queryIndexer(r)}async getNumberOfDelegators(e){const t=u.ensure(e).hex();p.validateAddress(t);const s={query:Pi,variables:{poolAddress:t}};return this.queryIndexer(s)}async getAccountCoinsData(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const a={query:Ai,variables:{where_condition:{owner_address:{_eq:r}},offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}async getAccountCoinsDataCount(e){const t=u.ensure(e).hex();p.validateAddress(t);const s={query:Ui,variables:{address:t}};return this.queryIndexer(s)}async getAccountOwnedObjects(e,t){var s,i;const r=u.ensure(e).hex();p.validateAddress(r);const a={query:$i,variables:{where_condition:{owner_address:{_eq:r}},offset:(s=t==null?void 0:t.options)==null?void 0:s.offset,limit:(i=t==null?void 0:t.options)==null?void 0:i.limit,order_by:t==null?void 0:t.orderBy}};return this.queryIndexer(a)}},Vn=class{constructor(n,e,t=!1){let s=null,i=null;if(typeof n=="object"&&tr(n)?(s=n.fullnodeUrl,i=n.indexerUrl,this.network="CUSTOM"):(s=Js[n],i=Vs[n],this.network=n),this.network==="CUSTOM"&&!s)throw new Error("fullnode url is not provided");i&&(this.indexerClient=new Xn(i,e)),this.aptosClient=new Qn(s,e,t)}};function Jn(n,e,t){Object.getOwnPropertyNames(e.prototype).forEach(s=>{const i=Object.getOwnPropertyDescriptor(e.prototype,s);i&&(i.value=function(...r){return this[t][s](...r)},Object.defineProperty(n.prototype,s,i))}),Object.getOwnPropertyNames(e).forEach(s=>{const i=Object.getOwnPropertyDescriptor(e,s);i&&(i.value=function(...r){return this[t][s](...r)},!n.hasOwnProperty.call(n,s)&&Object.defineProperty(n,s,i))})}Jn(Vn,Qn,"aptosClient");Jn(Vn,Xn,"indexerClient");function tr(n){return n.fullnodeUrl!==void 0&&typeof n.fullnodeUrl=="string"}var Yn=class{constructor(n,e){this.type=n,this.value=e}},Zn=class{constructor(){this.data={}}setProperty(n,e){this.data[n]=e}};function nr(n){let e;return n==="string"||n==="String"?e=new q(Le):e=new ce(n).parseTypeTag(),e}function es(n){const e=n.map.data,t=new Zn;return e.forEach(s=>{const{key:i}=s,r=s.value.value,o=s.value.type,a=nr(o),c=sr(a,r),l=new Yn(o,c);t.setProperty(i,l)}),t}function sr(n,e){const t=new De(new u(e).toUint8Array());let s="";return n instanceof N?s=t.deserializeU8().toString():n instanceof j?s=t.deserializeU64().toString():n instanceof Q?s=t.deserializeU128().toString():n instanceof W?s=t.deserializeBool()?"true":"false":n instanceof M?s=u.fromUint8Array(t.deserializeFixedBytes(32)).hex():n instanceof q&&n.isStringTypeTag()?s=t.deserializeStr():s=e,s}var ir={};me(ir,{PropertyMap:()=>Zn,PropertyValue:()=>Yn,Token:()=>or,TokenData:()=>rr});var rr=class{constructor(n,e,t,s,i,r,o,a){this.collection=n,this.description=e,this.name=t,this.maximum=s,this.supply=i,this.uri=r,this.default_properties=es(o),this.mutability_config=a}},or=class{constructor(n,e,t){this.id=n,this.amount=e,this.token_properties=es(t)}},ar={};me(ar,{AptosErrorCode:()=>ts,MoveFunctionVisibility:()=>ns,RoleType:()=>ss});var ts=(n=>(n.ACCOUNT_NOT_FOUND="account_not_found",n.RESOURCE_NOT_FOUND="resource_not_found",n.MODULE_NOT_FOUND="module_not_found",n.STRUCT_FIELD_NOT_FOUND="struct_field_not_found",n.VERSION_NOT_FOUND="version_not_found",n.TRANSACTION_NOT_FOUND="transaction_not_found",n.TABLE_ITEM_NOT_FOUND="table_item_not_found",n.BLOCK_NOT_FOUND="block_not_found",n.STATE_VALUE_NOT_FOUND="state_value_not_found",n.VERSION_PRUNED="version_pruned",n.BLOCK_PRUNED="block_pruned",n.INVALID_INPUT="invalid_input",n.INVALID_TRANSACTION_UPDATE="invalid_transaction_update",n.SEQUENCE_NUMBER_TOO_OLD="sequence_number_too_old",n.VM_ERROR="vm_error",n.HEALTH_CHECK_FAILED="health_check_failed",n.MEMPOOL_IS_FULL="mempool_is_full",n.INTERNAL_ERROR="internal_error",n.WEB_FRAMEWORK_ERROR="web_framework_error",n.BCS_NOT_SUPPORTED="bcs_not_supported",n.API_DISABLED="api_disabled",n))(ts||{}),ns=(n=>(n.PRIVATE="private",n.PUBLIC="public",n.FRIEND="friend",n))(ns||{}),ss=(n=>(n.VALIDATOR="validator",n.FULL_NODE="full_node",n))(ss||{});export{u as H,Ys as N,Vn as P};
