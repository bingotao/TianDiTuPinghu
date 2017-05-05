class Toolbar extends React.Component {
    constructor(props) {
        super();
        this.state = {
            vec: props.map.options.currentBaselayer == 'vec',
            anno: props.map.options.showAnno
        };

        this.options = {
            fullScreen: false
        };
    }

    baseLayerChange() {
        var vec = !this.state.vec;
        this.setState({ vec: vec });
        var map = this.props.map;
        if (map) {
            map.showBaselayer(vec ? 'vec' : 'img', this.state.anno);
        }
    }

    annoLayerChange() {
        var anno = !this.state.anno;
        this.setState({ anno: anno });
        var map = this.props.map;
        if (map) {
            map.showBaselayer(this.state.vec ? 'vec' : 'img', anno);
        }
    }

    toggleFullScreen() {
        if (this.props.fullScreenDom) {
            (this.options.fullScreen = !this.options.fullScreen) ?
                fullScreenApi.requestFullScreen(this.props.fullScreenDom) :
                fullScreenApi.cancelFullScreen(this.props.fullScreenDom);
        }
    }

    render() {
        var bVec = this.state.vec;

        return (
            <div className="toolbar">
                <span>
                    <span onClick={e=>this.baseLayerChange()} style={{ borderLeft: '0' }} className={"toolbar-item iconfont " + (bVec ? "icon-iconweixing" : "icon-map") }>{bVec ? "卫星" : "地图" }</span>
                    <span className="toolbar-group">
                        <span onClick={e=>this.annoLayerChange()} className={"toolbar-item iconfont " + (this.state.anno ? "icon-5" : "icon-fangxingweixuanzhong")}>标注</span>
                    </span>
                </span>
                <span>
                    <span onClick={this.props.showServices} className="toolbar-item iconfont icon-tuceng">综合服务</span>
                </span>
                <span>
                    <span className="iconfont toolbar-item icon-biaoji">标记</span>
                    <span className="toolbar-group">
                        <span onClick={this.props.sharePointClick} className="toolbar-item iconfont icon-weizhi">标点</span>
                        <span onClick={this.props.shareLineClick} className="toolbar-item iconfont icon-bianji">标线</span>
                        <span onClick={this.props.sharePolygonClick} className="toolbar-item iconfont icon-weibiaoti104">标面</span>
                    </span>
                </span>
                <span>
                    <span className="toolbar-item iconfont icon-Tool-plane">工具</span>
                    <span className="toolbar-group">
                        <span onClick={this.props.measureLengthClick} className="toolbar-item iconfont icon-ceju">测距</span>
                        <span onClick={this.props.measureAreaClick} className="toolbar-item iconfont icon-cemian">测面</span>
                        <span onClick={e=> { window.print(); }} className="toolbar-item iconfont icon-ordinaryprint">打印</span>
                        <span onClick={e=>this.props.markerLabelPanel.btnAddClick() } className="toolbar-item iconfont icon-tudingfill">标注</span>
                    </span>
                </span>
                <span>
                    <span onClick={this.props.clearClick} className="toolbar-item iconfont icon-shanchu">清除</span>
                </span>
                <span>
                    <span onClick={e=>this.toggleFullScreen()} className="toolbar-item iconfont icon-diannao">全屏</span>
                </span>
                <span>
                    <span onClick={this.props.fullExtent} className="toolbar-item iconfont icon-quanping">全图</span>
                </span>
            </div>
        );

    }
}