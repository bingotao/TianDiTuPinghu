__leafletExtends__();
antd = window['antd-mobile'];
class Map {
    constructor(el) {
        var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
        var baseLayers = {
            vec: {
                anno: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 1 }),
                base: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 1 })
            },
            img: {
                anno: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 1 }),
                base: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 1 })
            }
        };

        var map = L.map(el, {
            attributionControl: false,
            center: [config.InitPosition.Y, config.InitPosition.X],
            layers: [
				 baseLayers.vec.base,
				 baseLayers.vec.anno,
				 baseLayers.img.base,
				 baseLayers.img.anno
            ],
            zoom: config.InitPosition.Zoom
        });

        map.zoomControl.setPosition('bottomright');
        L.control.scale({ imperial: false }).setPosition('bottomleft').addTo(map);

        map.on('click', function (e) {
            var latlng = e.latlng;
            this.getNeareatPOI(latlng, function (poi) {
                if (poi.IsPOI) {
                    cResultPanel.setState({ results: [poi] });
                    cResultPanel.show(true);
                    cResultPanel.addPOIToMap([poi], false);
                    cResultPanel.setActivePOI(poi.FEATUREGUID);
                }
            }.bind(this));
        }, this);

        this.map = map;
        this.baseLayers = baseLayers;
        this.showBaseMap("vec");

        this.icons = {
            'default': new L.Icon.Default(),
            'poidefault': L.icon({
                iconUrl:_bl_+ '/Reference/image/poi-default.png',
                iconSize: [24, 38],
                iconAnchor: [12, 38],
                popupAnchor: [0, -38]
            }),
            'poiactive': L.icon({
                iconUrl: _bl_ + '/Reference/image/poi-focus.png',
                iconSize: [24, 38],
                iconAnchor: [12, 38],
                popupAnchor: [0, -38]
            }),
            'startpoint': L.icon({
                iconUrl: _bl_ + '/Reference/image/startpoint.png',
                iconSize: [32, 40],
                iconAnchor: [16, 40],
                popupAnchor: [0, -40],
                zIndexOffset: 999
            }),
            'endpoint': L.icon({
                iconUrl: _bl_ + '/Reference/image/endpoint.png',
                iconSize: [32, 40],
                iconAnchor: [16, 40],
                popupAnchor: [0, -40],
                zIndexOffset: 999
            }),
            'sharepoint': L.icon({
                iconUrl: _bl_ + '/Reference/image/sharepoint.png',
                iconSize: [26, 36],
                iconAnchor: [3, 34],
                popupAnchor: [0, -40]
            })
        };

        this.location = null;

        this.route = {
            startPoint: null,
            endPoint: null,
            routes: null
        };

        var drawItems = L.featureGroup();
        this.drawItems = drawItems;
        drawItems.addTo(map);
    }

    showBaseMap(type) {
        var layers = this.baseLayers;
        layers.img.base.setOpacity(type === 'vec' ? 0 : 1);
        layers.img.anno.setOpacity(type === 'vec' ? 0 : 1);
        if (type === 'vec') {
            $('.leaflet-control-scale').removeClass('active');
        }
        else {
            $('.leaflet-control-scale').addClass('active');
        }
    }

    fullAndLockScreen() {
        if (!fullScreenApi.isFullScreen()) {
            fullScreenApi.requestFullScreen(document.getElementById('mapmobile'))
            screen.orientation.lock("natural");
        }
    }

    clearLocation() {
        this.location ? this.location.remove() : null;
    }

    getLocation(component, showTip, callback) {
        var cThis = this;
        component && component.showLoading ? component.showLoading() : null;
        if (showTip) { antd.Toast.show("定位中..."); }
        jxgis.geolocation.get(function (rt) {
            x = rt.coords.longitude;
            y = rt.coords.latitude;

            cThis.clearLocation();

            var lnglat = L.latLng([y, x]);
            cThis.map.setView(lnglat);

            var location = L.circleMarker(lnglat, {
                className: 'position-circle',
                weight: 10,
                opacity: 0.2,
                fillOpacity: 1
            }).addTo(cThis.map);
            cThis.location = location;

            if (showTip) { antd.Toast.success("定位成功"); }
            component && component.hiddenLoading ? component.hiddenLoading(true) : null;
            if (callback) { callback(lnglat); }
        }, function (er) {
            antd.Toast.fail(er.message);
            component && component.hiddenLoading ? component.hiddenLoading() : null;
        });
    }

    getNeareatPOI(latlng, callBack) {
        $.post('GetNearestPOI',
            {
                lat: latlng.lat,
                lng: latlng.lng
            },
            function (ro) {
                if (ro.ErrorMessage) {
                    antd.Toast.fail(ro.ErrorMessage);
                }
                else {
                    var poi = ro.Data;
                    if (callBack) { callBack(poi); }
                    //if (!poi.IsPOI) {
                    //    poi.SHORTNAME += '（附近）';
                    //}
                }
            }.bind(this), 'json');
    }


    setStartPoint(latlng) {
        this.route.startPoint = L.marker(latlng, { icon: this.icons.startpoint }).addTo(this.map);
    }

    setEndPoint(latlng) {
        this.route.endPoint = L.marker(latlng, { icon: this.icons.endpoint }).addTo(this.map);
    }

    setRoute(routes) {
        var routes = L.polyline(routes, { color: 'red', opacity: 0.6 }).addTo(this.map);
        this.route.routes = routes;
        this.map.fitBounds(routes.getBounds(), { paddingTopLeft: [0, 60] });
    }

    clearPlanning() {
        var route = this.route;
        if (route) {
            route.startPoint && route.startPoint.remove();
            route.endPoint && route.endPoint.remove();
            route.routes && route.routes.remove();
        }
    }

    setPlanning(routePlanning, clear) {
        var rp = routePlanning;
        if (rp) {
            if (clear) {
                this.clearPlanning();
            }
            this.setStartPoint(rp.startPoint);
            this.setEndPoint(rp.endPoint);
            this.setRoute(rp.routes);
        }
    }

    showMarkerShare(ms) {
        var layer = ms.layer;
        this.drawItems.addLayer(layer);
        var bounds = this.drawItems.getBounds();
        this.map.fitBounds(bounds);

        var el = document.createElement('div');
        ReactDOM.render(<MarkerShare markerShare={ms } />, el);

        var popup = L.popup().setContent(el);
        layer.bindPopup(popup).openPopup();
    }
}

class MarkerShare extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var ms = this.props.markerShare;
        return (
        <div className="markershare">
            <h4>标题</h4>
            <div>{ms.title}</div>
            <h4>内容</h4>
            <div>{ms.content}</div>
        </div>);
    }
}

class Tools extends React.Component {
    constructor() {
        super();
    }

    render() {
        var map = this.props.map;
        return (
            <div>
                <BtnLocation ref="btnLocation" map={map} />
                <BtnFullScreen ref="btnFullScreen" map={map} />
                <BtnLayerToggle ref="btnLayerToggle" map={map} />
            </div>
        );
    }
}

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTools: false
        };
    }

    toggleShowTools() {
        this.setState({ showTools: !this.state.showTools });
    }

    render() {
        var s = this.state;
        return (
        <div>
            <span onClick={e => {
                    this.props.onAreaSearchClick();
                }}>
            <span className="iconfont icon-zhoubian"></span>附近
            </span>
            <span onClick={e =>
                {
                    this.props.onRouteClick();
                }}>
            <span className="iconfont icon-604luxian"></span>路线
            </span>
            <span onClick={e=> { this.toggleShowTools(); }}>
                <span className="iconfont icon-shezhi"></span>工具
            </span>
            <ul style={{ display: (s.showTools ? "block" : "none") }}>
                <li><a href="@ViewBag.BaseUrl/Home/Index"><span className="iconfont icon-diannao"></span>首页</a></li>
                <li onClick={e=> {
                        this.toggleShowTools();
                        var map = this.props.map;
                        map.cResultsPanel.hidden(false, true);
                        map.cRoute.hidden();
                        map.cRoute.clear(true);
                        map.drawItems.clearLayers();
                    }}><span className="iconfont icon-qingchu"></span>清空</li>
            </ul>
        </div>);
    }
}

$(function () {
    map = new Map(document.getElementById("map"));

    cOTools = ReactDOM.render(<Tools map={map} />
    , document.getElementById("otools"));

    cRoute = ReactDOM.render(<RoutePlanning map={map } />, document.getElementById('routeplanning'));

    cResultPanel = ReactDOM.render(<ResultPanel onGoToHereClick={e=> {
            cRoute.setEndPoint(e);
            cRoute.show();
        }} map={map
    } />, document.getElementById("resultpanel"));
    cSearch = ReactDOM.render(<Search map={map} resultPanel={cResultPanel } />, document.getElementById("search"));
    cAreaSearch = ReactDOM.render(<AreaSearch map={map} resultPanel={cResultPanel} categories={config.SearchCategory } />, document.getElementById("areasearch"));

    cToolBar = ReactDOM.render(<Toolbar map={map}
                                        onAreaSearchClick={e=> {
            if (map.location) {
                var pnt = map.location.getLatLng();
                cAreaSearch.show("当前位置", { lng: pnt.lng, lat: pnt.lat });
                cResultPanel.target = 'areaSearch';
            } else {
                map.getLocation(null, true, function (latlng) {
                    var pnt = map.location.getLatLng();
                    cAreaSearch.show("当前位置", { lng: pnt.lng, lat: pnt.lat });
                    cResultPanel.target = 'areaSearch';
                }.bind(map));
            }
        }}
                                        onRouteClick={e=> { cRoute.show(false); }
    } />, document.getElementById("toolbar"));

    $('.mm-title').on('click', e=> {
        cSearch.show(true);
        cResultPanel.hidden(false);
    });

    map.cToolbar = cToolBar;
    map.cAreaSearch = cAreaSearch;
    map.cSearch = cSearch;
    map.cResultsPanel = cResultPanel;
    map.cRoute = cRoute;
    map.cOTools = cOTools;
    //cOTools.refs.btnLocation.getLocation();
    //$('body').one('click', function () {
    //    if (!fullScreenApi.isFullScreen()) map.fullAndLockScreen();
    //});


    //获取url参数
    var urlArgs = commonTool.urlArgs;
    if (urlArgs.markershare) {
        $.post('GetMarkerShare?id=' + urlArgs.markershare, function (rt) {
            if (rt.ErrorMessage) {
                antd.Toast.fail(rt.ErrorMessage);
            } else {
                var ms = rt.Data.MarkerShare;
                var layer = L.GeoJSON.geometryToLayer(JSON.parse(ms.GeoJSON));
                layer.setIcon ? layer.setIcon(map.icons.sharepoint) : null;
                var markerShare = {
                    id: ms.ID,
                    title: ms.Title,
                    content: ms.Content,
                    layer: layer
                };
                map.showMarkerShare(markerShare);
            }
        }, 'json');
    } else if (urlArgs.poishare) {
        $.post('GetPOI?id=' + urlArgs.poishare, function (rt) {
            if (rt.ErrorMessage) {
                antd.Toast.fail(rt.ErrorMessage);
            } else {
                var poi = rt.Data.POI;
                map.map.setView([poi.Y, poi.X]);
                cResultPanel.setState({ results: [poi] });
                cResultPanel.show(true);
                cResultPanel.addPOIToMap([poi], false);
                cResultPanel.setActivePOI(poi.FEATUREGUID);
            }
        }, 'json');
    }
});