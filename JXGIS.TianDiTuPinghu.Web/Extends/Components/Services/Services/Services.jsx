class ServicePanel extends React.Component {
    constructor(props) {
        super(props);
    }

    getCategories() {
        var categories = [];
        for (var name in this.refs) {
            if (name.startsWith("category")) {
                var cts = this.refs[name].getCategories();
                categories = categories.concat(cts);
            }
        }
        return categories;
    }

    searchService() {
        var categories = this.getCategories();
        var searchText = this.refs.searchBar.getSearchText();
        var searchResults = this.refs.searchResults;
        searchResults.filter(categories, searchText);
    }

    render() {
        var categories = this.props.categories;
        var cCategories = [];
        for (var i = 0, l = categories.length; i < l; i++) {
            var category = categories[i];
            cCategories.push(<ServiceTypeFilter search={this.searchService.bind(this)} ref={'category' + i} category={category } />);
        }

        var services = this.props.services;

        return (
        <div>
            <div className="left-side">
                {cCategories}
            </div>
            <div className="content-main">
                <ServiceSearchBar search={this.searchService.bind(this)} ref="searchBar" />
                <ServiceResults ref="searchResults" services={services} />
            </div>
        </div>
        );
    }
}

function init() {
    var categories = config.categories;
    
    cServicePanel = ReactDOM.render(
        <ServicePanel categories={categories} services={[] } />,
        document.getElementById('content'));
    cServicePanel.searchService();
}

$(init);