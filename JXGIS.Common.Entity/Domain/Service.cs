using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JXGIS.Common.Entity
{
    [Table("SERVICE")]
    public class Service
    {
        [Key]
        [Column("SVC_ID")]
        public string ID { get; set; }

        [Column("SVC_NAME")]
        public string Name { get; set; }

        [Column("SVC_DESCRIPTION")]
        public string Description { get; set; }

        [Column("SVC_ADDRESS")]
        public string Address { get; set; }

        [Column("SVC_SERVICETYPE")]
        public string ServiceType { get; set; }

        [Column("SVC_METADATA")]
        public string MetaData { get; set; }

        [Column("SVC_IMAGEURL")]
        public string ImageUrl { get; set; }

        [Column("SVC_DATATYPE")]
        public string DataType { get; set; }
    }
}
