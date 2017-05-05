using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Common.Entity
{
    public class LngLat
    {
        public LngLat() { }
        public LngLat(double lng, double lat)
        {
            this.lat = lat;
            this.lng = lng;
        }

        public double lat { get; set; }

        public double lng { get; set; }
    }
}