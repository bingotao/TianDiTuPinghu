class AreaSearch extends React.Component {
    constructor(props) {
        super();
        var options = {
            defaulteState: {
                distance: 800,
                searchText: ''
            },
            point: null
        };
        this.options = options;
        this.state = options.defaulteState;
    }

    reset() {
        var centerLayer = this.centerLayer;
        var areaSearchLayer = this.areaSearchLayer;
        this.popup = null;
        if (centerLayer) {
            centerLayer.remove();
            centerLayer = null;
        }
        if (areaSearchLayer) {
            areaSearchLayer.remove();
            this.areaSearchLayer = null;
        }
        this.setState(this.defaulteState);
    }

    setPosition(point) {
        this.options.point = point;
    }

    changeSearchText(text) {
        this.setState({ searchText: text });
    }

    search() {
        var map = this.props.map;
        var point = this.options.point;
        var radius = this.state.distance;
        var searchText = this.state.searchText;
        var categories = this.options.categories;
        this.reset();

        var areaSearchLayer = L.circle(point, { radius: radius, weight: 1 });
        areaSearchLayer.editing.enable();
        map.drawItems.addLayer(areaSearchLayer);
        this.areaSearchLayer = areaSearchLayer;
        map.areaSearchLayer = areaSearchLayer;

        areaSearchLayer.on('edit', (function (cThis, point, searchText, categories) {
            return function (e) {
                var circle = e.target;
                var radius = circle.getRadius();
                var center = circle.getLatLng();
                $('.leaflet-edit-resize').attr('data-distance', radius.toFixed(0) + '米');
                cThis.getPOI(false, searchText, center, radius, categories);
            }
        })(this, point, searchText, categories));

        $('.leaflet-edit-resize').attr('data-distance', radius.toFixed(0) + '米');

        this.getPOI(false, searchText, point, radius, categories);
    }

    getPOI(fitMap, text, center, radius, categories) {
        _g.resultsPanel.getPOI(fitMap, text, categories, 1, center, radius);
        _g.resultsPanel.show();
        _g.poiDetails.hidden();
    }

    render() {
        var opts = this.options;
        var state = this.state;
        return (
        <div className="areasearch">
            <h3>周边搜索</h3>
            <div>
                 <antd.Input.Group>
                     <antd.Input placeholder="请输入关键字..." value={state.searchText} onChange={e=>this.changeSearchText(e.target.value)} />
                     <div className="ant-input-group-wrap">
                         <antd.Button type="primary" onClick={this.search.bind(this)}>搜索</antd.Button>
                     </div>
                 </antd.Input.Group>
            </div>
            <div className="areasearch-btns">
                <antd.Button onClick={e=> { this.options.categories = ["120201", "120202", "120204", "140312", "140310", "140311"]; this.search(); }} type="primary" size="small">餐饮</antd.Button>
                <antd.Button onClick={e=> { this.options.categories = ["120101", "120102", "120103"]; this.search(); }} type="primary" size="small">住宿</antd.Button>
                <antd.Button onClick={e=> { this.options.categories = ["160501", "160502"]; this.search(); }} type="primary" size="small">银行</antd.Button>
                <antd.Button onClick={e=> { this.options.categories = ["170105"]; this.search(); }} type="primary" size="small">公交站</antd.Button>
                <antd.Button onClick={e=> { this.options.categories = ["160301", "160302", "160303", "160304", "150406"]; this.search(); }} type="primary" size="small">医院</antd.Button>
            </div>
        </div>
        );
    }
}

AreaSearch.create = function (map, layer, node) {

    //单例，不存在则创建，存在则返回
    if (!AreaSearch.instance) {
        var dom = node || document.createElement('div');
        var areaSearch = ReactDOM.render(<AreaSearch map={map } />, dom);
        areaSearch.dom = dom;
        AreaSearch.instance = areaSearch;
    }
    areaSearch = AreaSearch.instance;
    areaSearch.reset();

    areaSearch.setPosition(layer.getLatLng());
    areaSearch.centerLayer = layer;
    areaSearch.popup = layer.bindPopup(areaSearch.dom);

    return AreaSearch.instance;
}