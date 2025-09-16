using Microsoft.AspNetCore.Mvc;

namespace PokeProx.Server.Controllers
{
    public class PokeStoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
