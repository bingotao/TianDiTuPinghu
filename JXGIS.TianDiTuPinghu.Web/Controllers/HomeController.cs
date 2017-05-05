using JXGIS.Common.BaseLib;
using JXGIS.TianDiTuPinghu.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JXGIS.TianDiTuPinghu.Web.Controllers
{
    public class HomeController : Controller
    {
        private static EFDbContext efDbContext = SystemUtils.EFDbContext;

        public ActionResult Index()
        {
            try
            {
                //  获取典型应用
                dynamic home = SystemUtils.Config.Home;
                home["Apps"] = AppUtils.GetJArrayApps();
                
                //  新闻消息显示的个数
                int count = (int)home.NewsCount;
                //  新闻消息
                var news = efDbContext.News
                    .Where(p => p.IsValid == 1)
                    .OrderByDescending(p => p.Publishdate)
                    .Take(count).ToList();

                ViewBag.Home = home.ToString();
                ViewBag.News = Newtonsoft.Json.JsonConvert.SerializeObject(news);
            }
            catch
            {
                ViewBag.Home = "{Apps:[]}";
                ViewBag.News = "[]";
            }
            return View();
        }
    }
}