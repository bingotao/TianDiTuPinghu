class AreaSearch extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false,
            searchText: "",
            positionText: ""
        };
        this.map = props.map;
        this.resultPanel = props.resultPanel;
        this.resultPanel.areaSearch = this;
        this.latlng = null;
    }

    search(item) {
        var s = this.state;
        this._search(s.searchText, item.codes);
    }

    _search(text, categories) {
        this.resultPanel.search(text, categories, 0, this.latlng);
        this.hidden();
    }

    show(positionText, latlng) {
        this.positionText = positionText || this.positionText;
        this.latlng = latlng || this.latlng;
        var obj = { visible: true };
        if (positionText) {
            obj.positionText = "“" + positionText + (positionText.indexOf('附近') < 0 ? '（附近）' : '') + "”";
        }
        this.setState(obj);
    }

    hidden(clear) {
        this.setState({ visible: false });
        if (!!clear) {
            this.resultPanel.clearPOILayer();
        }
    }

    toggleVisible() {
        this.setState({ visible: !this.state.visible });
    }

    render() {
        var s = this.state;
        var categories = this.props.categories;
        var cCategories = [];
        for (var i = 0, l = categories.length; i<l;i++) {
            var c = categories[i];
            cCategories.push(<AreaSearchCategory parent={this} category={c } />);
        }

        return (
        <div className={"areasearch " + (s.visible ? "active" : "")}>
            <div className="areasearchgroup">
                <div className="areasearchgroup-fallback">
                    <antd.Icon type="left" onClick={this.hidden.bind(this)} />
                </div>
                <antd.SearchBar placeholder={"搜索" + s.positionText}
                cancelText="搜索"
                onChange={t=>this.setState({ searchText: t })}
                onCancel={e=> { this._search(this.state.searchText, null, 0); this.hidden(); }} />
            </div>
            {cCategories}
        </div>);
    }
}

class AreaSearchCategory extends React.Component {
    constructor() {
        super();
    }

    render() {
        var c = this.props.category;
        var subs = c.sub;
        var cSubs = [];
        for (var i = 0, l = subs.length; i<l;i++) {

            var s = subs[i];
            cSubs.push(<AreaSearchCategoryItem parent={this} item={s } />);
        }
        return (
        <div className="areasearchcategory">
            <h3 style={{ borderLeft: ("6px solid " + c.color) } }>{c.name}</h3>
            <div>
                {cSubs}
            </div>
        </div>);
    }
}

class AreaSearchCategoryItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        var item = this.props.item;
        return (
            <span onClick={e=>this.props.parent.props.parent.search(this.props.item)}>
                {item.name}
            </span>);
    }
}