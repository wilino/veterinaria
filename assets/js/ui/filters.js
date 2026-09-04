/** Generic client-side filtering for collections marked with data attributes. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});

  function values($form) {
    var filters = {};
    $form.find("[data-filter-field]").each(function () {
      var $field = $(this);
      var key = $field.data("filter-field");
      var value = String($field.val() || "")
        .trim()
        .toLowerCase();
      if (key && value) filters[key] = value;
    });
    return filters;
  }

  function apply($form) {
    var target = $form.data("filter-target");
    var active = values($form);
    var $items = $(target).find("[data-filter-item]");
    $items.each(function () {
      var $item = $(this);
      var visible = Object.keys(active).every(function (key) {
        var actual = String($item.data(key) || "").toLowerCase();
        return actual.indexOf(active[key]) !== -1;
      });
      $item
        .toggleClass("d-none", !visible)
        .attr("aria-hidden", String(!visible));
    });
    var count = $items.not(".d-none").length;
    $form.find("[data-filter-count]").text(count);
    $(document).trigger("vetcare:filter-change", [$form, active, count]);
    return count;
  }

  function init() {
    $(document)
      .off(
        "input.vcFilters change.vcFilters",
        "[data-filter-target] [data-filter-field]",
      )
      .on(
        "input.vcFilters change.vcFilters",
        "[data-filter-target] [data-filter-field]",
        function () {
          apply($(this).closest("[data-filter-target]"));
        },
      )
      .off("click.vcFilters", '[data-action="clear-filters"]')
      .on("click.vcFilters", '[data-action="clear-filters"]', function () {
        var $form = $(this).closest("[data-filter-target]");
        $form[0].reset();
        apply($form);
      });
  }

  VetCare.UI = VetCare.UI || {};
  VetCare.UI.Filters = { init: init, apply: apply };
})(window, window.jQuery);
