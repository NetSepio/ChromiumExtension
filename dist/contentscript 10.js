/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/contentscript.js ***!
  \******************************/
var getPriceText = function getPriceText() {
  var _tag$innerText;

  var tag = document.querySelector('div.ds-summary-row h4 span');
  return (_tag$innerText = tag === null || tag === void 0 ? void 0 : tag.innerText) !== null && _tag$innerText !== void 0 ? _tag$innerText : 'No data';
};

var getRentText = function getRentText() {
  var _tag$innerText2;

  var tag = document.querySelector('div#ds-rental-home-values div.ds-expandable-card-section-default-padding div div span');
  return (_tag$innerText2 = tag === null || tag === void 0 ? void 0 : tag.innerText) !== null && _tag$innerText2 !== void 0 ? _tag$innerText2 : 'No data';
};

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
  console.log(msg, sender);
  callback("Price: ".concat(getPriceText(), "\nRent: ").concat(getRentText()));
});
/******/ })()
;
//# sourceMappingURL=contentscript.js.map