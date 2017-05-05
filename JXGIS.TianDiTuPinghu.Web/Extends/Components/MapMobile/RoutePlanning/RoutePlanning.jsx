class RoutePlanning extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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

    }

    clear(bClearMap) {
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

    getRoute(showTip) {
        if (!this.state.showLoading) {
            var s = this.state;
            if (s.startPoint.latlng && s.endPoint.latlng) {
                if (s.startPoint.latlng.lat === s.endPoint.latlng.lat
                    &&
                    s.startPoint.latlng.lng === s.endPoint.latlng.lng) {
                    antd.Toast.fail("设置的起始位置相同...");
                    return;
                }

                antd.Toast.show("正在规划路径...");
                this.setState({ showLoading: true });
                $.post('GetRoutePlanning',
                    {
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
                            }, function () { this.refs.routeDetial.scrollTop = 0; }.bind(this));

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

    getPOI(text) {
        var t = text || '';
        $.post('SearchPOI', { Keywords: [t], types: [], pagenumber: 1, pagesize: 15 }, function (rt) {
            if (rt.ErrorMessage) {
                antd.Toast.fail(rt.ErrorMessage);
            } else {
                this.setState({ searchResults: rt.Data.Data.Results, showSearchResult: true });
            }
        }.bind(this), 'json');
    }

    togglePosition() {
        var s = this.state;
        var start = s.startPoint;
        var end = s.endPoint;
        this.setState({
            startPoint: end,
            endPoint: start
        }, this.getRoute.bind(this, false));
    }

    show(general) {
        var obj = { visible: true };
        obj.general = !!general;
        this.setState(obj);
    }

    hidden(general) {
        var obj = { visible: false, general: false };
        this.setState(obj);
    }

    clearStartPoint() {
        this.setState({
            startPoint: {
                searchText: '',
                latlng: null
            }
        }, function () {
            this.refs.start.focus();
        }.bind(this));
    }

    clearEndPoint() {
        this.setState({
            endPoint: {
                searchText: '',
                latlng: null
            }
        }, function () {
            this.refs.end.focus();
        }.bind(this));
    }

    setPoint(poi) {
        var point = this.currentInput;
        var obj = { showSearchResult: false }
        obj[point] = {
            searchText: poi.SHORTNAME,
            latlng: {
                lat: poi.Y,
                lng: poi.X
            }
        };
        this.setState(obj, this.getRoute.bind(this, false));
    }

    setEndPoint(poi) {
        var obj = { showSearchResult: false }
        obj.endPoint = {
            searchText: poi.SHORTNAME,
            latlng: {
                lat: poi.Y,
                lng: poi.X
            }
        };
        this.setState(obj, this.getRoute.bind(this, false));
    }

    getCurrentPosition() {
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

    render() {
        var s = this.state;
        var results = s.searchResults || [];
        var cResults = results.map(function (i) {
            return <div onClick={this.setPoint.bind(this, i) }><antd.Icon type="environment" /><span>{i.SHORTNAME}</span></div>;
        }.bind(this));

        var routes = s.route ? s.route.Routes : [];
        var cRoutes = routes.map(function (i, j) {
            return <tr><th><div>{j + 1}</div></th><td>{i}</td></tr>;
        });
        return (
        <div className={"routeplanning "+(s.visible?"active ":"")+(s.general?"general":"")}>
            <div className="route-general">
                <span>{s.route && s.route.Distance}（{s.route && s.route.Time}）</span>
                <antd.Button onClick={e=>this.show(false)} inline type="ghost">详情</antd.Button>
            </div>
            <div className="route-search">
                <antd.Icon onClick={e=> { this.hidden(); this.clear(true);}} type="left" />
                <antd.Icon type="retweet" onClick={this.togglePosition.bind(this)} />
                <div className="route-group">
                    <div>
                        <span className="start-point"></span>
                        <input ref="start" value={s.startPoint.searchText}
                               onChange={ e=> {
                                var obj = s.startPoint;
                                obj.searchText = e.target.value;
                                this.setState({ startPoint: obj }, this.getPOI.bind(this, e.target.value));
                            }}
                               onBlur={e => {
                                var obj=this.state.startPoint;
                                obj.on=false;
                                this.setState({startPoint:obj});
                            }}
                               onFocus={e=> {
                                var obj = s.startPoint;
                                obj.on = true;
                                this.currentInput = 'startPoint';
                                this.setState({ startPoint: obj, showSearchResult: true });
                            }}
                               placeholder="请输入起点" type="text" />
                            <antd.Icon onClick={e => {
                                        this.clearStartPoint();
                                        e.stopPropagation();
                            }}
                                       className={s.startPoint.on ? 'active' : ''} type="cross-circle" />
                    </div>
                    <div>
                    <span className="end-point"></span>
                        <input ref="end" value={s.endPoint.searchText}
                               onChange={e=> {
                                var obj = s.endPoint;
                                obj.searchText = e.target.value;
                                this.setState({ endPoint: obj }, this.getPOI.bind(this, e.target.value));
                            }}
                               onFocus={e=> {
                                var obj = s.endPoint;
                                obj.on = true;
                                this.currentInput = 'endPoint';
                                this.setState({ endPoint: obj, showSearchResult: true });
                            }}
                               onBlur={e => {
                                var obj = this.state.endPoint;
                                obj.on = false;
                                this.setState({ endPoint: obj });
                            }}
                               placeholder="请输入终点" type="text" />
                        <antd.Icon onClick={e => {
                                    this.clearEndPoint();
                                    e.stopPropagation();
                        }}
                                   className={s.endPoint.on?'active':''}
                                   type="cross-circle" />
                    </div>
                </div>
                <antd.Button disabled={s.showLoading} onClick={this.getRoute.bind(this)} loading={s.showLoading} type="primary">{s.showLoading ? "路径规划中..." : "出发"}</antd.Button>
            </div>
            <div className={"route-detial " + (s.showDetail ? "active" : "")}>
                {s.route ? <div className="route-detial-general"><span>{s.route && s.route.Distance}（{s.route && s.route.Time}）</span><antd.Button inline onClick={e=>this.show(true)} type="ghost">地图</antd.Button></div> : null}
                <div className="route-detial-routes" ref="routeDetial">
                    <table>
                        {cRoutes}
                    </table>
                </div>
            </div>
            <div className={"route-searchresults " + (s.showSearchResult ? "active" : "")}>
                <div onClick={this.getCurrentPosition.bind(this)}><antd.Icon type="environment" /><span>当前位置</span></div>
                {cResults}
            </div>
        </div>);
    }
}