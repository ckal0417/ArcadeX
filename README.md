# Boocamp-vmtdev

Poyecto del boocmp de full stack de vmtdev

## Steam-Clone

Es un proyecto se va a realizar una aplicacion muy parecida a steam una plataforma de videojuegos

## Autores

Jefferson Veloz  
Cristofer Vera

## Creacion de DbContext y entidades de base datos usando Entity Framework

Ejecuta este comando para el programa se conecte a la base datos y puede crear el contexto y las entidades.

```shell
dotnet ef dbcontext scaffold "Server=localhost,1433;User=usuario;Password=contraseña;DataBase=NombreBaseDeDatos;TrustServerCertificate=True" Microsoft.EntityFrameworkCore.SqlServer --project Steam.Domain --startup-project Steam.WebApi --no-build --force --context-dir Database/SqlServer/Context --output-dir Database/SqlServer/Entities
```

## Enlaces externos

Diagrama de entidad relación:
