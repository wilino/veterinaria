/**
 * Shared, browser-safe configuration. Environment-specific values belong here,
 * never in individual pages or UI modules.
 */
(function (window) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});
  var currentScript =
    document.currentScript ||
    document.querySelector('script[src*="assets/js/config.js"]');
  var scriptSource = currentScript
    ? currentScript.getAttribute("src")
    : "assets/js/config.js";
  var assetBase = scriptSource.replace(/js\/config\.js(?:\?.*)?$/, "");

  VetCare.Config = Object.freeze({
    appName: "VetCare Pro",
    apiBaseUrl: "/api/v1",
    mockMode: true,
    assetBase: assetBase,
    mockDataUrl: assetBase + "data/mock-data.json",
    requestTimeout: 15000,
    locale: "es-BO",
    partialsDirectory: "partials",
    toastDelay: 5000,
    selectors: {
      page: "body[data-page]",
      partial: "[data-partial]",
      needsValidation: "form.needs-validation",
      filter: "[data-filter-target]",
      filterItem: "[data-filter-item]",
    },
  });
})(window);
