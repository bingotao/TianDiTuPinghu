using JXGIS.Common.BaseLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JXGIS.TianDiTuPinghu.Web.Controllers
{
    public class UpgradeBrowserController : Controller
    {
        // GET: UpgradeBrowser
        public ActionResult Index()
        {
            try
            {
                var browsers = SystemUtils.Config.Browsers;
                ViewBag.chrome = browsers.chrome;
                ViewBag.ie = browsers.ie;
                ViewBag.firefox = browsers.firefox;
                ViewBag.qh360 = browsers.qh360;
            }
            catch (Exception ex)
            {

            }

            return View();
        }

    }
}