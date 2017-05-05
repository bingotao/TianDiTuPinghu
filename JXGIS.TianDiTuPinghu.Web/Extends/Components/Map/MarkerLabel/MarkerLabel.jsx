/*
    labelItem 的结构
    {
        id:"id",
        content:"内容",
        createTime:"2016年12月2日",
        x:'',
        y:''
    }
*/

class MarkerLabelItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var i = this.props.labelItem;
        return (
            <div className={"labelitem "+(i.layer?'active':'')}>
                <antd.Icon onClick={e=>
                this.props.panel.toggleMapItem(i)} type="pushpin" />
                <antd.Icon onClick={e =>
                    this.props.panel.removeItem(i)} type="delete" />
                <antd.Icon type={i.layer?"eye":"eye-o"} />
                <p onClick={e=>
                this.props.panel.toggleMapItem(i)} className="labelitem-content ">{i.content}</p>
                <p onClick={e=>
                this.props.panel.toggleMapItem(i)} className="labelitem-time ">创建于：{i.createTime}</p>
            </div>
            );
    }
}

class MarkerLabelPanel extends React.Component {
    constructor(props) {
        super(props);
        var map = props.map;
        this.map = map;
        this.storeName = "mapMarkerLabels";
        var labelItems = store.get(this.storeName);

        labelItems = labelItems || [];

        this.state = {
            labelItems: labelItems
        };

        var markerFtGroupLayer = L.featureGroup().addTo(map.map);
        this.markerFtGroupLayer = markerFtGroupLayer;
    }

    componentDidUpdate() {
        if (!L.Browser.webkit) {
            var $scroll = this.$scroll;
            if ($scroll) {
                $scroll.mCustomScrollbar("scrollTo", "top");
            } else {
                this.$scroll = $('.appcenter .labelitems').mCustomScrollbar({
                    theme: "dark-blue",
                    scrollInertia: 0
                });
            }
        }
    }

    createMarkerOnMap(layer) {
        layer.addTo(this.map.map);
        var content = MarkerLabelMapPopup.create(layer, this);
        var popoup = L.popup({ className: 'markerlabel-popoup' }).setContent(content.dom);
        layer.bindPopup(popoup).openPopup()
    }

    btnAddClick() {
        this.map.drawControl.setDrawingOptions({
            marker: {
                icon: this.map.icons.markerlabel
            }
        });
        this.map.activateDrawPoint('marker');
    }

    showAll() {
        var labelItems = this.state.labelItems
        for (var i = 0, l = labelItems.length; i < l; i++) {
            this.showMapItem(labelItems[i], false);
        }
    }

    hiddenAll() {
        var labelItems = this.state.labelItems
        for (var i = 0, l = labelItems.length; i < l; i++) {
            this.hiddenMapItem(labelItems[i]);
        }
    }

    addItem(item) {
        //取消popoup绑定
        item.layer.closePopup();
        item.layer.unbindPopup();
        /*
        todo 绑定 tooltip
        */
        var content = MarkerLabelMapTooltip.create(item, this);
        item.layer.bindTooltip(content.dom, { permanent: true, direction: 'right' });

        this.state.labelItems.push(item);
        this.setState({
            labelItems: this.state.labelItems
        });

        this.saveMarkerLabelItems();
    }

    saveMarkerLabelItems() {
        var items = this.state.labelItems;
        var newItems = items.map(function (i) {
            return { id: i.id, content: i.content, createTime: i.createTime, x: i.x, y: i.y };
        });
        store.set(this.storeName, newItems);
    }

    toggleMapItem(item) {
        item.layer ? this.hiddenMapItem(item) : this.showMapItem(item, true);
    }

    showMapItem(item, bCenter) {
        var layer = L.GeoJSON.geometryToLayer({
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: [item.x, item.y]
            }
        });
        layer.setIcon(this.map.icons.markerlabel);
        if (bCenter) this.map.map.setView(layer.getLatLng());

        item.layer = layer.addTo(this.map.map);
        var content = MarkerLabelMapTooltip.create(item, this);
        item.layer.bindTooltip(content.dom, { permanent: true, direction: 'right' });
        this.setState({ labelItems: this.state.labelItems });
    }

    hiddenMapItem(item) {
        item.layer && item.layer.remove();
        item.layer = null;
        this.setState({ labelItems: this.state.labelItems });
    }

    removeItem(item) {
        var labelItems = this.state.labelItems;
        var newItems = [];

        for (var j = 0, l = labelItems.length; j < l; j++) {
            var i = labelItems[j];
            if (i.id == item.id) {
                if (item.layer) item.layer.remove();
                continue;
            }
            newItems.push(i);
        }
        this.setState({ labelItems: newItems });
        this.saveMarkerLabelItems();
    }

    render() {
        var cLabelItems = [];

        for (var i = this.state.labelItems.length - 1; i >= 0; i--) {
            cLabelItems.push(<MarkerLabelItem panel={this} labelItem={this.state.labelItems[i] } />);
        }

        return (
    <div className="markerlabelpanel clearfix">
        <div className="clearfix"><antd.Button type="primary" onClick={e=>this.btnAddClick()}>添加标注</antd.Button></div>
        <div className="labelitems">
            <div>
                {cLabelItems}
            </div>
        </div>
    </div>
    );
    }
}

class MarkerLabelMapPopup extends React.Component {
    constructor(props) {
        super(props);
        this.layer = props.layer;
        this.state = {
            content: null
        };
    }

    okClick() {
        var content = this.state.content;
        content = content ? content.trim() : '';
        if (!content) {
            _g.fun.showError("尚未填写任何标注信息！");
        }
        else if (content.length > 20) {
            _g.fun.showError("标注信息请少于20字！");
        } else {
            var now = Date.now();
            var date = new Date(now);
            var hours = date.getHours();
            hours = (hours < 10 ? "0" : "") + hours;
            var minutes = date.getMinutes();
            minutes = (minutes < 10 ? "0" : "") + minutes;
            var timeString = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日 " + hours + ":" + minutes;
            var latlng = this.layer.getLatLng();
            var item = {
                id: now,
                content: this.state.content,
                createTime: timeString,
                x: latlng.lng,
                y: latlng.lat
            };
            item.layer = this.layer;
            this.props.panel.addItem(item);
        }
    }

    cancelClick() {
        this.layer.remove();
    }

    render() {
        return (
        <div className="markerlabel-mappopup">
            <h4>标注</h4>
            <input ref="input" className="ct-input" placeholder="请填写标注内容" onChange={e=>this.setState({ content: e.target.value })} value={this.state.content} />
            <div className="clearfix">
                <antd.Button onClick={e=>this.cancelClick()}>取消</antd.Button>
                <antd.Button type="primary" onClick={e=>this.okClick()}>确定</antd.Button>
            </div>
        </div>);
    }
}

MarkerLabelMapPopup.create = function (layer, markerLabelPanel) {
    var dom = document.createElement('div');
    var content = ReactDOM.render(<MarkerLabelMapPopup panel={markerLabelPanel} layer={layer } />, dom);
    content.dom = dom;
    return content;
};

class MarkerLabelMapTooltip extends React.Component {
    constructor() {
        super();
    }

    render() {
        var i = this.props.item;
        return (
            <div className="markerlabel-maptooltip">
               {i.content}
            </div>
            );
    }
}

MarkerLabelMapTooltip.create = function (item, markerLabelPanel) {
    var dom = document.createElement('div');
    var content = ReactDOM.render(<MarkerLabelMapTooltip panel={markerLabelPanel} item={item } />, dom);
    content.dom = dom;
    return content;
};