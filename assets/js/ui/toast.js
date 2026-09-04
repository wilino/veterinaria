/** Accessible Bootstrap Toast wrapper. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});
  var config = VetCare.Config;
  var variants = {
    success: "text-bg-success",
    danger: "text-bg-danger",
    warning: "text-bg-warning",
    info: "text-bg-primary",
  };

  function container() {
    var $container = $("#vc-toast-container");
    if (!$container.length) {
      $container = $("<div>", {
        id: "vc-toast-container",
        class: "toast-container position-fixed top-0 end-0 p-3",
        "aria-live": "polite",
        "aria-atomic": "true",
      }).appendTo("body");
    }
    return $container;
  }

  function show(message, variant, options) {
    var settings = $.extend({ delay: config.toastDelay, title: null }, options);
    var type = variants[variant] ? variant : "info";
    var $toast = $("<div>", {
      class: "toast border-0 " + variants[type],
      role: "status",
      "aria-live": type === "danger" ? "assertive" : "polite",
    });
    var $body = $("<div>", { class: "d-flex" }).appendTo($toast);
    $("<div>", { class: "toast-body" })
      .text(message || "")
      .appendTo($body);
    $("<button>", {
      type: "button",
      class: "btn-close me-2 m-auto",
      "data-bs-dismiss": "toast",
      "aria-label": "Cerrar",
    }).appendTo($body);
    container().append($toast);
    $toast.on("hidden.bs.toast", function () {
      $toast.remove();
    });
    if (window.bootstrap && window.bootstrap.Toast)
      window.bootstrap.Toast.getOrCreateInstance($toast[0], {
        delay: settings.delay,
      }).show();
    else
      setTimeout(function () {
        $toast.remove();
      }, settings.delay);
    return $toast;
  }

  VetCare.UI = VetCare.UI || {};
  VetCare.UI.Toast = {
    init: function () {
      $(document)
        .off("click.vcToast", '[data-action="show-toast"]')
        .on("click.vcToast", '[data-action="show-toast"]', function (event) {
          event.preventDefault();
          var $trigger = $(this);
          show(
            $trigger.data("toast-message") || "Acción completada.",
            $trigger.data("toast-variant") || "info",
          );
        });
    },
    show: show,
  };
})(window, window.jQuery);
