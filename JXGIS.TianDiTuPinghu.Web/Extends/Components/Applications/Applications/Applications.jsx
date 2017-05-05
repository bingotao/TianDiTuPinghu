class Application extends React.Component {
    constructor() {
        super();
    }

    onError() {
        this.refs.img.src = _bl_ + "/Reference/image/none-picture.png";
    }

    render() {
        var item = this.props.app;
        var title = item.Name;
        var description = item.Description;
        var appUrl = item.Url || '#';
        var imgUrl = item.ImageUrl;

        return (
         <div className="app-item clearfix">
             <img ref="img" onError={this.onError.bind(this)} src={_bl_+imgUrl} />
              <div>
                  <h3><a target='_blank' href={appUrl}>{title}</a></h3>
                  <p>{description}</p>
              </div>
         </div>
        );
    }
}

class ApplicationPanel extends React.Component {
    constructor() {
        super();
    }

    render() {
        var apps = this.props.apps;
        var cApps = [];
        for (var i = 0, l = apps.length; i < l; i++) {
            cApps.push(<Application app={apps[i] } />);
        }

        return (
            <div>
                {cApps}
            </div>
            );

    }
}
$(function () {
    ReactDOM.render(<ApplicationPanel apps={config.apps } />, document.getElementById("applist"));
});