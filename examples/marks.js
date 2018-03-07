webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(312);


/***/ }),

/***/ 312:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"rc-slider/assets/index.less\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _react = __webpack_require__(42);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(78);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcSlider = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"rc-slider\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _rcSlider2 = _interopRequireDefault(_rcSlider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var style = { width: 400, margin: 50 };
	var marks = {
	  '-10': '-10°C',
	  0: _react2.default.createElement(
	    'strong',
	    null,
	    '0\xB0C'
	  ),
	  26: '26°C',
	  37: '37°C',
	  50: '50°C',
	  100: {
	    style: {
	      color: 'red'
	    },
	    label: _react2.default.createElement(
	      'strong',
	      null,
	      '100\xB0C'
	    )
	  }
	};
	
	function log(value) {
	  console.log(value); //eslint-disable-line
	}
	
	_reactDom2.default.render(_react2.default.createElement(
	  'div',
	  null,
	  _react2.default.createElement(
	    'div',
	    { style: style },
	    _react2.default.createElement(
	      'p',
	      null,
	      'Slider with marks, `step=null`'
	    ),
	    _react2.default.createElement(_rcSlider2.default, { min: -10, marks: marks, step: null, onChange: log, defaultValue: 20 })
	  ),
	  _react2.default.createElement(
	    'div',
	    { style: style },
	    _react2.default.createElement(
	      'p',
	      null,
	      'Slider with marks and steps'
	    ),
	    _react2.default.createElement(_rcSlider2.default, { dots: true, min: -10, marks: marks, step: 10, onChange: log, defaultValue: 20 })
	  ),
	  _react2.default.createElement(
	    'div',
	    { style: style },
	    _react2.default.createElement(
	      'p',
	      null,
	      'Slider with marks, `included=false`'
	    ),
	    _react2.default.createElement(_rcSlider2.default, { min: -10, marks: marks, included: false, defaultValue: 20 })
	  ),
	  _react2.default.createElement(
	    'div',
	    { style: style },
	    _react2.default.createElement(
	      'p',
	      null,
	      'Slider with marks and steps, `included=false`'
	    ),
	    _react2.default.createElement(_rcSlider2.default, { min: -10, marks: marks, step: 10, included: false, defaultValue: 20 })
	  ),
	  _react2.default.createElement(
	    'div',
	    { style: style },
	    _react2.default.createElement(
	      'p',
	      null,
	      'Range with marks'
	    ),
	    _react2.default.createElement(_rcSlider2.default.Range, { min: -10, marks: marks, onChange: log, defaultValue: [20, 25, 30, 40] })
	  ),
	  _react2.default.createElement(
	    'div',
	    { style: style },
	    _react2.default.createElement(
	      'p',
	      null,
	      'Range with marks and steps'
	    ),
	    _react2.default.createElement(_rcSlider2.default.Range, { min: -10, marks: marks, step: 10, onChange: log, defaultValue: [20, 40] })
	  )
	), document.getElementById('__react-content'));

/***/ })

});
//# sourceMappingURL=marks.js.map