class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: '',
            active: false
        };
    }

    search() {
        //console.log(this.state.searchText);
        window.open(encodeURI(_bl_ + '/Map/Map?searchText=' + this.state.searchText));
    }

    toggleState() {
        this.setState({
            active: !this.state.active
        });
    }

    clearText() {
        this.setState({
            searchText: ''
        });
    }

    render() {
        return (
        <div className={"searchgroup " + (this.state.active ? "active" : "")}>
            <input onKeyDown={e=> { if (e.nativeEvent.code == "Enter") this.search(); }} onBlur={e=>this.toggleState()} onFocus={e=>this.toggleState()} onChange={e=>this.setState({ searchText: e.target.value })} type="text" placeholder="请输入查询关键字" value={this.state.searchText} />
                <span onClick={e=>this.clearText()} className="btnclear anticon anticon-close-circle"></span>
                <button onClick={e=>this.search()} type="button"><span className="anticon anticon-search"></span></button>
        </div>);
    }
}

class News extends React.Component {
    constructor() {
        super();
    }

    render() {
        var news = this.props.news;
        var cNews = [];
        for (var i = 0, l = news.length; i < l; i++) {
            var title = news[i].Title;
            var url = news[i].Url || '#';
            cNews.push(<div><a className="new-a" target="_blank" href={url }>{title}</a></div>);
        }
        return (
            <div className="news">
                <antd.Row>
                    <antd.Col className="gutter-row" span={4}>
                        <span style={{ lineHeight: "27px" }}><span className="iconfont icon-laba"></span> 最新公告：</span>
                    </antd.Col>
                    <antd.Col className="gutter-row" span={20}>
                       <antd.Carousel autoplaySpeed={3000} autoplay={true} dots={false} vertical={true}>
                           {cNews}
                       </antd.Carousel>
                    </antd.Col>
                </antd.Row>

            </div>
            );
    }
}

class Uses extends React.Component {
    constructor() {
        super();
    }

    render() {
        var uses = this.props.uses;
        var cUses = [];
        for (var i = 0, l = uses.length; i < l; i++) {
            var use = uses[i];
            var url = use.Url || '#';
            var imageUrl = _bl_ + use.ImageUrl;
            var name = use.Name;
            var description = use.Description;
            cUses.push(
            <div>
                <div className="app-item">
                    <a href={url} target="_blank"><img src={imageUrl} /></a>
                    <div>
                        <a title={name} className="app-item-title" href={url} target="_blank">{name}</a>
                        <p title={description }>{description}</p>
                    </div>
                </div>
            </div>);
        }

        return (
            <div>
                <div className="ct-slider-pre" onClick={e=>this.refs.slider.refs.slick.slickPrev()}>
                <antd.Icon type="left" />
                </div>
                <antd.Carousel ref="slider" autoplaySpeed={3000} autoplay={true} arrows={true} slidesToShow={4} dots={false}>
                    {cUses}
                </antd.Carousel>
                <div className="ct-slider-next" onClick={e=>this.refs.slider.refs.slick.slickNext()}>
                <antd.Icon type="right" />
                </div>
            </div>
            );
    }
}

function init() {
    var cSearch = ReactDOM.render(<Search />, $('#searchgroup')[0]);
    var typicaluse_uses = config.Apps;
    cUses = ReactDOM.render(<Uses uses={typicaluse_uses } />, $('#typicaluse_uses')[0]);
    var cNews = ReactDOM.render(<News news={news } />, $('#news')[0]);

    //初始化切换说明
    (function () {
        var $sections = $('.section');
        var $lis = $('.apps li');
        var firstIndex = 0;
        var aCls = 'active';
        var autoPlay = true;
        var autoPlayIndex = firstIndex;
        var itemCount = 4;

        change();
        setInterval(change, 1000 * 7);

        function change() {
            if (autoPlay) {
                var index = autoPlayIndex % itemCount;
                autoPlayIndex++;
                $sections.removeClass(aCls);
                $($sections.get(index)).addClass(aCls);
            }
        }

        //鼠标浮上时切换到目标页并停止自动切换
        $lis.hover(function () {
            var index = $lis.index(this);
            $sections.removeClass(aCls);
            $($sections.get(index)).addClass(aCls);
            autoPlay = false;
        }, function () {
            autoPlay = true;
        });

        //鼠标浮上时停止自动切换
        $sections.hover(function () {
            autoPlay = false;
        }, function () {
            autoPlay = true;
        });
    })();

    g = {
        search: cSearch,
        uses: cUses,
        news: cNews
    };
}

$(init);