class Correcting extends React.Component {
    constructor(props) {
        super(props);

        var errortypes = {
            '0': '位置错误',
            '1': '名称错误',
            '9': '其他错误'
        };
        this.errortypes = errortypes;
        this.layer = props.layer;

        this.state = {
            poi_id: props.poi_id,
            errortype: errortypes['0'],
            errordescription: '',
            contactinfo: '',
            x: props.x,
            y: props.y
        };
    }

    errorTypeChange(e) {
        this.setState({
            errortype: e.target.value,
        });
    }

    commit() {
        var cThis = this;
        $.post('CreateCorrecting', this.state, function (rt) {
            if (rt.ErrorMessage) {
                _g.fun.showError(rt.ErrorMessage);
            } else {
                _g.fun.showSuccess('纠错信息已成功反馈，我们将及时处理并反馈！');
                cThis.layer.remove();
            }
        }, 'json');

    }

    render() {
        return (
        <div className='correcting'>
            <h3>地图纠错</h3>
            <h4>错误类型</h4>
    <div className="error-types">
            <antd.Radio.Group onChange={this.errorTypeChange.bind(this)} value={this.state.errortype}>
                <antd.Radio value={this.errortypes['0'] }>{this.errortypes['0']}</antd.Radio>
                <antd.Radio value={this.errortypes['1'] }>{this.errortypes['1']}</antd.Radio>
                <antd.Radio value={this.errortypes['9'] }>{this.errortypes['9']}</antd.Radio>
            </antd.Radio.Group>
    </div>
            <h4>错误描述</h4>
            <textarea className="ct-input" type="text" placeholder="错误描述信息" value={this.state.errordescription} onChange={e=>this.setState({ errordescription: e.target.value })}></textarea>
            <h4>联系方式</h4>
            <input className="ct-input" type="text" placeholder="有奖纠错，请留下您的联系方式" value={this.state.contactinfo} onChange={e=>this.setState({ contactinfo: e.target.value })} />
            <div className="correcting-btns clearfix">
                <antd.Button onClick={e=> { if (this.layer) this.layer.remove() }}>取消</antd.Button>
                <antd.Button onClick={this.commit.bind(this)} type="primary">确定</antd.Button>
            </div>
        </div>);
    }
}

Correcting.create = function (layer, poi_id) {
    var dom = document.createElement('div');
    var latlng = layer.getLatLng();
    var correcting = ReactDOM.render(<Correcting poi_id={poi_id} x={latlng.lng} y={latlng.lat} layer={layer } />, dom);
    correcting.dom = dom;
    return correcting;
}