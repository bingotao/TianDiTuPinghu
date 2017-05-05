using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Common.Entity
{
    [Table("CORRECTING")]
    public class Correcting
    {
        public Correcting()
        {
            this.ID = Guid.NewGuid().ToString();
        }

        [Key]
        [Column("C_ID")]
        public string ID { get; set; }

        [Column("POI_ID")]
        public string POI_ID { get; set; }

        [Column("ERROR_TYPE")]
        public string ErrorType { get; set; }

        [Column("ERROR_DESCRIPTION")]
        public string ErrorDescription { get; set; }

        [Column("CREATE_TIME")]
        public DateTime CreateTime { get; set; }

        [Column("EXECUTE_STATE")]
        public string ExecuteState { get; set; }

        [Column("EXECUTE_TIME")]
        public DateTime ExecuteTime { get; set; }

        [Column("EXECUTE_PERSON_ID")]
        public string ExecutePersonID { get; set; }

        [Column("CONTACTINFO")]
        public string ContactInfo { get; set; }

        [Column("X")]
        public double X { get; set; }

        [Column("Y")]
        public double Y { get; set; }

        [NotMapped]
        public LngLat LngLat { get { return new LngLat(this.X, this.Y); } }
    }
}
