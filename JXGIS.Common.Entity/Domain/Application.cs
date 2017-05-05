using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace JXGIS.Common.Entity
{
    [Table("APPLICATION")]
    public class Application
    {
        [Key]
        [Column("APP_ID")]
        public string ID { get; set; }

        [Column("APP_NAME")]
        public string Name { get; set; }

        [Column("APP_DESCRIPTION")]
        public string Description { get; set; }

        [Column("APP_IMGURL")]
        public string ImageUrl { get; set; }

        [Column("APP_URL")]
        public string Url { get; set; }

        [Column("APP_KEYWORDS")]
        public string Keywords { get; set; }

    }
}
