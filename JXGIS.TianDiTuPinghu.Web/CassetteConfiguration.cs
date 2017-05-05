using Cassette;
using Cassette.Scripts;
using Cassette.Stylesheets;

namespace JXGIS.TianDiTuPinghu.Web2
{
    /// <summary>
    /// Configures the Cassette asset bundles for the web application.
    /// </summary>
    public class CassetteBundleConfiguration : IConfiguration<BundleCollection>
    {
        public void Configure(BundleCollection bundles)
        {
            var styleSheetSearch = new FileSearch() { Pattern = "*.css;*.less", SearchOption = System.IO.SearchOption.AllDirectories };
            var jsSearch = new FileSearch() { Pattern = "*.js;*.jsx", SearchOption = System.IO.SearchOption.AllDirectories };

            bundles.AddPerSubDirectory<ScriptBundle>("Extends/CommonJS");
            bundles.AddPerSubDirectory<StylesheetBundle>("Extends/Components", styleSheetSearch);
            bundles.AddPerSubDirectory<ScriptBundle>("Extends/Components", jsSearch);
        }
    }
}