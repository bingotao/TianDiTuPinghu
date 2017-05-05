class DrivingPanning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            extend: true
        }
    }

    drawRoute(dp) {
        var startPoint = dp.StartPoint;
        var endPoint = dp.EndPoint;
        var path = dp.RoutePath;

        var p = this.props.parent;
        p.clearMap();

        var startLayer = L.marker(startPoint, { icon: p.map.icons.startpoint });
        var endLayer = L.marker(endPoint, { icon: p.map.icons.endpoint });
        p.routePath.addLayer(startLayer);
        p.routePath.addLayer(endLayer);
        p.startLayer = startLayer;
        p.endLayer = endLayer;

        var pathLayer = L.polyline(path, { color: 'red', weight: 5, opacity: 0.8 });
        p.routePath.addLayer(pathLayer);

        p.drivingLayer = pathLayer;
    }

    togglePanel() {
        this.setState({
            extend: !this.state.extend
        });
    }
    render() {
        var dp = this.props.plannings;
        var routes = [];

        if (dp && dp.Routes) {
            var rts = dp.Routes;
            for (var i = 0, l = rts.length; i < l; i++) {
                routes.push(
            <div className="driving-panning-item clearfix">
                <i className="anticon">{i + 1}.</i><span>{rts[i]}</span>
            </div>);
            }
        } else {
            dp = {};
        }
        return (
            <div style={{ display: (dp.Routes ? 'block' : 'none') }} className="driving-panning">
                <div className="driving-panning-item driving-panning-start clearfix" onClick={e=>this.togglePanel()}>
                <span><antd.Icon type={(this.state.extend ? "minus" : "plus")} /></span>
                <antd.Icon type="environment" /><span className="enhance">起点（<span>{dp.Distance}，{dp.Time}）</span></span>
                </div>
                <div className={"driving-panning-details " +(this.state.extend?"active":"")}>
                    {routes}
                </div>

                <div className="driving-panning-item driving-panning-end clearfix">
                   <antd.Icon type="environment" /><span className="enhance">终点</span>
                </div>
            </div>
            );
    }
}