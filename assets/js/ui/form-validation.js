/** Bootstrap-compatible client-side validation with accessible error feedback. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});

  function focusFirstInvalid(form) {
    var field = form.querySelector(":invalid");
    if (field) field.focus();
  }

  function validate(form) {
    var valid = form.checkValidity();
    $(form).addClass("was-validated");
    $(form)
      .find(":input[required], :input[aria-describedby]")
      .each(function () {
        var $field = $(this);
        $field.attr("aria-invalid", String(!this.validity.valid));
      });
    return valid;
  }

  function init() {
    $(document)
      .off("submit.vcValidation", "form.needs-validation")
      .on("submit.vcValidation", "form.needs-validation", function (event) {
        if (!validate(this)) {
          event.preventDefault();
          event.stopPropagation();
          focusFirstInvalid(this);
          if (VetCare.UI && VetCare.UI.Toast)
            VetCare.UI.Toast.show(
              "Revisa los campos marcados antes de continuar.",
              "danger",
            );
        }
      });
    $(document)
      .off(
        "input.vcValidation change.vcValidation",
        "form.needs-validation :input",
      )
      .on(
        "input.vcValidation change.vcValidation",
        "form.needs-validation :input",
        function () {
          if ($(this).closest("form").hasClass("was-validated"))
            $(this).attr("aria-invalid", String(!this.validity.valid));
        },
      );
  }

  VetCare.UI = VetCare.UI || {};
  VetCare.UI.FormValidation = { init: init, validate: validate };
})(window, window.jQuery);
