class FooterNav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var navs = this.props.navs;
        var cNavs = [];

        for (var i = 0, l = navs.length; i < l; i++) {
            var nav = navs[i];
            var cNav = <span><a href={_bl_ + nav.href} target="_blank">{nav.name}</a></span>
            cNavs.push(cNav);
        }

        return (
            <div className="footernav">
                {cNavs}
            </div>
            );
    }
}