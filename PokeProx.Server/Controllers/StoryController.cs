using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PokeProx.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StoryController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public StoryController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost]
        public async Task<IActionResult> GenerateStory([FromBody] JsonElement payload)
        {
            // Prepare prompt from Pokémon data
            var prompt = $"Write a fun story about these two Pokémon:\n\n" +
                         $"Pokemon 1: {payload.GetProperty("pokemon1").GetRawText()}\n" +
                         $"Pokemon 2: {payload.GetProperty("pokemon2").GetRawText()}";

            var lmStudioRequest = new
            {
                model = "openai/gpt-oss-20b",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                temperature = 0.7,
                max_tokens = 500
            };

            var content = new StringContent(JsonSerializer.Serialize(lmStudioRequest), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("http://localhost:1234/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "LM Studio request failed.");

            var result = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(result);
            var story = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

            return Ok(new { story });
        }
    }
}