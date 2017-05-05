class ServiceTypeFilterItem extends React.Component {
    constructor(props) {
        super();
        this.state = {
            selected: false
        };
    }

    change() {
        this.props.search();
    }

    isSelected() {
        return this.state.selected;
    }

    selectItem() {
        if (!this.state.selected) {
            this.state.selected = true;
            this.change();
            this.setState({ selected: true });
        }
    }

    unselectItem() {
        if (this.state.selected) {
            this.state.selected = false;
            this.change();
            this.setState({ selected: false });
        }
    }

    render() {
        var filter = this.props.filter;
        var name = filter.name;

        return (
            <div className={"servicetype-filter-item "+(this.state.selected?'active':'')}>
                <span onClick={this.selectItem.bind(this)}>
                    {name}
                </span>
                <antd.Icon onClick={this.unselectItem.bind(this)} type="close-circle" />
            </div>
            );
    }
}

class ServiceTypeFilter extends React.Component {
    constructor(props) {
        super();
    }

    getCategories() {
        var categories = [];
        for (var name in this.refs) {
            if (name.startsWith("filter")) {
                var ref = this.refs[name];
                if (ref.isSelected()) {
                    categories.push(ref.props.filter);
                }
            }
        }
        return categories;
    }

    render() {
        var category = this.props.category;
        var title = category.title;
        var filters = category.filters;
        var cFilters = [];
        for (var i = 0, l = filters.length; i < l; i++) {
            var filter = filters[i];
            cFilters.push(<ServiceTypeFilterItem search={this.props.search} ref={"filter" + i} filter={filter } />);
        }

        return (
            <div className="servicetype-filter">
                <div className="servicetype-filter-name">{title}</div>
                {cFilters}
            </div>
            );
    }
}