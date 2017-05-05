using JXGIS.Common.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Common.BaseLib
{
    public class EFDbContext : DbContext
    {


        public EFDbContext() : base((string)SystemUtils.Config.DbConStr)
        {
            this.Database.Initialize(false);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            string connectionString = (string)SystemUtils.Config.DbConStr;
            int indexOf = connectionString.IndexOf("USER ID", StringComparison.OrdinalIgnoreCase);
            string str = connectionString.Substring(indexOf);
            int startIndexOf = str.IndexOf("=", StringComparison.OrdinalIgnoreCase);
            int lastIndexOf = str.IndexOf(";", StringComparison.OrdinalIgnoreCase);
            string uid = str.Substring(startIndexOf + 1, lastIndexOf - startIndexOf - 1).Trim().ToUpper();
            modelBuilder.HasDefaultSchema(uid);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public DbSet<POI> POI { get; set; }

        public DbSet<MarkerShare> MarkerShare { get; set; }

        public DbSet<Correcting> Correcting { get; set; }

        public DbSet<Application> Application { get; set; }

        public DbSet<Service> Service { get; set; }

        public DbSet<News> News { get; set; }
    }
}