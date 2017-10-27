﻿using System;
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
            ViewData["Message"] = "Roster page";

            return View();
        }
        
        public IActionResult ListView()
        {
            ViewData["Message"] = "List view page";

            return View();
        }
        
        public IActionResult DetailView()
        {
            ViewData["Message"] = "Detail view page";

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
        
        public IActionResult Tabs()
        {
            ViewData["Message"] = "UI Elements such as tabs, modals, panels, etc";

            return View();
        }
        
        public IActionResult Modals()
        {
            ViewData["Message"] = "";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}