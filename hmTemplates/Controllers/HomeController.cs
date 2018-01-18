using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace hmTemplates.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Dashboards()
        {
            ViewData["Message"] = "Dashboards";

            return View();
        }
        
        public IActionResult Login()
        {
            ViewData["Message"] = "Login page";

            return View();
        }
        public IActionResult Rosters()
        {
            ViewData["Message"] = "Roster Pages";

            return View();
        }

        public IActionResult SearchPages()
        {
            ViewData["Message"] = "";

            return View();
        }

        public IActionResult LeftColumn()
        {
            ViewData["Message"] = "";

            return View();
        }

        public IActionResult RightColumn()
        {
            ViewData["Message"] = "";

            return View();
        }

        public IActionResult HorizontalForms()
        {
            ViewData["Message"] = "Different form layouts";

            return View();
        }
        
        public IActionResult VerticalForms()
        {
            ViewData["Message"] = "Different form layouts";

            return View();
        }
        
        public IActionResult Filters()
        {
            ViewData["Message"] = "";

            return View();
        }
        
        public IActionResult Tabs()
        {
            ViewData["Message"] = "";

            return View();
        }
        
        public IActionResult Modals()
        {
            ViewData["Message"] = "";

            return View();
        }
        public IActionResult Panels()
        {
            ViewData["Message"] = "";

            return View();
        }
        public IActionResult Error()
        {
            return View();
        }
        public IActionResult Images()
        {
            return View();
        }
        public IActionResult ScratchPad()
        {
            return View();
        }
    }
}
