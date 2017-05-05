using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using System.Data.OleDb;

namespace JXGIS.TianDiTuPinghu.Test
{
    public class DataImport
    {
        public static void Import()
        {
            string oraConStr = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=127.0.0.1)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=ORCL)));user id=tianditupinghu;Password=jxgis;";
            string odbConStr = @"provider = microsoft.jet.oledb.4.0; Data Source = E:\工作\文档\08天地图（平湖）\数据\天地图数据\tianditupinghu.mdb";

            string sqlTable = @"select featureguid,fcode,name,shortname,aliasname,address,labelx,labely,centerx,centery,type,phone,website,photo,fscale,stylename,usource,updatetime,updatestatus from poi";

            OracleDataAdapter oraAdapter = new OracleDataAdapter(sqlTable, oraConStr);
            OracleCommandBuilder oraComBuilder = new OracleCommandBuilder(oraAdapter);
            DataTable oraTable = new DataTable();
            oraAdapter.Fill(oraTable);

            DataTable odbTable = new DataTable();
            OleDbDataAdapter odbAdapter = new OleDbDataAdapter(sqlTable, odbConStr);
            odbAdapter.Fill(odbTable);


            var columns = odbTable.Columns;
            Type doubleType = typeof(double);

            foreach (DataRow odbRow in odbTable.Rows)
            {
                DataRow drNew = oraTable.NewRow();

                foreach (DataColumn column in columns)
                {
                    var data = odbRow[column];
                    if (data != DBNull.Value)
                    {
                        drNew[column.ColumnName] = data;
                    }
                }
                oraTable.Rows.Add(drNew);
            }

            oraAdapter.Update(oraTable);

            using (OracleConnection oraCon = new OracleConnection(oraConStr))
            {
                oraCon.Open();
                OracleCommand oraCom = new OracleCommand(@"update poi set geometry=sdo_geometry('POINT('||to_char(centerx)||' '||to_char(centery)||')',4326)", oraCon);
                var count = oraCom.ExecuteNonQuery();
                Console.WriteLine(count);
            }
        }
    }
}
