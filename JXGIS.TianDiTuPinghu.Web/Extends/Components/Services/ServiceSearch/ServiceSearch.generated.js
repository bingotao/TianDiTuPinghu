﻿// @hash v3-AF7E8525C9F230C4627902B35BD61F96D4AB990F
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 3.0.1 (build 0) with Babel 6.7.7
// Generated at: 2017/5/3 14:47:01
///////////////////////////////////////////////////////////////////////////////
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServiceSearchBar = function (_React$Component) {
    _inherits(ServiceSearchBar, _React$Component);

    function ServiceSearchBar(props) {
        _classCallCheck(this, ServiceSearchBar);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceSearchBar).call(this));

        _this.state = {
            searchText: "",
            btnClearVisible: false
        };
        return _this;
    }

    _createClass(ServiceSearchBar, [{
        key: "getSearchText",
        value: function getSearchText() {
            return this.state.searchText;
        }
    }, {
        key: "clearSearchText",
        value: function clearSearchText() {
            this.setState({ searchText: "" });
        }
    }, {
        key: "toggleClearBtn",
        value: function toggleClearBtn() {
            this.setState({ btnClearVisible: !this.state.btnClearVisible });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                { className: "serivce-searchbar" },
                React.createElement(
                    antd.Input.Group,
                    null,
                    React.createElement(antd.Input, { ref: "input", onChange: function onChange(e) {
                            return _this2.setState({ searchText: e.target.value });
                        }, value: this.state.searchText, onFocus: function onFocus(e) {
                            return _this2.toggleClearBtn();
                        }, onBlur: function onBlur(e) {
                            return _this2.toggleClearBtn();
                        }, size: "large", placeholder: "搜索服务..." }),
                    React.createElement(antd.Icon, { onClick: this.clearSearchText.bind(this), className: "btn-search-clear " + (this.state.btnClearVisible ? "active" : ""), type: "close-circle" }),
                    React.createElement(
                        "div",
                        { className: "ant-input-group-wrap" },
                        React.createElement(antd.Button, { onClick: this.props.search, type: "primary", icon: "search", size: "large" })
                    )
                )
            );
        }
    }]);

    return ServiceSearchBar;
}(React.Component);

var ServiceResults = function (_React$Component2) {
    _inherits(ServiceResults, _React$Component2);

    function ServiceResults(props) {
        _classCallCheck(this, ServiceResults);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceResults).call(this));

        _this3.state = {
            services: props.services || []
        };
        return _this3;
    }

    _createClass(ServiceResults, [{
        key: "filter",
        value: function filter(categories, searchText) {
            var types = [];
            var dataTypes = [];
            for (var i = 0, l = categories.length; i < l; i++) {
                var ct = categories[i];
                if (ct.type) types.push(ct.type);
                if (ct.dataType) dataTypes.push(ct.dataType);
            }
            var cThis = this;
            $.post('GetServices', {
                types: types,
                dataTypes: dataTypes,
                searchText: searchText
            }, function (rt) {
                if (rt.ErrorMessage) {
                    commonTool.info.showError(rt.ErrorMessage);
                } else {
                    var services = rt.Data;
                    cThis.setState({ services: services });
                }
            }, 'json');
        }
    }, {
        key: "render",
        value: function render() {
            var services = this.state.services;
            var total = services.length;
            var cServices = [];
            for (var i = 0, l = services.length; i < l; i++) {
                cServices.push(React.createElement(ServiceResultItem, { item: services[i] }));
            }

            return React.createElement(
                "div",
                { className: "service-result" },
                React.createElement(
                    "div",
                    { className: "service-result-total" },
                    "共找到 ",
                    React.createElement(
                        "span",
                        null,
                        total
                    ),
                    " 个服务"
                ),
                React.createElement(
                    "div",
                    { className: "service-result-list" },
                    cServices
                )
            );
        }
    }]);

    return ServiceResults;
}(React.Component);

var ServiceResultItem = function (_React$Component3) {
    _inherits(ServiceResultItem, _React$Component3);

    function ServiceResultItem(props) {
        _classCallCheck(this, ServiceResultItem);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceResultItem).call(this));
    }

    _createClass(ServiceResultItem, [{
        key: "onError",
        value: function onError() {
            this.refs.img.src = _bl_ + "/Reference/image/none-picture.png";
        }
    }, {
        key: "render",
        value: function render() {
            var item = this.props.item;
            var title = item.Name;
            var type = item.ServiceType;
            var description = item.Description;
            var address = item.Address;
            var metadata = item.MetaData;
            var img = item.ImageUrl ? _bl_ + item.ImageUrl : null;

            return React.createElement(
                "div",
                { className: "service-item clearfix" },
                React.createElement(
                    "h3",
                    { className: "service-item-title" },
                    title
                ),
                React.createElement(
                    "div",
                    { style: { marginTop: '10px' }, className: "clearfix" },
                    React.createElement("img", { ref: "img", onError: this.onError.bind(this), src: img }),
                    React.createElement(
                        "div",
                        { className: "service-item-content" },
                        React.createElement(
                            "div",
                            null,
                            "服务类型：",
                            type
                        ),
                        React.createElement(
                            "div",
                            null,
                            "服务简介：",
                            description
                        ),
                        React.createElement(
                            "div",
                            null,
                            "服务地址：",
                            address
                        ),
                        React.createElement(
                            "div",
                            null,
                            "服务元数据：",
                            metadata
                        )
                    )
                )
            );
        }
    }]);

    return ServiceResultItem;
}(React.Component);