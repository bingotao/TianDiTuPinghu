using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Common.Entity
{
    public class NearestPOI
    {
        public string FEATUREGUID { get; set; }

        public string FCODE { get; set; }

        public string NAME { get; set; }

        public string SHORTNAME { get; set; }

        public string ALIASNAME { get; set; }

        public string ADDRESS { get; set; }

        public double CENTERX { get; set; }

        public double CENTERY { get; set; }

        public string TYPE { get; set; }

        public string PHONE { get; set; }

        public string WEBSITE { get; set; }

        public string PHOTO { get; set; }

        public int FSCALE { get; set; }

        public string STYLENAME { get; set; }

        public LngLat LNGLAT { get { return new LngLat(this.CENTERX, this.CENTERY); } }

        public double X { get { return this.CENTERX; } }

        public double Y { get { return this.CENTERY; } }

        public string[] PHOTOS
        {
            get { return string.IsNullOrWhiteSpace(this.PHOTO) ? null : this.PHOTO.Split(','); }
        }

        public double Distance
        {
            get;
            set;
        }

        public bool IsPOI
        {
            get
            {
                return this.Distance < 50;
            }
        }
    }
}
