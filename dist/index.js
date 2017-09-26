(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["Dropzone"] = factory(require("react"));
	else
		root["Dropzone"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _attrAccept = __webpack_require__(2);

	var _attrAccept2 = _interopRequireDefault(_attrAccept);

	var _reactIsDeprecated = __webpack_require__(3);

	var _exifJs = __webpack_require__(4);

	var _exifJs2 = _interopRequireDefault(_exifJs);

	var _getDataTransferItems = __webpack_require__(5);

	var _getDataTransferItems2 = _interopRequireDefault(_getDataTransferItems);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint prefer-template: 0 */


	var supportMultiple = typeof document !== 'undefined' && document && document.createElement ? 'multiple' in document.createElement('input') : true;

	var Dropzone = function (_React$Component) {
	  _inherits(Dropzone, _React$Component);

	  _createClass(Dropzone, null, [{
	    key: 'renderChildren',
	    value: function renderChildren(children, isDragActive, isDragReject) {
	      if (typeof children === 'function') {
	        return children({ isDragActive: isDragActive, isDragReject: isDragReject });
	      }
	      return children;
	    }
	  }, {
	    key: 'resetImageOrientation',
	    value: function resetImageOrientation(image, callback) {
	      var img = new Image();
	      img.onload = function () {
	        _exifJs2.default.getData(img, function orientationReset() {
	          var width = img.width;
	          var height = img.height;
	          var canvas = document.createElement('canvas');
	          var ctx = canvas.getContext('2d');
	          var srcOrientation = _exifJs2.default.getTag(this, 'Orientation');
	          if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
	            canvas.width = height;
	            canvas.height = width;
	          } else {
	            canvas.width = width;
	            canvas.height = height;
	          }
	          switch (srcOrientation) {
	            case 2:
	              ctx.transform(-1, 0, 0, 1, width, 0);break;
	            case 3:
	              ctx.transform(-1, 0, 0, -1, width, height);break;
	            case 4:
	              ctx.transform(1, 0, 0, -1, 0, height);break;
	            case 5:
	              ctx.transform(0, 1, 1, 0, 0, 0);break;
	            case 6:
	              ctx.transform(0, 1, -1, 0, height, 0);break;
	            case 7:
	              ctx.transform(0, -1, -1, 0, height, width);break;
	            case 8:
	              ctx.transform(0, -1, 1, 0, 0, width);break;
	            default:
	              ctx.transform(1, 0, 0, 1, 0, 0);
	          }
	          ctx.drawImage(img, 0, 0);
	          canvas.toBlob(function (blob) {
	            return callback(URL.createObjectURL(blob));
	          });
	        });
	      };
	      img.src = URL.createObjectURL(image);
	    }
	  }]);

	  function Dropzone(props, context) {
	    _classCallCheck(this, Dropzone);

	    var _this = _possibleConstructorReturn(this, (Dropzone.__proto__ || Object.getPrototypeOf(Dropzone)).call(this, props, context));

	    _this.onClick = _this.onClick.bind(_this);
	    _this.onDragStart = _this.onDragStart.bind(_this);
	    _this.onDragEnter = _this.onDragEnter.bind(_this);
	    _this.onDragLeave = _this.onDragLeave.bind(_this);
	    _this.onDragOver = _this.onDragOver.bind(_this);
	    _this.onDrop = _this.onDrop.bind(_this);
	    _this.onFileDialogCancel = _this.onFileDialogCancel.bind(_this);
	    _this.fileAccepted = _this.fileAccepted.bind(_this);
	    _this.isFileDialogActive = false;
	    _this.state = {
	      isDragActive: false
	    };
	    return _this;
	  }

	  _createClass(Dropzone, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.enterCounter = 0;
	      // Tried implementing addEventListener, but didn't work out
	      document.body.onfocus = this.onFileDialogCancel;
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      // Can be replaced with removeEventListener, if addEventListener works
	      document.body.onfocus = null;
	    }
	  }, {
	    key: 'onDragStart',
	    value: function onDragStart(e) {
	      if (this.props.onDragStart) {
	        this.props.onDragStart.call(this, e);
	      }
	    }
	  }, {
	    key: 'onDragEnter',
	    value: function onDragEnter(e) {
	      e.preventDefault();

	      // Count the dropzone and any children that are entered.
	      ++this.enterCounter;

	      var allFilesAccepted = this.allFilesAccepted((0, _getDataTransferItems2.default)(e, this.props.multiple));

	      this.setState({
	        isDragActive: allFilesAccepted,
	        isDragReject: !allFilesAccepted
	      });

	      if (this.props.onDragEnter) {
	        this.props.onDragEnter.call(this, e);
	      }
	    }
	  }, {
	    key: 'onDragOver',
	    value: function onDragOver(e) {
	      // eslint-disable-line class-methods-use-this
	      e.preventDefault();
	      e.stopPropagation();
	      try {
	        e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
	      } catch (err) {
	        // continue regardless of error
	      }

	      if (this.props.onDragOver) {
	        this.props.onDragOver.call(this, e);
	      }
	      return false;
	    }
	  }, {
	    key: 'onDragLeave',
	    value: function onDragLeave(e) {
	      e.preventDefault();

	      // Only deactivate once the dropzone and all children was left.
	      if (--this.enterCounter > 0) {
	        return;
	      }

	      this.setState({
	        isDragActive: false,
	        isDragReject: false
	      });

	      if (this.props.onDragLeave) {
	        this.props.onDragLeave.call(this, e);
	      }
	    }
	  }, {
	    key: 'onDrop',
	    value: function onDrop(e) {
	      var _this2 = this;

	      var _props = this.props,
	          onDrop = _props.onDrop,
	          onDropAccepted = _props.onDropAccepted,
	          onDropRejected = _props.onDropRejected,
	          multiple = _props.multiple,
	          disablePreview = _props.disablePreview;

	      var fileList = (0, _getDataTransferItems2.default)(e, multiple);
	      var acceptedFiles = [];
	      var rejectedFiles = [];

	      // Stop default browser behavior
	      e.preventDefault();

	      // Reset the counter along with the drag on a drop.
	      this.enterCounter = 0;
	      this.isFileDialogActive = false;

	      fileList.forEach(function (file) {
	        Dropzone.resetImageOrientation(file, function (blob) {
	          if (!disablePreview) {
	            file.preview = blob; // eslint-disable-line no-param-reassign
	          }
	          if (_this2.fileAccepted(file) && _this2.fileMatchSize(file)) {
	            acceptedFiles.push(file);
	          } else {
	            rejectedFiles.push(file);
	          }
	          if (onDrop) {
	            onDrop.call(_this2, acceptedFiles, rejectedFiles, e);
	          }

	          if (rejectedFiles.length > 0 && onDropRejected) {
	            onDropRejected.call(_this2, rejectedFiles, e);
	          }

	          if (acceptedFiles.length > 0 && onDropAccepted) {
	            onDropAccepted.call(_this2, acceptedFiles, e);
	          }
	        });
	      });

	      // Reset drag state
	      this.setState({
	        isDragActive: false,
	        isDragReject: false
	      });
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick(e) {
	      var _props2 = this.props,
	          onClick = _props2.onClick,
	          disableClick = _props2.disableClick;

	      if (!disableClick) {
	        e.stopPropagation();
	        this.open();
	        if (onClick) {
	          onClick.call(this, e);
	        }
	      }
	    }
	  }, {
	    key: 'onFileDialogCancel',
	    value: function onFileDialogCancel() {
	      // timeout will not recognize context of this method
	      var onFileDialogCancel = this.props.onFileDialogCancel;
	      var fileInputEl = this.fileInputEl;
	      var isFileDialogActive = this.isFileDialogActive;
	      // execute the timeout only if the onFileDialogCancel is defined and FileDialog
	      // is opened in the browser

	      if (onFileDialogCancel && isFileDialogActive) {
	        setTimeout(function () {
	          // Returns an object as FileList
	          var FileList = fileInputEl.files;
	          if (!FileList.length) {
	            isFileDialogActive = false;
	            onFileDialogCancel();
	          }
	        }, 300);
	      }
	    }
	  }, {
	    key: 'fileAccepted',
	    value: function fileAccepted(file) {
	      return (0, _attrAccept2.default)(file, this.props.accept);
	    }
	  }, {
	    key: 'fileMatchSize',
	    value: function fileMatchSize(file) {
	      return file.size <= this.props.maxSize && file.size >= this.props.minSize;
	    }
	  }, {
	    key: 'allFilesAccepted',
	    value: function allFilesAccepted(files) {
	      return files.every(this.fileAccepted);
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      this.isFileDialogActive = true;
	      this.fileInputEl.value = null;
	      this.fileInputEl.click();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      var _props3 = this.props,
	          accept = _props3.accept,
	          activeClassName = _props3.activeClassName,
	          inputProps = _props3.inputProps,
	          multiple = _props3.multiple,
	          name = _props3.name,
	          rejectClassName = _props3.rejectClassName,
	          children = _props3.children,
	          rest = _objectWithoutProperties(_props3, ['accept', 'activeClassName', 'inputProps', 'multiple', 'name', 'rejectClassName', 'children']);

	      var activeStyle = rest.activeStyle,
	          className = rest.className,
	          rejectStyle = rest.rejectStyle,
	          style = rest.style,
	          props = _objectWithoutProperties(rest, ['activeStyle', 'className', 'rejectStyle', 'style']);

	      var _state = this.state,
	          isDragActive = _state.isDragActive,
	          isDragReject = _state.isDragReject;


	      className = className || '';

	      if (isDragActive && activeClassName) {
	        className += ' ' + activeClassName;
	      }
	      if (isDragReject && rejectClassName) {
	        className += ' ' + rejectClassName;
	      }

	      if (!className && !style && !activeStyle && !rejectStyle) {
	        style = {
	          width: 200,
	          height: 200,
	          borderWidth: 2,
	          borderColor: '#666',
	          borderStyle: 'dashed',
	          borderRadius: 5
	        };
	        activeStyle = {
	          borderStyle: 'solid',
	          backgroundColor: '#eee'
	        };
	        rejectStyle = {
	          borderStyle: 'solid',
	          backgroundColor: '#ffdddd'
	        };
	      }

	      var appliedStyle = void 0;
	      if (activeStyle && isDragActive) {
	        appliedStyle = _extends({}, style, activeStyle);
	      } else if (rejectStyle && isDragReject) {
	        appliedStyle = _extends({}, style, rejectStyle);
	      } else {
	        appliedStyle = _extends({}, style);
	      }

	      var inputAttributes = {
	        accept: accept,
	        type: 'file',
	        style: { display: 'none' },
	        multiple: supportMultiple && multiple,
	        ref: function ref(el) {
	          return _this3.fileInputEl = el;
	        }, // eslint-disable-line
	        onChange: this.onDrop
	      };

	      if (name && name.length) {
	        inputAttributes.name = name;
	      }

	      // Remove custom properties before passing them to the wrapper div element
	      var customProps = ['acceptedFiles', 'disablePreview', 'disableClick', 'onDropAccepted', 'onDropRejected', 'onFileDialogCancel', 'maxSize', 'minSize'];
	      var divProps = _extends({}, props);
	      customProps.forEach(function (prop) {
	        return delete divProps[prop];
	      });

	      return _react2.default.createElement(
	        'div',
	        _extends({
	          className: className,
	          style: appliedStyle
	        }, divProps /* expand user provided props first so event handlers are never overridden */, {
	          onClick: this.onClick,
	          onDragStart: this.onDragStart,
	          onDragEnter: this.onDragEnter,
	          onDragOver: this.onDragOver,
	          onDragLeave: this.onDragLeave,
	          onDrop: this.onDrop
	        }),
	        Dropzone.renderChildren(children, isDragActive, isDragReject),
	        _react2.default.createElement('input', _extends({}, inputProps /* expand user provided inputProps first so inputAttributes override them */, inputAttributes))
	      );
	    }
	  }]);

	  return Dropzone;
	}(_react2.default.Component);

	Dropzone.defaultProps = {
	  disablePreview: false,
	  disableClick: false,
	  multiple: true,
	  maxSize: Infinity,
	  minSize: 0
	};

	Dropzone.propTypes = {
	  onClick: _react2.default.PropTypes.func,
	  onDrop: _react2.default.PropTypes.func,
	  onDropAccepted: _react2.default.PropTypes.func,
	  onDropRejected: _react2.default.PropTypes.func,
	  onDragStart: _react2.default.PropTypes.func,
	  onDragEnter: _react2.default.PropTypes.func,
	  onDragOver: _react2.default.PropTypes.func,
	  onDragLeave: _react2.default.PropTypes.func,

	  // Contents of the dropzone
	  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.node, _react2.default.PropTypes.func]),

	  // CSS styles to apply
	  style: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.object, 'Prop style is deprecated. Use function as children to style dropzone and its contents.'),

	  // CSS styles to apply when drop will be accepted
	  activeStyle: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.object, 'Prop activeStyle is deprecated. Use function as children to style dropzone and its contents.'),

	  // CSS styles to apply when drop will be rejected
	  rejectStyle: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.object, 'Prop rejectStyle is deprecated. Use function as children to style dropzone and its contents.'),

	  // Optional className
	  className: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.string, 'Prop className is deprecated. Use function as children to style dropzone and its contents.'),

	  // className for accepted state
	  activeClassName: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.string, 'Prop activeClassName is deprecated. Use function as children to style dropzone and its contents.'),

	  // className for rejected state
	  rejectClassName: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.string, 'Prop rejectClassName is deprecated. Use function as children to style dropzone and its contents.'),

	  disablePreview: _react2.default.PropTypes.bool, // Enable/disable preview generation
	  disableClick: _react2.default.PropTypes.bool, // Disallow clicking on the dropzone container to open file dialog
	  onFileDialogCancel: _react2.default.PropTypes.func, // Provide a callback on clicking the cancel button of the file dialog

	  inputProps: _react2.default.PropTypes.object, // Pass additional attributes to the <input type="file"/> tag
	  multiple: _react2.default.PropTypes.bool, // Allow dropping multiple files
	  accept: _react2.default.PropTypes.string, // Allow specific types of files. See https://github.com/okonet/attr-accept for more information
	  name: _react2.default.PropTypes.string, // name attribute for the input tag
	  maxSize: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.number, 'Prop maxSize is deprecated and will be removed in the next major release'),
	  minSize: (0, _reactIsDeprecated.deprecate)(_react2.default.PropTypes.number, 'Prop minSize is deprecated and will be removed in the next major release')
	};

	exports.default = Dropzone;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports=function(t){function n(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return t[e].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){"use strict";n.__esModule=!0,r(8),r(9),n["default"]=function(t,n){if(t&&n){var r=function(){var r=Array.isArray(n)?n:n.split(","),e=t.name||"",o=t.type||"",i=o.replace(/\/.*$/,"");return{v:r.some(function(t){var n=t.trim();return"."===n.charAt(0)?e.toLowerCase().endsWith(n.toLowerCase()):/\/\*$/.test(n)?i===n.replace(/\/.*$/,""):o===n})}}();if("object"==typeof r)return r.v}return!0},t.exports=n["default"]},function(t,n){var r=t.exports={version:"1.2.2"};"number"==typeof __e&&(__e=r)},function(t,n){var r=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},function(t,n,r){var e=r(2),o=r(1),i=r(4),u=r(19),c="prototype",f=function(t,n){return function(){return t.apply(n,arguments)}},s=function(t,n,r){var a,p,l,y,d=t&s.G,h=t&s.P,v=d?e:t&s.S?e[n]||(e[n]={}):(e[n]||{})[c],x=d?o:o[n]||(o[n]={});d&&(r=n);for(a in r)p=!(t&s.F)&&v&&a in v,l=(p?v:r)[a],y=t&s.B&&p?f(l,e):h&&"function"==typeof l?f(Function.call,l):l,v&&!p&&u(v,a,l),x[a]!=l&&i(x,a,y),h&&((x[c]||(x[c]={}))[a]=l)};e.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,t.exports=s},function(t,n,r){var e=r(5),o=r(18);t.exports=r(22)?function(t,n,r){return e.setDesc(t,n,o(1,r))}:function(t,n,r){return t[n]=r,t}},function(t,n){var r=Object;t.exports={create:r.create,getProto:r.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:r.getOwnPropertyDescriptor,setDesc:r.defineProperty,setDescs:r.defineProperties,getKeys:r.keys,getNames:r.getOwnPropertyNames,getSymbols:r.getOwnPropertySymbols,each:[].forEach}},function(t,n){var r=0,e=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++r+e).toString(36))}},function(t,n,r){var e=r(20)("wks"),o=r(2).Symbol;t.exports=function(t){return e[t]||(e[t]=o&&o[t]||(o||r(6))("Symbol."+t))}},function(t,n,r){r(26),t.exports=r(1).Array.some},function(t,n,r){r(25),t.exports=r(1).String.endsWith},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n){var r={}.toString;t.exports=function(t){return r.call(t).slice(8,-1)}},function(t,n,r){var e=r(10);t.exports=function(t,n,r){if(e(t),void 0===n)return t;switch(r){case 1:return function(r){return t.call(n,r)};case 2:return function(r,e){return t.call(n,r,e)};case 3:return function(r,e,o){return t.call(n,r,e,o)}}return function(){return t.apply(n,arguments)}}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n,r){t.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r(7)("match")]=!1,!"/./"[t](n)}catch(o){}}return!0}},function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,r){var e=r(16),o=r(11),i=r(7)("match");t.exports=function(t){var n;return e(t)&&(void 0!==(n=t[i])?!!n:"RegExp"==o(t))}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,r){var e=r(2),o=r(4),i=r(6)("src"),u="toString",c=Function[u],f=(""+c).split(u);r(1).inspectSource=function(t){return c.call(t)},(t.exports=function(t,n,r,u){"function"==typeof r&&(o(r,i,t[n]?""+t[n]:f.join(String(n))),"name"in r||(r.name=n)),t===e?t[n]=r:(u||delete t[n],o(t,n,r))})(Function.prototype,u,function(){return"function"==typeof this&&this[i]||c.call(this)})},function(t,n,r){var e=r(2),o="__core-js_shared__",i=e[o]||(e[o]={});t.exports=function(t){return i[t]||(i[t]={})}},function(t,n,r){var e=r(17),o=r(13);t.exports=function(t,n,r){if(e(n))throw TypeError("String#"+r+" doesn't accept regex!");return String(o(t))}},function(t,n,r){t.exports=!r(15)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n){var r=Math.ceil,e=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?e:r)(t)}},function(t,n,r){var e=r(23),o=Math.min;t.exports=function(t){return t>0?o(e(t),9007199254740991):0}},function(t,n,r){"use strict";var e=r(3),o=r(24),i=r(21),u="endsWith",c=""[u];e(e.P+e.F*r(14)(u),"String",{endsWith:function(t){var n=i(this,t,u),r=arguments,e=r.length>1?r[1]:void 0,f=o(n.length),s=void 0===e?f:Math.min(o(e),f),a=String(t);return c?c.call(n,a,s):n.slice(s-a.length,s)===a}})},function(t,n,r){var e=r(5),o=r(3),i=r(1).Array||Array,u={},c=function(t,n){e.each.call(t.split(","),function(t){void 0==n&&t in i?u[t]=i[t]:t in[]&&(u[t]=r(12)(Function.call,[][t],n))})};c("pop,reverse,shift,keys,values,entries",1),c("indexOf,every,some,forEach,map,filter,find,findIndex,includes",3),c("join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill"),o(o.S,"Array",u)}]);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.deprecate = deprecate;
	exports.addIsDeprecated = addIsDeprecated;

	/**
	 * Wraps a singular React.PropTypes.[type] with
	 * a console.warn call that is only called if the
	 * prop is not undefined/null and is only called
	 * once.
	 * @param  {Object} propType React.PropType type
	 * @param  {String} message  Deprecation message
	 * @return {Function}        ReactPropTypes checkType
	 */
	function deprecate(propType, message) {
	  var warned = false;
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var props = args[0];
	    var propName = args[1];

	    var prop = props[propName];
	    if (prop !== undefined && prop !== null && !warned) {
	      warned = true;
	      console.warn(message);
	    }
	    return propType.call.apply(propType, [this].concat(args));
	  };
	}

	/**
	 * Returns a copy of `PropTypes` with an `isDeprecated`
	 * method available on all top-level propType options.
	 * @param {React.PropTypes}  PropTypes
	 * @return {React.PropTypes} newPropTypes
	 */
	function addIsDeprecated(PropTypes) {
	  var newPropTypes = _extends({}, PropTypes);
	  for (var type in newPropTypes) {
	    if (newPropTypes.hasOwnProperty(type)) {
	      var propType = newPropTypes[type];
	      propType = propType.bind(newPropTypes);
	      propType.isDeprecated = deprecate.bind(newPropTypes, propType);
	      newPropTypes[type] = propType;
	    }
	  }
	  return newPropTypes;
	}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {

	    var debug = false;

	    var root = this;

	    var EXIF = function(obj) {
	        if (obj instanceof EXIF) return obj;
	        if (!(this instanceof EXIF)) return new EXIF(obj);
	        this.EXIFwrapped = obj;
	    };

	    if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = EXIF;
	        }
	        exports.EXIF = EXIF;
	    } else {
	        root.EXIF = EXIF;
	    }

	    var ExifTags = EXIF.Tags = {

	        // version tags
	        0x9000 : "ExifVersion",             // EXIF version
	        0xA000 : "FlashpixVersion",         // Flashpix format version

	        // colorspace tags
	        0xA001 : "ColorSpace",              // Color space information tag

	        // image configuration
	        0xA002 : "PixelXDimension",         // Valid width of meaningful image
	        0xA003 : "PixelYDimension",         // Valid height of meaningful image
	        0x9101 : "ComponentsConfiguration", // Information about channels
	        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

	        // user information
	        0x927C : "MakerNote",               // Any desired information written by the manufacturer
	        0x9286 : "UserComment",             // Comments by user

	        // related file
	        0xA004 : "RelatedSoundFile",        // Name of related sound file

	        // date and time
	        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
	        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
	        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
	        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
	        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

	        // picture-taking conditions
	        0x829A : "ExposureTime",            // Exposure time (in seconds)
	        0x829D : "FNumber",                 // F number
	        0x8822 : "ExposureProgram",         // Exposure program
	        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
	        0x8827 : "ISOSpeedRatings",         // ISO speed rating
	        0x8828 : "OECF",                    // Optoelectric conversion factor
	        0x9201 : "ShutterSpeedValue",       // Shutter speed
	        0x9202 : "ApertureValue",           // Lens aperture
	        0x9203 : "BrightnessValue",         // Value of brightness
	        0x9204 : "ExposureBias",            // Exposure bias
	        0x9205 : "MaxApertureValue",        // Smallest F number of lens
	        0x9206 : "SubjectDistance",         // Distance to subject in meters
	        0x9207 : "MeteringMode",            // Metering mode
	        0x9208 : "LightSource",             // Kind of light source
	        0x9209 : "Flash",                   // Flash status
	        0x9214 : "SubjectArea",             // Location and area of main subject
	        0x920A : "FocalLength",             // Focal length of the lens in mm
	        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
	        0xA20C : "SpatialFrequencyResponse",    //
	        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
	        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
	        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	        0xA214 : "SubjectLocation",         // Location of subject in image
	        0xA215 : "ExposureIndex",           // Exposure index selected on camera
	        0xA217 : "SensingMethod",           // Image sensor type
	        0xA300 : "FileSource",              // Image source (3 == DSC)
	        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
	        0xA302 : "CFAPattern",              // Color filter array geometric pattern
	        0xA401 : "CustomRendered",          // Special processing
	        0xA402 : "ExposureMode",            // Exposure mode
	        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
	        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
	        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
	        0xA406 : "SceneCaptureType",        // Type of scene
	        0xA407 : "GainControl",             // Degree of overall image gain adjustment
	        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
	        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
	        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
	        0xA40B : "DeviceSettingDescription",    //
	        0xA40C : "SubjectDistanceRange",    // Distance to subject

	        // other tags
	        0xA005 : "InteroperabilityIFDPointer",
	        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
	    };

	    var TiffTags = EXIF.TiffTags = {
	        0x0100 : "ImageWidth",
	        0x0101 : "ImageHeight",
	        0x8769 : "ExifIFDPointer",
	        0x8825 : "GPSInfoIFDPointer",
	        0xA005 : "InteroperabilityIFDPointer",
	        0x0102 : "BitsPerSample",
	        0x0103 : "Compression",
	        0x0106 : "PhotometricInterpretation",
	        0x0112 : "Orientation",
	        0x0115 : "SamplesPerPixel",
	        0x011C : "PlanarConfiguration",
	        0x0212 : "YCbCrSubSampling",
	        0x0213 : "YCbCrPositioning",
	        0x011A : "XResolution",
	        0x011B : "YResolution",
	        0x0128 : "ResolutionUnit",
	        0x0111 : "StripOffsets",
	        0x0116 : "RowsPerStrip",
	        0x0117 : "StripByteCounts",
	        0x0201 : "JPEGInterchangeFormat",
	        0x0202 : "JPEGInterchangeFormatLength",
	        0x012D : "TransferFunction",
	        0x013E : "WhitePoint",
	        0x013F : "PrimaryChromaticities",
	        0x0211 : "YCbCrCoefficients",
	        0x0214 : "ReferenceBlackWhite",
	        0x0132 : "DateTime",
	        0x010E : "ImageDescription",
	        0x010F : "Make",
	        0x0110 : "Model",
	        0x0131 : "Software",
	        0x013B : "Artist",
	        0x8298 : "Copyright"
	    };

	    var GPSTags = EXIF.GPSTags = {
	        0x0000 : "GPSVersionID",
	        0x0001 : "GPSLatitudeRef",
	        0x0002 : "GPSLatitude",
	        0x0003 : "GPSLongitudeRef",
	        0x0004 : "GPSLongitude",
	        0x0005 : "GPSAltitudeRef",
	        0x0006 : "GPSAltitude",
	        0x0007 : "GPSTimeStamp",
	        0x0008 : "GPSSatellites",
	        0x0009 : "GPSStatus",
	        0x000A : "GPSMeasureMode",
	        0x000B : "GPSDOP",
	        0x000C : "GPSSpeedRef",
	        0x000D : "GPSSpeed",
	        0x000E : "GPSTrackRef",
	        0x000F : "GPSTrack",
	        0x0010 : "GPSImgDirectionRef",
	        0x0011 : "GPSImgDirection",
	        0x0012 : "GPSMapDatum",
	        0x0013 : "GPSDestLatitudeRef",
	        0x0014 : "GPSDestLatitude",
	        0x0015 : "GPSDestLongitudeRef",
	        0x0016 : "GPSDestLongitude",
	        0x0017 : "GPSDestBearingRef",
	        0x0018 : "GPSDestBearing",
	        0x0019 : "GPSDestDistanceRef",
	        0x001A : "GPSDestDistance",
	        0x001B : "GPSProcessingMethod",
	        0x001C : "GPSAreaInformation",
	        0x001D : "GPSDateStamp",
	        0x001E : "GPSDifferential"
	    };

	     // EXIF 2.3 Spec
	    var IFD1Tags = EXIF.IFD1Tags = {
	        0x0100: "ImageWidth",
	        0x0101: "ImageHeight",
	        0x0102: "BitsPerSample",
	        0x0103: "Compression",
	        0x0106: "PhotometricInterpretation",
	        0x0111: "StripOffsets",
	        0x0112: "Orientation",
	        0x0115: "SamplesPerPixel",
	        0x0116: "RowsPerStrip",
	        0x0117: "StripByteCounts",
	        0x011A: "XResolution",
	        0x011B: "YResolution",
	        0x011C: "PlanarConfiguration",
	        0x0128: "ResolutionUnit",
	        0x0201: "JpegIFOffset",    // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
	        0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
	        0x0211: "YCbCrCoefficients",
	        0x0212: "YCbCrSubSampling",
	        0x0213: "YCbCrPositioning",
	        0x0214: "ReferenceBlackWhite"
	    };

	    var StringValues = EXIF.StringValues = {
	        ExposureProgram : {
	            0 : "Not defined",
	            1 : "Manual",
	            2 : "Normal program",
	            3 : "Aperture priority",
	            4 : "Shutter priority",
	            5 : "Creative program",
	            6 : "Action program",
	            7 : "Portrait mode",
	            8 : "Landscape mode"
	        },
	        MeteringMode : {
	            0 : "Unknown",
	            1 : "Average",
	            2 : "CenterWeightedAverage",
	            3 : "Spot",
	            4 : "MultiSpot",
	            5 : "Pattern",
	            6 : "Partial",
	            255 : "Other"
	        },
	        LightSource : {
	            0 : "Unknown",
	            1 : "Daylight",
	            2 : "Fluorescent",
	            3 : "Tungsten (incandescent light)",
	            4 : "Flash",
	            9 : "Fine weather",
	            10 : "Cloudy weather",
	            11 : "Shade",
	            12 : "Daylight fluorescent (D 5700 - 7100K)",
	            13 : "Day white fluorescent (N 4600 - 5400K)",
	            14 : "Cool white fluorescent (W 3900 - 4500K)",
	            15 : "White fluorescent (WW 3200 - 3700K)",
	            17 : "Standard light A",
	            18 : "Standard light B",
	            19 : "Standard light C",
	            20 : "D55",
	            21 : "D65",
	            22 : "D75",
	            23 : "D50",
	            24 : "ISO studio tungsten",
	            255 : "Other"
	        },
	        Flash : {
	            0x0000 : "Flash did not fire",
	            0x0001 : "Flash fired",
	            0x0005 : "Strobe return light not detected",
	            0x0007 : "Strobe return light detected",
	            0x0009 : "Flash fired, compulsory flash mode",
	            0x000D : "Flash fired, compulsory flash mode, return light not detected",
	            0x000F : "Flash fired, compulsory flash mode, return light detected",
	            0x0010 : "Flash did not fire, compulsory flash mode",
	            0x0018 : "Flash did not fire, auto mode",
	            0x0019 : "Flash fired, auto mode",
	            0x001D : "Flash fired, auto mode, return light not detected",
	            0x001F : "Flash fired, auto mode, return light detected",
	            0x0020 : "No flash function",
	            0x0041 : "Flash fired, red-eye reduction mode",
	            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
	            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
	            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
	            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
	            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
	            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
	            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
	            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
	        },
	        SensingMethod : {
	            1 : "Not defined",
	            2 : "One-chip color area sensor",
	            3 : "Two-chip color area sensor",
	            4 : "Three-chip color area sensor",
	            5 : "Color sequential area sensor",
	            7 : "Trilinear sensor",
	            8 : "Color sequential linear sensor"
	        },
	        SceneCaptureType : {
	            0 : "Standard",
	            1 : "Landscape",
	            2 : "Portrait",
	            3 : "Night scene"
	        },
	        SceneType : {
	            1 : "Directly photographed"
	        },
	        CustomRendered : {
	            0 : "Normal process",
	            1 : "Custom process"
	        },
	        WhiteBalance : {
	            0 : "Auto white balance",
	            1 : "Manual white balance"
	        },
	        GainControl : {
	            0 : "None",
	            1 : "Low gain up",
	            2 : "High gain up",
	            3 : "Low gain down",
	            4 : "High gain down"
	        },
	        Contrast : {
	            0 : "Normal",
	            1 : "Soft",
	            2 : "Hard"
	        },
	        Saturation : {
	            0 : "Normal",
	            1 : "Low saturation",
	            2 : "High saturation"
	        },
	        Sharpness : {
	            0 : "Normal",
	            1 : "Soft",
	            2 : "Hard"
	        },
	        SubjectDistanceRange : {
	            0 : "Unknown",
	            1 : "Macro",
	            2 : "Close view",
	            3 : "Distant view"
	        },
	        FileSource : {
	            3 : "DSC"
	        },

	        Components : {
	            0 : "",
	            1 : "Y",
	            2 : "Cb",
	            3 : "Cr",
	            4 : "R",
	            5 : "G",
	            6 : "B"
	        }
	    };

	    function addEvent(element, event, handler) {
	        if (element.addEventListener) {
	            element.addEventListener(event, handler, false);
	        } else if (element.attachEvent) {
	            element.attachEvent("on" + event, handler);
	        }
	    }

	    function imageHasData(img) {
	        return !!(img.exifdata);
	    }


	    function base64ToArrayBuffer(base64, contentType) {
	        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
	        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
	        var binary = atob(base64);
	        var len = binary.length;
	        var buffer = new ArrayBuffer(len);
	        var view = new Uint8Array(buffer);
	        for (var i = 0; i < len; i++) {
	            view[i] = binary.charCodeAt(i);
	        }
	        return buffer;
	    }

	    function objectURLToBlob(url, callback) {
	        var http = new XMLHttpRequest();
	        http.open("GET", url, true);
	        http.responseType = "blob";
	        http.onload = function(e) {
	            if (this.status == 200 || this.status === 0) {
	                callback(this.response);
	            }
	        };
	        http.send();
	    }

	    function getImageData(img, callback) {
	        function handleBinaryFile(binFile) {
	            var data = findEXIFinJPEG(binFile);
	            img.exifdata = data || {};
	            var iptcdata = findIPTCinJPEG(binFile);
	            img.iptcdata = iptcdata || {};
	            if (EXIF.isXmpEnabled) {
	               var xmpdata= findXMPinJPEG(binFile);
	               img.xmpdata = xmpdata || {};               
	            }
	            if (callback) {
	                callback.call(img);
	            }
	        }

	        if (img.src) {
	            if (/^data\:/i.test(img.src)) { // Data URI
	                var arrayBuffer = base64ToArrayBuffer(img.src);
	                handleBinaryFile(arrayBuffer);

	            } else if (/^blob\:/i.test(img.src)) { // Object URL
	                var fileReader = new FileReader();
	                fileReader.onload = function(e) {
	                    handleBinaryFile(e.target.result);
	                };
	                objectURLToBlob(img.src, function (blob) {
	                    fileReader.readAsArrayBuffer(blob);
	                });
	            } else {
	                var http = new XMLHttpRequest();
	                http.onload = function() {
	                    if (this.status == 200 || this.status === 0) {
	                        handleBinaryFile(http.response);
	                    } else {
	                        throw "Could not load image";
	                    }
	                    http = null;
	                };
	                http.open("GET", img.src, true);
	                http.responseType = "arraybuffer";
	                http.send(null);
	            }
	        } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
	            var fileReader = new FileReader();
	            fileReader.onload = function(e) {
	                if (debug) console.log("Got file of length " + e.target.result.byteLength);
	                handleBinaryFile(e.target.result);
	            };

	            fileReader.readAsArrayBuffer(img);
	        }
	    }

	    function findEXIFinJPEG(file) {
	        var dataView = new DataView(file);

	        if (debug) console.log("Got file of length " + file.byteLength);
	        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
	            if (debug) console.log("Not a valid JPEG");
	            return false; // not a valid jpeg
	        }

	        var offset = 2,
	            length = file.byteLength,
	            marker;

	        while (offset < length) {
	            if (dataView.getUint8(offset) != 0xFF) {
	                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
	                return false; // not a valid marker, something is wrong
	            }

	            marker = dataView.getUint8(offset + 1);
	            if (debug) console.log(marker);

	            // we could implement handling for other markers here,
	            // but we're only looking for 0xFFE1 for EXIF data

	            if (marker == 225) {
	                if (debug) console.log("Found 0xFFE1 marker");

	                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

	                // offset += 2 + file.getShortAt(offset+2, true);

	            } else {
	                offset += 2 + dataView.getUint16(offset+2);
	            }

	        }

	    }

	    function findIPTCinJPEG(file) {
	        var dataView = new DataView(file);

	        if (debug) console.log("Got file of length " + file.byteLength);
	        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
	            if (debug) console.log("Not a valid JPEG");
	            return false; // not a valid jpeg
	        }

	        var offset = 2,
	            length = file.byteLength;


	        var isFieldSegmentStart = function(dataView, offset){
	            return (
	                dataView.getUint8(offset) === 0x38 &&
	                dataView.getUint8(offset+1) === 0x42 &&
	                dataView.getUint8(offset+2) === 0x49 &&
	                dataView.getUint8(offset+3) === 0x4D &&
	                dataView.getUint8(offset+4) === 0x04 &&
	                dataView.getUint8(offset+5) === 0x04
	            );
	        };

	        while (offset < length) {

	            if ( isFieldSegmentStart(dataView, offset )){

	                // Get the length of the name header (which is padded to an even number of bytes)
	                var nameHeaderLength = dataView.getUint8(offset+7);
	                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
	                // Check for pre photoshop 6 format
	                if(nameHeaderLength === 0) {
	                    // Always 4
	                    nameHeaderLength = 4;
	                }

	                var startOffset = offset + 8 + nameHeaderLength;
	                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

	                return readIPTCData(file, startOffset, sectionLength);

	                break;

	            }


	            // Not the marker, continue searching
	            offset++;

	        }

	    }
	    var IptcFieldMap = {
	        0x78 : 'caption',
	        0x6E : 'credit',
	        0x19 : 'keywords',
	        0x37 : 'dateCreated',
	        0x50 : 'byline',
	        0x55 : 'bylineTitle',
	        0x7A : 'captionWriter',
	        0x69 : 'headline',
	        0x74 : 'copyright',
	        0x0F : 'category'
	    };
	    function readIPTCData(file, startOffset, sectionLength){
	        var dataView = new DataView(file);
	        var data = {};
	        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
	        var segmentStartPos = startOffset;
	        while(segmentStartPos < startOffset+sectionLength) {
	            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
	                segmentType = dataView.getUint8(segmentStartPos+2);
	                if(segmentType in IptcFieldMap) {
	                    dataSize = dataView.getInt16(segmentStartPos+3);
	                    segmentSize = dataSize + 5;
	                    fieldName = IptcFieldMap[segmentType];
	                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
	                    // Check if we already stored a value with this name
	                    if(data.hasOwnProperty(fieldName)) {
	                        // Value already stored with this name, create multivalue field
	                        if(data[fieldName] instanceof Array) {
	                            data[fieldName].push(fieldValue);
	                        }
	                        else {
	                            data[fieldName] = [data[fieldName], fieldValue];
	                        }
	                    }
	                    else {
	                        data[fieldName] = fieldValue;
	                    }
	                }

	            }
	            segmentStartPos++;
	        }
	        return data;
	    }



	    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
	        var entries = file.getUint16(dirStart, !bigEnd),
	            tags = {},
	            entryOffset, tag,
	            i;

	        for (i=0;i<entries;i++) {
	            entryOffset = dirStart + i*12 + 2;
	            tag = strings[file.getUint16(entryOffset, !bigEnd)];
	            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
	            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
	        }
	        return tags;
	    }


	    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
	        var type = file.getUint16(entryOffset+2, !bigEnd),
	            numValues = file.getUint32(entryOffset+4, !bigEnd),
	            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
	            offset,
	            vals, val, n,
	            numerator, denominator;

	        switch (type) {
	            case 1: // byte, 8-bit unsigned int
	            case 7: // undefined, 8-bit byte, value depending on field
	                if (numValues == 1) {
	                    return file.getUint8(entryOffset + 8, !bigEnd);
	                } else {
	                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getUint8(offset + n);
	                    }
	                    return vals;
	                }

	            case 2: // ascii, 8-bit byte
	                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
	                return getStringFromDB(file, offset, numValues-1);

	            case 3: // short, 16 bit int
	                if (numValues == 1) {
	                    return file.getUint16(entryOffset + 8, !bigEnd);
	                } else {
	                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 4: // long, 32 bit int
	                if (numValues == 1) {
	                    return file.getUint32(entryOffset + 8, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 5:    // rational = two long values, first is numerator, second is denominator
	                if (numValues == 1) {
	                    numerator = file.getUint32(valueOffset, !bigEnd);
	                    denominator = file.getUint32(valueOffset+4, !bigEnd);
	                    val = new Number(numerator / denominator);
	                    val.numerator = numerator;
	                    val.denominator = denominator;
	                    return val;
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
	                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
	                        vals[n] = new Number(numerator / denominator);
	                        vals[n].numerator = numerator;
	                        vals[n].denominator = denominator;
	                    }
	                    return vals;
	                }

	            case 9: // slong, 32 bit signed int
	                if (numValues == 1) {
	                    return file.getInt32(entryOffset + 8, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 10: // signed rational, two slongs, first is numerator, second is denominator
	                if (numValues == 1) {
	                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
	                    }
	                    return vals;
	                }
	        }
	    }

	    /**
	    * Given an IFD (Image File Directory) start offset
	    * returns an offset to next IFD or 0 if it's the last IFD.
	    */
	    function getNextIFDOffset(dataView, dirStart, bigEnd){
	        //the first 2bytes means the number of directory entries contains in this IFD
	        var entries = dataView.getUint16(dirStart, !bigEnd);

	        // After last directory entry, there is a 4bytes of data,
	        // it means an offset to next IFD.
	        // If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

	        return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
	    }

	    function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd){
	        // get the IFD1 offset
	        var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart+firstIFDOffset, bigEnd);

	        if (!IFD1OffsetPointer) {
	            // console.log('******** IFD1Offset is empty, image thumb not found ********');
	            return {};
	        }
	        else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
	            // console.log('******** IFD1Offset is outside the bounds of the DataView ********');
	            return {};
	        }
	        // console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

	        var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd)

	        // EXIF 2.3 specification for JPEG format thumbnail

	        // If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
	        // Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
	        // by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
	        // Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
	        // JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

	        if (thumbTags['Compression']) {
	            // console.log('Thumbnail image found!');

	            switch (thumbTags['Compression']) {
	                case 6:
	                    // console.log('Thumbnail image format is JPEG');
	                    if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
	                    // extract the thumbnail
	                        var tOffset = tiffStart + thumbTags.JpegIFOffset;
	                        var tLength = thumbTags.JpegIFByteCount;
	                        thumbTags['blob'] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
	                            type: 'image/jpeg'
	                        });
	                    }
	                break;

	            case 1:
	                console.log("Thumbnail image format is TIFF, which is not implemented.");
	                break;
	            default:
	                console.log("Unknown thumbnail image format '%s'", thumbTags['Compression']);
	            }
	        }
	        else if (thumbTags['PhotometricInterpretation'] == 2) {
	            console.log("Thumbnail image format is RGB, which is not implemented.");
	        }
	        return thumbTags;
	    }

	    function getStringFromDB(buffer, start, length) {
	        var outstr = "";
	        for (n = start; n < start+length; n++) {
	            outstr += String.fromCharCode(buffer.getUint8(n));
	        }
	        return outstr;
	    }

	    function readEXIFData(file, start) {
	        if (getStringFromDB(file, start, 4) != "Exif") {
	            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
	            return false;
	        }

	        var bigEnd,
	            tags, tag,
	            exifData, gpsData,
	            tiffOffset = start + 6;

	        // test for TIFF validity and endianness
	        if (file.getUint16(tiffOffset) == 0x4949) {
	            bigEnd = false;
	        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
	            bigEnd = true;
	        } else {
	            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
	            return false;
	        }

	        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
	            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
	            return false;
	        }

	        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

	        if (firstIFDOffset < 0x00000008) {
	            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
	            return false;
	        }

	        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

	        if (tags.ExifIFDPointer) {
	            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
	            for (tag in exifData) {
	                switch (tag) {
	                    case "LightSource" :
	                    case "Flash" :
	                    case "MeteringMode" :
	                    case "ExposureProgram" :
	                    case "SensingMethod" :
	                    case "SceneCaptureType" :
	                    case "SceneType" :
	                    case "CustomRendered" :
	                    case "WhiteBalance" :
	                    case "GainControl" :
	                    case "Contrast" :
	                    case "Saturation" :
	                    case "Sharpness" :
	                    case "SubjectDistanceRange" :
	                    case "FileSource" :
	                        exifData[tag] = StringValues[tag][exifData[tag]];
	                        break;

	                    case "ExifVersion" :
	                    case "FlashpixVersion" :
	                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
	                        break;

	                    case "ComponentsConfiguration" :
	                        exifData[tag] =
	                            StringValues.Components[exifData[tag][0]] +
	                            StringValues.Components[exifData[tag][1]] +
	                            StringValues.Components[exifData[tag][2]] +
	                            StringValues.Components[exifData[tag][3]];
	                        break;
	                }
	                tags[tag] = exifData[tag];
	            }
	        }

	        if (tags.GPSInfoIFDPointer) {
	            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
	            for (tag in gpsData) {
	                switch (tag) {
	                    case "GPSVersionID" :
	                        gpsData[tag] = gpsData[tag][0] +
	                            "." + gpsData[tag][1] +
	                            "." + gpsData[tag][2] +
	                            "." + gpsData[tag][3];
	                        break;
	                }
	                tags[tag] = gpsData[tag];
	            }
	        }

	        // extract thumbnail
	        tags['thumbnail'] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

	        return tags;
	    }

	   function findXMPinJPEG(file) {

	        if (!('DOMParser' in self)) {
	            // console.warn('XML parsing not supported without DOMParser');
	            return;
	        }
	        var dataView = new DataView(file);

	        if (debug) console.log("Got file of length " + file.byteLength);
	        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
	           if (debug) console.log("Not a valid JPEG");
	           return false; // not a valid jpeg
	        }

	        var offset = 2,
	            length = file.byteLength,
	            dom = new DOMParser();

	        while (offset < (length-4)) {
	            if (getStringFromDB(dataView, offset, 4) == "http") {
	                var startOffset = offset - 1;
	                var sectionLength = dataView.getUint16(offset - 2) - 1;
	                var xmpString = getStringFromDB(dataView, startOffset, sectionLength)
	                var xmpEndIndex = xmpString.indexOf('xmpmeta>') + 8;
	                xmpString = xmpString.substring( xmpString.indexOf( '<x:xmpmeta' ), xmpEndIndex );

	                var indexOfXmp = xmpString.indexOf('x:xmpmeta') + 10
	                //Many custom written programs embed xmp/xml without any namespace. Following are some of them.
	                //Without these namespaces, XML is thought to be invalid by parsers
	                xmpString = xmpString.slice(0, indexOfXmp)
	                            + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" '
	                            + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
	                            + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" '
	                            + 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" '
	                            + 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" '
	                            + 'xmlns:exif="http://ns.adobe.com/exif/1.0/" '
	                            + 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" '
	                            + 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" '
	                            + 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" '
	                            + 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" '
	                            + 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '
	                            + xmpString.slice(indexOfXmp)

	                var domDocument = dom.parseFromString( xmpString, 'text/xml' );
	                return xml2Object(domDocument);
	            } else{
	             offset++;
	            }
	        }
	    }

	    function xml2json(xml) {
	        var json = {};
	      
	        if (xml.nodeType == 1) { // element node
	          if (xml.attributes.length > 0) {
	            json['@attributes'] = {};
	            for (var j = 0; j < xml.attributes.length; j++) {
	              var attribute = xml.attributes.item(j);
	              json['@attributes'][attribute.nodeName] = attribute.nodeValue;
	            }
	          }
	        } else if (xml.nodeType == 3) { // text node
	          return xml.nodeValue;
	        }
	      
	        // deal with children
	        if (xml.hasChildNodes()) {
	          for(var i = 0; i < xml.childNodes.length; i++) {
	            var child = xml.childNodes.item(i);
	            var nodeName = child.nodeName;
	            if (json[nodeName] == null) {
	              json[nodeName] = xml2json(child);
	            } else {
	              if (json[nodeName].push == null) {
	                var old = json[nodeName];
	                json[nodeName] = [];
	                json[nodeName].push(old);
	              }
	              json[nodeName].push(xml2json(child));
	            }
	          }
	        }
	        
	        return json;
	    }

	    function xml2Object(xml) {
	        try {
	            var obj = {};
	            if (xml.children.length > 0) {
	              for (var i = 0; i < xml.children.length; i++) {
	                var item = xml.children.item(i);
	                var attributes = item.attributes;
	                for(var idx in attributes) {
	                    var itemAtt = attributes[idx];
	                    var dataKey = itemAtt.nodeName;
	                    var dataValue = itemAtt.nodeValue;

	                    if(dataKey !== undefined) {
	                        obj[dataKey] = dataValue;
	                    }
	                }
	                var nodeName = item.nodeName;

	                if (typeof (obj[nodeName]) == "undefined") {
	                  obj[nodeName] = xml2json(item);
	                } else {
	                  if (typeof (obj[nodeName].push) == "undefined") {
	                    var old = obj[nodeName];

	                    obj[nodeName] = [];
	                    obj[nodeName].push(old);
	                  }
	                  obj[nodeName].push(xml2json(item));
	                }
	              }
	            } else {
	              obj = xml.textContent;
	            }
	            return obj;
	          } catch (e) {
	              console.log(e.message);
	          }
	    }

	    EXIF.enableXmp = function() {
	        EXIF.isXmpEnabled = true;
	    }

	    EXIF.disableXmp = function() {
	        EXIF.isXmpEnabled = false;
	    }

	    EXIF.getData = function(img, callback) {
	        if (((self.Image && img instanceof self.Image)
	            || (self.HTMLImageElement && img instanceof self.HTMLImageElement))
	            && !img.complete)
	            return false;

	        if (!imageHasData(img)) {
	            getImageData(img, callback);
	        } else {
	            if (callback) {
	                callback.call(img);
	            }
	        }
	        return true;
	    }

	    EXIF.getTag = function(img, tag) {
	        if (!imageHasData(img)) return;
	        return img.exifdata[tag];
	    }
	    
	    EXIF.getIptcTag = function(img, tag) {
	        if (!imageHasData(img)) return;
	        return img.iptcdata[tag];
	    }

	    EXIF.getAllTags = function(img) {
	        if (!imageHasData(img)) return {};
	        var a,
	            data = img.exifdata,
	            tags = {};
	        for (a in data) {
	            if (data.hasOwnProperty(a)) {
	                tags[a] = data[a];
	            }
	        }
	        return tags;
	    }
	    
	    EXIF.getAllIptcTags = function(img) {
	        if (!imageHasData(img)) return {};
	        var a,
	            data = img.iptcdata,
	            tags = {};
	        for (a in data) {
	            if (data.hasOwnProperty(a)) {
	                tags[a] = data[a];
	            }
	        }
	        return tags;
	    }

	    EXIF.pretty = function(img) {
	        if (!imageHasData(img)) return "";
	        var a,
	            data = img.exifdata,
	            strPretty = "";
	        for (a in data) {
	            if (data.hasOwnProperty(a)) {
	                if (typeof data[a] == "object") {
	                    if (data[a] instanceof Number) {
	                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
	                    } else {
	                        strPretty += a + " : [" + data[a].length + " values]\r\n";
	                    }
	                } else {
	                    strPretty += a + " : " + data[a] + "\r\n";
	                }
	            }
	        }
	        return strPretty;
	    }

	    EXIF.readFromBinaryFile = function(file) {
	        return findEXIFinJPEG(file);
	    }

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return EXIF;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}.call(this));



/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getDataTransferFiles;
	function getDataTransferFiles(event) {
	  var isMultipleAllowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	  var dataTransferItemsList = [];
	  if (event.dataTransfer) {
	    var dt = event.dataTransfer;
	    if (dt.files && dt.files.length) {
	      dataTransferItemsList = dt.files;
	    } else if (dt.items && dt.items.length) {
	      // During the drag even the dataTransfer.files is null
	      // but Chrome implements some drag store, which is accesible via dataTransfer.items
	      dataTransferItemsList = dt.items;
	    }
	  } else if (event.target && event.target.files) {
	    dataTransferItemsList = event.target.files;
	  }

	  if (dataTransferItemsList.length > 0) {
	    dataTransferItemsList = isMultipleAllowed ? dataTransferItemsList : [dataTransferItemsList[0]];
	  }

	  // Convert from DataTransferItemsList to the native Array
	  return Array.prototype.slice.call(dataTransferItemsList);
	}
	module.exports = exports["default"];

/***/ })
/******/ ])
});
;