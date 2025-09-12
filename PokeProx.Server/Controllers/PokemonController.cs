using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace PokeProx.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PokemonController : ControllerBase
    {
        private readonly ILogger<PokemonController> _logger;
        private readonly HttpClient _httpClient;

        public PokemonController(ILogger<PokemonController> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetPokemon(string name)
        {
            var apiUrl = $"https://pokeapi.co/api/v2/pokemon/{name}";
            var response = await _httpClient.GetAsync(apiUrl);

            if (!response.IsSuccessStatusCode)
            {
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return NotFound($"Pokemon '{name}' not found.");
                }
                else
                {
                    return StatusCode((int)response.StatusCode, "Error retrieving data from PokeAPI.");
                }

            }
            /*
            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
            */
            var content = await response.Content.ReadAsStreamAsync();
            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var result = new
            {
                id = root.GetProperty("id").GetInt32(),
                name = root.GetProperty("name").GetString(),
                image1 = root.GetProperty("sprites").GetProperty("front_shiny").GetString(),
                image2 = root.GetProperty("sprites").GetProperty("front_default").GetString()
            };

            return Ok(result);
        }


        
    }
}
