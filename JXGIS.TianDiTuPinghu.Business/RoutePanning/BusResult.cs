using JXGIS.Common.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.TianDiTuPinghu.Business
{
    public class BusRoute
    {
        public static List<BusRoute> Parse(string jsonText)
        {
            dynamic json = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonText);
            List<BusRoute> rlts = new List<BusRoute>();
            try
            {
                dynamic lines = json.results[0].lines;
                foreach (var line in lines)
                {
                    BusRoute busRoute = new BusRoute();
                    busRoute.LineName = line.lineName.ToString();
                    busRoute.BusLines = new List<BusLine>();
                    double totalTime = 0;
                    double totalDistance = 0;

                    foreach (var segment in line.segments)
                    {
                        BusLine busLine = new BusLine();
                        busLine.Type = (int)segment.segmentType;

                        busLine.StartStation = new Station()
                        {
                            ID = segment.stationStart.uuid.ToString(),
                            Name = segment.stationStart.name.ToString(),
                            Point = DrivingResult.GetLngLat(segment.stationStart.lonlat.ToString())
                        };

                        busLine.EndStation = new Station()
                        {
                            ID = segment.stationEnd.uuid.ToString(),
                            Name = segment.stationEnd.name.ToString(),
                            Point = DrivingResult.GetLngLat(segment.stationEnd.lonlat.ToString())
                        };

                        var segmentLine = segment.segmentLine[0];
                        SegmentLine segLine = new SegmentLine();

                        segLine.ID = segmentLine.byuuid.ToString();
                        segLine.Direction = segmentLine.direction.ToString();
                        double distance = 0;
                        if (segmentLine.segmentDistance != null) double.TryParse(segmentLine.segmentDistance.ToString(), out distance);
                        totalDistance += distance;
                        segLine.Distance = "约" + (distance > 1000 ? Math.Round(distance / 1000, 2, MidpointRounding.AwayFromZero) + "公里" : Math.Round(distance, 0, MidpointRounding.AwayFromZero) + "米");

                        double segmentTime = 0;
                        if (segmentLine.segmentTime != null) double.TryParse(segmentLine.segmentTime.ToString(), out segmentTime);
                        totalTime += segmentTime;
                        segLine.Time = GetTime(segmentTime);

                        double transferTime = 0;
                        if (segmentLine.segmentTransferTime != null) double.TryParse(segmentLine.segmentTransferTime.ToString(), out transferTime);
                        totalTime += transferTime;
                        segLine.TransferTime = GetTime(transferTime);

                        segLine.WorkTime = segmentLine.SEndTime == null ? string.Empty : segmentLine.SEndTime.ToString();
                        segLine.LineName = segmentLine.lineName == null ? string.Empty : segmentLine.lineName.ToString();

                        var stationCount = segmentLine.segmentStationCount.ToString();
                        segLine.StationCount = string.IsNullOrWhiteSpace(stationCount) ? 0 : int.Parse(stationCount);
                        segLine.RoutePath = DrivingResult.GetRoutePath(segmentLine.linePoint.ToString());

                        busLine.Line = segLine;
                        busRoute.BusLines.Add(busLine);
                    }
                    busRoute.TotalTime = GetTime(totalTime);
                    busRoute.TotalDistance = "约" + (totalDistance >= 1000 ? Math.Round(totalDistance / 1000, 2, MidpointRounding.AwayFromZero) + "公里" : Math.Round(totalDistance, 0) + "米");

                    rlts.Add(busRoute);
                }
            }
            catch
            {
                rlts = new List<BusRoute>();
            }
            return rlts;
        }

        public static string GetTime(double time)
        {
            var hours = (int)(time / 60);
            string hourStr = hours == 0 ? string.Empty : hours + "小时";
            var minute = (int)(time % 60);
            return "约" + hourStr + minute + "分钟";

        }

        public string LineName { get; set; }

        public List<BusLine> BusLines { get; set; }

        public int TransferCount { get { return this.TransferBuses.Count; } }

        public List<string> TransferBuses
        {
            get
            {
                var lines = this.LineName.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);
                List<string> ls = new List<string>();
                foreach (var line in lines)
                {
                    ls.Add(line.Trim());
                }
                return ls;
            }
        }

        public string TotalTime { get; set; }

        public string TotalDistance { get; set; }
    }

    public class BusLine
    {
        public Station StartStation { get; set; }
        public Station EndStation { get; set; }

        public int Type { get; set; }

        public SegmentLine Line { get; set; }
    }

    public class Station
    {
        public LngLat Point { get; set; }

        public string Name { get; set; }

        public string ID { get; set; }
    }

    public class SegmentLine
    {
        public string ID { get; set; }

        public string LineName { get; set; }

        public int StationCount { get; set; }

        public string Time { get; set; }

        public string TransferTime { get; set; }

        public string Distance { get; set; }

        public string Direction { get; set; }

        public string WorkTime { get; set; }

        public List<List<double>> RoutePath { get; set; }
    }
}
