/** Application entry point. Load this script last, with defer. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});

  function initializeModules() {
    var ui = VetCare.UI || {};
    ["Layout", "Modal", "Toast", "Tabs", "Filters", "FormValidation"].forEach(
      function (name) {
        if (ui[name] && typeof ui[name].init === "function") ui[name].init();
      },
    );
  }

  function initializePage() {
    var page = $("body").data("page");
    VetCare.State.set("page", page || null);
    if (page && VetCare.Pages && typeof VetCare.Pages[page] === "function")
      VetCare.Pages[page]();
    $(document).trigger("vetcare:ready", [page || null]);
  }

  function start() {
    var load =
      VetCare.UI && VetCare.UI.Layout && VetCare.UI.Layout.loadPartials;
    var done =
      typeof load === "function" ? load() : $.Deferred().resolve().promise();
    $.when(done).always(function () {
      initializeModules();
      initializePage();
    });
  }

  VetCare.App = { start: start, initializeModules: initializeModules };
  $(start);
})(window, window.jQuery);
