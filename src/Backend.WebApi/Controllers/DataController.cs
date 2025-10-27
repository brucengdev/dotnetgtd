using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Microsoft.AspNetCore.Mvc;


namespace Backend.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class DataController:ControllerBase
{
    public DataController(IDataManager _)
    {
        
    }
    
    [HttpPut("[action]")]
    [ServiceFilter<SecurityFilterAttribute>]
    public ActionResult Import([FromBody] UserData _)
    {
        return Ok();
    }
}