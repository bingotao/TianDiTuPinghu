using JXGIS.Common.BaseLib;
using JXGIS.Common.Entity;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.TianDiTuPinghu.Business
{
    public class AppUtils
    {

        public static List<Application> GetApps()
        {
            return SystemUtils.EFDbContext.Application.ToList();
        }

        public static JArray GetJArrayApps()
        {
            var apps = GetApps();
            return JArray.FromObject(apps);
        }

    }
}
