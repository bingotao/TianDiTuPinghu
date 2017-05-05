
class BtnLocation extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            located: false
        };
    }

    getLocation() {
        if (!this.state.loading) {
            var map = this.props.map;
            map.getLocation(this, true, function (latlng) {
                this.getNeareatPOI(latlng, function (poi) {
                    this.nearestPOI = poi;
                }.bind(this));
            }.bind(map));
        }
    }

    showLoading() {
        this.setState({ loading: true });
    }

    hiddenLoading(success) {
        this.setState({ loading: false, located: success ? true : false });
    }

    render() {
        return (
        <span onClick={this.getLocation.bind(this)} className={"btn-mobile btn-location iconfont " + (this.state.loading ? "" : ("icon-position01 " + (this.state.located ? "active" : "")))}>
            {this.state.loading ? <a className="anticon anticon-spin anticon-loading"></a> : null}
        </span>);
    }
}
