__leafletExtends__();
L.GeometryUtil = L.extend(L.GeometryUtil || {}, {
    geodesicArea: function (latLngs) {
        var pointsCount = latLngs.length,
			area = 0.0,
			d2r = Math.PI / 180,
			p1, p2;

        if (pointsCount > 2) {
            for (var i = 0; i < pointsCount; i++) {
                p1 = latLngs[i];
                p2 = latLngs[(i + 1) % pointsCount];
                area += ((p2.lng - p1.lng) * d2r) *
						(2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }

        return Math.abs(area);
    },

    readableArea: function (area, isMetric) {
        var areaStr;

        if (isMetric) {
            if (area >= 10000) {
                areaStr = (area * 0.0001).toFixed(2) + ' 万平方米';
            } else {
                areaStr = area.toFixed(2) + ' 平方米';
            }
        } else {
            area /= 0.836127;

            if (area >= 3097600) {
                areaStr = (area / 3097600).toFixed(2) + ' mi&sup2;';
            } else if (area >= 4840) {
                areaStr = (area / 4840).toFixed(2) + ' acres';
            } else {
                areaStr = Math.ceil(area) + ' yd&sup2;';
            }
        }

        return areaStr;
    },

    readableDistance: function (distance, isMetric, useFeet) {
        var distanceStr;

        if (isMetric) {
            if (distance > 1000) {
                distanceStr = (distance / 1000).toFixed(2) + ' 千米';
            } else {
                distanceStr = Math.ceil(distance) + ' 米';
            }
        } else {
            distance *= 1.09361;

            if (distance > 1760) {
                distanceStr = (distance / 1760).toFixed(2) + ' miles';
            } else {
                var suffix = ' yd';
                if (useFeet) {
                    distance = distance * 3;
                    suffix = ' ft';
                }
                distanceStr = Math.ceil(distance) + suffix;
            }
        }

        return distanceStr;
    }
});

class Nav extends React.Component {
    constructor() {
        super();
    }

    appCenterClick() {
        _g.appCenter.toggleHidden();
        _g.searchPanel.hidden();
    }

    searchClick() {
        _g.searchPanel.toggleHidden();
        _g.searchPanel.focus();
        _g.appCenter.hidden();
    }

    render() {
        return (
			<div className="nav">
				<img src={_bl_+"/Reference/image/logo.png"} />
			    <antd.Icon onClick={e=>this.appCenterClick()} type="bars" />
			    <antd.Icon onClick={e=>this.searchClick()} type="search" />
			</div>
		);
    }
}

class Map {
    constructor(el, urlArgs) {
        this.drawTip = {
            marker: {
                start: "单击标注"
            },
            polygon: {
                cont: "单击以继续",
                end: "双击结束",
                start: "单击开始"
            },
            polyline: {
                cont: "点击以继续",
                end: "双击结束",
                start: "单击开始"
            }
        };

        this.orgTips = null;
        var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

        this.options = {
            draw: {
                drawType: null,
                drawPointOn: false,
                drawLineOn: false,
                drawPolygonOn: false
            },
            showAnno: true,
            currentBaselayer: "vec",
            baseLayers: {
                vec: {
                    //    anno: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 0 }),
                    //    base: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 0 })
                    anno: L.tileLayer.TDTJX({ type: 'vec_anno' }),
                    base: L.tileLayer.TDTJX({ type: 'vec' })
                },
                img: {
                    //    anno: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 0 }),
                    //    base: L.tileLayer("http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}", { subdomains: subdomains, opacity: 0 })
                    //
                    anno: L.tileLayer.TDTJX({ type: 'img_anno' }),
                    base: L.tileLayer.TDTJX({ type: 'img' })
                }
            }
        };

        var baseLayers = this.options.baseLayers;
        var cThis = this;
        var map = L.map(el, {
            //renderer: L.canvas(),
            crs: L.CRS.EPSG4490,
            attributionControl: false,
            center: [config.InitPosition.Y, config.InitPosition.X],
            layers: [
				 baseLayers.img.base,
				 baseLayers.img.anno,
                 baseLayers.vec.base,
				 baseLayers.vec.anno,
            ],
            zoom: config.InitPosition.Zoom,
            contextmenu: true,
            contextmenuWidth: 110,
            contextmenuItems: [
                {
                    text: '<div class="ct-menu-item"><span class="iconfont icon-weizhi ct-start-point"></span>&nbsp;&nbsp;从此出发</div>',
                    callback: function (e) {
                        var point = e.latlng;
                        _g.routePlanning.setStart({
                            point: { x: point.lng, y: point.lat },
                            name: '起点',
                            center: false
                        });
                        _g.appCenter.show('0');
                    }
                },
                {
                    text: '<div class="ct-menu-item"><span class="iconfont icon-weizhi ct-end-point"></span>&nbsp;&nbsp;到达此处</div>',
                    callback: function (e) {
                        var point = e.latlng;
                        _g.routePlanning.setEnd({
                            point: { x: point.lng, y: point.lat },
                            name: '终点',
                            center: false
                        });
                        _g.appCenter.show('0');
                    }
                },
                {
                    text: '<div class="ct-menu-item"><span class="iconfont icon-zhoubian"></span>&nbsp;&nbsp;搜索周边</div>',
                    callback: function (e) {
                        var point = e.latlng;
                        cThis.createAreaSearch(point);
                    }
                },
                {
                    text: '<div class="ct-menu-item"><span class="iconfont icon-biaoji1"></span>&nbsp;&nbsp;标记此处</div>',
                    callback: function (e) {
                        var point = e.latlng;
                        var marker = L.marker(point, { icon: cThis.icons.markerlabel });
                        cThis.showMarkerResult(marker);
                    }
                },
                {
                    text: '<div class="ct-menu-item"><span class="iconfont icon-qingchushuju"></span>&nbsp;&nbsp;清除</div>',
                    callback: function (e) {
                        cThis.clearAll();
                    }
                },
                {
                    text: '<div class="ct-menu-item"><span class="iconfont icon-jiucuo"></span>&nbsp;&nbsp;纠错</div>',
                    callback: function (e) {
                        var point = e.latlng;
                        cThis.createCorrecting(point);
                    }
                }
            ]
        });

        this.map = map;

        this.$currentLevel = $('#currentLevel');
        this.setZoom();

        map.on('zoomend', this.setZoom.bind(this));

        //初始化底图类型
        this.showBaselayer(urlArgs.maptype || this.options.currentBaselayer, this.options.showAnno);

        map.zoomControl.setPosition('bottomright');
        L.control.scale({ imperial: false }).setPosition('bottomleft').addTo(map);

        var icons = {
            'default': new L.Icon.Default(),
            //'poidefault': L.icon({
            //    iconUrl: _bl_ + '/Reference/image/poi-default.png',
            //    iconSize: [24, 38],
            //    iconAnchor: [12, 38],
            //    popupAnchor: [0, -38]
            //}),
            //'poiactive': L.icon({
            //    iconUrl: _bl_ + '/Reference/image/poi-focus.png',
            //    iconSize: [24, 38],
            //    iconAnchor: [12, 38],
            //    popupAnchor: [0, -38]
            //}),
            'poidefault': L.divIcon({ className: 'ct-icons-poidefault', iconSize: [24, 36], iconAnchor: [12, 34], popupAnchor: [0, -36] }),
            'poiactive': L.divIcon({ className: 'ct-icons-poiactive', iconSize: [24, 36], iconAnchor: [12, 34], popupAnchor: [0, -36] }),
            'markerlabel': L.icon({
                iconUrl: _bl_ + '/Reference/image/markerlabel.png',
                iconSize: [26, 36],
                iconAnchor: [7, 38],
                popupAnchor: [0, -40],
                tooltipAnchor: [20, -30]
            }),
            'startpoint': L.icon({
                iconUrl: _bl_ + '/Reference/image/startpoint.png',
                iconSize: [32, 40],
                iconAnchor: [16, 40],
                popupAnchor: [0, -40]
            }),
            'endpoint': L.icon({
                iconUrl: _bl_ + '/Reference/image/endpoint.png',
                iconSize: [32, 40],
                iconAnchor: [16, 40],
                popupAnchor: [0, -40]
            }),
            'sharepoint': L.icon({
                iconUrl: _bl_ + '/Reference/image/sharepoint.png',
                iconSize: [26, 36],
                iconAnchor: [3, 34],
                popupAnchor: [0, -40]
            }),
            'correcting': L.icon({
                iconUrl: _bl_ + '/Reference/image/correcting.png',
                iconSize: [20, 28],
                iconAnchor: [10, 28],
                popupAnchor: [0, -28]
            }),
            //'correcting': L.divIcon({ className: 'ct-icons-correcting', iconSize: [24, 40], iconAnchor: [12, 38], popupAnchor: [0, -38] })
        };

        this.icons = icons;
        //初始化POI查询图层 GeoJSON layer
        var poiItems = L.geoJSON(null, {
            onEachFeature: function (ft, layer) {
                layer.setIcon(icons['poidefault']);
                //绑定POI guid 供图层筛选
                layer.ftId = ft.properties.FEATUREGUID;
                //绑定popup
                layer.bindPopup('<span>' + ft.properties.NAME + '</span>', { className: 'map-poi-title' });
            }
        });
        this.poiItems = poiItems.addTo(map);

        poiItems.on('popupopen', function (e) {
            var poi = e.layer.feature.properties;
            _g.poiDetails.showPOIDeails(poi);
            _g.resultsPanel.hidden(_g.resultsPanel.clickHidden);
        });
        //初始化绘制图层（包含了测量、标记、标注）
        this.initDraw(map);

        if (urlArgs.searchtext) {
            setTimeout(function () {
                c_resultspanel.getPOI(true, decodeURI(urlArgs.searchtext));
                c_resultspanel.show();
            }, 1000);
        } else if (urlArgs.markershare) {
            $.post('GetMarkerShare?id=' + urlArgs.markershare, (function (cThis) {
                return function (rt) {

                    if (rt.ErrorMessage) {
                        _g.fun.showError(rt.ErrorMessage);
                    } else {
                        var ms = rt.Data.MarkerShare;
                        var layer = L.GeoJSON.geometryToLayer(JSON.parse(ms.GeoJSON));
                        layer.setIcon ? layer.setIcon(cThis.icons.sharepoint) : null;
                        var markerShare = {
                            id: ms.ID,
                            title: ms.Title,
                            content: ms.Content,
                            layer: layer
                        };

                        cThis.showMarkerShare(markerShare);
                    }
                }
            })(this), 'json');
        } else if (urlArgs.poishare) {
            $.post('GetPOI?id=' + urlArgs.poishare, (function (map) {
                return function (rt) {
                    if (rt.ErrorMessage) {
                        _g.fun.showError(rt.ErrorMessage);
                    } else {
                        var poi = rt.Data.POI;

                        map.map.setView(poi.LNGLAT);
                        var marker = L.marker(poi.LNGLAT, { icon: icons.poiactive });
                        map.drawItems.addLayer(marker);
                        marker.on('popupopen', function () {
                            _g.poiDetails.showPOIDeails(poi);
                        });
                        marker.bindPopup(poi.SHORTNAME, { className: 'map-poi-title' }).openPopup();
                    }
                }
            })(this), 'json');
        }
    }

    setZoom() {
        var zoom = this.map.getZoom();
        this.$currentLevel.find('span').html(zoom);
    }

    showMarkerShare(markerShare) {
        var layer = markerShare.layer;
        this.drawItems.addLayer(layer);
        var bounds = this.drawItems.getBounds();
        this.map.fitBounds(bounds);
        var share = Share.createShare();
        var popup = L.popup().setContent(share.shareDOM);
        share.setState(markerShare);
        layer.bindPopup(popup).openPopup();
    }

    getMeasureContent(layer) {
        if (layer instanceof L.Polygon) {
            var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
				area = L.GeometryUtil.geodesicArea(latlngs);
            return "面积: " + L.GeometryUtil.readableArea(area, true);
        } else if (layer instanceof L.Polyline) {
            var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
				distance = 0;
            if (latlngs.length < 2) {
                return "长度: N/A";
            } else {
                for (var i = 0; i < latlngs.length - 1; i++) {
                    distance += latlngs[i].distanceTo(latlngs[i + 1]);
                }
                return "长度: " + L.GeometryUtil.readableDistance(distance, true);
            }
        }
        return null;
    };

    clearPOILayer() {
        this.poiItems.clearLayers();
    }

    clearDrawLayer() {
        this.drawItems.clearLayers();
    }

    clearAll() {
        //清除POI查询结果
        _g.resultsPanel.hidden(true);
        //清除标注
        _g.markerPanel.hiddenAll();
        //清除绘制图层（测量、分享等）
        this.drawItems.clearLayers();
        //清除路径规划结果
        _g.routePlanning.clearResults();
    }
    /*
        type:
        measure,share,marker
    */
    activateDrawPoint(type) {
        var drawOpts = this.options.draw;
        drawOpts.drawType = type;
        drawOpts.drawPointOn = true;
        if (!this.drawCancelBtn)
            this.drawCancelBtn = $('.leaflet-draw-actions a').last()[0];
        this.drawCancelBtn && this.drawCancelBtn.click();
        if (!this.drawPointBtn)
            this.drawPointBtn = $('.leaflet-draw-draw-marker')[0];
        this.drawPointBtn.click();
        drawOpts.drawPolygonOn = false;
        drawOpts.drawPointOn = false;
    }

    toggleDrawPoint(type) {
        this.drawControl.setDrawingOptions({
            marker: {
                icon: this.icons.sharepoint
            }
        });

        var drawOpts = this.options.draw;
        drawOpts.drawType = type;
        drawOpts.drawPointOn = !drawOpts.drawPointOn;
        if (!this.drawCancelBtn)
            this.drawCancelBtn = $('.leaflet-draw-actions a').last()[0];
        this.drawCancelBtn && this.drawCancelBtn.click();
        if (drawOpts.drawPointOn) {
            if (!this.drawPointBtn)
                this.drawPointBtn = $('.leaflet-draw-draw-marker')[0];
            this.drawPointBtn.click();
        }
        drawOpts.drawPolygonOn = false;
        drawOpts.drawPointOn = false;
    }


    toggleDrawLine(type) {
        var drawOpts = this.options.draw;
        drawOpts.drawType = type;
        drawOpts.drawLineOn = !drawOpts.drawLineOn;
        if (!this.drawCancelBtn)
            this.drawCancelBtn = $('.leaflet-draw-actions a').last()[0];
        this.drawCancelBtn && this.drawCancelBtn.click();
        if (drawOpts.drawLineOn) {
            if (!this.drawLineBtn)
                this.drawLineBtn = $('.leaflet-draw-draw-polyline')[0];
            this.drawLineBtn.click();
        }
        drawOpts.drawPolygonOn = false;
        drawOpts.drawPointOn = false;
    }

    toggleDrawPolygon(type) {
        var drawOpts = this.options.draw;
        drawOpts.drawType = type;
        drawOpts.drawPolygonOn = !drawOpts.drawPolygonOn;
        if (!this.drawCancelBtn)
            this.drawCancelBtn = $('.leaflet-draw-actions a').last()[0];
        this.drawCancelBtn && this.drawCancelBtn.click();
        if (drawOpts.drawPolygonOn) {
            if (!this.drawPolygonBtn)
                this.drawPolygonBtn = $('.leaflet-draw-draw-polygon')[0];
            this.drawPolygonBtn.click();
        }
        drawOpts.drawLineOn = false;
        drawOpts.drawPointOn = false;
    }

    initDraw(map) {
        var drawPoint = new L.DivIcon({
            iconSize: new L.Point(12, 12),
            className: 'leaflet-div-icon leaflet-editing-icon measure-icon'
        });
        L.Draw.Polyline.prototype.options.icon = drawPoint;
        L.Draw.Polygon.prototype.options.icon = drawPoint;

        this.orgTips = {
            polyline: L.drawLocal.draw.handlers.polyline.tooltip,
            polygon: L.drawLocal.draw.handlers.polygon.tooltip
        }

        L.drawLocal.draw.handlers.marker.tooltip = this.drawTip.marker;
        L.drawLocal.draw.handlers.polygon.tooltip = this.drawTip.polygon;
        L.drawLocal.draw.handlers.polyline.tooltip = this.drawTip.polyline;

        var drawItems = L.featureGroup();
        this.drawItems = drawItems;
        drawItems.addTo(map);

        var drawControl = new L.Control.Draw({
            draw: {
                polyline: {
                    shapeOptions: {
                        color: 'red',
                        weight: 3
                    }
                },
                polygon: {
                    allowIntersection: false,
                    showArea: false,
                    shapeOptions: {
                        color: 'red',
                        weight: 3
                    }
                },
                marker: {
                    //icon: this.icons.markerlabel
                },
                circle: false,
                rectangle: false
            }
        });
        drawControl.addTo(map);
        this.drawControl = drawControl;
        var cThis = this;
        map.on(L.Draw.Event.CREATED, function (event) {
            var layer = event.layer;
            switch (cThis.options.draw.drawType) {
                case "measure":
                    cThis.showMeasureResult(layer);
                    break;
                case "share":
                    cThis.showShareResult(layer);
                    break;
                case "marker":
                    cThis.showMarkerResult(layer);
                default:
                    break;
            }
        });
    }

    showMarkerResult(layer) {
        _g.markerPanel.createMarkerOnMap(layer);
    }

    showShareResult(layer) {
        this.drawItems.addLayer(layer);
        //分享绑定tooltip
        var share = Share.createShare();
        var popup = L.popup().setContent(share.shareDOM);
        share.setState({ layer: layer });
        layer.bindPopup(popup).openPopup();
    }

    showMeasureResult(layer) {
        var content = this.getMeasureContent(layer);
        var $dom = $('<div class="measure-label">' + content + '<span class="iconfont icon-shanchu"></span></div>');
        $dom.data('layer', layer).find('.iconfont').click(function () {
            var $this = $(this);
            $this.parent().data('layer').remove();
        });

        this.drawItems.addLayer(layer);

        var centerMapPoint = layer.getCenter();
        var points = layer.getLatLngs();

        if (layer instanceof L.Polygon) {
            var ring = points[points.length - 1];
            var lastMapPoint = ring[ring.length - 1];
        } else if (layer instanceof L.Polyline) {
            var lastMapPoint = points[points.length - 1];
        } else { return }

        if (content !== null) {
            var tooltip = layer.bindTooltip($dom[0], { direction: 'right', permanent: true });
            tooltip.openTooltip(lastMapPoint);
        }
    }

    showBaselayer(type, showAnno) {
        var layers = this.options.baseLayers;
        this.options.currentBaselayer = type;

        if (type == 'vec') {
            layers.img.base.remove();
            layers.img.anno.remove();

            layers.vec.base.addTo(this.map);
            showAnno == false ? layers.vec.anno.remove() : layers.vec.anno.addTo(this.map);
            //layers.vec.anno.setOpacity(showAnno == false ? 0 : 1);
            //layers.vec.base.setOpacity(1);
        } else {
            layers.vec.anno.remove();
            layers.vec.base.remove();
            //layers.img.anno.setOpacity(showAnno == false ? 0 : 1);
            //layers.img.base.setOpacity(1);

            layers.img.base.addTo(this.map);
            showAnno == false ? layers.img.anno.remove() : layers.img.anno.addTo(this.map);
        }

        /*
		当前插件存在bug暂时不添加该功能

		if (!this.minimap) {
			this.minimap = new L.Control.MiniMap(groupLayer, { toggleDisplay: false }).addTo(map);
		} else {
			this.minimap.changeLayer(groupLayer);
		}*/
    }

    fullExtent() {
        this.map.setView([config.FullExtent.Y, config.FullExtent.X], config.FullExtent.Zoom);
    }

    loadPOIs(items, fit) {
        var poiItems = this.poiItems;
        poiItems.closePopup();
        this.clearPOILayer();
        var geoJSON = this.POIToGeoJSON(items);
        poiItems.addData(geoJSON);

        if (fit) {
            var bounds = poiItems.getBounds();
            this.map.fitBounds(bounds, { paddingTopLeft: [400, 50], paddingBottomRight: [50, 50] });
        }
    }

    _POIToGeoJSON(i) {
        return {
            type: "Feature",
            properties: i,
            geometry: {
                type: "Point",
                coordinates: [i.X, i.Y]
            }
        };
    }

    POIToGeoJSON(poi) {
        var geoJSON;
        if (L.Util.isArray(poi)) {
            geoJSON = [];
            for (var i = 0, l = poi.length; i < l; i++) {
                var item = poi[i];
                geoJSON.push(this._POIToGeoJSON(item));
            }
        } else {
            geoJSON = this._POIToGeoJSON(poi);
        }
        return geoJSON;
    }

    showPOI(item) {
        var ftId = item.FEATUREGUID;
        var icons = this.icons;
        this.getPOILayer(
				ftId,
				function (layer) {
				    layer.setIcon(icons['poiactive']);
				    layer.setZIndexOffset(9);
				},
				function (layer) {
				    layer.setIcon(icons['poidefault']);
				    layer.setZIndexOffset(0);
				});
    }

    getPOILayer(ftId, layerFun, otherLayerFun) {
        var layers = this.poiItems.getLayers();
        var findLayer = null;
        for (var i = 0, l = layers.length; i < l; i++) {
            var layer = layers[i];
            if (layer.ftId === ftId) {
                findLayer = layer;
                if (layerFun) layerFun(layer);
                if (!otherLayerFun) break;
            } else {
                if (otherLayerFun) otherLayerFun(layer);
            }
        }
    }

    showPOIDetails(item) {
        var ftId = item.FEATUREGUID;
        var map = this.map;
        this.getPOILayer(
				ftId,
				function (layer) {
				    map.setView(layer.getLatLng());
				    layer.openPopup();

				});
    }

    createCorrecting(point, poi_id) {
        var marker = L.marker(point, { icon: this.icons.correcting, zIndexOffset: 99 });
        this.drawItems.addLayer(marker);
        var correcting = Correcting.create(marker, poi_id);
        marker.bindPopup(correcting.dom).openPopup();
    }

    createAreaSearch(point) {
        var marker = L.marker(point, { zIndexOffset: 99 });
        this.drawItems.addLayer(marker);
        var areaSearch = AreaSearch.create(map, marker);
        areaSearch.popup.openPopup();
    }

    getPOI(keyword, categories, pagenumber, center, radius) {
        _g.resultsPanel.getPOI(keyword, categories, pagenumber, center, radius);
    }
}

function init() {
    var $window = $(window);
    var $main = $('.main');
    var $map = $main.find('>.map');
    /* toastr setting*/
    (function () {
        toastr.options.positionClass = "toast-bottom-full-width";
    })();

    var urlArgs = commonTool.urlArgs;

    map = new Map($map[0], urlArgs);

    function getDOMById(id) {
        return document.getElementById(id);
    }



    function getPOI(item) {
        var keyword = c_searchPanel.state.searchText.trim();

        var categories = [];
        if (item.sub) {
            for (var i = 0, l = item.sub.length; i < l; i++) {
                var sub = item.sub[i];
                categories = categories.concat(sub.codes);
            }
        } else {
            categories = categories.concat(item.codes);
        }
        c_resultspanel.getPOI(true, keyword, categories);
    }

    var c_searchPanel = ReactDOM.render(
	<SearchCategoryPanel btnClick={e=> { c_resultspanel.getPOI(true,e, []); }}
                         click={getPOI}
                         categories={config.SearchCategory
} />, getDOMById('searchPanel'));

    var c_appcenter = ReactDOM.render(
<AppCenter map={map} windowHeight={$window.height()} layers={config.Layers } />,
getDOMById('appcenter'));

    var c_toolbar = ReactDOM.render(
<Toolbar map={map}
         markerLabelPanel={c_appcenter.refs.markerPanel}
         fullExtent={e=>map.fullExtent()}
         clearClick={e=>map.clearAll()}
         sharePointClick={e=>map.toggleDrawPoint('share')}
         shareLineClick={e=>map.toggleDrawLine('share')}
         sharePolygonClick={e=>map.toggleDrawPolygon('share')}
         measureAreaClick={e=>map.toggleDrawPolygon('measure')}
         measureLengthClick={e=>map.toggleDrawLine('measure')}
         baseLayerChange={map.showBaselayer}
         annoLayerChange={map.showBaselayer}
         showServices={e=> { c_appcenter.show('2') }}
         fullScreenDom={$main[0]
} />,
getDOMById('toolbar'));

    c_resultspanel = ReactDOM.render(
<SearchResultPanel map={map} url={"SearchPOI"}
                   hover={item=>map.showPOI(item)}
                   click={item=>map.showPOIDetails(item)
} />,
getDOMById('searchresults')
		);

    var c_nav = ReactDOM.render(<Nav />, getDOMById('nav'));

    var c_footNav = ReactDOM.render(
<FooterNav navs={config.Navs } />,
		getDOMById('footernav')
	);

    var c_poiDetails = ReactDOM.render(<POIDetailsPanel map={map} onHidden={ e=> {
    if (c_resultspanel.state.hidden && !c_resultspanel.clickHidden)
c_resultspanel.show();
}
} />, getDOMById('poiDetailsPanel'));

    _g = {
        searchPanel: c_searchPanel,
        appCenter: c_appcenter,
        markerPanel: c_appcenter.refs.markerPanel,
        routePlanning: c_appcenter.refs.routePlanning,
        toolbar: c_toolbar,
        resultsPanel: c_resultspanel,
        nav: c_nav,
        poiDetails: c_poiDetails,
        fun: {
            showError: function (msg) {
                toastr.error(msg);
            },
            showSuccess: function (msg) {
                toastr.success(msg);
            },
            showInfo: function (msg) {
                toastr.info(msg);
            },
            showWarning: function (msg) {
                toastr.warning(msg);
            }
        }
    };

    var drawPoint = new L.DivIcon({
        iconSize: new L.Point(12, 12),
        className: 'leaflet-div-icon leaflet-editing-icon measure-icon'
    });
    L.Draw.Polyline.prototype.options.icon = drawPoint;
    L.Draw.Polygon.prototype.options.icon = drawPoint;
}

$(init);