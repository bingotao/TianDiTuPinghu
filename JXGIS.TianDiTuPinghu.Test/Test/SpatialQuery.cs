using JXGIS.Common.BaseLib;
using JXGIS.Common.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.TianDiTuPinghu.Test
{
    public class SpatialQuery
    {
        public static void Query()
        {
            var sql = @"
select featureguid,fcode,name,shortname,aliasname,address,labelx,labely,centerx,centery,type,phone,website,photo,fscale,stylename,usource,updatetime,updatestatus 
from poi t 
where sdo_within_distance(
      geometry, 
      sdo_geometry('POINT(121.108998 30.837612)',4326), 
      'distance=' || 500 || ' unit=m'
      ) = 'TRUE'";

            var query = SystemUtils.EFDbContext.Database.SqlQuery<POI>(sql);

            var list = query.ToList();
        }
    }
}
