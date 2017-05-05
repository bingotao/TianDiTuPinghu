class LayerItem extends React.Component {
    constructor() {
        super();
        this.state = {
            checked: false
        }
    }

    toggleCheck(){
        this.setState({
            checked:!this.state.checked
        });
    }

    render() {
        return (
            <span onClick={e=>this.toggleCheck()} className={"layer-item "+(this.state.checked ?"active":"")}>
                <span className={"iconfont "+(this.state.checked ? "icon-5" : "icon-fangxingweixuanzhong" )}></span>
                {this.props.name}
            </span>
        );
    }
}

class LayerControl extends React.Component {
    constructor() {
        super();
    }

    componentDidUpdate() {
        if(!L.Browser.webkit){
            var $scroll = this.$scroll;
            if ($scroll) {
                $scroll.mCustomScrollbar("scrollTo", "top");
            } else {
                this.$scroll = $('.layercontrol .layercontrol-container').mCustomScrollbar({
                    theme: "dark-blue",
                    scrollInertia: 0
                });
            }}
    }

    render() {
        var layers = this.props.layers;

        function getTreeNodes(data) {
            var nodes = [];
            for (var i = 0, l = data.length; i < l; i++) {
                var item = data[i];
                var node = null;
                if (item.children && item.children.length) {
                    node = <antd.Tree.TreeNode key={item.key} title={item.name }>{getTreeNodes(item.children)}</antd.Tree.TreeNode>;
                } else
                    node = <antd.Tree.TreeNode key={item.key} title={<LayerItem name={item.name}/>} />;
                nodes.push(node);
            }
            return nodes;
        }

        var nodes = getTreeNodes(layers);

        return (
            <div className="layercontrol">
                <div className="layercontrol-container">
                    <antd.Tree defaultExpandAll={true} checkable={false}>
                        {nodes}
                    </antd.Tree>
                </div>
            </div>
            );
    }
}