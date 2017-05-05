class SearchResultItem extends React.Component {
    constructor(props) {
        super();
    }

    onClick(e) {
        if (this.props.click) {
            this.props.click(this.props.item);
        }
    }

    onHover(e) {
        if (this.props.hover) {
            this.props.hover(this.props.item);
        }
    }

    onError() {
        this.refs.img.src = _bl_ + "/Reference/image/none-picture.png";
    }

    render() {
        var item = this.props.item;

        return (
        <div className='searchresult-item' onMouseEnter={(e)=>this.onHover(e)} onClick={ (e)=>this.onClick(e)}>
            <antd.Row>
                <antd.Col span={3}>
                    <div className="searchresult-item-index">{item.INDEX}</div>
                </antd.Col>
                <antd.Col span={13}>
                    <div className="searchresult-item-shortname">{item.SHORTNAME}</div>
                    <div className="searchresult-item-address"><antd.Icon type="environment" /> {item.ADDRESS}</div>
                    <div className="searchresult-item-phone"><antd.Icon type="phone" /> {item.PHONE}</div>
                </antd.Col>
                <antd.Col span={8}>
                    <img ref="img" onError={this.onError.bind(this)} src={item.PHOTO} />
                </antd.Col>
            </antd.Row>
        </div>
        );
    }
}

class SearchResultPanel extends React.Component {
    constructor(props) {
        super();
        this.keywords = [''];
        this.pageSize = props.pageSize || 30;
        this.clickHidden = false;
        this.state = {
            rows: [],
            total: 0,
            hidden: true,
            pageNumber: 1
        };
    }

    pageChange(noop) {
        console.log(`${noop}\n`);
        console.log(this);
    }

    show() {
        this.setState({
            hidden: false
        });
    }

    hidden(click) {
        this.clickHidden = click ? true : false;
        if (click) {
            this.clear();
        }
        this.setState({
            hidden: true
        });
    }

    clear() {
        this.keywords = null;
        this.types = null;
        this.center = null;
        this.radius = null;

        this.props.map.poiItems.clearLayers();
        if (this.props.map.areaSearchLayer) {
            this.props.map.areaSearchLayer.remove();
            this.props.map.areaSearchLayer = null;
        }
        this.setState({ rows: [] });
    }

    toggle() {
        this.setState({
            hidden: !this.state.hidden
        });
    }

    getPOI(fitMap, keyword, categories, pagenumber, center, radius) {
        this.clickHidden = false;
        this.keywords = keyword || this.keywords;
        this.types = categories || this.types;
        this.center = center || this.center;
        if (this.center) {
            this.center = {
                lat: this.center.lat,
                lng: this.center.lng
            };
        }
        this.radius = radius || this.radius;
        var c_this = this;
        var pageNumber = pagenumber ? pagenumber : 1
        this.setState({
            pageNumber: pageNumber
        });

        $.post(this.props.url,
            {
                keywords: this.keywords,
                types: this.types,
                pagesize: this.pageSize,
                pagenumber: pageNumber,
                centerpoint: this.center,
                radius: this.radius
            },
            function (rt) {
                if (!rt.ErrorMessage) {
                    var data = rt.Data.Data;
                    c_this.setState({
                        rows: data.Results,
                        total: data.Count,
                        hidden: false
                    });
                    c_this.props.map.loadPOIs(data.Results, fitMap);
                } else {
                    _g.fun.showError(rt.ErrorMessage);
                }
            }, 'json');
    }

    componentDidUpdate() {
        if (!L.Browser.webkit) {
            var $scroll = this.$scroll;
            if ($scroll) {
                $scroll.mCustomScrollbar("scrollTo", "top");
            } else {
                this.$scroll = $('.searchresult-panel .searchresult-panelbody').mCustomScrollbar({
                    theme: "dark-blue",
                    scrollInertia: 0
                });
            }
        }
    }

    render() {
        var rows = this.state.rows;
        var items = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            row.INDEX = (i + 1);
            items.push(<SearchResultItem click={this.props.click} hover={this.props.hover} item={row } />);
        }
        return (
        <div className={"searchresult-panel "+(this.state.hidden?"":"active")}>
            <span onClick={e=>this.hidden(true)} className="btn-search-fallback">返回</span>
            <div className="searchresult-total">搜索到 <span> {this.state.total} </span> 条结果</div>
            <div className="searchresult-panelbody">
                <div>
                    { items }
                </div>
            </div>
            <div className="searchresult-pagination clearfix">
                <antd.Pagination current={this.state.pageNumber} pageSize={this.pageSize} onChange={e=>this.getPOI(true,null, null, e)} size="small" total={this.state.total} />
            </div>
        </div>
        );
    }
}