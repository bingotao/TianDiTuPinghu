using JXGIS.Common.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.TianDiTuPinghu.Business
{
    public class DrivingResult
    {

        public static DrivingResult Parse(string jsonText)
        {
            dynamic jsonResult = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonText);
            dynamic result = jsonResult.result;

            DrivingResult rlt = new DrivingResult();

            rlt.StartPoint = GetLngLat(result.orig.ToString());
            rlt.EndPoint = GetLngLat(result.dest.ToString());

            double distance = 0;
            if (result.distance != null) double.TryParse(result.distance.ToString(), out distance);
            rlt.Distance = "约" + Math.Round(distance, 2, MidpointRounding.AwayFromZero) + "公里";

            double time = 0;
            if (result.duration != null) double.TryParse(result.duration.ToString(), out time);
            rlt.Time = GetTime(time);

            rlt.RoutePath = GetRoutePath(result.routelatlon.ToString());

            rlt.Routes = new List<string>();

            foreach (var item in result.routes.item)
            {
                rlt.Routes.Add(item.strguide.ToString().Trim(',', '，', '。'));
            }

            rlt.CenterInfo = new MapInfo()
            {
                Center = GetLngLat(result.mapinfo.center.ToString()),
                Scale = (int)result.mapinfo.scale
            };
            return rlt;
        }

        public static string GetTime(double time)
        {
            var hours = (int)(time / 3600);
            string hourStr = hours == 0 ? string.Empty : hours + "小时";
            var minute = (int)(time % 3600 / 60);
            return "约" + hourStr + minute + "分钟";

        }

        public static LngLat GetLngLat(string text)
        {
            string[] cor = text.Split(',');
            var lng = double.Parse(cor[0]);
            var lat = double.Parse(cor[1]);
            return new LngLat(lng, lat);
        }

        public static List<List<double>> GetRoutePath(string text)
        {
            List<List<double>> routePath = new List<List<double>>();
            string[] pairs = text.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string pair in pairs)
            {
                string[] cors = pair.Split(',');
                routePath.Add(new List<double>() { double.Parse(cors[1]), double.Parse(cors[0]) });
            }
            return routePath;
        }

        public LngLat StartPoint { get; set; }

        public LngLat EndPoint { get; set; }

        public string Distance { get; set; }

        public string Time { get; set; }

        public List<List<double>> RoutePath { get; set; }

        public List<string> Routes { get; set; }

        public MapInfo CenterInfo { get; set; }
    }

    public class MapInfo
    {
        public LngLat Center { get; set; }

        public int Scale { get; set; }
    }
}
