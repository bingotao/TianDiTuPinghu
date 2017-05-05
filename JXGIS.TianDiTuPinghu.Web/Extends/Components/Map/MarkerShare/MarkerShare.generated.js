﻿// @hash v3-EF2A09655BDBE818872B045B926B139E2D8C6497
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 3.0.1 (build 0) with Babel 6.7.7
// Generated at: 2017/5/3 14:46:58
///////////////////////////////////////////////////////////////////////////////
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Share = function (_React$Component) {
    _inherits(Share, _React$Component);

    function Share(props) {
        _classCallCheck(this, Share);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Share).call(this, props));

        _this.state = {
            id: '',
            title: '',
            content: '',
            onSharing: false,
            layer: null
        };

        _this.shareDOM = props.shareDOM;
        return _this;
    }

    _createClass(Share, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var clipboard = new Clipboard(this.refs.copyAddress);

            clipboard.on('success', function (e) {
                _g.fun.showSuccess('复制成功！');
            });
        }
    }, {
        key: 'onShareing',
        value: function onShareing() {
            this.setState({ onSharing: true });
        }
    }, {
        key: 'unShareing',
        value: function unShareing() {
            this.setState({ onSharing: false });
        }
    }, {
        key: 'createMarkerShare',
        value: function createMarkerShare() {
            var obj = {
                id: null,
                title: this.state.title,
                content: this.state.content,
                geoJson: JSON.stringify(this.state.layer.toGeoJSON())
            };

            this.onShareing();

            $.post('CreateMarkerShare', obj, function (cThis) {
                return function (rt) {
                    if (rt.ErrorMessage) {
                        _g.fun.showError(rt.ErrorMessage);
                    } else {
                        var markerShare = rt.Data.MarkerShare;
                        var shareContent = {
                            id: markerShare.ID,
                            title: markerShare.Title,
                            content: markerShare.Content
                        };
                        cThis.setState(shareContent);
                        _g.fun.showSuccess('分享成功！');
                    }
                    cThis.unShareing();
                };
            }(this), 'json');
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var id = this.state.id;
            var title = this.state.title;
            var content = this.state.content;
            var address = window.location.origin + _bl_ + '/Map/Index?markershare=' + this.state.id;
            var onSharing = this.state.onSharing;

            return React.createElement(
                'div',
                { className: 'map-draw-share' },
                React.createElement(
                    'h3',
                    null,
                    '标记'
                ),
                React.createElement(
                    'h4',
                    null,
                    '标题'
                ),
                React.createElement('input', { className: 'ct-input', ref: 'titleInput', onChange: function onChange(e) {
                        return _this2.setState({ title: e.target.value });
                    }, type: 'text', value: title || '', disabled: id ? true : false }),
                React.createElement(
                    'h4',
                    null,
                    '内容'
                ),
                React.createElement('textarea', { className: 'ct-input', onChange: function onChange(e) {
                        return _this2.setState({ content: e.target.value });
                    }, value: content || '', disabled: id ? true : false }),
                React.createElement(
                    'div',
                    { style: { display: id ? 'block' : 'none' } },
                    React.createElement(
                        'h4',
                        null,
                        '链接'
                    ),
                    React.createElement('input', { value: address, type: 'text', disabled: true }),
                    React.createElement(
                        'button',
                        { ref: 'copyAddress', 'data-clipboard-text': address },
                        '复制链接'
                    )
                ),
                React.createElement(
                    'button',
                    { onClick: function onClick(e) {
                            return _this2.createMarkerShare();
                        }, className: onSharing ? 'onsharing' : '', disabled: onSharing, style: { display: id ? 'none' : 'block' } },
                    onSharing ? '正在生成分享链接...' : '分享',
                    ' '
                )
            );
        }
    }]);

    return Share;
}(React.Component);

Share.createShare = function () {
    var shareDOM = $("<div></div>")[0];
    var share = ReactDOM.render(React.createElement(Share, { shareDOM: shareDOM }), shareDOM);
    return share;
};