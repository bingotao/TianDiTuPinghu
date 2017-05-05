class QuickSearchResultItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        var item = this.props.item;
        return (
            <div className="qk-sc-pl-item" onClick={e=>this.props.itemClick(this.props.item)}>
                <antd.Icon type="search" />
                <span className="qk-sc-pl-item-shortname">{item.SHORTNAME}</span>
                <span>{item.STYLENAME}</span>
            </div>
        );
    }

}

class QuickSearchResults extends React.Component {
    constructor() {
        super();
        this.state = {
            results: []
        };
    }

    render() {
        var results = this.state.results;
        var rltItems = [];
        for (var i = 0, l = results.length; i < l; i++) {
            rltItems.push(<QuickSearchResultItem itemClick={this.props.itemClick} item={results[i] } />);
        }

        return (
        <div className="quicksearchresults-panel">
            {rltItems}
        </div>
        );
    }
}