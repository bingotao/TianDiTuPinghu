class BtnFullScreen extends React.Component {
    constructor() {
        super();
    }
    click() {
        this.props.map.fullAndLockScreen();
    }

    render() {
        return (
            <span onClick={this.click.bind(this)} className="btn-mobile btn-fullscreen iconfont icon-quanping"></span>
       );
    }
}
