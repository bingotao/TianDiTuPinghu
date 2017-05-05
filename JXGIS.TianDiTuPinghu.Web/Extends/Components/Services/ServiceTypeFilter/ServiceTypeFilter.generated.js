﻿// @hash v3-F704B3DF87399875BECC942C11CC5685354C2074
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 3.0.1 (build 0) with Babel 6.7.7
// Generated at: 2017/5/3 14:47:01
///////////////////////////////////////////////////////////////////////////////
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServiceTypeFilterItem = function (_React$Component) {
    _inherits(ServiceTypeFilterItem, _React$Component);

    function ServiceTypeFilterItem(props) {
        _classCallCheck(this, ServiceTypeFilterItem);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceTypeFilterItem).call(this));

        _this.state = {
            selected: false
        };
        return _this;
    }

    _createClass(ServiceTypeFilterItem, [{
        key: 'change',
        value: function change() {
            this.props.search();
        }
    }, {
        key: 'isSelected',
        value: function isSelected() {
            return this.state.selected;
        }
    }, {
        key: 'selectItem',
        value: function selectItem() {
            if (!this.state.selected) {
                this.state.selected = true;
                this.change();
                this.setState({ selected: true });
            }
        }
    }, {
        key: 'unselectItem',
        value: function unselectItem() {
            if (this.state.selected) {
                this.state.selected = false;
                this.change();
                this.setState({ selected: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var filter = this.props.filter;
            var name = filter.name;

            return React.createElement(
                'div',
                { className: "servicetype-filter-item " + (this.state.selected ? 'active' : '') },
                React.createElement(
                    'span',
                    { onClick: this.selectItem.bind(this) },
                    name
                ),
                React.createElement(antd.Icon, { onClick: this.unselectItem.bind(this), type: 'close-circle' })
            );
        }
    }]);

    return ServiceTypeFilterItem;
}(React.Component);

var ServiceTypeFilter = function (_React$Component2) {
    _inherits(ServiceTypeFilter, _React$Component2);

    function ServiceTypeFilter(props) {
        _classCallCheck(this, ServiceTypeFilter);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ServiceTypeFilter).call(this));
    }

    _createClass(ServiceTypeFilter, [{
        key: 'getCategories',
        value: function getCategories() {
            var categories = [];
            for (var name in this.refs) {
                if (name.startsWith("filter")) {
                    var ref = this.refs[name];
                    if (ref.isSelected()) {
                        categories.push(ref.props.filter);
                    }
                }
            }
            return categories;
        }
    }, {
        key: 'render',
        value: function render() {
            var category = this.props.category;
            var title = category.title;
            var filters = category.filters;
            var cFilters = [];
            for (var i = 0, l = filters.length; i < l; i++) {
                var filter = filters[i];
                cFilters.push(React.createElement(ServiceTypeFilterItem, { search: this.props.search, ref: "filter" + i, filter: filter }));
            }

            return React.createElement(
                'div',
                { className: 'servicetype-filter' },
                React.createElement(
                    'div',
                    { className: 'servicetype-filter-name' },
                    title
                ),
                cFilters
            );
        }
    }]);

    return ServiceTypeFilter;
}(React.Component);