class BusLine extends React.Component {
    constructor() {
        super();
        this.index = 1;
    }

    render() {
        var bl = this.props.busLine;
        var line = bl.Line;
        switch (bl.Type) {
            case 1:
                return (
                    <div className="busline-item"><span className="iconfont icon-iconfontjiaotongiconwalk"></span>步行 <span className="enhance">{line.Distance}({line.Time})</span> 到达 <span className="enhance">{bl.EndStation.Name}</span></div>
                    );
            case 2:
            case 3:
                return (
                    <div className="busline-item">
                        <div className="enhance"><span className="iconfont icon-gongjiao"></span>{line.Direction}({line.StationCount}站)</div>
                        <div className="busline-station">
                            <div>
                                <span className="iconfont icon-station"></span>
                                <span>{bl.StartStation.Name}</span>
                                <span className="enhance"> 上车</span>
                            </div>
                            <div>
                                <span className="iconfont icon-station"></span>
                                <span>{bl.EndStation.Name}</span>
                                <span className="enhance"> 下车</span>
                            </div>
                            <div className="enhance">运营时间：{line.WorkTime}</div>
                        </div>
                    </div>
                    );
            default:
                return null;
        }
    }
}

class BusPanning extends React.Component {
    constructor(props) {
        super();
        this.state = {
            detailsOn: props.detailsOn
        };
    }

    toggleDetails() {
        this.setState({
            detailsOn: !this.state.detailsOn
        });
    }

    render() {
        var bp = this.props.busPanning;

        var trs = [];
        if (bp && bp.TransferBuses) {
            var trsBuses = bp.TransferBuses;
            for (var i = 0, l = trsBuses.length; i < l; i++) {
                var item = trsBuses[i];
                if (i != l - 1)
                    trs.push(<span><span><span className="iconfont icon-gongjiao"></span>{item}</span> <span className="iconfont icon-right"></span></span>);
                else
                    trs.push(<span><span><span className="iconfont icon-gongjiao"></span>{item}</span></span>);
            }

            var busLines = [];

            var lines = bp.BusLines;
            for (var i = 0, l = lines.length; i < l; i++) {
                busLines.push(<BusLine busLine={lines[i] } />);
            }
            } else {
                bp = {};
            }

        return (
            <div className={"bus-panning" + (this.state.detailsOn ? " active" : "")}>
                <div onClick={e=>this.props.parent.showDetails(this.props.index)} className={"bus-panning-sp" + (this.state.detailsOn ? " active" : "")}>
                <span className="btn-buspanning-details"><antd.Icon type={this.state.detailsOn ? "up" : "down"} /></span>
                <div className="bus-panning-simple">{trs}</div>
                <div className="bus-panning-simple-detail">
                {bp.TotalTime}({bp.TotalDistance}，{bp.TransferCount == 0 ? "无换乘" : "换乘" + bp.TransferCount + "次"})
                </div>
                </div>
                <div className={"bus-panning-details " + (this.state.detailsOn ? " active" : "" )}>
                   <div className="bus-panning-details-start"><antd.Icon type="environment" />起点</div>{busLines}
                   <div className="bus-panning-details-end"><antd.Icon type="environment" />终点</div>
                </div>
            </div>
        );
    }
}


class BusPanningResultPanel extends React.Component {
    constructor(props) {
        super();
        this.parent = props.parent;
        this.state = {
            showDetailsIndex: 0
        }
    }

    showDetails(index) {
        this.setState({ showDetailsIndex: index });
    }

    drawPath(dp) {



    }

    render() {
        var pgs = this.props.plannings;
        var plannings = [];
        if (pgs) {
            for (var i = 0, l = pgs.length; i < l; i++) {
                plannings.push(<BusPanning parent={this} index={i} detailsOn={this.state.showDetailsIndex === i} busPanning={pgs[i] } />);
            }

            if (l === 0) {
                plannings = <div className="busplaning-nonetip">未找到合适的公交线路</div>;
            }
        } else {
            plannings = <div></div>;
        }
        return (
            <div>
                {plannings}
            </div>);
    }
}