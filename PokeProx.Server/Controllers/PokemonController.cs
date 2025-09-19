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
            _httpClient = httpClientFactory.CreateClient("pokeapi");
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetPokemon(string name)
        {
            var response = await _httpClient.GetAsync($"pokemon/{name}");

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

            var content = await response.Content.ReadAsStreamAsync();
            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var abilities = root.GetProperty("abilities")
                .EnumerateArray()
                .Select(a => a.GetProperty("ability").GetProperty("name").GetString())
                .ToList();

            var types = root.GetProperty("types")
                .EnumerateArray()
                .Select(t => t.GetProperty("type").GetProperty("name").GetString())
                .ToList();

            var stats = root.GetProperty("stats")
                .EnumerateArray()
                .Select(s => new {
                    name = s.GetProperty("stat").GetProperty("name").GetString(),
                    base_stat = s.GetProperty("base_stat").GetInt32()
                })
                .ToList();

            var result = new
            {
                id = root.GetProperty("id").GetInt32(),
                name = root.GetProperty("name").GetString(),
                image1 = root.GetProperty("sprites").GetProperty("front_default").GetString(),
                base_experience = root.GetProperty("base_experience").GetInt32(),
                height = root.GetProperty("height").GetInt32(),
                weight = root.GetProperty("weight").GetInt32(),
                abilities,
                types,
                stats
            };

            return Ok(result);
        }


        
    }
}
