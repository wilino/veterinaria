/**
 * The only module allowed to make network calls. Consumers receive the same
 * { data, meta, errors, requestId } envelope in mock and API modes.
 */
(function (window, $) {
  "use strict";

  var VetCare = (window.VetCare = window.VetCare || {});
  var config = VetCare.Config;
  var mockCache;

  function requestId() {
    return "vc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }

  function normalize(payload, fallbackId) {
    if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
      return {
        data: payload.data,
        meta: payload.meta || {},
        errors: payload.errors || [],
        requestId: payload.requestId || fallbackId,
      };
    }
    return { data: payload, meta: {}, errors: [], requestId: fallbackId };
  }

  function normalizeError(jqXHR, fallbackId) {
    var response = jqXHR.responseJSON || {};
    return $.Deferred()
      .reject({
        status: jqXHR.status || 0,
        message: response.message || "No fue posible completar la solicitud.",
        errors: response.errors || [],
        requestId: response.requestId || fallbackId,
      })
      .promise();
  }

  function loadMockData() {
    if (mockCache) return mockCache;
    mockCache = $.getJSON(config.mockDataUrl).then(
      function (payload) {
        return payload;
      },
      function () {
        return {};
      },
    );
    return mockCache;
  }

  function mockResource(path, method, body) {
    var key =
      String(path || "")
        .replace(/^\/+|\/+$/g, "")
        .split("/")[0] || "dashboard";
    return loadMockData().then(function (data) {
      var response;
      if (method === "GET")
        response = data[key] === undefined ? data : data[key];
      else response = $.extend(true, { id: "demo-" + Date.now() }, body || {});
      return normalize(
        { data: response, meta: { source: "mock" } },
        requestId(),
      );
    });
  }

  function request(method, path, options) {
    var settings = options || {};
    var id = requestId();
    if (config.mockMode && !settings.forceNetwork)
      return mockResource(path, method, settings.data);

    return $.ajax({
      url:
        config.apiBaseUrl.replace(/\/$/, "") +
        "/" +
        String(path || "").replace(/^\//, ""),
      method: method,
      data: settings.data ? JSON.stringify(settings.data) : undefined,
      dataType: "json",
      contentType: "application/json",
      timeout: config.requestTimeout,
      headers: $.extend(
        { Accept: "application/json", "X-Request-ID": id },
        settings.headers || {},
      ),
    }).then(
      function (payload) {
        return normalize(payload, id);
      },
      function (jqXHR) {
        return normalizeError(jqXHR, id);
      },
    );
  }

  VetCare.Api = {
    request: request,
    get: function (path, options) {
      return request("GET", path, options);
    },
    post: function (path, data, options) {
      return request("POST", path, $.extend({}, options, { data: data }));
    },
    put: function (path, data, options) {
      return request("PUT", path, $.extend({}, options, { data: data }));
    },
    remove: function (path, options) {
      return request("DELETE", path, options);
    },
    getMockData: loadMockData,
    clearMockCache: function () {
      mockCache = null;
    },
  };
})(window, window.jQuery);
