using JXGIS.Common.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.TianDiTuPinghu.Business
{
    public class POISearchParameters
    {
        public string[] Keywords { get; set; }
        public string[] Types { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public LngLat CenterPoint { get; set; }
        public double Radius { get; set; }
        public LngLat Point1 { get; set; }
        public LngLat Point2 { get; set; }
    }
}
