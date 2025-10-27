using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Microsoft.AspNetCore.Mvc;


namespace Backend.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class DataController:ControllerBase
{
    private readonly IDataManager _dataManager;
    public DataController(IDataManager dm)
    {
        _dataManager = dm;
    }
    
    [HttpPut("[action]")]
    [ServiceFilter<SecurityFilterAttribute>]
    public ActionResult Import([FromBody] UserData data)
    {
        _dataManager.Import(data);
        return Ok();
    }
}