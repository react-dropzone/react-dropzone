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

	var _propTypes = __webpack_require__(2);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _exifJs = __webpack_require__(12);

	var _exifJs2 = _interopRequireDefault(_exifJs);

	var _utils = __webpack_require__(13);

	var _styles = __webpack_require__(15);

	var _styles2 = _interopRequireDefault(_styles);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint prefer-template: 0 */

	var Dropzone = function (_React$Component) {
	  _inherits(Dropzone, _React$Component);

	  _createClass(Dropzone, null, [{
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

	    _this.renderChildren = function (children, isDragActive, isDragAccept, isDragReject) {
	      if (typeof children === 'function') {
	        return children(_extends({}, _this.state, {
	          isDragActive: isDragActive,
	          isDragAccept: isDragAccept,
	          isDragReject: isDragReject
	        }));
	      }
	      return children;
	    };

	    _this.composeHandlers = _this.composeHandlers.bind(_this);
	    _this.onClick = _this.onClick.bind(_this);
	    _this.onDocumentDrop = _this.onDocumentDrop.bind(_this);
	    _this.onDragEnter = _this.onDragEnter.bind(_this);
	    _this.onDragLeave = _this.onDragLeave.bind(_this);
	    _this.onDragOver = _this.onDragOver.bind(_this);
	    _this.onDragStart = _this.onDragStart.bind(_this);
	    _this.onDrop = _this.onDrop.bind(_this);
	    _this.onFileDialogCancel = _this.onFileDialogCancel.bind(_this);
	    _this.onInputElementClick = _this.onInputElementClick.bind(_this);

	    _this.setRef = _this.setRef.bind(_this);
	    _this.setRefs = _this.setRefs.bind(_this);

	    _this.isFileDialogActive = false;

	    _this.state = {
	      draggedFiles: [],
	      acceptedFiles: [],
	      rejectedFiles: []
	    };
	    return _this;
	  }

	  _createClass(Dropzone, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var preventDropOnDocument = this.props.preventDropOnDocument;

	      this.dragTargets = [];

	      if (preventDropOnDocument) {
	        document.addEventListener('dragover', _utils.onDocumentDragOver, false);
	        document.addEventListener('drop', this.onDocumentDrop, false);
	      }
	      this.fileInputEl.addEventListener('click', this.onInputElementClick, false);
	      // Tried implementing addEventListener, but didn't work out
	      document.body.onfocus = this.onFileDialogCancel;
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      var preventDropOnDocument = this.props.preventDropOnDocument;

	      if (preventDropOnDocument) {
	        document.removeEventListener('dragover', _utils.onDocumentDragOver);
	        document.removeEventListener('drop', this.onDocumentDrop);
	      }
	      this.fileInputEl.removeEventListener('click', this.onInputElementClick, false);
	      // Can be replaced with removeEventListener, if addEventListener works
	      document.body.onfocus = null;
	    }
	  }, {
	    key: 'composeHandlers',
	    value: function composeHandlers(handler) {
	      if (this.props.disabled) {
	        return null;
	      }

	      return handler;
	    }
	  }, {
	    key: 'onDocumentDrop',
	    value: function onDocumentDrop(evt) {
	      if (this.node.contains(evt.target)) {
	        // if we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
	        return;
	      }
	      evt.preventDefault();
	      this.dragTargets = [];
	    }
	  }, {
	    key: 'onDragStart',
	    value: function onDragStart(evt) {
	      if (this.props.onDragStart) {
	        this.props.onDragStart.call(this, evt);
	      }
	    }
	  }, {
	    key: 'onDragEnter',
	    value: function onDragEnter(evt) {
	      evt.preventDefault();

	      // Count the dropzone and any children that are entered.
	      if (this.dragTargets.indexOf(evt.target) === -1) {
	        this.dragTargets.push(evt.target);
	      }

	      this.setState({
	        isDragActive: true, // Do not rely on files for the drag state. It doesn't work in Safari.
	        draggedFiles: (0, _utils.getDataTransferItems)(evt)
	      });

	      if (this.props.onDragEnter) {
	        this.props.onDragEnter.call(this, evt);
	      }
	    }
	  }, {
	    key: 'onDragOver',
	    value: function onDragOver(evt) {
	      // eslint-disable-line class-methods-use-this
	      evt.preventDefault();
	      evt.stopPropagation();
	      try {
	        evt.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
	      } catch (err) {
	        // continue regardless of error
	      }

	      if (this.props.onDragOver) {
	        this.props.onDragOver.call(this, evt);
	      }
	      return false;
	    }
	  }, {
	    key: 'onDragLeave',
	    value: function onDragLeave(evt) {
	      var _this2 = this;

	      evt.preventDefault();

	      // Only deactivate once the dropzone and all children have been left.
	      this.dragTargets = this.dragTargets.filter(function (el) {
	        return el !== evt.target && _this2.node.contains(el);
	      });
	      if (this.dragTargets.length > 0) {
	        return;
	      }

	      // Clear dragging files state
	      this.setState({
	        isDragActive: false,
	        draggedFiles: []
	      });

	      if (this.props.onDragLeave) {
	        this.props.onDragLeave.call(this, evt);
	      }
	    }
	  }, {
	    key: 'onDrop',
	    value: function onDrop(evt) {
	      var _this3 = this;

	      var _props = this.props,
	          onDrop = _props.onDrop,
	          onDropAccepted = _props.onDropAccepted,
	          onDropRejected = _props.onDropRejected,
	          multiple = _props.multiple,
	          disablePreview = _props.disablePreview,
	          accept = _props.accept,
	          maxSize = _props.maxSize,
	          minSize = _props.minSize;

	      var fileList = (0, _utils.getDataTransferItems)(evt);
	      var acceptedFiles = [];
	      var rejectedFiles = [];

	      // Stop default browser behavior
	      evt.preventDefault();

	      // Reset the counter along with the drag on a drop.
	      this.dragTargets = [];
	      this.isFileDialogActive = false;

	      fileList.forEach(function (file) {
	        Dropzone.resetImageOrientation(file, function (blob) {
	          if (!disablePreview) {
	            file.preview = blob; // eslint-disable-line no-param-reassign
	          }
	          if ((0, _utils.fileAccepted)(file, accept) && (0, _utils.fileMatchSize)(file, maxSize, minSize)) {
	            acceptedFiles.push(file);
	          } else {
	            rejectedFiles.push(file);
	          }
	          if (onDrop) {
	            onDrop.call(_this3, acceptedFiles, rejectedFiles, evt);
	          }

	          if (rejectedFiles.length > 0 && onDropRejected) {
	            onDropRejected.call(_this3, rejectedFiles, evt);
	          }

	          if (acceptedFiles.length > 0 && onDropAccepted) {
	            onDropAccepted.call(_this3, acceptedFiles, evt);
	          }
	        });

	        if (!multiple) {
	          // if not in multi mode add any extra accepted files to rejected.
	          // This will allow end users to easily ignore a multi file drop in "single" mode.
	          rejectedFiles.push.apply(rejectedFiles, _toConsumableArray(acceptedFiles.splice(1)));
	        }

	        if (onDrop) {
	          onDrop.call(_this3, acceptedFiles, rejectedFiles, evt);
	        }

	        if (rejectedFiles.length > 0 && onDropRejected) {
	          onDropRejected.call(_this3, rejectedFiles, evt);
	        }

	        if (acceptedFiles.length > 0 && onDropAccepted) {
	          onDropAccepted.call(_this3, acceptedFiles, evt);
	        }

	        // Clear files value
	        _this3.draggedFiles = null;

	        // Reset drag state
	        _this3.setState({
	          isDragActive: false,
	          draggedFiles: [],
	          acceptedFiles: acceptedFiles,
	          rejectedFiles: rejectedFiles
	        });
	      });
	    }
	  }, {
	    key: 'onClick',
	    value: function onClick(evt) {
	      var _props2 = this.props,
	          onClick = _props2.onClick,
	          disableClick = _props2.disableClick;

	      if (!disableClick) {
	        evt.stopPropagation();

	        if (onClick) {
	          onClick.call(this, evt);
	        }

	        // in IE11/Edge the file-browser dialog is blocking, ensure this is behind setTimeout
	        // this is so react can handle state changes in the onClick prop above above
	        // see: https://github.com/react-dropzone/react-dropzone/issues/450
	        setTimeout(this.open.bind(this), 0);
	      }
	    }
	  }, {
	    key: 'onInputElementClick',
	    value: function onInputElementClick(evt) {
	      evt.stopPropagation();
	      if (this.props.inputProps && this.props.inputProps.onClick) {
	        this.props.inputProps.onClick();
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
	    key: 'setRef',
	    value: function setRef(ref) {
	      this.node = ref;
	    }
	  }, {
	    key: 'setRefs',
	    value: function setRefs(ref) {
	      this.fileInputEl = ref;
	    }
	    /**
	     * Open system file upload dialog.
	     *
	     * @public
	     */

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
	      var _props3 = this.props,
	          accept = _props3.accept,
	          acceptClassName = _props3.acceptClassName,
	          activeClassName = _props3.activeClassName,
	          children = _props3.children,
	          disabled = _props3.disabled,
	          disabledClassName = _props3.disabledClassName,
	          inputProps = _props3.inputProps,
	          multiple = _props3.multiple,
	          name = _props3.name,
	          rejectClassName = _props3.rejectClassName,
	          rest = _objectWithoutProperties(_props3, ['accept', 'acceptClassName', 'activeClassName', 'children', 'disabled', 'disabledClassName', 'inputProps', 'multiple', 'name', 'rejectClassName']);

	      var acceptStyle = rest.acceptStyle,
	          activeStyle = rest.activeStyle,
	          className = rest.className,
	          disabledStyle = rest.disabledStyle,
	          rejectStyle = rest.rejectStyle,
	          style = rest.style,
	          props = _objectWithoutProperties(rest, ['acceptStyle', 'activeStyle', 'className', 'disabledStyle', 'rejectStyle', 'style']);

	      var _state = this.state,
	          isDragActive = _state.isDragActive,
	          draggedFiles = _state.draggedFiles;

	      var filesCount = draggedFiles.length;
	      var isMultipleAllowed = multiple || filesCount <= 1;
	      var isDragAccept = filesCount > 0 && (0, _utils.allFilesAccepted)(draggedFiles, this.props.accept);
	      var isDragReject = filesCount > 0 && (!isDragAccept || !isMultipleAllowed);
	      className = className || '';
	      var noStyles = !className && !style && !activeStyle && !acceptStyle && !rejectStyle && !disabledStyle;

	      if (isDragActive && activeClassName) {
	        className += ' ' + activeClassName;
	      }
	      if (isDragAccept && acceptClassName) {
	        className += ' ' + acceptClassName;
	      }
	      if (isDragReject && rejectClassName) {
	        className += ' ' + rejectClassName;
	      }
	      if (disabled && disabledClassName) {
	        className += ' ' + disabledClassName;
	      }

	      if (noStyles) {
	        style = _styles2.default.default;
	        activeStyle = _styles2.default.active;
	        acceptStyle = style.active;
	        rejectStyle = _styles2.default.rejected;
	        disabledStyle = _styles2.default.disabled;
	      }

	      var appliedStyle = _extends({}, style);
	      if (activeStyle && isDragActive) {
	        appliedStyle = _extends({}, style, activeStyle);
	      }
	      if (acceptStyle && isDragAccept) {
	        appliedStyle = _extends({}, appliedStyle, acceptStyle);
	      }
	      if (rejectStyle && isDragReject) {
	        appliedStyle = _extends({}, appliedStyle, rejectStyle);
	      }
	      if (disabledStyle && disabled) {
	        appliedStyle = _extends({}, style, disabledStyle);
	      }

	      var inputAttributes = {
	        accept: accept,
	        disabled: disabled,
	        type: 'file',
	        style: { display: 'none' },
	        multiple: _utils.supportMultiple && multiple,
	        ref: this.setRefs,
	        onChange: this.onDrop,
	        autoComplete: 'off'
	      };

	      if (name && name.length) {
	        inputAttributes.name = name;
	      }

	      // Remove custom properties before passing them to the wrapper div element
	      var customProps = ['acceptedFiles', 'preventDropOnDocument', 'disablePreview', 'disableClick', 'activeClassName', 'acceptClassName', 'rejectClassName', 'disabledClassName', 'onDropAccepted', 'onDropRejected', 'onFileDialogCancel', 'maxSize', 'minSize'];
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
	          onClick: this.composeHandlers(this.onClick),
	          onDragStart: this.composeHandlers(this.onDragStart),
	          onDragEnter: this.composeHandlers(this.onDragEnter),
	          onDragOver: this.composeHandlers(this.onDragOver),
	          onDragLeave: this.composeHandlers(this.onDragLeave),
	          onDrop: this.composeHandlers(this.onDrop),
	          ref: this.setRef,
	          'aria-disabled': disabled
	        }),
	        this.renderChildren(children, isDragActive, isDragAccept, isDragReject),
	        _react2.default.createElement('input', _extends({}, inputProps /* expand user provided inputProps first so inputAttributes override them */, inputAttributes))
	      );
	    }
	  }]);

	  return Dropzone;
	}(_react2.default.Component);

	exports.default = Dropzone;


	Dropzone.propTypes = {
	  /**
	   * Allow specific types of files. See https://github.com/okonet/attr-accept for more information.
	   * Keep in mind that mime type determination is not reliable across platforms. CSV files,
	   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
	   * Windows. In some cases there might not be a mime type set at all.
	   * See: https://github.com/react-dropzone/react-dropzone/issues/276
	   */
	  accept: _propTypes2.default.string,

	  /**
	   * Contents of the dropzone
	   */
	  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),

	  /**
	   * Disallow clicking on the dropzone container to open file dialog
	   */
	  disableClick: _propTypes2.default.bool,

	  /**
	  * Enable/disable the dropzone entirely
	  */
	  disabled: _propTypes2.default.bool,

	  /**
	   * Enable/disable preview generation
	   */
	  disablePreview: _propTypes2.default.bool,

	  /**
	   * If false, allow dropped items to take over the current browser window
	   */
	  preventDropOnDocument: _propTypes2.default.bool,

	  /**
	   * Pass additional attributes to the `<input type="file"/>` tag
	   */
	  inputProps: _propTypes2.default.object,

	  /**
	   * Allow dropping multiple files
	   */
	  multiple: _propTypes2.default.bool,

	  /**
	   * `name` attribute for the input tag
	   */
	  name: _propTypes2.default.string,

	  /**
	   * Maximum file size
	   */
	  maxSize: _propTypes2.default.number,

	  /**
	   * Minimum file size
	   */
	  minSize: _propTypes2.default.number,

	  /**
	   * className
	   */
	  className: _propTypes2.default.string,

	  /**
	   * className for active state
	   */
	  activeClassName: _propTypes2.default.string,

	  /**
	   * className for accepted state
	   */
	  acceptClassName: _propTypes2.default.string,

	  /**
	   * className for rejected state
	   */
	  rejectClassName: _propTypes2.default.string,

	  /**
	   * className for disabled state
	   */
	  disabledClassName: _propTypes2.default.string,

	  /**
	   * CSS styles to apply
	   */
	  style: _propTypes2.default.object,

	  /**
	   * CSS styles to apply when drag is active
	   */
	  activeStyle: _propTypes2.default.object,

	  /**
	   * CSS styles to apply when drop will be accepted
	   */
	  acceptStyle: _propTypes2.default.object,

	  /**
	   * CSS styles to apply when drop will be rejected
	   */
	  rejectStyle: _propTypes2.default.object,

	  /**
	   * CSS styles to apply when dropzone is disabled
	   */
	  disabledStyle: _propTypes2.default.object,

	  /**
	   * onClick callback
	   * @param {Event} event
	   */
	  onClick: _propTypes2.default.func,

	  /**
	   * onDrop callback
	   */
	  onDrop: _propTypes2.default.func,

	  /**
	   * onDropAccepted callback
	   */
	  onDropAccepted: _propTypes2.default.func,

	  /**
	   * onDropRejected callback
	   */
	  onDropRejected: _propTypes2.default.func,

	  /**
	   * onDragStart callback
	   */
	  onDragStart: _propTypes2.default.func,

	  /**
	   * onDragEnter callback
	   */
	  onDragEnter: _propTypes2.default.func,

	  /**
	   * onDragOver callback
	   */
	  onDragOver: _propTypes2.default.func,

	  /**
	   * onDragLeave callback
	   */
	  onDragLeave: _propTypes2.default.func,

	  /**
	   * Provide a callback on clicking the cancel button of the file dialog
	   */
	  onFileDialogCancel: _propTypes2.default.func
	};

	Dropzone.defaultProps = {
	  preventDropOnDocument: true,
	  disabled: false,
	  disablePreview: false,
	  disableClick: false,
	  multiple: true,
	  maxSize: Infinity,
	  minSize: 0
	};
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	if (process.env.NODE_ENV !== 'production') {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;

	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(4)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(11)();
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(5);
	var invariant = __webpack_require__(6);
	var warning = __webpack_require__(7);
	var assign = __webpack_require__(8);

	var ReactPropTypesSecret = __webpack_require__(9);
	var checkPropTypes = __webpack_require__(10);

	module.exports = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    if (process.env.NODE_ENV !== 'production') {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          invariant(
	            false,
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            warning(
	              false,
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `%s` prop on `%s`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
	              propFullName,
	              componentName
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues);
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (propValue.hasOwnProperty(key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        warning(
	          false,
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received %s at index %s.',
	          getPostfixForTypeWarning(checker),
	          i
	        );
	        return emptyFunction.thatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
	          return null;
	        }
	      }

	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }

	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(5);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  var printWarning = function printWarning(format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  warning = function warning(condition, format) {
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	if (process.env.NODE_ENV !== 'production') {
	  var invariant = __webpack_require__(6);
	  var warning = __webpack_require__(7);
	  var ReactPropTypesSecret = __webpack_require__(9);
	  var loggedTypeFailures = {};
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (process.env.NODE_ENV !== 'production') {
	    for (var typeSpecName in typeSpecs) {
	      if (typeSpecs.hasOwnProperty(typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
	        }
	      }
	    }
	  }
	}

	module.exports = checkPropTypes;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(5);
	var invariant = __webpack_require__(6);
	var ReactPropTypesSecret = __webpack_require__(9);

	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.supportMultiple = undefined;
	exports.getDataTransferItems = getDataTransferItems;
	exports.fileAccepted = fileAccepted;
	exports.fileMatchSize = fileMatchSize;
	exports.allFilesAccepted = allFilesAccepted;
	exports.onDocumentDragOver = onDocumentDragOver;

	var _attrAccept = __webpack_require__(14);

	var _attrAccept2 = _interopRequireDefault(_attrAccept);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var supportMultiple = exports.supportMultiple = typeof document !== 'undefined' && document && document.createElement ? 'multiple' in document.createElement('input') : true;

	function getDataTransferItems(event) {
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
	  // Convert from DataTransferItemsList to the native Array
	  return Array.prototype.slice.call(dataTransferItemsList);
	}

	// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
	// that MIME type will always be accepted
	function fileAccepted(file, accept) {
	  return file.type === 'application/x-moz-file' || (0, _attrAccept2.default)(file, accept);
	}

	function fileMatchSize(file, maxSize, minSize) {
	  return file.size <= maxSize && file.size >= minSize;
	}

	function allFilesAccepted(files, accept) {
	  return files.every(function (file) {
	    return fileAccepted(file, accept);
	  });
	}

	// allow the entire document to be a drag target
	function onDocumentDragOver(evt) {
	  evt.preventDefault();
	}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports=function(t){function n(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return t[e].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){"use strict";n.__esModule=!0,r(8),r(9),n["default"]=function(t,n){if(t&&n){var r=function(){var r=Array.isArray(n)?n:n.split(","),e=t.name||"",o=t.type||"",i=o.replace(/\/.*$/,"");return{v:r.some(function(t){var n=t.trim();return"."===n.charAt(0)?e.toLowerCase().endsWith(n.toLowerCase()):/\/\*$/.test(n)?i===n.replace(/\/.*$/,""):o===n})}}();if("object"==typeof r)return r.v}return!0},t.exports=n["default"]},function(t,n){var r=t.exports={version:"1.2.2"};"number"==typeof __e&&(__e=r)},function(t,n){var r=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},function(t,n,r){var e=r(2),o=r(1),i=r(4),u=r(19),c="prototype",f=function(t,n){return function(){return t.apply(n,arguments)}},s=function(t,n,r){var a,p,l,y,d=t&s.G,h=t&s.P,v=d?e:t&s.S?e[n]||(e[n]={}):(e[n]||{})[c],x=d?o:o[n]||(o[n]={});d&&(r=n);for(a in r)p=!(t&s.F)&&v&&a in v,l=(p?v:r)[a],y=t&s.B&&p?f(l,e):h&&"function"==typeof l?f(Function.call,l):l,v&&!p&&u(v,a,l),x[a]!=l&&i(x,a,y),h&&((x[c]||(x[c]={}))[a]=l)};e.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,t.exports=s},function(t,n,r){var e=r(5),o=r(18);t.exports=r(22)?function(t,n,r){return e.setDesc(t,n,o(1,r))}:function(t,n,r){return t[n]=r,t}},function(t,n){var r=Object;t.exports={create:r.create,getProto:r.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:r.getOwnPropertyDescriptor,setDesc:r.defineProperty,setDescs:r.defineProperties,getKeys:r.keys,getNames:r.getOwnPropertyNames,getSymbols:r.getOwnPropertySymbols,each:[].forEach}},function(t,n){var r=0,e=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++r+e).toString(36))}},function(t,n,r){var e=r(20)("wks"),o=r(2).Symbol;t.exports=function(t){return e[t]||(e[t]=o&&o[t]||(o||r(6))("Symbol."+t))}},function(t,n,r){r(26),t.exports=r(1).Array.some},function(t,n,r){r(25),t.exports=r(1).String.endsWith},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n){var r={}.toString;t.exports=function(t){return r.call(t).slice(8,-1)}},function(t,n,r){var e=r(10);t.exports=function(t,n,r){if(e(t),void 0===n)return t;switch(r){case 1:return function(r){return t.call(n,r)};case 2:return function(r,e){return t.call(n,r,e)};case 3:return function(r,e,o){return t.call(n,r,e,o)}}return function(){return t.apply(n,arguments)}}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n,r){t.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r(7)("match")]=!1,!"/./"[t](n)}catch(o){}}return!0}},function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,r){var e=r(16),o=r(11),i=r(7)("match");t.exports=function(t){var n;return e(t)&&(void 0!==(n=t[i])?!!n:"RegExp"==o(t))}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,r){var e=r(2),o=r(4),i=r(6)("src"),u="toString",c=Function[u],f=(""+c).split(u);r(1).inspectSource=function(t){return c.call(t)},(t.exports=function(t,n,r,u){"function"==typeof r&&(o(r,i,t[n]?""+t[n]:f.join(String(n))),"name"in r||(r.name=n)),t===e?t[n]=r:(u||delete t[n],o(t,n,r))})(Function.prototype,u,function(){return"function"==typeof this&&this[i]||c.call(this)})},function(t,n,r){var e=r(2),o="__core-js_shared__",i=e[o]||(e[o]={});t.exports=function(t){return i[t]||(i[t]={})}},function(t,n,r){var e=r(17),o=r(13);t.exports=function(t,n,r){if(e(n))throw TypeError("String#"+r+" doesn't accept regex!");return String(o(t))}},function(t,n,r){t.exports=!r(15)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n){var r=Math.ceil,e=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?e:r)(t)}},function(t,n,r){var e=r(23),o=Math.min;t.exports=function(t){return t>0?o(e(t),9007199254740991):0}},function(t,n,r){"use strict";var e=r(3),o=r(24),i=r(21),u="endsWith",c=""[u];e(e.P+e.F*r(14)(u),"String",{endsWith:function(t){var n=i(this,t,u),r=arguments,e=r.length>1?r[1]:void 0,f=o(n.length),s=void 0===e?f:Math.min(o(e),f),a=String(t);return c?c.call(n,a,s):n.slice(s-a.length,s)===a}})},function(t,n,r){var e=r(5),o=r(3),i=r(1).Array||Array,u={},c=function(t,n){e.each.call(t.split(","),function(t){void 0==n&&t in i?u[t]=i[t]:t in[]&&(u[t]=r(12)(Function.call,[][t],n))})};c("pop,reverse,shift,keys,values,entries",1),c("indexOf,every,some,forEach,map,filter,find,findIndex,includes",3),c("join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill"),o(o.S,"Array",u)}]);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  rejected: {
	    borderStyle: 'solid',
	    borderColor: '#c66',
	    backgroundColor: '#eee'
	  },
	  disabled: {
	    opacity: 0.5
	  },
	  active: {
	    borderStyle: 'solid',
	    borderColor: '#6c6',
	    backgroundColor: '#eee'
	  },
	  default: {
	    width: 200,
	    height: 200,
	    borderWidth: 2,
	    borderColor: '#666',
	    borderStyle: 'dashed',
	    borderRadius: 5
	  }
	};
	module.exports = exports['default'];

/***/ })
/******/ ])
});
;