using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JXGIS.Common.Entity
{
    [Table("NEWS")]
    public class News
    {
        [Key]
        [Column("N_ID")]
        public string ID { get; set; } = Guid.NewGuid().ToString();

        [Column("N_TITLE")]
        public string Title { get; set; }

        [Column("N_URL")]
        public string Url { get; set; }

        [Column("N_KEYWORDS")]
        public string Keywords { get; set; }

        [Column("N_PUBLISHDATE")]
        public DateTime Publishdate { get; set; } = DateTime.Now;

        [Column("N_PUBLISHER")]
        public string Publisher { get; set; }

        [Column("N_ISVALID")]
        public int? IsValid { get; set; } = 1;

    }
}