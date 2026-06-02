# 🎮 ArcadeX

Plataforma de Gestión y Distribución Digital de Videojuegos
Inspirada en Steam y desarrollada como proyecto final de Bootcamp Full Stack.

## 📖 Descripción

ArcadeX es una plataforma web de gestión y distribución digital de videojuegos inspirada en Steam. El
proyecto fue desarrollado aplicando principios modernos de arquitectura de software, diseño de APIs REST
y desarrollo Full Stack.
La aplicación permite administrar catálogos de videojuegos, gestionar usuarios y ofrecer una base sólida
para la construcción de una tienda digital de videojuegos escalable y mantenible.

## 🌐 Demo y Documentación

API en Producción
🔗 https://arcadex-yfzr.onrender.com/scalar/
La documentación interactiva está disponible mediante Scalar y permite explorar todos los endpoints
disponibles, modelos de datos y pruebas de la API directamente desde el navegador.

- .NET
- Angular
- SQL Server
- Docker

## 🚀 Tecnologías Utilizadas

### Backend

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server 2022
- OpenAPI / Scalar
- Clean Architecture
- Dependency Injection

### Frontend

- Angular 22
- Angular Material
- TypeScript
- SCSS

### DevOps y Herramientas

- Docker
- GitHub Actions
- Git
- GitHub
- Visual Studio 2022
- Visual Studio Code
- Postman

## 🏗️ Arquitectura del Proyecto

### Backend

La solución backend sigue una arquitectura basada en Clean Architecture para garantizar mantenibilidad,
escalabilidad y separación de responsabilidades.

```text
Backend
├── ArcadeX.API
├── ArcadeX.Application
├── ArcadeX.Domain
├── ArcadeX.Infrastructure
└── ArcadeX.Persistence
```

#### Capas

##### ArcadeX.Domain

Contiene las entidades del dominio y las reglas de negocio principales de la aplicación.

##### ArcadeX.Application

Implementa casos de uso, contratos, DTOs y lógica de aplicación.

##### ArcadeX.Infrastructure

Gestiona servicios externos y configuraciones de infraestructura.

##### ArcadeX.Persistence

Implementa el acceso a datos utilizando Entity Framework Core y SQL Server.

##### ArcadeX.API

Expone la funcionalidad mediante una API REST documentada con OpenAPI y Scalar.

### Frontend

El frontend se encuentra desarrollado siguiendo una estructura modular basada en características.

```text
Frontend
└── src/app
├── core
├── features
└── shared
```

#### Capas

##### Core

Servicios globales, interceptores, guards y configuraciones compartidas.

##### Features

Módulos organizados por funcionalidades de negocio.

##### Shared

Componentes, pipes, directivas y utilidades reutilizables.

## 🎯 Objetivos del Proyecto

Durante el desarrollo de ArcadeX se aplicaron conceptos y buenas prácticas utilizadas en aplicacionesempresariales modernas:

- Arquitectura Limpia (Clean Architecture)
- Principios SOLID
- Diseño de APIs REST
- Separación de responsabilidades
- Inyección de dependencias
- Desarrollo modular con Angular
- Persistencia relacional con SQL Server
- Contenerización con Docker
- Integración continua con GitHub Actions

## 📂 Estructura General del Proyecto

```text
ArcadeX
│
├── Backend
│ ├── ArcadeX.API
│ ├── ArcadeX.Application
│ ├── ArcadeX.Domain
│ ├── ArcadeX.Infrastructure
│ └── ArcadeX.Persistence
│
├── Frontend
│
├── DataBase
│
└── README.md
```

## ⚙️ Instalación Local

### Clonar repositorio

```shell
git clone https://github.com/ckal0417/ArcadeX.git
```

### Backend

```shell
cd Backend
dotnet restore
dotnet build
dotnet run
```

### Frontend

```shell
cd Frontend
npm install
ng serve
```

## Creacion de DbContext y entidades de base datos usando Entity Framework

Ejecuta este comando para el programa se conecte a la base datos y puede crear el contexto y las entidades.

```shell
dotnet ef dbcontext scaffold "Server=localhost,1433;User=usuario;Password=contraseña;DataBase=NombreBaseDeDatos;TrustServerCertificate=True" Microsoft.EntityFrameworkCore.SqlServer --project ArcadeX.Domain --startup-project ArcadeX.bApi --no-build --force --context-dir Database/SqlServer/Context --output-dir Database/SqlServer/Entities
```

## 🔮 Mejoras Futuras

- Sistema de compras
- Carrito de compras
- Lista de deseos
- Sistema de reseñas y calificaciones
- Integración con pasarelas de pago
- Dashboard administrativo avanzado
- Notificaciones en tiempo real
- Gestión de ofertas y promociones

## Autores

- Jefferson Veloz
- Cristofer Vera

Proyecto desarrollado como trabajo final de Bootcamp Full Stack.
Si te interesa el desarrollo Full Stack con .NET y Angular, no dudes en explorar el código y la documentacióndel proyecto.

## Lecciones Aprendidas

Durante el desarrollo de ArcadeX aprendí a:

- Diseñar una arquitectura desacoplada utilizando Clean Architecture.
- Implementar APIs REST escalables con ASP.NET Core.
- Organizar aplicaciones Angular mediante módulos de características.
- Gestionar dependencias mediante inyección de dependencias.
- Trabajar con SQL Server y Entity Framework Core.
- Containerizar aplicaciones utilizando Docker.
- Automatizar procesos mediante GitHub Actions.
