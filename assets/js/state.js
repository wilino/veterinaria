/** Lightweight observable state store for page modules. */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});
  var listeners = {};
  var store = {
    page: null,
    session: null,
    loading: false,
  };

  function clone(value) {
    if (value === undefined) return undefined;
    if (value === null || typeof value !== "object") return value;
    return $.extend(true, Array.isArray(value) ? [] : {}, value);
  }

  function emit(key, value, previous) {
    (listeners[key] || []).slice().forEach(function (listener) {
      listener(clone(value), clone(previous));
    });
    $(document).trigger("vetcare:state-change", [
      key,
      clone(value),
      clone(previous),
    ]);
  }

  VetCare.State = {
    get: function (key) {
      return key ? clone(store[key]) : clone(store);
    },
    set: function (key, value) {
      var previous = store[key];
      store[key] = clone(value);
      emit(key, store[key], previous);
      return this.get(key);
    },
    patch: function (key, values) {
      return this.set(key, $.extend(true, {}, store[key] || {}, values));
    },
    subscribe: function (key, listener) {
      if (typeof listener !== "function") return function () {};
      listeners[key] = listeners[key] || [];
      listeners[key].push(listener);
      return function () {
        listeners[key] = (listeners[key] || []).filter(function (item) {
          return item !== listener;
        });
      };
    },
    reset: function () {
      Object.keys(store).forEach(function (key) {
        VetCare.State.set(key, null);
      });
    },
  };
})(window, window.jQuery);
