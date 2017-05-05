class POIDetailImg extends React.Component {
    constructor(props) {
        super(props);
    }

    onImgError() {
        this.refs.img.src = _bl_ + "/Reference/image/none-picture.png";
    }

    render() {
        var img = this.props.imgUrl;
        return (
             <img ref="img" onError={this.onImgError.bind(this)} className="poidetail-img" src={img } />
         );
    }
}

class POIDetailsPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            show: false
        };
    }

    hidden() {
        this.setState({ show: false });
        if (this.props.onHidden) {
            this.props.onHidden();
        }
    }

    showPOIDeails(poi) {
        var item = poi || {};
        item.show = true;
        this.setState(item);
        _g.appCenter.hidden();
    }

    correcting() {
        var map = this.props.map;
        var point = this.state.LNGLAT;
        var poi_id = this.state.FEATUREGUID;
        map.createCorrecting(point, poi_id);
    }

    componentDidMount() {
        var clipboard = new Clipboard(this.refs.copyAddress);

        clipboard.on('success', function (e) {
            _g.fun.showSuccess('分享地址复制成功！');
        });
    }

    getPosition() {
        var poi = this.state;
        return {
            name: poi.SHORTNAME,
            point: {
                y: this.state.LNGLAT.lat,
                x: this.state.LNGLAT.lng
            },
            center: false
        };
    }

    setRouteStart() {
        _g.appCenter.show('0');
        _g.routePlanning.setStart(this.getPosition());
    }

    setRouteEnd() {
        _g.appCenter.show('0');
        _g.routePlanning.setEnd(this.getPosition());
    }

    render() {
        var item = this.state;

        var images = item.PHOTO ? item.PHOTO.split(";") : [_bl_ + "/Reference/image/none-picture.png"];
        var imgs = [];

        for (var i = 0, l = images.length; i < l; i++) {
            imgs.push(<div><POIDetailImg imgUrl={images[i] } /></div>);
        }

        var address = window.location.origin + _bl_ + '/Map/Index?poishare=' + this.state.FEATUREGUID;
        return (
            <div className={"poidetails-panel " + (item.show ? "active" : "")}>
                <antd.Button onClick={e=>this.hidden()} type="close" icon="left">返回</antd.Button>
                <antd.Carousel autoplay={true} effect="fade">
                    {imgs}
                </antd.Carousel>
                <div className="poidetails-info">
                    <div>{item.SHORTNAME}</div>
                    <div><antd.Icon type="environment" /> {item.ADDRESS}</div>
                    <div><antd.Icon type="phone" /> {item.PHONE}</div>
                    <div className="poidetails-route">
                        <antd.Button onClick={this.setRouteStart.bind(this)} type="primary">从此出发<antd.Icon type="arrow-right" /></antd.Button>
                        <antd.Button onClick={this.setRouteEnd.bind(this)} type="primary">到达此处<antd.Icon type="arrow-left" /></antd.Button>
                    </div>
                </div>

                <div className="poidetails-tools">
                    <span onClick={e=>this.props.map.createAreaSearch(this.state.LNGLAT)}><antd.Icon type="search" /> 搜附近</span>
                    <span><button ref='copyAddress' data-clipboard-text={address }><antd.Icon type="share-alt" /> 分享</button></span>
                    <span onClick={this.correcting.bind(this)}><antd.Icon type="file-excel" /> 纠错</span>
                </div>
            </div>
        );
    }
}