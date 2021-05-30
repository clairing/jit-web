/* eslint-disable no-empty */
// import notify from 'devextreme/ui/notify';
var Ez = { name: "EzFrameWork", version: 'v1.0' };
var $ = "";
(function (ez) {
  ez.Type = {
    isNumber: function (obj) {
      return Object.prototype.toString.call(obj) === "[object Number]";
    },
    isString: function (obj) {
      return Object.prototype.toString.call(obj) === "[object String]";
    },
    isUndefined: function (obj) {
      return Object.prototype.toString.call(obj) === "[object Undefined]";
    },
    isBoolean: function (obj) {
      return Object.prototype.toString.call(obj) === "[object Boolean]";
    },
    isObject: function (obj) {
      return Object.prototype.toString.call(obj) === "[object Object]";
    },
    isArray: function (obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    },
    isFunction: function (obj) {
      return Object.prototype.toString.call(obj) === "[object Function]";
    }
  }
  ez.rondomNum = function () {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + S4() + S4());
  };
  ez.Url = function () {
    var parseParam = function (param, key) {
      if (param) {
        var paramStr = "";
        if (param instanceof String || param instanceof Number || param instanceof Boolean) {
          paramStr += "&" + key + "=" + encodeURIComponent(param);
        } else {
          $.each(param, function (i) {
            if (i) {
              var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" :
                "." + i);
              paramStr += '&' + parseParam(this, k);
            }
          });
        }
        return paramStr.substr(1);
      }
    };
    var count = arguments.length;
    if (count === 0)
      return;
    var _url, _args;
    if (count > 1 && arguments[count - 1] instanceof Object) {
      _args = "?" + parseParam(arguments[count - 1])
      if (count === 2) {
        _url = arguments[0] + _args;
      }
      if (count === 3) {
        _url = "/" + arguments[0] + "/" + arguments[1] + _args;
      }
      if (count === 4) {
        _url = "/" + arguments[0] + "/" + arguments[1] + "/" + arguments[2] + _args;
      }
      location.href = _url;
    } else {
      if (count === 1) {
        _url = arguments[0];
      }
      if (count === 2) {
        _url = "/" + arguments[0] + "/" + arguments[1];
      }
      if (count === 3) {
        _url = "/" + arguments[0] + "/" + arguments[1] + "/" + arguments[2];
      }
      location.href = _url;
    }
  };
  ez.Caching = {
    Local: {
      SetValue: function (key, value) {
        if (window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      },
      SetJsonValue: function (key, value) {
        if (window.localStorage) {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      },
      GetJsonValue: function (key) {
        if (window.localStorage) {
          return JSON.parse(window.localStorage.getItem(key));
        }
        return "";
      },
      GetValue: function (key) {
        if (window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return "";
      },
      Clear: function () {
        if (window.localStorage) {
          window.localStorage.clear();
        }
      },
      Remove: function (key) {
        if (window.localStorage) {
          if (key) {
            window.localStorage.removeItem(key);
          }
        }
      }
    },
    VerLocal: {
      SetValue: function (key, value, ver) {
        if (window.localStorage) {
          if (!ver) {
            ver = new Date().Format("yyyyMMdd");
          }
          var data = {
            "value": value,
            "ver": ver
          };
          window.localStorage.setItem(key, JSON.stringify(data));
        }
      },
      GetValue: function (key, ver) {
        if (window.localStorage) {
          if (!ver) {
            ver = new Date().Format("yyyyMMdd");
          }
          var data = JSON.parse(window.localStorage.getItem(key));
          if (data) {
            if (ver !== data.ver) {
              window.localStorage.removeItem(key);
            } else {
              return data.value;
            }
          }
        }
        return "";
      },
      Clear: function () {
        if (window.localStorage) {
          window.localStorage.clear();
        }
      },
      Remove: function (key) {
        if (window.localStorage) {
          if (key) {
            window.localStorage.removeItem(key);
          }
        }
      }
    },
    Session: {
      SetValue: function (key, value) {
        if (window.sessionStorage) {
          window.sessionStorage.setItem(key, value);
        }
      },
      SetJsonValue: function (key, value) {
        if (window.sessionStorage) {
          window.sessionStorage.setItem(key, JSON.stringify(value));
        }
      },
      GetJsonValue: function (key) {
        if (window.sessionStorage) {
          return JSON.parse(window.sessionStorage.getItem(key));
        }
        return "";
      },
      GetValue: function (key) {
        if (window.sessionStorage) {
          return window.sessionStorage.getItem(key);
        }
        return "";
      },
      Clear: function () {
        if (window.sessionStorage) {
          window.sessionStorage.clear();
        }
      },
      Remove: function (key) {
        if (window.sessionStorage) {
          if (key) {
            window.sessionStorage.removeItem(key);
          }
        }
      }
    },
    Cookie: {
      GetValue: function (key) {
        var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)"); //正则匹配
        if (arr == document.cookie.match(reg)) {
          return unescape(arr[2]);
        } else {
          return null;
        }
      },
      SetValue: function (key, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
      },
      Clear: function () {
        var keys = document.cookie.match(/[^ =;]+(?==)/g);
        if (keys) {
          for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
      },
      Remove: function (key) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = Ez.Caching.Cookie.GetValue(key);
        if (cval !== null) {
          document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
        }
      }
    }
  }
})(Ez);
//弹出框封装
(function (ez) {
  ez.Alert = function (msg, event, template, height) {
    var tempId = "popup-" + ez.rondomNum(),
      _closeOnOutsideClick = true,
      _showCloseButton = true,
      _width = 360;
    var templates = {
      A: function () {
        return $(
          "<div> <div style='display:inline-block;float:left;width:30px'><i class='fa fa-exclamation-circle' aria-hidden='true' style = 'color:#febc20;font-size: 34px;vertical-align: middle;padding-right:5px'></i></div><div style='display: inline-block;float: left; position: absolute; padding: 0 20px 0 10px;word-wrap: break-word; word-break: break-all; max-height:400px;overflow-y:auto;' class='msg-text'>" +
          (msg ? msg : "") + "</div></div>");
      },
      E: function () {
        return $(
          "<div> <div style='display:inline-block;float:left;width:30px'><i class='fa  fa-times-circle-o' aria-hidden='true' style = 'color:#d9534f;font-size: 34px;vertical-align: middle;padding-right:5px'></i></div><div style='display: inline-block;float: left; position: absolute; padding: 0 20px 0 10px;word-wrap: break-word; word-break: break-all; max-height:400px;overflow-y:auto;' class='msg-text'>" +
          (msg ? msg : "") + "</div></div>");
      }
    };
    var _template;
    if (ez.Type.isFunction(template)) {
      _template = template;
    }
    if (ez.Type.isString(template)) {
      _template = templates[template];
    }
    if (_template) { } else {
      _template = templates.A;
    }
    if (ez.Type.isObject(height)) {
      if ("width" in height) {
        _width = height.width;
      }
      if ("closeOnOutsideClick" in height) {
        _closeOnOutsideClick = height.closeOnOutsideClick;
      }
      if ("showCloseButton" in height) {
        _showCloseButton = height.showCloseButton;
      }
    }
    var option = {
      height: function () {
        var _height;
        if (ez.Type.isNumber(height)) {
          _height = height;
        } else if (ez.Type.isFunction(height)) {
          _height = height();
        } else if (ez.Type.isObject(height)) {
          if ("height" in height) {
            _height = height.height;
          }
        } else {
          var length = msg ? msg.toString().replace(`/[^\x00-\xff]/g`, "aa").length : 40;
          if (Math.ceil(length / 40) === 1) {
            $(".msg-text").css("line-height", "34px");
            _height = 34 + 87;
          } else {
            _height = Math.ceil(length / 40) * 19 + 87 > 500 ? 500 : Math.ceil(length / 40) *
              19 + 87;
          }
        }
        return _height;
      },
      width: _width,
      contentTemplate: _template,
      showTitle: true,
      title: "提示",
      visible: false,
      dragEnabled: true,
      closeOnOutsideClick: _closeOnOutsideClick,
      showCloseButton: _showCloseButton,
      toolbarItems: [
        {
          toolbar: "bottom",
          options: {
            text: "",
            type: "default",
            onClick: function () {
              $popupContainer.dxPopup(option).dxPopup("instance").hide();
            }
          },
          widget: "dxButton"
        }
      ],
      onHidden: function () {
        try {
          if (ez.Type.isFunction(event)) (event)();
        } catch (e) {
          ez.Alert(e.message);
        }
        $("#" + tempId).remove();
      },
      onContentReady: function () {
        $("#" + tempId).find(".dx-toolbar-center .dx-button").addClass("dx-state-hover");
      },
      onShown: function () {
        $("#" + tempId).find(".dx-toolbar-center .dx-button").focus();
      }
    };
    var $popupContainer = $("<div id=\"" + tempId + "\"  />").addClass("popup").appendTo($("body"));
    $popupContainer.dxPopup(option).dxPopup("instance").show();
  };
})(Ez)
