using JXGIS.Common.Entity;

namespace JXGIS.TianDiTuPinghu.Business
{
    public class PlanningOptions
    {

        public PlanningOptions() { }
        public PlanningOptions(LngLat Begin, LngLat End, int TripMode, int PlanningType)
        {
            this.Begin = Begin;
            this.End = End;
            this.TripMode = TripMode;
            this.PlanningType = PlanningType;
        }

        public LngLat Begin { get; set; }
        public LngLat End { get; set; }
        public int PlanningType { get; set; }
        public int TripMode { get; set; }
    }
}
