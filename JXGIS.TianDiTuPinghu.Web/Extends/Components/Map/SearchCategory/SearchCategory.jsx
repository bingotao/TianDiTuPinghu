class SubItem extends React.Component {
    constructor() {
        super();
    }

    click() {
        if (this.props.click)
            this.props.click(this.props.item);
    }

    render() {
        var item = this.props.item;
        return (<span onClick={(e) =>this.click(e)} className={'subitem ' + (item.sub ? 'subitem-bg' : 'subitem-sm') }>{item.name}</span>);

    }
}

class SearchCategoryItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        var item = this.props.item;
        var subs = [];
        for (var i = 0, l = item.sub.length; i < l; i++) {
            subs.push(<SubItem item={ item.sub[i]} click={this.props.click } />);
        }
        return (
        <div className="searchcategory-item">
            <antd.Row>
                <antd.Col span={3}>
                    <img src={_bl_+item.picture} />
                </antd.Col>
                <antd.Col span={21}>
                    <div>
                        <SubItem item={ item } click={this.props.click } />
                    </div>
                    <div>
                        {subs}
                    </div>
                </antd.Col>
            </antd.Row>
        </div>
       );
    }
}

class SearchCategoryPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            hidden: true,
            btnClearVisible: false,
            searchText: ""
        };
    }

    btnClick() {
        if (this.props.btnClick)
            this.props.btnClick(this.state.searchText);
    }

    focus() {
        if (this.state.hidden) {
            var input = this.searchText.refs.input;
            setTimeout(function () {
                input.focus();
            }, 200);
        }
    }

    toggleHidden() {
        this.setState({
            hidden: !this.state.hidden
        });
    }

    show() {
        this.setState({
            hidden: false
        });
    }

    hidden() {
        this.setState({
            hidden: true
        });
    }

    toggleClearBtn() {
        this.setState({
            btnClearVisible: !this.state.btnClearVisible
        });
    }

    clearSearchText() {
        this.setState({ searchText: "" });
    }

    render() {
        var categories = this.props.categories;
        var ui = [];

        for (var i = 0, l = categories.length; i < l; i++) {
            ui.push(<SearchCategoryItem item={categories[i]} click={this.props.click } />);
        };

        return (
            <div className={"searchcategory-panel "+(this.state.hidden?"":"active")}>
                <div className="searchcategory-panel-search">
                    <antd.Input.Group>
                        <antd.Input ref={(input)=>this.searchText=input} onChange={e=>this.setState({ searchText: e.target.value })} value={this.state.searchText} onFocus={e=>this.toggleClearBtn()} onBlur={e=>this.toggleClearBtn()} size="large" placeholder="请输入搜索关键字..." />
                        <antd.Icon onClick={e=>this.clearSearchText()} className={"btn-search-clear " + (this.state.btnClearVisible ?  "active" : "")} type="close-circle" />
                        <div className="ant-input-group-wrap">
                            <antd.Button onClick={e=>this.btnClick()} type="primary" icon="search" size="large" />
                        </div>
                    </antd.Input.Group>
                </div>
                {ui}
                <div onClick={e=>this.hidden()} className="searchcategory-panel-sliderup">
                    <antd.Icon type="caret-up" />
                </div>
            </div>
        );
    }
}