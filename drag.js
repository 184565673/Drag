;(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define('Drag',factory);
  } else {
    root.Drag = factory();
  }
})(window, function() {
    function Drag(elem, anchor, options) {
        this.elem = elem;
        this.anchor = anchor;
        this.options = extend({
            lockX       :   false,
            lockY       :   false,
            onStart     :   noop,
            onMove      :   noop,
            onStop      :   noop
        }, options);
        this._start = BindAsEventListener(this.startHandle, this);
        this._move = BindAsEventListener(this.moveHandle, this);
        this._stop = BindAsEventListener(this.stopHandle, this);

        if(getStyle(elem, 'position') != 'absolute') elem.style.position = 'absolute';
        bind(elem, 'mousedown', this._start);
    }

    Drag.prototype.startHandle = function(event) {
        this._x = event.clientX - this.elem.offsetLeft;
        this._y = event.clientY - this.elem.offsetTop;
        this._marginLeft = parseInt(getStyle(this.elem, 'margin-left')) || 0;
        this._marginTop = parseInt(getStyle(this.elem, 'margin-top')) || 0;

        bind(document, 'mousemove', this._move);
        bind(document, 'mouseup', this._stop);
        this.options.onStart();
        prevenetDefault(event);
    }

    Drag.prototype.moveHandle = function(event) {
        if(!this.options.lockX) this.elem.style.left = event.clientX - this._x - this._marginLeft +'px';
        if(!this.options.lockY) this.elem.style.top = event.clientY - this._y - this._marginTop +'px';
        this.options.onMove();
    }

    Drag.prototype.stopHandle = function() {
        unbind(document, 'mousemove', this._move);
        unbind(document, 'mouseup', this._stop);
        this.options.onStop();
    }

    //Helper functions   
    var 
        noop = function() {
        
        },
        getStyle = function(elem, prop) {
            if(document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(elem,'').getPropertyValue(prop);
            } else if(elem.currentStyle) {
                prop = prop.replace(/\-([a-z])/, function($1, $2){
                    return $2.toUpperCase();
                });
                return elem.currentStyle[prop];
            } else {
                prop = prop.replace(/\-([a-z])/, function($1, $2){
                    return $2.toUpperCase();
                });
                return elem.style[prop];
            }
        },
        prevenetDefault = function(event) {
            if(event.prevenetDefault) {
                event.prevenetDefault()
            } else {
                event.returnValue = false;
            }
        },
        bind = (function() {
            if (document.addEventListener) {
                return function(obj, event, func) {
                    obj.addEventListener(event, func, false);
                };
            } else if (document.attachEvent) {
                return function(obj, event, func) {
                    obj.attachEvent('on' + event, func);
                };
            } else {
                return function() { };
            }
        }()),
        unbind = (function() {
            if (document.removeEventListener) {
                return function(obj, event, func) {
                    obj.removeEventListener(event, func, false);
                };
            } else if (document.detachEvent) {
                return function(obj, event, func) {
                    obj.detachEvent('on' + event, func);
                };
            } else {
                return function() { };
            }
        }()),
        BindAsEventListener = function(fun, context) {
            return function(event) {
                return fun.call(context, (event || window.event));
            }
        },
        extend = function() {
            var src = arguments[0];
            copy = Array.prototype.slice.call(arguments,1);
            if(copy.length) {
                for(var i = 0, c = copy.length; i < c; i++) {
                    for(var prop in copy[i]) {
                        if(copy[i].hasOwnProperty(prop)) {
                            src[prop] = copy[i][prop];
                        }
                    }
                }
            }
            return src;
        };

    return Drag;    
});
