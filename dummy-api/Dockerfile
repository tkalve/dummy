FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY DummyApi.slnx ./
COPY src/DummyApi/DummyApi.csproj src/DummyApi/
RUN dotnet restore

COPY . .
RUN dotnet publish src/DummyApi/DummyApi.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/healthz || exit 1

ENTRYPOINT ["dotnet", "DummyApi.dll"]
