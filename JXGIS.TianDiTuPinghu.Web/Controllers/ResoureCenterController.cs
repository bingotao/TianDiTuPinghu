using JXGIS.Common.BaseLib;
using JXGIS.Common.Entity;
using JXGIS.TianDiTuPinghu.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JXGIS.TianDiTuPinghu.Web.Controllers
{
    public class ResourceCenterController : Controller
    {

        public ActionResult GetServices(string[] types, string[] dataTypes, string searchText)
        {
            ReturnObject ro = null;
            try
            {
                var services = SystemUtils.EFDbContext.Service.ToList();


                var resultServices = services
                                .Where(c => (types == null || types.Length == 0) ? true : types.Contains(c.ServiceType))
                                .Where(c => string.IsNullOrEmpty(searchText) ? true : c.Name.Contains(searchText.Trim()))
                                .Where(c => (dataTypes == null || dataTypes.Length == 0) ? true : dataTypes.Contains(c.DataType))
                                .ToList();
                ro = new ReturnObject(resultServices);
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex, false);
            }

            return Json(ro);
        }

        // GET: ResoureCenter
        public ActionResult Services()
        {
            ViewBag.Navs = Newtonsoft.Json.JsonConvert.DeserializeObject<string[,]>(SystemUtils.Config.ResourceCenter.Navs.ToString());
            ViewBag.SelectedNav = "服务展示";
            ViewBag.Categories = SystemUtils.Config.Services.Categories.ToString();
            return View();
        }

        public ActionResult Applications()
        {
            ViewBag.Navs = Newtonsoft.Json.JsonConvert.DeserializeObject<string[,]>(SystemUtils.Config.ResourceCenter.Navs.ToString());
            ViewBag.SelectedNav = "典型应用";
            try
            {
                ViewBag.Apps = AppUtils.GetJArrayApps().ToString();
            }
            catch
            {
                ViewBag.Apps = "[]";
            }

            return View();
        }

        public ActionResult DataAchievements()
        {
            ViewBag.Navs = Newtonsoft.Json.JsonConvert.DeserializeObject<string[,]>(SystemUtils.Config.ResourceCenter.Navs.ToString());
            ViewBag.SelectedNav = "地信成果";
            return View();
        }
    }
}