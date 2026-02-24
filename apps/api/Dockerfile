FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src

COPY Bookshelf.Core/Bookshelf.Core.csproj Bookshelf.Core/
RUN dotnet restore Bookshelf.Core/Bookshelf.Core.csproj

COPY Bookshelf.Core/. Bookshelf.Core/
WORKDIR /src/Bookshelf.Core
RUN dotnet publish Bookshelf.Core.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Bookshelf.Core.dll"]
