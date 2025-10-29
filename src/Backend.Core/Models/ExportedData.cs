using System.Text.Json.Serialization;

namespace Backend.Models;

public class ExportedData
{
    [JsonPropertyName("projects")]
    public List<ExportedProject> Projects { get; set; }
}

public class ExportedProject
{
    [JsonPropertyName("completed")]
    public bool Completed { get; set; }
    
    [JsonPropertyName("later")]
    public bool Later { get; set; }
    
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("description")]
    public string Description { get; set; }
}