using JXGIS.Common.BaseLib;
using System.Text;
using System.Web;

namespace JXGIS.TianDiTuPinghu.Business
{
    public class RoutePlanning
    {
        /// <summary>
        /// 转译Url
        /// </summary>
        private static string _baseUrl = SystemUtils.Config.RoutePanning.Base;

        private static string _busUrl = SystemUtils.Config.RoutePanning.Bus;

        private static string _drivingUrl = SystemUtils.Config.RoutePanning.Driving;

        public static string GetRoute(PlanningOptions options)
        {
            var begin = options.Begin;
            var end = options.End;
            var tripMode = options.TripMode;
            var planningType = options.PlanningType;
            string getUrl = null;

            string result = null;
            switch (tripMode)
            {
                case 1:
                    getUrl = string.Format(RoutePlanning._busUrl, begin.lng, begin.lat, end.lng, end.lat, planningType);
                    //result = ServiceUtilities.Get(getUrl, Encoding.UTF8);
                    break;
                case 2:
                    getUrl = string.Format(RoutePlanning._drivingUrl, begin.lng, begin.lat, end.lng, end.lat, planningType);
                    break;
                default:
                    break;
            }

            // 单独的Url返回的为xml格式，使用baseUrl进行转译
            result = ServiceUtils.Get(_baseUrl + HttpUtility.UrlEncode(getUrl), Encoding.UTF8);
            var i = result.IndexOf('{');
            result = result.Substring(i).Trim(';');
            return result;
        }
    }
}
