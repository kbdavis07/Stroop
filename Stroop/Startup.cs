using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Stroop.Startup))]
namespace Stroop
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
