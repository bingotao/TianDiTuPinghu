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
    public class MapController : Controller
    {
        private static EFDbContext _efDbContext = SystemUtils.EFDbContext;

        // GET: Map
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Map()
        {
            ViewBag.Map = SystemUtils.Config.Map.ToString();
            return View();
        }

        public ActionResult MapMobile()
        {
            ViewBag.Map = SystemUtils.Config.Map.ToString();
            return View();
        }

        public ActionResult SearchPOI(POISearchParameters SearchParameters)
        {
            ReturnObject2 ro = null;
            try
            {
                POIResult poiResult = POISearch.Search(SearchParameters);
                ro = new ReturnObject2();
                ro.AddData("Data", poiResult);
            }
            catch (Exception ex)
            {
                ro = new ReturnObject2(ex.Message);
            }
            return Json(ro);
        }

        public ActionResult GetPOI(string id)
        {
            ReturnObject2 ro = null;
            try
            {
                POI poi = _efDbContext.POI.Find(id);
                if (poi != null)
                {
                    ro = new ReturnObject2();
                    ro.Data.Add("POI", poi);
                }
                else
                {
                    ro = new ReturnObject2("未找到指定的兴趣点！");
                }
            }
            catch (Exception ex)
            {
                ro = new ReturnObject2(ex.Message);
            }
            return Json(ro);
        }


        public ActionResult QuickSearch(string keyWord)
        {
            ReturnObject2 ro = null;
            try
            {
                object result = POISearch.QuickSearch(keyWord);
                ro = new ReturnObject2();
                ro.AddData("rows", result);
            }
            catch (Exception ex)
            {
                ro = new ReturnObject2(ex.Message);
            }
            return Json(ro);
        }

        public ActionResult GetNearestPOI(LngLat lngLat)
        {
            ReturnObject ro = null;
            try
            {
                NearestPOI poi = POISearch.GetNearestPOI(lngLat);
                ro = new ReturnObject(poi);
            }
            catch (Exception ex)
            {
                ro = new ReturnObject(ex);
            }

            return Json(ro);
        }

        public ActionResult CreateMarkerShare(MarkerShare markerShare)
        {
            ReturnObject2 ro = null;
            try
            {
                if (markerShare != null && !string.IsNullOrEmpty(markerShare.GeoJSON))
                {
                    MarkerShare markerShareNew = new MarkerShare();
                    markerShareNew.Title = markerShare.Title;
                    markerShareNew.Content = markerShare.Content;
                    markerShareNew.GeoJSON = markerShare.GeoJSON;

                    markerShareNew = _efDbContext.MarkerShare.Add(markerShareNew);
                    _efDbContext.SaveChanges();

                    ro = new ReturnObject2();
                    ro.Data.Add("MarkerShare", markerShareNew);
                }
                else
                {
                    throw new Exception("标注或标注图形缺失");
                }
            }
            catch (Exception ex)
            {
                ro = new ReturnObject2(ex.Message);
            }

            return Json(ro);
        }

        public ActionResult GetMarkerShare(string id)
        {
            ReturnObject2 ro = null;
            try
            {
                if (!string.IsNullOrEmpty(id))
                {
                    MarkerShare markerShareNew = _efDbContext.MarkerShare.Find(id);
                    if (markerShareNew != null)
                    {
                        ro = new ReturnObject2();
                        ro.Data.Add("MarkerShare", markerShareNew);
                    }
                    else
                    {
                        throw new Exception("未找到标注或标注已过期！");
                    }
                }
                else
                {
                    throw new Exception("未找到标注或标注已过期！");
                }
            }
            catch (Exception ex)
            {
                ro = new ReturnObject2(ex.Message);
            }

            return Json(ro);
        }


        public ActionResult GetRoutePlanning(PlanningOptions options)
        {
            ReturnObject2 ro = null;
            try
            {
                var route = RoutePlanning.GetRoute(options);
                object result = null;
                if (options.TripMode == 1)
                    result = BusRoute.Parse(route);
                else
                    result = DrivingResult.Parse(route);
                ro = new ReturnObject2();
                ro.AddData("route", result);
            }
            catch (Exception ex)
            {
                ro = new ReturnObject2(ex.Message);
            }

            return Json(ro);
        }

        /// <summary>
        /// 创建新的地图纠错
        /// </summary>
        /// <param name="correcting"></param>
        /// <returns></returns>
        public ActionResult CreateCorrecting(Correcting correcting)
        {
            ReturnObject2 ro = new ReturnObject2();
            try
            {
                var newCorrecting = new Correcting();

                newCorrecting.ErrorType = correcting.ErrorType;
                newCorrecting.ErrorDescription = correcting.ErrorDescription;
                newCorrecting.ContactInfo = correcting.ContactInfo;
                newCorrecting.CreateTime = DateTime.Now;
                newCorrecting.POI_ID = correcting.POI_ID;
                newCorrecting.X = correcting.X;
                newCorrecting.Y = correcting.Y;

                _efDbContext.Correcting.Add(newCorrecting);
                _efDbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                ro = new ReturnObject2(ex.Message);
            }
            return Json(ro);
        }
    }
}