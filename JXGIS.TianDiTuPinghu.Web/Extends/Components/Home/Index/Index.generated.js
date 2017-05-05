﻿// @hash v3-7B384A0E64372497C3C2A65C7F447FA61380DCB4
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 3.0.1 (build 0) with Babel 6.7.7
// Generated at: 2017/5/3 14:46:56
///////////////////////////////////////////////////////////////////////////////
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_React$Component) {
    _inherits(Search, _React$Component);

    function Search() {
        _classCallCheck(this, Search);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Search).call(this));

        _this.state = {
            searchText: '',
            active: false
        };
        return _this;
    }

    _createClass(Search, [{
        key: 'search',
        value: function search() {
            //console.log(this.state.searchText);
            window.open(encodeURI(_bl_ + '/Map/Map?searchText=' + this.state.searchText));
        }
    }, {
        key: 'toggleState',
        value: function toggleState() {
            this.setState({
                active: !this.state.active
            });
        }
    }, {
        key: 'clearText',
        value: function clearText() {
            this.setState({
                searchText: ''
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                { className: "searchgroup " + (this.state.active ? "active" : "") },
                React.createElement('input', { onKeyDown: function onKeyDown(e) {
                        if (e.nativeEvent.code == "Enter") _this2.search();
                    }, onBlur: function onBlur(e) {
                        return _this2.toggleState();
                    }, onFocus: function onFocus(e) {
                        return _this2.toggleState();
                    }, onChange: function onChange(e) {
                        return _this2.setState({ searchText: e.target.value });
                    }, type: 'text', placeholder: '请输入查询关键字', value: this.state.searchText }),
                React.createElement('span', { onClick: function onClick(e) {
                        return _this2.clearText();
                    }, className: 'btnclear anticon anticon-close-circle' }),
                React.createElement(
                    'button',
                    { onClick: function onClick(e) {
                            return _this2.search();
                        }, type: 'button' },
                    React.createElement('span', { className: 'anticon anticon-search' })
                )
            );
        }
    }]);

    return Search;
}(React.Component);

var News = function (_React$Component2) {
    _inherits(News, _React$Component2);

    function News() {
        _classCallCheck(this, News);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(News).call(this));
    }

    _createClass(News, [{
        key: 'render',
        value: function render() {
            var news = this.props.news;
            var cNews = [];
            for (var i = 0, l = news.length; i < l; i++) {
                var title = news[i].Title;
                var url = news[i].Url || '#';
                cNews.push(React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'a',
                        { className: 'new-a', target: '_blank', href: url },
                        title
                    )
                ));
            }
            return React.createElement(
                'div',
                { className: 'news' },
                React.createElement(
                    antd.Row,
                    null,
                    React.createElement(
                        antd.Col,
                        { className: 'gutter-row', span: 4 },
                        React.createElement(
                            'span',
                            { style: { lineHeight: "27px" } },
                            React.createElement('span', { className: 'iconfont icon-laba' }),
                            ' 最新公告：'
                        )
                    ),
                    React.createElement(
                        antd.Col,
                        { className: 'gutter-row', span: 20 },
                        React.createElement(
                            antd.Carousel,
                            { autoplaySpeed: 3000, autoplay: true, dots: false, vertical: true },
                            cNews
                        )
                    )
                )
            );
        }
    }]);

    return News;
}(React.Component);

var Uses = function (_React$Component3) {
    _inherits(Uses, _React$Component3);

    function Uses() {
        _classCallCheck(this, Uses);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Uses).call(this));
    }

    _createClass(Uses, [{
        key: 'render',
        value: function render() {
            var _this5 = this;

            var uses = this.props.uses;
            var cUses = [];
            for (var i = 0, l = uses.length; i < l; i++) {
                var use = uses[i];
                var url = use.Url || '#';
                var imageUrl = _bl_ + use.ImageUrl;
                var name = use.Name;
                var description = use.Description;
                cUses.push(React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'app-item' },
                        React.createElement(
                            'a',
                            { href: url, target: '_blank' },
                            React.createElement('img', { src: imageUrl })
                        ),
                        React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'a',
                                { title: name, className: 'app-item-title', href: url, target: '_blank' },
                                name
                            ),
                            React.createElement(
                                'p',
                                { title: description },
                                description
                            )
                        )
                    )
                ));
            }

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'ct-slider-pre', onClick: function onClick(e) {
                            return _this5.refs.slider.refs.slick.slickPrev();
                        } },
                    React.createElement(antd.Icon, { type: 'left' })
                ),
                React.createElement(
                    antd.Carousel,
                    { ref: 'slider', autoplaySpeed: 3000, autoplay: true, arrows: true, slidesToShow: 4, dots: false },
                    cUses
                ),
                React.createElement(
                    'div',
                    { className: 'ct-slider-next', onClick: function onClick(e) {
                            return _this5.refs.slider.refs.slick.slickNext();
                        } },
                    React.createElement(antd.Icon, { type: 'right' })
                )
            );
        }
    }]);

    return Uses;
}(React.Component);

function init() {
    var cSearch = ReactDOM.render(React.createElement(Search, null), $('#searchgroup')[0]);
    var typicaluse_uses = config.Apps;
    cUses = ReactDOM.render(React.createElement(Uses, { uses: typicaluse_uses }), $('#typicaluse_uses')[0]);
    var cNews = ReactDOM.render(React.createElement(News, { news: news }), $('#news')[0]);

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