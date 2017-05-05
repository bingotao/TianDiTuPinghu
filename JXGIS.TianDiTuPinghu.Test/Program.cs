using JXGIS.Common.BaseLib;
using JXGIS.Common.Entity;
using JXGIS.TianDiTuPinghu.Business;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace JXGIS.TianDiTuPinghu.Test
{
    class Program
    {
        static void Main(string[] args)
        {

            //ReturnObject ro = new ReturnObject(new Exception("呵呵"));

            //ReturnObject ro1 = new ReturnObject(new DataTable("1"));

            //ro1.AddData("DataTable", new DataTable("2"));

            //var str = SystemUtility.BaseUrl;

            //var poi = POISearch.GetNearestPOI(new LngLat(121.096888766, 30.6005635700001));


            //var s = ServiceUtilities.Get("http://mp.weixin.qq.com/profile?src=3&timestamp=1482890472&ver=1&signature=J-UcWxLdqsCExpQqICEHwjVkaqh0Th7IORH-AHkL7lvMXqDOwvKnrtjW1goi-RnPlmgZHPer8AkcxujQU9kyYA==", Encoding.UTF8);
            //var i = s.IndexOf("{\"list\":[{");
            //var j = s.IndexOf("seajs.use(\"sougou/profile.js\");");

            //var t = s.Substring(i, j - i).Trim().Trim(';');

            //            var regStr = @"(?x)
            //{
            //    [^{}]*
            //    (
            //       (  (?'k'{)  [^{}]*  )+
            //       (  (?'-k'}) [^{}]*  )+
            //    )*
            //    (?(k)(?!))
            //}";

            //            Regex rg = new Regex(regStr);
            //            var matchs = rg.Matches(s);
            //            foreach (Match match in matchs)
            //            {
            //                var v = match.Value;
            //            }

            var news = SystemUtils.EFDbContext.News.ToArray();
            //.Where(p => p.IsValid == 1)
            //.OrderByDescending(p => p.Publishdate)
            //.Take(5).ToList();

            var n = new News();
        }
    }
}
