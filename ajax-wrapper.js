var APEXNET_ajaxWrapper_Library = APEXNET_ajaxWrapper_Library || {};

/*
options: {
                method:
                data:
                onBeforeSend:
                onDone:
                onFail:
                onAlways:
                isShowLoading:
                selectorLoading:
                delayLoading:
          }
*/
APEXNET_ajaxWrapper_Library.ajax = (function (url, options) {
    
    var loading;
    var method = options.method || "GET";
    var data = options.data || {};
    var onBeforeSend = options.onBeforeSend || null;
    var onDone = options.onDone || null;
    var onFail = options.onFail || null;
    var onAlways = options.onAlways || null;
    var isShowLoading = options.isShowLoading || false;
    var selectorLoading = options.selectorLoading || null;
    var delayLoading = options.delayLoading || 0;

    $.ajax({
        url: url,
        type: method,
        cache: false,
        data: data,
        beforeSend: function (xhr) {
            if (isShowLoading) {
                showLoading(selectorLoading);
            }
            if (onBeforeSend) {
                onBeforeSend(xhr);
            }
        }
    })
        .done(function (responseData) {
            if (onDone)
                onDone(responseData);
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
            hideLoading(selectorLoading);
        });
    


function showLoading(selector) {
    if (selector) {
        $(selector).prop('disabled', 'true');
        $(selector).after("<i id='apexnet_ajaxLoading' class='fa fa-spinner fa-spin'></i>");
    } else {        
        $("body").append('<div id="apexnet_ajaxLoading" class="apexnet_ajaxLoading-cover"><div class="apexnet_ajaxLoading"><i class="fa fa-spinner fa-spin"></i></div></div>');
        loading = setTimeout('$("#apexnet_ajaxLoading").fadeIn(200);', delayLoading);
    }
}

function hideLoading(selector) {
    if (selector) {
        $(selector).removeAttr('disabled');
        $('#apexnet_loading').remove();
    } else {
        clearTimeout(loading);
        $("#apexnet_ajaxLoading").fadeOut(200);
        $("#apexnet_ajaxLoading").remove();
    }
}
});
