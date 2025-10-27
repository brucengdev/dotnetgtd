using Backend.WebApi.ActionFilters;
using Microsoft.AspNetCore.Mvc;


namespace Backend.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class DataController:ControllerBase
{
    [HttpPut("[action]")]
    [ServiceFilter<SecurityFilterAttribute>]
    public ActionResult Import()
    {
        return Ok();
    }
}