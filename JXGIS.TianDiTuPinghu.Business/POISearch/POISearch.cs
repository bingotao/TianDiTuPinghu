using JXGIS.Common.BaseLib;
using JXGIS.Common.Entity;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.TianDiTuPinghu.Business
{
    public class POISearch
    {
        private static EFDbContext _context = SystemUtils.EFDbContext;
        private static int _maxPageSize = (int)SystemUtils.Config.POI.MaxPageSize;
        public static POIResult Search(POISearchParameters SearchParas)
        {
            var sp = SearchParas;
            return Search(sp.Keywords, sp.Types, sp.PageNumber, sp.PageSize, sp.CenterPoint, sp.Radius, sp.Point1, sp.Point2);
        }

        public static POI GetPOI(string id)
        {
            return _context.POI.Find(id);
        }

        /// <summary>
        /// 兴趣点查询
        /// </summary>
        /// <param name="Keywords">关键字组</param>
        /// <param name="Types">类型组</param>
        /// <param name="PageNumber">页数（从1开始）</param>
        /// <param name="PageSize">页容量</param>
        /// <param name="CenterPoint">中心点位置</param>
        /// <param name="Radius">搜索半径</param>
        /// <param name="Point1">Extent Point1</param>
        /// <param name="Point2">Extent Point2</param>
        /// <returns></returns>
        public static POIResult Search
            (
                string[] Keywords,
                string[] Types = null,
                int PageNumber = 1,
                int PageSize = 10,
                LngLat CenterPoint = null,
                double? Radius = 0,
                LngLat Point1 = null,
                LngLat Point2 = null
            )
        {
            if (Keywords != null && Keywords.Length > 0 && PageSize > 0 && PageNumber > 0)
            {
                PageNumber = PageNumber - 1;

                PageSize = PageSize > _maxPageSize ? _maxPageSize : PageSize;

                //中心点搜素
                if (CenterPoint != null && Radius > 0)
                    return SearchInRadius(Keywords, Types, PageNumber, PageSize, CenterPoint, (double)Radius);
                //矩形查询
                else if (Point1 != null && Point2 != null)
                    return SearchInBounds(Keywords, Types, PageNumber, PageSize, Point1, Point2);
                //普通查询
                else
                    return SearchByKeywords(Keywords, Types, PageNumber, PageSize);
            }
            return new POIResult();
        }

        /// <summary>
        /// 半径内查询
        /// </summary>
        /// <param name="Keywords"></param>
        /// <param name="Types"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="CenterPoint"></param>
        /// <param name="Radius"></param>
        /// <returns></returns>
        private static POIResult SearchInRadius
            (
                string[] Keywords,
                string[] Types,
                int PageNumber,
                int PageSize,
                LngLat CenterPoint,
                double Radius
            )
        {
            POIResult poiResult = new POIResult();

            List<object> paras = new List<object>();
            string baseSQL = @"select featureguid,fcode,name,shortname,aliasname,address,labelx,labely,centerx,centery,type,phone,website,photo,fscale,stylename,usource,updatetime,updatestatus from poi t where 1=1 ";
            string keywordsConditon = string.Empty;

            for (int i = 0, l = Keywords.Length; i < l; i++)
            {
                string kWord = Keywords[i];
                keywordsConditon += " and t.name like :t" + i;
                paras.Add(new OracleParameter(":t" + i, "%" + kWord + "%"));
            }
            baseSQL += keywordsConditon;

            if (Types != null && Types.Length > 0)
            {
                string typeCondition = string.Empty;
                for (int i = 0, l = Types.Length; i < l; i++)
                {
                    var type = Types[i];
                    typeCondition += ":t" + i + ",";
                    paras.Add(new OracleParameter(":t" + i, type));
                }
                typeCondition = " and t.fcode in (" + typeCondition.Trim(',') + ")";
                baseSQL += typeCondition;
            }

            baseSQL += @" and sdo_within_distance(geometry,sdo_geometry(:point, 4326),:radius) = 'TRUE'";
            string sqlCount = string.Format(@"select count(*) from ({0})", baseSQL);
            paras.Add(new OracleParameter(":point", string.Format("POINT({0} {1})", CenterPoint.lng, CenterPoint.lat)));
            paras.Add(new OracleParameter(":radius", string.Format("distance={0} unit=m", Radius)));

            var count = _context.Database.SqlQuery<int>(sqlCount, paras.ToArray());
            poiResult.Count = count.ToList().First();

            baseSQL += " order by fscale asc";
            string sqlList = string.Format(@"select * from (select t.*,rownum rn from ({0})t where rownum<=:endCount) where rn>:beginCount", baseSQL);

            paras.Add(new OracleParameter(":endCount", (PageNumber + 1) * PageSize));
            paras.Add(new OracleParameter(":beginCount", PageNumber * PageSize));

            var results = _context.Database.SqlQuery<POI>(sqlList, paras.ToArray());
            poiResult.Results = results.ToList();
            return poiResult;
        }

        /// <summary>
        /// 矩形范围查询
        /// </summary>
        /// <param name="Keywords"></param>
        /// <param name="Types"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <param name="Point1"></param>
        /// <param name="Point2"></param>
        /// <returns></returns>
        private static POIResult SearchInBounds
            (
                string[] Keywords,
                string[] Types,
                int PageNumber,
                int PageSize,
                LngLat Point1,
                LngLat Point2
            )
        {
            POIResult poiResult = new POIResult();
            double x1 = Math.Min(Point1.lng, Point2.lng);
            double y1 = Math.Min(Point1.lat, Point2.lat);
            double x2 = Math.Max(Point1.lng, Point2.lng);
            double y2 = Math.Max(Point1.lat, Point2.lat);

            var query = GetBaseQuery(Keywords, Types)
                        .Where(
                            p =>
                               p.CENTERX >= x1 && p.CENTERX <= x2
                               &&
                               p.CENTERY >= y1 && p.CENTERY <= y2
                        );
            poiResult.Count = query.Count();
            query = OrderAndTakePage(query, PageNumber, PageSize);
            poiResult.Results = query.ToList();
            return poiResult;
        }

        public static object QuickSearch(string keyWord)
        {
            if (string.IsNullOrWhiteSpace(keyWord))
                return new List<object>();
            var query = (from p in _context.POI
                         where p.NAME.Contains(keyWord)
                         orderby p.FSCALE ascending
                         select new
                         {
                             SHORTNAME = p.SHORTNAME,
                             STYLENAME = p.STYLENAME,
                             X = p.CENTERX,
                             Y = p.CENTERY
                         }).Take(10);
            return query.ToList();
        }


        /// <summary>
        /// 关键字查询
        /// </summary>
        /// <param name="Keywords"></param>
        /// <param name="Types"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <returns></returns>
        private static POIResult SearchByKeywords
            (
                string[] Keywords,
                string[] Types,
                int PageNumber,
                int PageSize
            )
        {
            POIResult poiResult = new POIResult();
            var query = GetBaseQuery(Keywords, Types);
            poiResult.Count = query.Count();
            query = OrderAndTakePage(query, PageNumber, PageSize);
            poiResult.Results = query.ToList();
            return poiResult;
        }


        public static NearestPOI GetNearestPOI(LngLat lnglat)
        {
            var baseSQL = @"select featureguid, fcode, name, shortname, aliasname, address, labelx, labely, centerx, centery, type, phone, website, photo, fscale, stylename, usource, updatetime, updatestatus,
SDO_NN_DISTANCE(1) distance
from poi t where sdo_nn(t.geometry, sdo_geometry(:point, 4326),1) = 'TRUE' and rownum=1";
            string pointStr = string.Format("POINT({0} {1})", lnglat.lng, lnglat.lat);
            return _context.Database.SqlQuery<NearestPOI>(baseSQL, new OracleParameter(":point", pointStr)).ToList().First();
        }

        /// <summary>
        /// 排序并提取当页内容
        /// </summary>
        /// <param name="query"></param>
        /// <param name="PageNumber"></param>
        /// <param name="PageSize"></param>
        /// <returns></returns>
        private static IQueryable<POI> OrderAndTakePage
            (
                IQueryable<POI> query,
                int PageNumber,
                int PageSize
            )
        {
            return query
                   .OrderBy(p => p.FSCALE)
                   .Skip(PageSize * PageNumber).Take(PageSize);
        }

        /// <summary>
        /// 构建基础查询
        /// </summary>
        /// <param name="Keywords"></param>
        /// <param name="Types"></param>
        /// <returns></returns>
        private static IQueryable<POI> GetBaseQuery
            (
                string[] Keywords,
                string[] Types
            )
        {
            var query = from poi in _context.POI select poi;

            foreach (string keyword in Keywords)
            {
                if (!string.IsNullOrWhiteSpace(keyword))
                {
                    query = query.Where(p => p.NAME.Contains(keyword));
                }
            }


            if (Types != null && Types.Length > 0)
            {
                Expression<Func<POI, bool>> queryType = null;

                foreach (string type in Types)
                {
                    queryType = queryType == null ? p => p.FCODE.IndexOf(type) == 0 : queryType.Or(p => p.FCODE.IndexOf(type) == 0);
                }
                query = query.Where(queryType);
            }

            return query;
        }
    }
}
