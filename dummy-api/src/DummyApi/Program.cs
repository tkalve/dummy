var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();

// .__(.)< (mjau)
// \___)


var app = builder.Build();

app.MapGet("/api/inspect", (HttpRequest request) =>
{
    var headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());

    var envVars = Environment.GetEnvironmentVariables()
        .Cast<System.Collections.DictionaryEntry>()
        .OrderBy(e => e.Key.ToString())
        .ToDictionary(e => e.Key.ToString()!, e => e.Value?.ToString() ?? "");

    var networkInterfaces = System.Net.NetworkInformation.NetworkInterface.GetAllNetworkInterfaces()
        .Where(nic => nic.OperationalStatus == System.Net.NetworkInformation.OperationalStatus.Up)
        .SelectMany(nic => nic.GetIPProperties().UnicastAddresses)
        .Select(addr => addr.Address.ToString())
        .Where(addr => !addr.StartsWith("127.") && addr != "::1")
        .ToList();

    var result = new
    {
        timestamp = DateTime.UtcNow,
        host = new
        {
            machineName = Environment.MachineName,
            osDescription = System.Runtime.InteropServices.RuntimeInformation.OSDescription,
            osArchitecture = System.Runtime.InteropServices.RuntimeInformation.OSArchitecture.ToString(),
            processArchitecture = System.Runtime.InteropServices.RuntimeInformation.ProcessArchitecture.ToString(),
            dotnetVersion = Environment.Version.ToString(),
            processorCount = Environment.ProcessorCount,
            ipAddresses = networkInterfaces,
        },
        process = new
        {
            pid = Environment.ProcessId,
            workingDirectory = Environment.CurrentDirectory,
            uptimeSeconds = (int)(DateTime.UtcNow - System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime()).TotalSeconds,
        },
        environmentVariables = envVars,
        requestHeaders = headers,
    };

    return Results.Ok(result);
});

app.MapHealthChecks("/api/healthz");

app.Run();
