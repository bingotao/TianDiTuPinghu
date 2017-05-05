class ServiceSearchBar extends React.Component {
    constructor(props) {
        super();
        this.state = {
            searchText: "",
            btnClearVisible: false
        }
    }

    getSearchText() {
        return this.state.searchText;
    }

    clearSearchText() {
        this.setState({ searchText: "" });
    }

    toggleClearBtn() {
        this.setState({ btnClearVisible: !this.state.btnClearVisible });
    }

    render() {
        return (
        <div className="serivce-searchbar">
            <antd.Input.Group>
                <antd.Input ref="input" onChange={e=>this.setState({ searchText: e.target.value })} value={this.state.searchText} onFocus={e=>this.toggleClearBtn()} onBlur={e=>this.toggleClearBtn()} size="large" placeholder="搜索服务..." />
                    <antd.Icon onClick={this.clearSearchText.bind(this)} className={"btn-search-clear " + (this.state.btnClearVisible ?  "active" : "")} type="close-circle" />
                        <div className="ant-input-group-wrap">
                            <antd.Button onClick={this.props.search} type="primary" icon="search" size="large" />
                        </div>
            </antd.Input.Group>
        </div>
        );
    }
}

class ServiceResults extends React.Component {
    constructor(props) {
        super();
        this.state = {
            services: props.services || []
        };
    }

    filter(categories, searchText) {
        var types = [];
        var dataTypes = [];
        for (var i = 0, l = categories.length; i < l ; i++) {
            var ct = categories[i];
            if (ct.type) types.push(ct.type);
            if (ct.dataType) dataTypes.push(ct.dataType);
        }
        var cThis = this;
        $.post('GetServices', {
            types: types,
            dataTypes: dataTypes,
            searchText: searchText
        }, function (rt) {
            if (rt.ErrorMessage) {
                commonTool.info.showError(rt.ErrorMessage);
            }
            else {
                var services = rt.Data;
                cThis.setState({ services: services });
            }
        }, 'json');
    }

    render() {
        var services = this.state.services;
        var total = services.length;
        var cServices = [];
        for (var i = 0, l = services.length; i < l ; i++) {
            cServices.push(<ServiceResultItem item={services[i] } />);
        }

        return (
        <div className="service-result">
            <div className="service-result-total">共找到 <span>{total}</span> 个服务</div>
            <div className="service-result-list">
                {cServices}
            </div>
        </div>
        );
    }
}

class ServiceResultItem extends React.Component {
    constructor(props) {
        super();
    }

    onError() {
        this.refs.img.src = _bl_ + "/Reference/image/none-picture.png";
    }

    render() {
        var item = this.props.item;
        var title = item.Name;
        var type = item.ServiceType;
        var description = item.Description;
        var address = item.Address;
        var metadata = item.MetaData;
        var img = item.ImageUrl ? (_bl_ + item.ImageUrl) : null;

        return (
        <div className="service-item clearfix">
            <h3 className="service-item-title">{title}</h3>
            <div style={{ marginTop: '10px' }} className="clearfix">
                <img ref="img" onError={this.onError.bind(this)} src={img} />
                <div className="service-item-content">
                    <div>服务类型：{type}</div>
                    <div>服务简介：{description}</div>
                    <div>服务地址：{address}</div>
                    <div>服务元数据：{metadata}</div>
                </div>
            </div>
        </div>);
    }
}