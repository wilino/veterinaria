/** Modal triggers and a reusable confirmation dialog. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});
  var confirmId = "vc-confirm-modal";

  function instance(selector) {
    var element =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    if (!element || !window.bootstrap || !window.bootstrap.Modal) return null;
    return window.bootstrap.Modal.getOrCreateInstance(element);
  }

  function show(selector) {
    var modal = instance(selector);
    if (modal) modal.show();
  }

  function hide(selector) {
    var modal = instance(selector);
    if (modal) modal.hide();
  }

  function ensureConfirmModal() {
    var $modal = $("#" + confirmId);
    if ($modal.length) return $modal;
    $modal = $("<div>", {
      id: confirmId,
      class: "modal fade",
      tabindex: "-1",
      "aria-labelledby": confirmId + "-title",
      "aria-hidden": "true",
    })
      .append(
        $("<div>", { class: "modal-dialog modal-dialog-centered" }).append(
          $("<div>", { class: "modal-content" })
            .append(
              $("<div>", { class: "modal-header" }).append(
                $("<h2>", {
                  id: confirmId + "-title",
                  class: "modal-title fs-5",
                }),
                $("<button>", {
                  type: "button",
                  class: "btn-close",
                  "data-bs-dismiss": "modal",
                  "aria-label": "Cerrar",
                }),
              ),
            )
            .append($("<div>", { class: "modal-body" }))
            .append(
              $("<div>", { class: "modal-footer" }).append(
                $("<button>", {
                  type: "button",
                  class: "btn btn-outline-secondary",
                  "data-bs-dismiss": "modal",
                }).text("Cancelar"),
                $("<button>", {
                  type: "button",
                  class: "btn btn-primary",
                  "data-action": "confirm-accept",
                }).text("Confirmar"),
              ),
            ),
        ),
      )
      .appendTo("body");
    return $modal;
  }

  function confirm(options) {
    var settings = $.extend(
      {
        title: "Confirmar acción",
        message: "¿Deseas continuar?",
        confirmText: "Confirmar",
        confirmClass: "btn-primary",
      },
      options,
    );
    var $modal = ensureConfirmModal();
    $modal.find(".modal-title").text(settings.title);
    $modal.find(".modal-body").text(settings.message);
    var $accept = $modal.find('[data-action="confirm-accept"]');
    $accept
      .text(settings.confirmText)
      .attr("class", "btn " + settings.confirmClass)
      .off("click.vcConfirm")
      .one("click.vcConfirm", function () {
        var result =
          typeof settings.onConfirm === "function"
            ? settings.onConfirm()
            : null;
        if (result !== false) hide("#" + confirmId);
      });
    show("#" + confirmId);
  }

  VetCare.UI = VetCare.UI || {};
  VetCare.UI.Modal = {
    init: function () {
      $(document)
        .off("click.vcModal", '[data-action="modal-open"]')
        .on("click.vcModal", '[data-action="modal-open"]', function () {
          show($(this).data("target"));
        });
    },
    show: show,
    hide: hide,
    confirm: confirm,
  };
})(window, window.jQuery);
