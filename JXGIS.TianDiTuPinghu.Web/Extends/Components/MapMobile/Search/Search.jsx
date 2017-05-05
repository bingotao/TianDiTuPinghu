class QuickSearch extends React.Component {
    constructor() {
        super();
    }

    render() {
        var categories = [
            { name: '餐饮美食', img: _bl_ + "/Reference/image/餐饮美食.png", codes: ['120201', '120202', "140312", "140310", "140311", "120204"] },
            { name: '旅游住宿', img: _bl_ + "/Reference/image/旅游住宿.png", codes: ["120101", "120102", "120103"] },
            { name: '交通运输', img: _bl_ + "/Reference/image/交通运输.png", codes: ["170801", "1701", "170401", "170501"] },
            { name: '娱乐消费', img: _bl_ + "/Reference/image/娱乐消费.png", codes: ["13", "14", "15"] },
            { name: '公共生活', img: _bl_ + "/Reference/image/公共生活.png", codes: ["160301", "160302", "160303", "160304", "150406"] }
        ];
        var cCategories = [];

        for (var j = 0, l = categories.length; j < l; j++) {
            var i = categories[j];
            cCategories.push(
            <div onClick={(i=> {
                this.props.search.searchOnResultPanel(null, i.codes);
                this.props.search.props.resultPanel._target = "search";
            }).bind(this, i)}>
                <img src={i.img} />
                <div>{i.name}</div>
            </div>);
        }

        return (
        <div className="quick-search">
            <div style={{ width: "300px", margin: "0 auto" } }>{cCategories}</div>
        </div>
        );
    }
}

class QuickSearchResults extends React.Component {
    constructor() {
        super();
    }

    scrollTop() {
        this.refs.panel.scrollTop = 0;
    }

    render() {
        var items = this.props.items;
        var cItems = [];
        if (items && items.length)
            for (var j = 0, l = items.length; j < l; j++) {
                i = items[j];
                cItems.push(<div onClick={(i=> {
                        var resultPanel = this.props.resultPanel;
                        resultPanel.state.results = [i];
                        resultPanel.addPOIToMap([i], true);
                        resultPanel.setActivePOI(i.FEATUREGUID);
                        resultPanel.show(true);
                        resultPanel._target = "search";
                        this.props.search.hidden();
                    }).bind(this,i)} className="quick-result"><span className="anticon anticon-environment-o"></span>{i.SHORTNAME}</div>);
            }
        return (
        <div ref='panel' className="quick-search-results">
            {cItems}
        </div>);
    }
}

class Search extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false,
            results: null,
            btnClearVisible: false,
            searchText: ""
        };
        props.resultPanel.parent = this;
    }

    btnClick() {
        this.search();
        this.props.resultPanel._target = "search";
    }

    searchOnResultPanel(keyword, categories) {
        this.props.resultPanel.search(keyword || this.state.searchText, categories);
    }

    search(keyword, categories) {
        var keyWord = keyword || this.state.searchText;
        keyWord = keyWord.trim();
        var cThis = this;
        $.post('SearchPOI', { keywords: keyWord.split(' '), types: categories, pagenumber: 1, pagesize: 20 }, function (rt) {
            if (rt.ErrorMessage) {
                antd.Toast.fail(rt.ErrorMessage);
            } else {
                var data = rt.Data.Data;
                var results = rt.Data.Data.Results;
                cThis.setState({ results: results });
            }
        }, 'json');
    }

    show(clear) {
        var obj = { visible: true };
        if (clear) {
            obj.searchText = "";
            obj.results = [];
        }
        this.setState(obj);
    }

    hidden(clear) {
        var obj = { visible: false };
        if (clear) {
            obj.searchText = "";
            obj.results = [];
            this.props.resultPanel.clearPOILayer(false, true);
        }
        this.setState(obj);
    }

    toggleClearBtn() {
        this.setState({
            btnClearVisible: !this.state.btnClearVisible
        });
    }

    componentDidUpdate() {
        this.refs.panel.scrollTop();
    }

    render() {
        return (
        <div className={"search " + (this.state.visible ? "active" : "")}>
            <div className="search-group">
                <antd.Icon onClick={e=>this.hidden(true)} className="btn-fallback" type="left" />
                <antd.SearchBar value={this.state.searchText}
                                placeholder="搜索"
                                onSubmit={e=>this.searchOnResultPanel(e)}
                                onChange={e=> { this.setState({ searchText: e }); this.search(e); }}
                                cancelText={"搜索"}
                                onCancel={e=>this.searchOnResultPanel(e)} />
            </div>
            <QuickSearch search={this} />
            <QuickSearchResults search={this} resultPanel={this.props.resultPanel} ref='panel' items={this.state.results} />
        </div>);
    }
}

class ResultPanel extends React.Component {
    constructor(props) {
        super();
        this.keyWord = '';
        this.categories = [];
        this.state = {
            visible: false,
            slided: false,
            currentPage: 0,
            total: 0,
            results: []
        };
        this.map = props.map;

        var icons = this.map.icons;
        var poiLayer = L.geoJSON(null);

        poiLayer.on('click', function (e) {
            this.show(true);
            this.setActivePOI(e.layer.feature.properties.FEATUREGUID);
        }.bind(this));
        var poiLayer = poiLayer.addTo(map.map);
        this.map.poiLayer = poiLayer;
    }

    fallbackClick() {
        if (this._target == 'search') {
            this.parent.show();
        } else {
            this.areaSearch.show();
        }
        this.hidden(false, false);
    }

    setActivePOI(ftId, scrollTop) {
        var icons = this.map.icons;
        if ((ftId == null || ftId == undefined) && this.state.results.length)
            ftId = this.state.results[0];
        if (ftId) {
            this.map.poiLayer.eachLayer(function (layer) {
                if (layer.feature.properties.FEATUREGUID == ftId) {
                    layer.setIcon(icons.poiactive);
                    layer.setZIndexOffset(99999);
                } else {
                    layer.setZIndexOffset(1);
                    layer.setIcon(icons.poidefault);
                }
            });

            var results = this.state.results;
            for (var i = 0, l = results.length; i < l ; i++) {
                var r = results[i];
                r.active = false;
                if (r.FEATUREGUID == ftId) {
                    r.active = true;
                    if (scrollTop !== false) this.refs.panel.scrollTop = i * 132;
                }
            }
            this.setState({
                results: results
            });
        }
    }

    toggleSlided() {
        this.setState(
            {
                visible: true,
                slided: !this.state.slided
            });
    }

    clearPOILayer() {
        this.map.poiLayer.clearLayers();
    }


    _onGoToHereClick(poi) {
        this.hidden(false, true);
        if (this.props.onGoToHereClick) {
            this.props.onGoToHereClick(poi);
        }
    }

    addPOIToMap(pois, fit) {
        var newPOIs = [];
        this.clearPOILayer();

        var poiLayer = this.map.poiLayer;
        for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i];
            poi.INDEX = i;
            newPOIs.push({
                type: "Feature",
                properties: poi,
                geometry: {
                    type: "Point",
                    coordinates: [poi.X, poi.Y]
                }
            });
        }
        poiLayer.addData(newPOIs);

        if (fit) {
            if (newPOIs.length > 1) {
                bounds = poiLayer.getBounds();
                this.map.map.fitBounds(bounds, { paddingTopLeft: [10, 70], paddingBottomRight: [10, 200] });
            }
            else if (newPOIs.length == 1) {
                this.map.map.setView([pois[0].Y, pois[0].X]);
            }
        }
    }

    search(keyword, categories, pagenumber, latlng) {
        this.keyWord = keyword || this.keyWord;
        this.categories = categories || this.categories;
        this.keyWord = this.keyWord.trim();
        this.latlng = latlng || this.latlng;
        var pageNumber = pagenumber ? pagenumber : 0;

        var postObj = {
            keywords: this.keyWord.split(' '),
            types: this.categories,
            pagenumber: pageNumber + 1,
            pagesize: 10
        };

        if (this.latlng) {
            postObj.centerpoint = this.latlng;
            postObj.radius = 1000;
        }
        var cThis = this;
        $.post('SearchPOI',
            postObj,
            function (rt) {
                if (rt.ErrorMessage) {
                    antd.Toast.fail(rt.ErrorMessage);
                } else {
                    var data = rt.Data.Data;
                    var results = rt.Data.Data.Results;
                    cThis.setState({ currentPage: pageNumber, total: data.Count, results: results });
                    cThis.addPOIToMap(results, true);
                    if (results.length) {
                        cThis.setActivePOI(results[0].FEATUREGUID);
                    }

                    cThis.parent.hidden(false);
                    cThis.show();
                }
            }, 'json');
    }

    show(slided) {
        this.setState(slided ? { visible: true, slided: true } : { visible: true, slided: false });
    }

    scrollTop() {
        this.refs.panel.scrollTop = 0;
    }

    hidden(slided, clear) {
        if (slided) {
            this.setState({ visible: true, slided: true });
        } else {
            this.keyWord = "";
            this.categories = [];
            this.latlng = null;
            this.setState({
                visible: false,
                slided: false,
                currentPage: 0,
                total: 0,
                results: []
            });
            if (!!clear) {
                this.parent.hidden(true);
                this.map.poiLayer.clearLayers();
            }
        }
    }

    render() {
        var state = this.state;
        var results = state.results;
        var cResults = [];
        for (var i = 0, l = results.length; i < l ; i++) {

            var r = results[i];
            cResults.push(<ResultItem parent={this} item={r } />);
        }

        var cNoneFind = <div className="result-panel-nonefind">未找到相关信息</div>;
        return (
        <div className={"result-panel " + (state.visible ? 'active ' : '') + (state.slided ? 'slided' : '')}>
            <div className="result-panel-actions">
                <antd.Icon onClick={e=>this.fallbackClick()} type="arrow-left" />
                <antd.Icon onClick={this.toggleSlided.bind(this)} type={state.slided ? "caret-up" : "caret-down"} />
                <antd.Icon onClick={e=>this.hidden(false,true)} type="cross-circle" />
            </div>
            <div ref='panel' className="result-panel-results">
                {cResults.length > 0 ? cResults : cNoneFind}
                <antd.Pagination onChange={e=>this.search(null, null, e, null)}
                                 style={{ display: (state.results.length > 1 ? "block" : "none"), padding: "5px 20px" }}
                                 total={parseInt(state.total / 10) + (state.total % 10 > 0 ? 1 : 0)}
                                 current={state.currentPage}
                                 prevText="上一页"
                                 nextText="下一页" />
            </div>
        </div>
);
    }
}

class ResultItem extends React.Component {
    constructor() {
        super();
    }

    error() {
        this.refs.img.src = _bl_ + "/Reference/image/none-picture.png";
    }

    render() {
        var item = this.props.item;
        var imgs = item.PHOTO ? item.PHOTO.split(',') : [_bl_ + "/Reference/image/none-picture.png"];
        return (
            <div onClick={e=> {
                this.props.parent.hidden(true);
                this.props.parent.props.map.map.setView([item.Y, item.X]);
                this.props.parent.setActivePOI(item.FEATUREGUID, true);
            }}
                 className={"result-item " + (item.active ? "active" : "")}>
                <div>
                    <h3>{item.SHORTNAME}</h3>
                    <h4><antd.Icon type="environment" />{item.ADDRESS || '暂无'}</h4>
                    <h4><antd.Icon type="phone" />{item.PHONE || '暂无'}</h4>
                    <antd.Button onClick={e=> {
                            this.props.parent._onGoToHereClick(this.props.item);
                            e.stopPropagation();
                        }
                    } type="ghost" size="small" inline>去这里</antd.Button>
                    <antd.Button onClick={e=> {
                            this.props.parent.areaSearch.show(item.SHORTNAME, { lng: item.X, lat: item.Y });
                            this.props.parent._target = "areasearch";
                        }} type="ghost" size="small" inline>搜周边</antd.Button>
                </div>
                <img onError={this.error.bind(this)} ref="img" src={imgs[0]} />
            </div>
        );
    }
}