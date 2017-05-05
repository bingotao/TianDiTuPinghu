class BtnLayerToggle extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: false,
            vec: true
        };
    }

    click() {
        var map = this.props.map;
        var bVec = !this.state.vec;
        this.setState({ vec: bVec });
        map.showBaseMap(bVec ? "vec" : "img");
    }

    render() {
        var state = this.state;
        if (state)
            return (
            <span onClick={this.click.bind(this)} className={"btn-mobile iconfont btn-layertoggle " + (state.vec ? "icon-iconweixing" : "icon-ditu2")}>
                {this.state.loading ? <a className="anticon anticon-spin anticon-loading"></a> : null}
            </span>
            );
    }
}
