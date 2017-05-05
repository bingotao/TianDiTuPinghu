using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Common.Entity
{
    [Table("MARKERSHARE")]
    public class MarkerShare
    {

        public MarkerShare()
        {
            this.ID = Guid.NewGuid().ToString();
            this.CreateTime = DateTime.Now;
        }

        [Column("MS_ID")]
        [Key]
        public string ID { get; set; }

        [Column("MS_TITLE")]
        public string Title { get; set; }

        [Column("MS_CONTENT")]
        public string Content { get; set; }

        [Column("MS_GEOJSON")]
        public string GeoJSON { get; set; }

        [Column("CREATETIME")]
        public DateTime CreateTime { get; set; }
    }
}
