﻿// @hash v3-4B7D4C81E928ABA451F945135EB9FDD8D262BFA5
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 3.0.1 (build 0) with Babel 6.7.7
// Generated at: 2017/5/3 14:46:59
///////////////////////////////////////////////////////////////////////////////
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchResultItem = function (_React$Component) {
    _inherits(SearchResultItem, _React$Component);

    function SearchResultItem(props) {
        _classCallCheck(this, SearchResultItem);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SearchResultItem).call(this));
    }

    _createClass(SearchResultItem, [{
        key: "onClick",
        value: function onClick(e) {
            if (this.props.click) {
                this.props.click(this.props.item);
            }
        }
    }, {
        key: "onHover",
        value: function onHover(e) {
            if (this.props.hover) {
                this.props.hover(this.props.item);
            }
        }
    }, {
        key: "onError",
        value: function onError() {
            this.refs.img.src = _bl_ + "/Reference/image/none-picture.png";
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var item = this.props.item;

            return React.createElement(
                "div",
                { className: "searchresult-item", onMouseEnter: function onMouseEnter(e) {
                        return _this2.onHover(e);
                    }, onClick: function onClick(e) {
                        return _this2.onClick(e);
                    } },
                React.createElement(
                    antd.Row,
                    null,
                    React.createElement(
                        antd.Col,
                        { span: 3 },
                        React.createElement(
                            "div",
                            { className: "searchresult-item-index" },
                            item.INDEX
                        )
                    ),
                    React.createElement(
                        antd.Col,
                        { span: 13 },
                        React.createElement(
                            "div",
                            { className: "searchresult-item-shortname" },
                            item.SHORTNAME
                        ),
                        React.createElement(
                            "div",
                            { className: "searchresult-item-address" },
                            React.createElement(antd.Icon, { type: "environment" }),
                            " ",
                            item.ADDRESS
                        ),
                        React.createElement(
                            "div",
                            { className: "searchresult-item-phone" },
                            React.createElement(antd.Icon, { type: "phone" }),
                            " ",
                            item.PHONE
                        )
                    ),
                    React.createElement(
                        antd.Col,
                        { span: 8 },
                        React.createElement("img", { ref: "img", onError: this.onError.bind(this), src: item.PHOTO })
                    )
                )
            );
        }
    }]);

    return SearchResultItem;
}(React.Component);

var SearchResultPanel = function (_React$Component2) {
    _inherits(SearchResultPanel, _React$Component2);

    function SearchResultPanel(props) {
        _classCallCheck(this, SearchResultPanel);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(SearchResultPanel).call(this));

        _this3.keywords = [''];
        _this3.pageSize = props.pageSize || 30;
        _this3.clickHidden = false;
        _this3.state = {
            rows: [],
            total: 0,
            hidden: true,
            pageNumber: 1
        };
        return _this3;
    }

    _createClass(SearchResultPanel, [{
        key: "pageChange",
        value: function pageChange(noop) {
            console.log(noop + "\n");
            console.log(this);
        }
    }, {
        key: "show",
        value: function show() {
            this.setState({
                hidden: false
            });
        }
    }, {
        key: "hidden",
        value: function hidden(click) {
            this.clickHidden = click ? true : false;
            if (click) {
                this.clear();
            }
            this.setState({
                hidden: true
            });
        }
    }, {
        key: "clear",
        value: function clear() {
            this.keywords = null;
            this.types = null;
            this.center = null;
            this.radius = null;

            this.props.map.poiItems.clearLayers();
            if (this.props.map.areaSearchLayer) {
                this.props.map.areaSearchLayer.remove();
                this.props.map.areaSearchLayer = null;
            }
            this.setState({ rows: [] });
        }
    }, {
        key: "toggle",
        value: function toggle() {
            this.setState({
                hidden: !this.state.hidden
            });
        }
    }, {
        key: "getPOI",
        value: function getPOI(fitMap, keyword, categories, pagenumber, center, radius) {
            this.clickHidden = false;
            this.keywords = keyword || this.keywords;
            this.types = categories || this.types;
            this.center = center || this.center;
            if (this.center) {
                this.center = {
                    lat: this.center.lat,
                    lng: this.center.lng
                };
            }
            this.radius = radius || this.radius;
            var c_this = this;
            var pageNumber = pagenumber ? pagenumber : 1;
            this.setState({
                pageNumber: pageNumber
            });

            $.post(this.props.url, {
                keywords: this.keywords,
                types: this.types,
                pagesize: this.pageSize,
                pagenumber: pageNumber,
                centerpoint: this.center,
                radius: this.radius
            }, function (rt) {
                if (!rt.ErrorMessage) {
                    var data = rt.Data.Data;
                    c_this.setState({
                        rows: data.Results,
                        total: data.Count,
                        hidden: false
                    });
                    c_this.props.map.loadPOIs(data.Results, fitMap);
                } else {
                    _g.fun.showError(rt.ErrorMessage);
                }
            }, 'json');
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (!L.Browser.webkit) {
                var $scroll = this.$scroll;
                if ($scroll) {
                    $scroll.mCustomScrollbar("scrollTo", "top");
                } else {
                    this.$scroll = $('.searchresult-panel .searchresult-panelbody').mCustomScrollbar({
                        theme: "dark-blue",
                        scrollInertia: 0
                    });
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var rows = this.state.rows;
            var items = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                row.INDEX = i + 1;
                items.push(React.createElement(SearchResultItem, { click: this.props.click, hover: this.props.hover, item: row }));
            }
            return React.createElement(
                "div",
                { className: "searchresult-panel " + (this.state.hidden ? "" : "active") },
                React.createElement(
                    "span",
                    { onClick: function onClick(e) {
                            return _this4.hidden(true);
                        }, className: "btn-search-fallback" },
                    "返回"
                ),
                React.createElement(
                    "div",
                    { className: "searchresult-total" },
                    "搜索到 ",
                    React.createElement(
                        "span",
                        null,
                        " ",
                        this.state.total,
                        " "
                    ),
                    " 条结果"
                ),
                React.createElement(
                    "div",
                    { className: "searchresult-panelbody" },
                    React.createElement(
                        "div",
                        null,
                        items
                    )
                ),
                React.createElement(
                    "div",
                    { className: "searchresult-pagination clearfix" },
                    React.createElement(antd.Pagination, { current: this.state.pageNumber, pageSize: this.pageSize, onChange: function onChange(e) {
                            return _this4.getPOI(true, null, null, e);
                        }, size: "small", total: this.state.total })
                )
            );
        }
    }]);

    return SearchResultPanel;
}(React.Component);