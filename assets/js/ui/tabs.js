/** Bootstrap tab setup with optional panel state hooks. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});

  function init() {
    $(document)
      .off("click.vcTabs", '[data-action="tab-show"]')
      .on("click.vcTabs", '[data-action="tab-show"]', function (event) {
        event.preventDefault();
        var target = $(this).data("target");
        var element = document.querySelector(target);
        if (!element || !window.bootstrap || !window.bootstrap.Tab) return;
        window.bootstrap.Tab.getOrCreateInstance(element).show();
      })
      .off("shown.bs.tab.vcTabs", '[data-bs-toggle="tab"]')
      .on("shown.bs.tab.vcTabs", '[data-bs-toggle="tab"]', function (event) {
        $(document).trigger("vetcare:tab-change", [
          $(event.target).data("bs-target") || $(event.target).attr("href"),
        ]);
      });
  }

  VetCare.UI = VetCare.UI || {};
  VetCare.UI.Tabs = { init: init };
})(window, window.jQuery);
