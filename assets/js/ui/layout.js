/** Shared page chrome, partial loading and navigation interactions. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});
  var config = VetCare.Config;

  function normalizeBase(base) {
    return String(base || "").replace(/\/$/, "");
  }

  function partialUrl(name, element) {
    if (
      /^(https?:)?\/\//.test(name) ||
      /^\.?\.\//.test(name) ||
      name.indexOf("/") !== -1
    )
      return name;
    var base = element.closest("[data-partial-base]").data("partial-base");
    if (base === undefined) base = $("body").data("partial-base");
    base = normalizeBase(base === undefined ? "." : base);
    return (
      base +
      "/" +
      config.partialsDirectory +
      "/" +
      (String(name).endsWith(".html") ? name : name + ".html")
    );
  }

  function loadPartials() {
    var pending = [];
    $(config.selectors.partial).each(function () {
      var $target = $(this);
      var name = $target.data("partial");
      if (!name) return;
      pending.push(
        $.ajax({
          url: partialUrl(name, $target),
          dataType: "html",
          cache: false,
        })
          .done(function (markup) {
            $target.html(markup).attr("data-partial-loaded", "true");
          })
          .fail(function () {
            $target.empty().attr("data-partial-error", "true");
            $(document).trigger("vetcare:partial-error", [name]);
          }),
      );
    });
    return $.when.apply($, pending);
  }

  function activateNavigation() {
    var page = $("body").data("page");
    if (!page) return;
    $("[data-nav-page]").each(function () {
      var $item = $(this);
      var isActive = String($item.data("nav-page")) === String(page);
      $item
        .toggleClass("active", isActive)
        .attr("aria-current", isActive ? "page" : null);
    });
  }

  function toggleSidebar() {
    var $layout = $(".vc-app-layout").first();
    var $scope = $layout.length ? $layout : $("body");
    $scope.toggleClass("vc-sidebar-collapsed");
    var isCollapsed = $scope.hasClass("vc-sidebar-collapsed");
    $('[data-action="toggle-sidebar"]').attr(
      "aria-expanded",
      String(!isCollapsed),
    );
    $(document).trigger("vetcare:sidebar-toggle", [isCollapsed]);
  }

  function initOffcanvas(target) {
    var element = document.querySelector(target);
    if (!element || !window.bootstrap || !window.bootstrap.Offcanvas) return;
    window.bootstrap.Offcanvas.getOrCreateInstance(element).toggle();
  }

  VetCare.UI = VetCare.UI || {};
  VetCare.UI.Layout = {
    init: function () {
      $(document)
        .off("click.vcLayout", '[data-action="toggle-sidebar"]')
        .on("click.vcLayout", '[data-action="toggle-sidebar"]', function () {
          toggleSidebar();
        })
        .off("click.vcLayoutOffcanvas", '[data-action="toggle-offcanvas"]')
        .on(
          "click.vcLayoutOffcanvas",
          '[data-action="toggle-offcanvas"]',
          function () {
            initOffcanvas($(this).data("target"));
          },
        );
      activateNavigation();
    },
    loadPartials: loadPartials,
    activateNavigation: activateNavigation,
  };
})(window, window.jQuery);
