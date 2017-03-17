"use strict";

var app = function () {
  document.addEventListener("DOMContentLoaded", function (event) {
    var $ = require('jquery');
    console.log("DOM fully loaded and parsed");
    console.log("jquery works " + $);
  });
}();
