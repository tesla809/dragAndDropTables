"use strict";
const app = function() {
  document.addEventListener("DOMContentLoaded", function(event) {
  	const $ = require('jquery');
    console.log("DOM fully loaded and parsed");
    console.log(`jquery works ${$}`);
  });
}();
