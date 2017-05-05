﻿// @hash v3-B0F85E15C269F5FFD3A37A57E64AD29F7F2812F6
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 3.0.1 (build 0) with Babel 6.7.7
// Generated at: 2017/5/3 14:47:00
///////////////////////////////////////////////////////////////////////////////
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoutePlanning = function (_React$Component) {
    _inherits(RoutePlanning, _React$Component);

    function RoutePlanning(props) {
        _classCallCheck(this, RoutePlanning);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RoutePlanning).call(this, props));

        _this.state = {
            visible: false,
            general: false,
            showDetail: true,
            showSearchResult: false,
            startPoint: {
                searchText: '',
                latlng: null,
                on: false
            },
            endPoint: {
                searchText: '',
                latlng: null,
                on: false
            },
            route: null,
            showLoading: false,
            searchResults: []
        };

        return _this;
    }

    _createClass(RoutePlanning, [{
        key: 'clear',
        value: function clear(bClearMap) {
            var obj = {
                startPoint: {
                    searchText: '',
                    latlng: null,
                    on: false
                },
                endPoint: {
                    searchText: '',
                    latlng: null,
                    on: false
                },
                route: null,
                showLoading: false,
                searchResults: []
            };
            this.setState(obj);
            if (bClearMap) {
                this.props.map.clearPlanning();
            }
        }
    }, {
        key: 'getRoute',
        value: function getRoute(showTip) {
            if (!this.state.showLoading) {
                var s = this.state;
                if (s.startPoint.latlng && s.endPoint.latlng) {
                    if (s.startPoint.latlng.lat === s.endPoint.latlng.lat && s.startPoint.latlng.lng === s.endPoint.latlng.lng) {
                        antd.Toast.fail("设置的起始位置相同...");
                        return;
                    }

                    antd.Toast.show("正在规划路径...");
                    this.setState({ showLoading: true });
                    $.post('GetRoutePlanning', {
                        begin: s.startPoint.latlng,
                        end: s.endPoint.latlng,
                        planningtype: 1,
                        tripmode: 2
                    }, function (rt) {
                        if (rt.ErrorMessage) {
                            antd.Toast.fail(rt.ErrorMessage);
                            this.setState({ showLoading: false });
                        } else {
                            var route = rt.Data.route;
                            this.setState({
                                showLoading: false,
                                route: route
                            }, function () {
                                this.refs.routeDetial.scrollTop = 0;
                            }.bind(this));

                            this.props.map.setPlanning({
                                startPoint: route.StartPoint,
                                endPoint: route.EndPoint,
                                routes: route.RoutePath
                            }, true);
                        }
                    }.bind(this), 'json');
                } else {
                    showTip ? antd.Toast.fail("请设置起始位置！") : null;
                }
            }
        }
    }, {
        key: 'getPOI',
        value: function getPOI(text) {
            var t = text || '';
            $.post('SearchPOI', { Keywords: [t], types: [], pagenumber: 1, pagesize: 15 }, function (rt) {
                if (rt.ErrorMessage) {
                    antd.Toast.fail(rt.ErrorMessage);
                } else {
                    this.setState({ searchResults: rt.Data.Data.Results, showSearchResult: true });
                }
            }.bind(this), 'json');
        }
    }, {
        key: 'togglePosition',
        value: function togglePosition() {
            var s = this.state;
            var start = s.startPoint;
            var end = s.endPoint;
            this.setState({
                startPoint: end,
                endPoint: start
            }, this.getRoute.bind(this, false));
        }
    }, {
        key: 'show',
        value: function show(general) {
            var obj = { visible: true };
            obj.general = !!general;
            this.setState(obj);
        }
    }, {
        key: 'hidden',
        value: function hidden(general) {
            var obj = { visible: false, general: false };
            this.setState(obj);
        }
    }, {
        key: 'clearStartPoint',
        value: function clearStartPoint() {
            this.setState({
                startPoint: {
                    searchText: '',
                    latlng: null
                }
            }, function () {
                this.refs.start.focus();
            }.bind(this));
        }
    }, {
        key: 'clearEndPoint',
        value: function clearEndPoint() {
            this.setState({
                endPoint: {
                    searchText: '',
                    latlng: null
                }
            }, function () {
                this.refs.end.focus();
            }.bind(this));
        }
    }, {
        key: 'setPoint',
        value: function setPoint(poi) {
            var point = this.currentInput;
            var obj = { showSearchResult: false };
            obj[point] = {
                searchText: poi.SHORTNAME,
                latlng: {
                    lat: poi.Y,
                    lng: poi.X
                }
            };
            this.setState(obj, this.getRoute.bind(this, false));
        }
    }, {
        key: 'setEndPoint',
        value: function setEndPoint(poi) {
            var obj = { showSearchResult: false };
            obj.endPoint = {
                searchText: poi.SHORTNAME,
                latlng: {
                    lat: poi.Y,
                    lng: poi.X
                }
            };
            this.setState(obj, this.getRoute.bind(this, false));
        }
    }, {
        key: 'getCurrentPosition',
        value: function getCurrentPosition() {
            var map = this.props.map;
            if (map.location) {
                var pnt = map.location.getLatLng();
                this.setPoint({
                    SHORTNAME: "当前位置",
                    X: pnt.lng,
                    Y: pnt.lat
                });
            } else {
                map.getLocation(null, true, function (latlng) {
                    this.setPoint({
                        SHORTNAME: "当前位置",
                        X: latlng.lng,
                        Y: latlng.lat
                    });
                }.bind(this));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var s = this.state;
            var results = s.searchResults || [];
            var cResults = results.map(function (i) {
                return React.createElement(
                    'div',
                    { onClick: this.setPoint.bind(this, i) },
                    React.createElement(antd.Icon, { type: 'environment' }),
                    React.createElement(
                        'span',
                        null,
                        i.SHORTNAME
                    )
                );
            }.bind(this));

            var routes = s.route ? s.route.Routes : [];
            var cRoutes = routes.map(function (i, j) {
                return React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        React.createElement(
                            'div',
                            null,
                            j + 1
                        )
                    ),
                    React.createElement(
                        'td',
                        null,
                        i
                    )
                );
            });
            return React.createElement(
                'div',
                { className: "routeplanning " + (s.visible ? "active " : "") + (s.general ? "general" : "") },
                React.createElement(
                    'div',
                    { className: 'route-general' },
                    React.createElement(
                        'span',
                        null,
                        s.route && s.route.Distance,
                        '（',
                        s.route && s.route.Time,
                        '）'
                    ),
                    React.createElement(
                        antd.Button,
                        { onClick: function onClick(e) {
                                return _this2.show(false);
                            }, inline: true, type: 'ghost' },
                        '详情'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'route-search' },
                    React.createElement(antd.Icon, { onClick: function onClick(e) {
                            _this2.hidden();_this2.clear(true);
                        }, type: 'left' }),
                    React.createElement(antd.Icon, { type: 'retweet', onClick: this.togglePosition.bind(this) }),
                    React.createElement(
                        'div',
                        { className: 'route-group' },
                        React.createElement(
                            'div',
                            null,
                            React.createElement('span', { className: 'start-point' }),
                            React.createElement('input', { ref: 'start', value: s.startPoint.searchText,
                                onChange: function onChange(e) {
                                    var obj = s.startPoint;
                                    obj.searchText = e.target.value;
                                    _this2.setState({ startPoint: obj }, _this2.getPOI.bind(_this2, e.target.value));
                                },
                                onBlur: function onBlur(e) {
                                    var obj = _this2.state.startPoint;
                                    obj.on = false;
                                    _this2.setState({ startPoint: obj });
                                },
                                onFocus: function onFocus(e) {
                                    var obj = s.startPoint;
                                    obj.on = true;
                                    _this2.currentInput = 'startPoint';
                                    _this2.setState({ startPoint: obj, showSearchResult: true });
                                },
                                placeholder: '请输入起点', type: 'text' }),
                            React.createElement(antd.Icon, { onClick: function onClick(e) {
                                    _this2.clearStartPoint();
                                    e.stopPropagation();
                                },
                                className: s.startPoint.on ? 'active' : '', type: 'cross-circle' })
                        ),
                        React.createElement(
                            'div',
                            null,
                            React.createElement('span', { className: 'end-point' }),
                            React.createElement('input', { ref: 'end', value: s.endPoint.searchText,
                                onChange: function onChange(e) {
                                    var obj = s.endPoint;
                                    obj.searchText = e.target.value;
                                    _this2.setState({ endPoint: obj }, _this2.getPOI.bind(_this2, e.target.value));
                                },
                                onFocus: function onFocus(e) {
                                    var obj = s.endPoint;
                                    obj.on = true;
                                    _this2.currentInput = 'endPoint';
                                    _this2.setState({ endPoint: obj, showSearchResult: true });
                                },
                                onBlur: function onBlur(e) {
                                    var obj = _this2.state.endPoint;
                                    obj.on = false;
                                    _this2.setState({ endPoint: obj });
                                },
                                placeholder: '请输入终点', type: 'text' }),
                            React.createElement(antd.Icon, { onClick: function onClick(e) {
                                    _this2.clearEndPoint();
                                    e.stopPropagation();
                                },
                                className: s.endPoint.on ? 'active' : '',
                                type: 'cross-circle' })
                        )
                    ),
                    React.createElement(
                        antd.Button,
                        { disabled: s.showLoading, onClick: this.getRoute.bind(this), loading: s.showLoading, type: 'primary' },
                        s.showLoading ? "路径规划中..." : "出发"
                    )
                ),
                React.createElement(
                    'div',
                    { className: "route-detial " + (s.showDetail ? "active" : "") },
                    s.route ? React.createElement(
                        'div',
                        { className: 'route-detial-general' },
                        React.createElement(
                            'span',
                            null,
                            s.route && s.route.Distance,
                            '（',
                            s.route && s.route.Time,
                            '）'
                        ),
                        React.createElement(
                            antd.Button,
                            { inline: true, onClick: function onClick(e) {
                                    return _this2.show(true);
                                }, type: 'ghost' },
                            '地图'
                        )
                    ) : null,
                    React.createElement(
                        'div',
                        { className: 'route-detial-routes', ref: 'routeDetial' },
                        React.createElement(
                            'table',
                            null,
                            cRoutes
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: "route-searchresults " + (s.showSearchResult ? "active" : "") },
                    React.createElement(
                        'div',
                        { onClick: this.getCurrentPosition.bind(this) },
                        React.createElement(antd.Icon, { type: 'environment' }),
                        React.createElement(
                            'span',
                            null,
                            '当前位置'
                        )
                    ),
                    cResults
                )
            );
        }
    }]);

    return RoutePlanning;
}(React.Component);