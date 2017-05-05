/*
   type类型：driving、bus
*/
class PathPlanningPanel extends React.Component {
    constructor(props) {
        super(props);

        this.map = props.map;
        var routePath = L.featureGroup().addTo(this.map.map);
        this.map.routePath = routePath;
        this.routePath = routePath;

        this.startLayer = null;
        this.endLayer = null;
        this.drivingLayer = null;

        var defaultState = {
            loading: false,
            type: 'driving',
            start: {
                point: null,
                name: ''
            },
            end: {
                point: null,
                name: ''
            },
            drivingPath: null,
            showSearchResults: false
        };
        this.defaultState = defaultState;
        this.state = defaultState;
    }

    componentDidUpdate() {
        if (!L.Browser.webkit) {
            var $scroll = this.$scroll;
            if ($scroll) {
                $scroll.mCustomScrollbar("scrollTo", "top");
            } else {
                this.$scroll = $('.pathplanning-panel .pathpanning-result').mCustomScrollbar({
                    theme: "dark-blue",
                    scrollInertia: 0
                });
            }
        }
    }

    getPostions(e, type) {
        var text = e.target.value;
        var obj = {};
        obj[type] = { name: text, point: this.state[type].point };
        this.setState(obj);

        if (text) {
            this.getPOI(text);
        }
    }

    getPOI(keyWord) {
        $.post('QuickSearch', { keyWord: keyWord }, (function (cThis) {
            return function (rt) {
                if (rt.ErrorMessage) {
                    _g.fun.showError(rt.ErrorMessage);
                }
                else {
                    var rows = rt.Data.rows;
                    if (rows.length) {
                        cThis.showSearchResults();
                        cThis.refs.searchResults.setState({ results: rows });
                    }
                }
            }
        })(this), 'json');

    }

    getPlanning(startPoint, endPoint, type) {
        var start = startPoint || this.state.start.point;
        var end = endPoint || this.state.end.point;
        var type = type || this.state.type;

        if (start && end && type) {
            this.setState({ loading: true });
            $.post('GetRoutePlanning',
                {
                    Begin: {
                        lng: start.lng,
                        lat: start.lat
                    },
                    End: {
                        lng: end.lng,
                        lat: end.lat
                    },
                    PlanningType: 1,
                    TripMode: (type === 'bus' ? 1 : 2)
                }, (function (cThis, type) {
                    return function (rt) {
                        cThis.setState({ loading: false });
                        if (rt.ErrorMessage) {
                            _g.fun.showError(rt.ErrorMessage);
                        } else {
                            var route = rt.Data.route;
                            var obj = {};
                            obj[type + 'Path'] = route;

                            cThis.refs.driving.drawRoute(route);
                            cThis.setState(obj);
                        }
                    };
                })(this, type), 'json');
        } else {
            _g.fun.showError('请设置起点和终点！');
        }
    }

    setStart(start, getRoute) {
        if (this.startLayer) this.startLayer.remove();
        if (start) {
            this.startLayer = L.marker(start.point, { icon: this.map.icons.startpoint });
            this.routePath.addLayer(this.startLayer);
        }
        var obj = {
            drivingPath: null,
            start: start || { point: null, name: '' }
        };

        if (this.drivingLayer) this.drivingLayer.remove();

        var end = this.state.end;
        if (getRoute && start && start.point && end && end.point) {
            this.getPlanning(start.point, end.point, this.state.type);
        }
        this.setState(obj);
    }

    setEnd(end, getRoute) {
        if (this.endLayer) this.endLayer.remove();
        if (end) {
            this.endLayer = L.marker(end.point, { icon: this.map.icons.endpoint });
            this.routePath.addLayer(this.endLayer);
        }
        var obj = {
            drivingPath: null,
            end: end || { point: null, name: '' }
        };

        if (this.drivingLayer) this.drivingLayer.remove();
        var start = this.state.start;
        if (getRoute && start && start.point && end && end.point) {
            this.getPlanning(start.point, end.point, this.state.type);
        }
        this.setState(obj);
    }

    setType(type) {
        this.setState({ type: type === 'bus' ? 'bus' : 'driving' });
    }

    toggleStartEnd() {
        var start = this.state.start;
        var end = this.state.end;
        if (this.startLayer) this.startLayer.remove();
        this.startLayer = L.marker(start.point, { icon: this.map.icons.startpoint });
        this.routePath.addLayer(this.startLayer);
        if (this.endLayer) this.endLayer.remove();
        this.endLayer = L.marker(end.point, { icon: this.map.icons.endpoint });
        this.routePath.addLayer(this.endLayer);

        if (start.point && end.point) {
            this.getPlanning(end.point, start.point, this.state.type);
        }

        this.setState({
            start: end,
            end: start
        });
    }

    setPosition(position, pointType) {
        var type = pointType || this.focus;
        var obj = { showSearchResults: false };
        var map = this.map.map;
        if (this[type + 'Layer']) this[type + 'Layer'].remove();
        var point = L.latLng(position.Y, position.X);
        var layer = L.marker(point, { icon: (type === 'start' ? this.map.icons.startpoint : this.map.icons.endpoint) });
        this.routePath.addLayer(layer);
        this[type + 'Layer'] = layer;

        obj[type] = {
            name: position.SHORTNAME,
            point: point
        };

        var p1 = type === 'start' ? point : this.state.start.point;
        var p2 = type === 'start' ? this.state.end.point : point;
        if (p1 && p2) {
            map.fitBounds(L.latLngBounds(p1, p2), { paddingTopLeft: [400, 50], paddingBottomRight: [50, 50] });
            this.getPlanning(p1, p2, this.state.type);
        }
        else {
            map.setView(point);
        }

        this.setState(obj);
    }

    showSearchResults() {
        this.setState({
            showSearchResults: true
        });
    }

    hiddenSearchResults() {
        this.setState({
            showSearchResults: false
        });
    }

    clearMap() {
        this.startLayer = null;
        this.endLayer = null;
        this.drivingLayer = null;
        this.routePath.clearLayers();
    }

    clearResults() {
        this.setState(this.defaultState);
        this.clearMap();
    }

    clearAll() {
        this.setState(this.defaultState);
        this.clearMap();
    }

    render() {
        var start = this.state.start;
        var end = this.state.end;
        var type = this.state.type;

        return (
        <div className="pathplanning-panel">
            <div className="pathplanning-nav">
                <antd.Row>
                    <antd.Col onClick={e=>this.setType('driving')} className={this.state.type ==='driving'?'active':''} span={12}><span className="iconfont icon-qiche"></span>驾车</antd.Col>
                    <antd.Col onClick={e=>this.setType('bus')} className={this.state.type === 'bus' ? 'active' : ''} span={12}><span className="iconfont icon-gongjiao"></span>公交</antd.Col>
                </antd.Row>
            </div>
            <div className="pathplanning-header"><span className="iconfont icon-qiche"></span>驾车</div>
            <antd.Row>
                <antd.Col span={3}>
                    <antd.Icon type="swap" onClick={this.toggleStartEnd.bind(this)} />
                </antd.Col>
                <antd.Col span={21}>
                    <div>
                        <span className="pathplanning-start-icon"></span>
                        <input ref='start' type="text" onFocus={e=>this.focus = 'start'} onChange={e=>this.getPostions(e,'start')} placeholder="输入起点或在图上选点" value={start ? start.name : ''} />
                        <antd.Icon onClick={e=> { this.setStart(null); this.refs.start.focus(); }} type="close-circle" />
                    </div>
                    <div>
                        <span className="pathplanning-end-icon"></span>
                        <input onFocus={e=>this.focus='end'} ref='end' onChange={e=>this.getPostions(e,'end')} type="text" placeholder="输入终点或在图上选点" value={end ? end.name : ''} />
                        <antd.Icon onClick={e=> { this.setEnd(null); this.refs.end.focus(); }} type="close-circle" />
                    </div>
                </antd.Col>
                <antd.Col span={24}>
                    <antd.Button loading={this.state.loading} onClick={e=>this.getPlanning()} type="primary">出发</antd.Button>
                </antd.Col>
            </antd.Row>
            <div style={{ display: (this.state.showSearchResults ? 'block' : 'none') }}>
                <QuickSearchResults ref='searchResults' itemClick={this.setPosition.bind(this)} />
            </div>
            <div className="pathpanning-result">
                <div style={{ display: (type === 'bus' ? 'block' : 'none') }}>
                    <BusPanningResultPanel ref='bus' parent={this} plannings={this.state.busPath} />
                </div>
                <div style={{ display: (type === 'driving' ? 'block' : 'none') }}>
                    <DrivingPanning ref='driving' parent={this} plannings={this.state.drivingPath} />
                </div>
            </div>
        </div>
        );
    }
}