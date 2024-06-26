var delayLoadingTimeout;
var loadingTimeout;
var loaderQueues;
class loaderQueuesManager {
    static getLoaderQueues(selectorLoading) {
        loaderQueues = loaderQueues || new Array();
        if (loaderQueues[selectorLoading] == undefined) {
            loaderQueues[selectorLoading] = 0;
        }
        console.log(
            "getLoaderQueues",
            selectorLoading,
            loaderQueues[selectorLoading]
        );
        return loaderQueues[selectorLoading];
    }
    static anyLoaderQueues(selectorLoading) {
        console.log(
            "anyLoaderQueues",
            selectorLoading,
            loaderQueues[selectorLoading]
        );
        return this.getLoaderQueues(selectorLoading) > 0;
    }
    static addItemInLoaderQueue(selectorLoading) {
        loaderQueues = loaderQueues || new Array();
        if (loaderQueues[selectorLoading] == undefined) {
            loaderQueues[selectorLoading] = 0;
        }
        loaderQueues[selectorLoading]++;
        console.log(
            "addItemInLoaderQueue",
            selectorLoading,
            loaderQueues[selectorLoading]
        );
    }
    static removeItemInLoaderQueue(selectorLoading) {
        loaderQueues = loaderQueues || new Array();
        if (loaderQueues[selectorLoading] == undefined) {
            loaderQueues[selectorLoading] = 1;
        }
        loaderQueues[selectorLoading]--;
        console.log(
            "removeItemInLoaderQueue",
            selectorLoading,
            loaderQueues[selectorLoading]
        );
    }
}

$(function () {
    /* Utility */
    if (typeof String.prototype.escapeJquerySelector !== "function") {
        String.prototype.escapeJquerySelector = function () {
            return this.replaceAll("#", "_").replaceAll(">", "_").replaceAll("+", "_").replaceAll(".", "_").replaceAll(" ", "_");
        };
    }
})

var APEXNET_Loading = {
    /**
     * Shows the loader
     * @param {{ selector: string, delay: number, timeout: number }} options
     */
    show: function (options) {
        var loadingOptions = options || {};
        var selector = loadingOptions.selector || null;
        var delay = loadingOptions.delay || 0;
        var timeout = loadingOptions.timeout || 0;
        if (selector) {
            $(selector).prop("disabled", "true");
            var width = $(selector).outerWidth();
            var height = $(selector).outerHeight();
            $(selector).wrap(
                "<div class='positionLoader' style='display:inline-block; position:relative; width:" +
                    width +
                    "px; height:" +
                    height +
                    "px;'></div>"
            );
            $(selector).after(
                `<i id="${selector.escapeJquerySelector()}" class='fa fa-circle-o-notch fa-spin aloader'></i>`
            );
        } else {
            $("body").append(
                '<div id="apexnet_ajaxLoading" class="apexnet_ajaxLoading-cover"><div class="apexnet_ajaxLoading"><i class="fa fa-spinner fa-spin"></i></div></div>'
            );
            delayLoadingTimeout = setTimeout(
                '$("#apexnet_ajaxLoading").fadeIn(200);',
                delay || 0
            );
        }
        if (timeout != 0) {
            loadingTimeout = setTimeout(function (selector) {
                APEXNET_Loading.hide(selector);
            }, timeout);
        }
    },
    /**
     * Hide the loader
     * @param {string} selector 
     */
    hide: function (selector) {
        if (selector) {
            selector = selector.escapeJquerySelector();

            if ($(selector).parent(".positionLoader").length == 1) {
                $(selector).unwrap();
                $(selector).remove();
                $(selector).prop("disabled", "false");
            }
        } else {
            clearTimeout(delayLoadingTimeout);
            $("#apexnet_ajaxLoading").fadeOut(200);
            $("#apexnet_ajaxLoading").remove();
        }
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }
    },
};

var APEXNET_ajaxWrapper_Library = {
    /*
options: {
                method:
                async:
                data:
                traditional:
                onBeforeSend:
                onDone:
                onFail:
                onAlways:
                isShowLoading:
                selectorLoading:
                delayLoading:
          }
*/
    /**
     * Perform an ajax request.
     *
     * @param {string} url Url to call
     * @param {{ method: string, async: boolean, data: any, contentType: string, traditional: boolean, onBeforeSend, onDone, onFail, onAlways, responseType: string }} options Options object
     * @returns Ajax result.
     */
    ajax: function (url, options) {
        var method = options.method || "GET";
        var async = options.async || true;
        var data = options.data || {};
        var contentType =
            options.contentType ||
            "application/x-www-form-urlencoded; charset=UTF-8";
        var traditional = options.traditional || false;
        var onBeforeSend = options.onBeforeSend || null;
        var onDone = options.onDone || null;
        var onFail = options.onFail || null;
        var onAlways = options.onAlways || null;
        var isShowLoading = options.isShowLoading || false;
        var selectorLoading = options.selectorLoading || null;
        var delayLoading = options.delayLoading || 0;
        let ajaxOptions = {
            url: url,
            type: method,
            async: async,
            cache: false,
            data: data,
            traditional: traditional,
            contentType: contentType,
            beforeSend: function (xhr) {
                if (isShowLoading) {
                    APEXNET_Loading.show({
                        selector: selectorLoading,
                        delay: delayLoading,
                    });
                }
                if (onBeforeSend) {
                    onBeforeSend(xhr);
                }
            },
        };

        if (options.secureCall) {
            ajaxOptions.crossDomain = true;
            ajaxOptions.xhrFields = {
                withCredentials: true,
            };
        }

        if (options.responseType) {
            ajaxOptions.xhr = function () {
                var xhr = new XMLHttpRequest();
                xhr.responseType = options.responseType;
                return xhr;
            };
        }

        var ajaxRequest = $.ajax(ajaxOptions)
            .done(function (responseData, status, request) {
                if (onDone) onDone(responseData, status, request);
            })
            .fail(function (xhr, textStatus, errorThrown) {
                if (onFail) {
                    onFail(xhr, textStatus, errorThrown);
                }
            })
            .always(function () {
                if (onAlways) {
                    onAlways();
                }
                if (isShowLoading) {
                    APEXNET_Loading.hide(selectorLoading);
                }
            });

        return ajaxRequest;
    },
};
