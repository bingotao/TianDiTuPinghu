using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JXGIS.Common.Entity
{
    [Table("POI")]
    public class POI
    {
        [Key, Column("FEATUREGUID")]
        public string FEATUREGUID { get; set; }

        [Column("FCODE")]
        public string FCODE { get; set; }

        [Column("NAME")]
        public string NAME { get; set; }

        [Column("SHORTNAME")]
        public string SHORTNAME { get; set; }

        [Column("ALIASNAME")]
        public string ALIASNAME { get; set; }

        [Column("ADDRESS")]
        public string ADDRESS { get; set; }

        [Column("CENTERX")]
        public double CENTERX { get; set; }

        [Column("CENTERY")]
        public double CENTERY { get; set; }

        [Column("TYPE")]
        public string TYPE { get; set; }

        [Column("PHONE")]
        public string PHONE { get; set; }

        [Column("WEBSITE")]
        public string WEBSITE { get; set; }

        [Column("PHOTO")]
        public string PHOTO { get; set; }

        [Column("FSCALE")]
        public int FSCALE { get; set; }

        [Column("STYLENAME")]
        public string STYLENAME { get; set; }

        [NotMapped]
        public LngLat LNGLAT { get { return new LngLat(this.CENTERX, this.CENTERY); } }

        [NotMapped]
        public double X { get { return this.CENTERX; } }

        [NotMapped]
        public double Y { get { return this.CENTERY; } }

        [NotMapped]
        public string[] PHOTOS
        {
            get { return string.IsNullOrWhiteSpace(this.PHOTO) ? null : this.PHOTO.Split(','); }
        }
    }
}