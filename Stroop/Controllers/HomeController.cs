using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Stroop.Models;

namespace Stroop.Controllers
{
    public class HomeController : Controller
    {

        private Report db = new Report();

        public ActionResult Index()
        {
            var Results = from r in db.TestResults select r;

            Results = Results.OrderBy(r => r.TotalScore).Take(10);

            return View(Results.ToList());

            //return View(db.TestResults.ToList());
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}