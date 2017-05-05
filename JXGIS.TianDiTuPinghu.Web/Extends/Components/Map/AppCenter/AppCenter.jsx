class AppCenter extends React.Component {
    constructor() {
        super();
        var tabs = {
            "0": "0",
            "1": "1",
            "2": "2"
        }
        this.tabs = tabs;
        this.state = {
            currentTab: tabs["0"],
            hidden: true
        };
    }

    show(tab) {
        var state = {
            hidden: false
        };
        if (tab) state.currentTab = tab;
        this.setState(state);
    }

    hidden() {
        this.setState({
            hidden: true
        });
    }

    toggleHidden() {
        this.setState({
            hidden: !this.state.hidden
        });
    }

    selectTab(tabName) {
        this.setState({
            currentTab: tabName
        });
    }

    getActiveClass(tabName) {
        return tabName == this.state.currentTab ? "active" : "";
    }

    render() {
        var lxghCls = this.getActiveClass(this.tabs["0"]);
        var zhfwCls = this.getActiveClass(this.tabs["1"]);
        var zttcCls = this.getActiveClass(this.tabs["2"]);

        return (
            <div className={"appcenter " + (this.state.hidden ? "" : "active")}>
                <div className="appcenter-nav">
                    <span onClick={e=>this.selectTab(this.tabs["0"])} className={lxghCls}><span className="iconfont icon-604luxian"></span>线路规划</span>
                    <span onClick={e=>this.selectTab(this.tabs["1"])} className={zhfwCls}><span className="iconfont icon-zonghechaxun"></span>地图标注</span>
                    <span onClick={e=>this.selectTab(this.tabs["2"])} className={zttcCls}><span className="iconfont icon-tuceng"></span>综合服务</span>
                </div>
                <div className="appcenter-appcontainer">
                    <div className={lxghCls}>
                        <PlanningPanel ref="routePlanning" fetchUrl={"../Map/QuickSearch"} map={this.props.map} />
                    </div>
                    <div className={zhfwCls}>
                        <MarkerLabelPanel ref="markerPanel" map={this.props.map} />
                    </div>
                    <div className={zttcCls}>
                        <LayerControl layers={this.props.layers} />
                    </div>
                </div>
                <div onClick={e=>this.hidden()} className="appcenter-panel-sliderup">
                    <antd.Icon type="caret-up" />
                </div>
            </div>
        );
    }
}