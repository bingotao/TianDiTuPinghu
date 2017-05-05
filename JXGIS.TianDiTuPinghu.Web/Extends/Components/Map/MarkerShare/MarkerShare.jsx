class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            content: '',
            onSharing: false,
            layer: null
        };

        this.shareDOM = props.shareDOM;
    }

    componentDidMount() {
        var clipboard = new Clipboard(this.refs.copyAddress);

        clipboard.on('success', function (e) {
            _g.fun.showSuccess('复制成功！');
        });
    }

    onShareing() {
        this.setState({ onSharing: true });
    }

    unShareing() {
        this.setState({ onSharing: false });
    }

    createMarkerShare() {
        var obj = {
            id: null,
            title: this.state.title,
            content: this.state.content,
            geoJson: JSON.stringify(this.state.layer.toGeoJSON())
        };

        this.onShareing();

        $.post('CreateMarkerShare', obj, (function (cThis) {
            return function (rt) {
                if (rt.ErrorMessage) {
                    _g.fun.showError(rt.ErrorMessage);
                }
                else {
                    var markerShare = rt.Data.MarkerShare;
                    var shareContent = {
                        id: markerShare.ID,
                        title: markerShare.Title,
                        content: markerShare.Content
                    };
                    cThis.setState(shareContent);
                    _g.fun.showSuccess('分享成功！');
                }
                cThis.unShareing()
            }

        })(this), 'json');
    }

    render() {
        var id = this.state.id;
        var title = this.state.title;
        var content = this.state.content;
        var address = window.location.origin + _bl_ + '/Map/Index?markershare=' + this.state.id;
        var onSharing = this.state.onSharing;

        return (
            <div className="map-draw-share">
                <h3>标记</h3>
                <h4>标题</h4>
                <input className="ct-input" ref="titleInput" onChange={e =>this.setState({ title: e.target.value })} type="text" value={title || ''} disabled={id ? true : false } />
                <h4>内容</h4>
                <textarea className="ct-input" onChange={e =>this.setState({ content: e.target.value })} value={content || ''} disabled={id ? true : false }></textarea>
                <div style={{ display: (id ? 'block':'none' )} }>
                <h4>链接</h4>
                <input value={address} type="text" disabled />
                <button ref='copyAddress' data-clipboard-text={address }>复制链接</button>
                </div>
                <button onClick={e =>this.createMarkerShare()} className={onSharing ? 'onsharing' : ''} disabled={onSharing} style={{ display: id ? 'none' : 'block' } }>{onSharing ? '正在生成分享链接...' : '分享'} </button>
            </div>
            );
    }

}

Share.createShare = function () {
    var shareDOM = $("<div></div>")[0];
    var share = ReactDOM.render(<Share shareDOM={shareDOM } />, shareDOM);
    return share;
}