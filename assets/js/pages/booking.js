/** Public appointment-request page. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});
  var selectors = {
    form: "#booking-form",
    error: "#booking-error",
    errorMessage: "[data-booking-error-message]",
    success: "#booking-success",
    submit: "#booking-submit",
    submitLabel: ".booking-submit-label",
    submitLoading: ".booking-submit-loading",
    observationCount: "#observations-count",
  };

  function value(form, name) {
    return $.trim(
      $(form)
        .find('[name="' + name + '"]')
        .val() || "",
    );
  }

  function selectedText(form, name) {
    var $field = $(form).find('[name="' + name + '"]');
    return $.trim($field.find("option:selected").text() || "");
  }

  function formatDate(input) {
    if (!input) return "Aún no seleccionada";
    var parts = input.split("-");
    if (parts.length !== 3) return input;
    return new Intl.DateTimeFormat("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(
      new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])),
    );
  }

  function setSummary(form) {
    var petName = value(form, "petName");
    var species = selectedText(form, "petSpecies");
    var service = selectedText(form, "serviceId");
    var phone = value(form, "ownerPhone");
    var email = value(form, "ownerEmail");
    var hasSpecies = $(form).find('[name="petSpecies"]').val();
    var hasService = $(form).find('[name="serviceId"]').val();
    var hasTime = $(form).find('[name="preferredTime"]').val();

    $('[data-summary="pet"]').text(
      petName
        ? petName + (hasSpecies ? " · " + species : "")
        : "Aún no indicado",
    );
    $('[data-summary="service"]').text(
      hasService ? service : "Aún no seleccionado",
    );
    $('[data-summary="date"]').text(formatDate(value(form, "preferredDate")));
    $('[data-summary="time"]').text(
      hasTime ? selectedText(form, "preferredTime") : "Aún no seleccionado",
    );
    $('[data-summary="contact"]').text(
      phone || email
        ? [phone, email].filter(Boolean).join(" · ")
        : "Aún no indicado",
    );
  }

  function setLoading(isLoading) {
    $(selectors.submit).prop("disabled", isLoading);
    $(selectors.submitLabel).toggleClass("d-none", isLoading);
    $(selectors.submitLoading).toggleClass("d-none", !isLoading);
  }

  function showError(message) {
    $(selectors.errorMessage).text(message);
    $(selectors.error).removeClass("d-none").trigger("focus");
  }

  function hideError() {
    $(selectors.error).addClass("d-none");
  }

  function payloadFrom(form) {
    return {
      owner: {
        name: value(form, "ownerName"),
        document: value(form, "ownerDocument"),
        phone: value(form, "ownerPhone"),
        email: value(form, "ownerEmail"),
      },
      pet: {
        name: value(form, "petName"),
        species: value(form, "petSpecies"),
        breed: value(form, "petBreed"),
        age: value(form, "petAge"),
      },
      serviceId: value(form, "serviceId"),
      serviceName: selectedText(form, "serviceId"),
      preferredDate: value(form, "preferredDate"),
      preferredTime: value(form, "preferredTime"),
      preferredTimeLabel: selectedText(form, "preferredTime"),
      observations: value(form, "observations"),
      contactConsent: $(form).find('[name="contactConsent"]').is(":checked"),
    };
  }

  function showSuccess(form, response) {
    var request = response && response.data ? response.data : {};
    var reference =
      request.id || (response && response.requestId) || "VC-PENDIENTE";
    var payload = payloadFrom(form);
    $("#booking-reference").text(reference);
    $('[data-confirmation="pet"]').text(payload.pet.name);
    $('[data-confirmation="service"]').text(payload.serviceName);
    $('[data-confirmation="schedule"]').text(
      formatDate(payload.preferredDate) + " · " + payload.preferredTimeLabel,
    );
    $(selectors.form).addClass("d-none");
    $(selectors.success).removeClass("d-none").trigger("focus");
  }

  function requestServices(form) {
    if (!VetCare.Api || typeof VetCare.Api.get !== "function") return;
    VetCare.Api.get("/services").then(function (response) {
      var services = response && response.data;
      if (!Array.isArray(services) || !services.length) return;
      var $select = $(form).find('[name="serviceId"]');
      var current = $select.val();
      var $placeholder = $select.find('option[value=""]').first();
      $select.empty().append($placeholder);
      $.each(services, function (_, service) {
        if (!service || !service.id || !service.name) return;
        $("<option>", { value: service.id, text: service.name }).appendTo(
          $select,
        );
      });
      $("<option>", {
        value: "consulta-especializada",
        text: "Consulta especializada",
      }).appendTo($select);
      $("<option>", {
        value: "control",
        text: "Control o seguimiento",
      }).appendTo($select);
      $select.val(current);
    });
  }

  function resetBooking(form) {
    form.reset();
    $(form).removeClass("was-validated");
    $(form).find(":input").removeAttr("aria-invalid");
    $(selectors.success).addClass("d-none");
    $(selectors.form).removeClass("d-none");
    hideError();
    setSummary(form);
    $(form).find("#owner-name").trigger("focus");
  }

  function init() {
    var form = document.querySelector(selectors.form);
    if (!form) return;

    var today = new Date();
    var localToday = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 10);
    $(form).find('[name="preferredDate"]').attr("min", localToday);
    setSummary(form);
    requestServices(form);

    $(form)
      .off("input.booking change.booking", ":input")
      .on("input.booking change.booking", ":input", function () {
        if (this.name === "observations")
          $(selectors.observationCount).text(this.value.length);
        setSummary(form);
      })
      .off("submit.booking")
      .on("submit.booking", function (event) {
        event.preventDefault();
        hideError();

        var validation = VetCare.UI && VetCare.UI.FormValidation;
        var valid =
          validation && typeof validation.validate === "function"
            ? validation.validate(form)
            : form.checkValidity();
        if (!valid) return;

        if (!VetCare.Api || typeof VetCare.Api.post !== "function") {
          showError(
            "El servicio de reservas no está disponible. Inténtalo más tarde.",
          );
          return;
        }

        setLoading(true);
        VetCare.Api.post("/booking-requests", payloadFrom(form))
          .then(
            function (response) {
              showSuccess(form, response);
            },
            function (error) {
              showError(
                (error && error.message) ||
                  "No pudimos enviar tu solicitud. Inténtalo nuevamente.",
              );
            },
          )
          .always(function () {
            setLoading(false);
          });
      });

    $(document)
      .off("click.booking", '[data-action="new-booking"]')
      .on("click.booking", '[data-action="new-booking"]', function () {
        resetBooking(form);
      });
  }

  VetCare.Pages = VetCare.Pages || {};
  VetCare.Pages.booking = init;
})(window, window.jQuery);
