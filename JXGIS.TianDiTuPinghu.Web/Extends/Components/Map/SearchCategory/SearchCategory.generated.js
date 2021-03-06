﻿// @hash v3-F7C4B899A8D6324CD1619C34D61CF38A616FE32B
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 3.0.1 (build 0) with Babel 6.7.7
// Generated at: 2017/5/3 14:46:59
///////////////////////////////////////////////////////////////////////////////
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubItem = function (_React$Component) {
    _inherits(SubItem, _React$Component);

    function SubItem() {
        _classCallCheck(this, SubItem);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SubItem).call(this));
    }

    _createClass(SubItem, [{
        key: 'click',
        value: function click() {
            if (this.props.click) this.props.click(this.props.item);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var item = this.props.item;
            return React.createElement(
                'span',
                { onClick: function onClick(e) {
                        return _this2.click(e);
                    }, className: 'subitem ' + (item.sub ? 'subitem-bg' : 'subitem-sm') },
                item.name
            );
        }
    }]);

    return SubItem;
}(React.Component);

var SearchCategoryItem = function (_React$Component2) {
    _inherits(SearchCategoryItem, _React$Component2);

    function SearchCategoryItem() {
        _classCallCheck(this, SearchCategoryItem);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SearchCategoryItem).call(this));
    }

    _createClass(SearchCategoryItem, [{
        key: 'render',
        value: function render() {
            var item = this.props.item;
            var subs = [];
            for (var i = 0, l = item.sub.length; i < l; i++) {
                subs.push(React.createElement(SubItem, { item: item.sub[i], click: this.props.click }));
            }
            return React.createElement(
                'div',
                { className: 'searchcategory-item' },
                React.createElement(
                    antd.Row,
                    null,
                    React.createElement(
                        antd.Col,
                        { span: 3 },
                        React.createElement('img', { src: _bl_ + item.picture })
                    ),
                    React.createElement(
                        antd.Col,
                        { span: 21 },
                        React.createElement(
                            'div',
                            null,
                            React.createElement(SubItem, { item: item, click: this.props.click })
                        ),
                        React.createElement(
                            'div',
                            null,
                            subs
                        )
                    )
                )
            );
        }
    }]);

    return SearchCategoryItem;
}(React.Component);

var SearchCategoryPanel = function (_React$Component3) {
    _inherits(SearchCategoryPanel, _React$Component3);

    function SearchCategoryPanel() {
        _classCallCheck(this, SearchCategoryPanel);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchCategoryPanel).call(this));

        _this4.state = {
            hidden: true,
            btnClearVisible: false,
            searchText: ""
        };
        return _this4;
    }

    _createClass(SearchCategoryPanel, [{
        key: 'btnClick',
        value: function btnClick() {
            if (this.props.btnClick) this.props.btnClick(this.state.searchText);
        }
    }, {
        key: 'focus',
        value: function focus() {
            if (this.state.hidden) {
                var input = this.searchText.refs.input;
                setTimeout(function () {
                    input.focus();
                }, 200);
            }
        }
    }, {
        key: 'toggleHidden',
        value: function toggleHidden() {
            this.setState({
                hidden: !this.state.hidden
            });
        }
    }, {
        key: 'show',
        value: function show() {
            this.setState({
                hidden: false
            });
        }
    }, {
        key: 'hidden',
        value: function hidden() {
            this.setState({
                hidden: true
            });
        }
    }, {
        key: 'toggleClearBtn',
        value: function toggleClearBtn() {
            this.setState({
                btnClearVisible: !this.state.btnClearVisible
            });
        }
    }, {
        key: 'clearSearchText',
        value: function clearSearchText() {
            this.setState({ searchText: "" });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var categories = this.props.categories;
            var ui = [];

            for (var i = 0, l = categories.length; i < l; i++) {
                ui.push(React.createElement(SearchCategoryItem, { item: categories[i], click: this.props.click }));
            };

            return React.createElement(
                'div',
                { className: "searchcategory-panel " + (this.state.hidden ? "" : "active") },
                React.createElement(
                    'div',
                    { className: 'searchcategory-panel-search' },
                    React.createElement(
                        antd.Input.Group,
                        null,
                        React.createElement(antd.Input, { ref: function ref(input) {
                                return _this5.searchText = input;
                            }, onChange: function onChange(e) {
                                return _this5.setState({ searchText: e.target.value });
                            }, value: this.state.searchText, onFocus: function onFocus(e) {
                                return _this5.toggleClearBtn();
                            }, onBlur: function onBlur(e) {
                                return _this5.toggleClearBtn();
                            }, size: 'large', placeholder: '请输入搜索关键字...' }),
                        React.createElement(antd.Icon, { onClick: function onClick(e) {
                                return _this5.clearSearchText();
                            }, className: "btn-search-clear " + (this.state.btnClearVisible ? "active" : ""), type: 'close-circle' }),
                        React.createElement(
                            'div',
                            { className: 'ant-input-group-wrap' },
                            React.createElement(antd.Button, { onClick: function onClick(e) {
                                    return _this5.btnClick();
                                }, type: 'primary', icon: 'search', size: 'large' })
                        )
                    )
                ),
                ui,
                React.createElement(
                    'div',
                    { onClick: function onClick(e) {
                            return _this5.hidden();
                        }, className: 'searchcategory-panel-sliderup' },
                    React.createElement(antd.Icon, { type: 'caret-up' })
                )
            );
        }
    }]);

    return SearchCategoryPanel;
}(React.Component);