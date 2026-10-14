# Guía Paso a Paso: Configuración del Entorno y Backend - EntregaNexo

**Asignatura:** Desarrollo Web\
**Proyecto:** EntregaNexo\
**Documento:** Guía práctica del proceso de configuración y desarrollo

------------------------------------------------------------------------

## 1. Introducción y Contexto del Proyecto

EntregaNexo es una plataforma de entregas a domicilio pensada para conectar comercios locales, clientes y repartidores independientes. En la aplicación: \* Los clientes pueden consultar productos disponibles y realizar compras. \* Se valida y controla el stock de inventario para no vender productos agotados. \* Cada venta registra su detalle con los precios unitarios, cantidades, impuestos y descuentos. \* Se manejan transacciones seguras para que, si ocurre un error durante el cobro o la actualización del inventario, la base de datos no quede con información inconsistente.

### Tecnologías que utilizamos

Para este proyecto utilizamos las siguientes herramientas y tecnologías: \* **Docker y Docker Compose:** Para levantar y gestionar los contenedores de las bases de datos de forma aislada y reproducible. \* **Bases de datos relacionales:** Preparamos el entorno para soportar cuatro motores diferentes (**MySQL**, **PostgreSQL**, **Microsoft SQL Server** y **Oracle Database**). \* **DBeaver:** Gestor gráfico para conectarnos a las bases de datos y verificar que los servicios y las tablas estuvieran funcionando. \* **NestJS:** Framework de Node.js con TypeScript que usamos para estructurar todo el backend siguiendo una arquitectura modular y limpia. \* **Sequelize y Sequelize-TypeScript:** ORM para definir los modelos de datos, las relaciones y gestionar las transacciones en la base de datos. \* **Swagger:** Documentación interactiva para probar los endpoints directamente desde el navegador.

### Organización del trabajo

El desarrollo documentado hasta el momento corresponde a la primera etapa del proyecto y está organizado de la siguiente manera: 1. **Preparación del Entorno:** Configuración de los contenedores de bases de datos con Docker y comprobación visual de tablas y conexiones en DBeaver. 2. **Fase 1: Desarrollo del Backend con NestJS:** Construcción del backend organizado por issues: \* **Issue 1:** Creación del proyecto base y herramientas de desarrollo. \* **Issue 2:** Capa transversal, conexión a bases de datos y arranque del servidor. \* **Issue 3:** Feature de Clientes (`clients`). \* **Issue 4:** Feature de Tipos de Productos (`product-types`). \* **Issue 5:** Feature de Productos y Gestión de Stock (`products`). \* **Issue 6:** Feature de Ventas y Transacciones Atómicas (`sales`). \* **Issue 7:** Módulo agrupador de negocios (`BusinessModule`), seeders automáticos y pruebas e2e con Vitest.

A continuación, detallamos cada uno de los pasos que realizamos.

------------------------------------------------------------------------

## 2. Preparación del Entorno: Bases de Datos con Docker y DBeaver

### Paso 1: Creación del archivo `docker-compose.yml`

Comenzamos creando el archivo `docker-compose.yml` en la raíz del proyecto. Aquí definimos los cuatro contenedores de bases de datos que vamos a utilizar (MySQL, PostgreSQL, SQL Server y Oracle), asignando sus puertos de acceso y las carpetas locales donde guardarán la información.

![](images/clipboard-3466989596.png)

------------------------------------------------------------------------

### Paso 2: Creación del archivo `.env` con las credenciales

Creamos un archivo `.env` para almacenar de forma segura las contraseñas, usuarios, puertos y nombres de las bases de datos, evitando dejarlos escritos directamente en el archivo de Docker Compose.

![](images/clipboard-1528650608.png)

------------------------------------------------------------------------

### Paso 3: Estructura de carpetas para guardar los datos (`data/`)

Para que la información no se borre cada vez que apaguemos o reiniciemos los contenedores, organizamos la carpeta `data/` con una subcarpeta para cada motor:

``` text
data/
├── mysql/
├── postgres/
├── mssql/
└── oracle/
```

De esta forma, todos los datos quedan guardados directamente en nuestra máquina.

------------------------------------------------------------------------

### Paso 4: Levantamiento de los cuatro contenedores

Con las configuraciones listas, ejecutamos el comando `docker compose up -d` en la terminal para iniciar los cuatro contenedores en segundo plano: `entreganexo-mysql`, `entreganexo-postgres`, `entreganexo-mssql` y `entreganexo-oracle`.

![](images/clipboard-2549667650.png)

------------------------------------------------------------------------

### Paso 5: Verificación de la red interna de Docker

Revisamos que Docker Compose creara automáticamente la red interna del proyecto. Esta red permite que los contenedores se comuniquen entre sí usando sus propios nombres sin necesidad de configuraciones adicionales.

![](images/clipboard-3037047914.png)

------------------------------------------------------------------------

### Paso 6: Conexión y creación de la base de datos en MySQL

Accedimos a la consola del contenedor de MySQL (`entreganexo-mysql`), iniciamos sesión con el usuario y contraseña que definimos en el `.env`, y confirmamos la creación de la base de datos para el proyecto.

![](images/clipboard-2002902236.png)

------------------------------------------------------------------------

### Paso 7: Conexión y verificación en PostgreSQL

Entramos al contenedor de PostgreSQL (`entreganexo-postgres`) usando la herramienta `psql` para probar las credenciales y verificar que la base de datos estuviera lista para recibir conexiones.

![](images/clipboard-3179852791.png)

------------------------------------------------------------------------

### Paso 8: Verificación del contenedor de SQL Server (MSSQL)

Revisamos el contenedor `entreganexo-mssql` para comprobar que el servicio de SQL Server hubiera arrancado correctamente y estuviera esperando conexiones.

![](images/clipboard-2929556709.png)

------------------------------------------------------------------------

### Paso 9: Creación de la base de datos en SQL Server

Nos conectamos mediante la herramienta `sqlcmd` al contenedor de SQL Server y ejecutamos la consulta para crear la base de datos de EntregaNexo.

![](images/clipboard-2098138174.png)

------------------------------------------------------------------------

### Paso 10: Verificación del contenedor de Oracle

Revisamos los registros del contenedor `entreganexo-oracle`. Como este motor tarda un poco más en inicializar, esperamos a que el estado cambiara a saludable (*healthy*) para confirmar que estuviera completamente operativo.

![](images/clipboard-561364117.png)

------------------------------------------------------------------------

### Paso 11: Comprobación de conexiones activas en DBeaver

Abrimos el gestor gráfico DBeaver y configuramos las conexiones a los cuatro motores que levantamos con Docker. Comprobamos que pudimos conectarnos con éxito a MySQL, PostgreSQL, SQL Server y Oracle, confirmando que todos los servicios responden correctamente.

![](images/clipboard-988046604.png)

------------------------------------------------------------------------

### Paso 12: Verificación de tablas en MySQL desde DBeaver

Revisamos en DBeaver el esquema de MySQL para comprobar la presencia y estructura de las tablas del sistema, verificando que los tipos de datos y columnas queden creados adecuadamente.

![](images/clipboard-3522718187.png)

------------------------------------------------------------------------

### Paso 13: Verificación de tablas en PostgreSQL desde DBeaver

Entramos al esquema público de PostgreSQL en DBeaver y comprobamos que las tablas se registraron correctamente con sus respectivas relaciones y tipos de datos.

![](images/clipboard-3737651871.png)

------------------------------------------------------------------------

### Paso 14: Verificación de tablas en SQL Server desde DBeaver

Nos conectamos a la base de datos de SQL Server en DBeaver y corroboramos las tablas creadas bajo el esquema predeterminado, validando la integridad del motor.

![](images/clipboard-4023028902.png)

------------------------------------------------------------------------

### Paso 15: Verificación de tablas en Oracle desde DBeaver

Finalmente, accedemos a la instancia de Oracle en DBeaver y comprobamos que todas las tablas y restricciones quedaron registradas en el esquema de la base de datos.

![](images/clipboard-2754250114.png)

------------------------------------------------------------------------

## Issue 1: Creación del Proyecto y Herramientas Base

### Paso 16: Creación del proyecto base con NestJS CLI (`backend-full`)

Para iniciar el backend con una estructura limpia y recomendada, usamos el CLI oficial de NestJS ejecutando el comando para generar el proyecto dentro de la carpeta `backend-full`.

![](images/clipboard-1454525543.png)

------------------------------------------------------------------------

### Paso 17: Estructura inicial generada por el CLI

Revisamos los archivos creados automáticamente por NestJS CLI para confirmar que el esqueleto base del proyecto esté completo y listo para trabajar.

![](images/clipboard-4290269056.png)

------------------------------------------------------------------------

### Paso 18: Instalación de librerías del núcleo y base de datos

Instalamos los paquetes necesarios para la arquitectura y conectividad: Sequelize, decoradores tipados y los drivers para conectar las cuatro bases de datos (MySQL, PostgreSQL, SQL Server y Oracle).

![](images/clipboard-2427658075.png)

------------------------------------------------------------------------

### Paso 19: Instalación de librerías de validación y utilidades

Completamos la instalación agregando las utilidades de validación (`class-validator`, `class-transformer`), Joi para validar las variables de entorno y Swagger para documentar los endpoints de la API.

![](images/clipboard-644668646.png)

------------------------------------------------------------------------

### Paso 20: Configuración de ESM y scripts en `package.json`

Modificamos el archivo `package.json` agregando `"type": "module"` para utilizar el estándar moderno de módulos ECMAScript y definimos los scripts de compilación, ejecución, formateo y pruebas.

![](images/clipboard-667243716.png)

------------------------------------------------------------------------

### Paso 21: Configuración de TypeScript y Nest CLI

Ajustamos los archivos `tsconfig.json`, `tsconfig.build.json` y `nest-cli.json` para habilitar el uso de decoradores, la resolución de módulos moderna y asegurar que el compilador procese bien todos los archivos.

![](images/clipboard-2671170191.png)

------------------------------------------------------------------------

### Paso 22: Script para liberar el puerto 3002 en Windows (`free-port.js`)

Creamos el script `scripts/free-port.js` que se ejecuta antes de `npm run start:dev` para buscar cualquier proceso que esté ocupando el puerto 3002 y cerrarlo automáticamente, evitando errores de puerto ocupado al reiniciar el servidor.

![](images/clipboard-3037541733.png)

------------------------------------------------------------------------

### Paso 23: Estructura de carpetas según Arquitectura Limpia

Organizamos el árbol de carpetas dentro de `src/` adoptando la Arquitectura Limpia modular (`common`, `config`, `features/business`, `health`, `infrastructure`) para albergar ordenadamente todas las capas del sistema.

![](images/clipboard-2330050971.png)

------------------------------------------------------------------------

## Issue 2: Capa Transversal, Base de Datos y Arranque

### Paso 24: Contrato tipado de variables de entorno (`env.interface.ts`)

En `src/config/environment/env.interface.ts`, creamos la interfaz `IEnvConfig` para tipar todas las variables que necesita la aplicación (puerto, dialecto de base de datos, credenciales y hosts), asegurando que el código reconozca sus tipos correctamente.

![](images/clipboard-3483315941.png)

------------------------------------------------------------------------

### Paso 25: Validación de variables de entorno con decoradores (`env.validation.ts`)

Configuramos `env.validation.ts` utilizando decoradores de validación para certificar que todos los datos de conexión requeridos por el motor activo existan antes de levantar el servidor.

![](images/clipboard-3667879465.png)

------------------------------------------------------------------------

### Paso 26: Selector dinámico de base de datos activa (`db-env.ts`)

Implementamos la función selectora en `db-env.ts` para extraer automáticamente los parámetros de conexión correspondientes al dialecto configurado en la variable `DB_DIALECT` del `.env`.

![](images/clipboard-165445130.png)

------------------------------------------------------------------------

### Paso 27: Construcción del objeto de configuración global (`env.config.ts`)

Creamos `env.config.ts` para transformar las variables de entorno validadas en un objeto fuertemente tipado y listo para ser consumido por los módulos de la aplicación.

![](images/clipboard-3105560146.png)

------------------------------------------------------------------------

### Paso 28: Módulo global de variables de entorno (`environment.module.ts`)

Configuramos `environment.module.ts` como un módulo `@Global()` de NestJS para que la configuración esté disponible mediante inyección de dependencias en toda la arquitectura sin duplicar importaciones.

![](images/clipboard-3816463324.png)

------------------------------------------------------------------------

### Paso 29: Jerarquía de excepciones personalizadas (`domain.exception.ts`)

Estructuramos las clases de excepción personalizadas en `src/common/exceptions/` (`DomainException`, `NotFoundDomainException`, etc.) para clasificar adecuadamente cualquier error de negocio o del sistema de forma desacoplada de la web.

![](images/clipboard-3771194625.png)

------------------------------------------------------------------------

### Paso 30: Filtro global de errores HTTP (`global-exception.filter.ts`)

Implementamos `global-exception.filter.ts` en `src/common/filters/` para capturar cualquier error que ocurra en el backend y devolver una respuesta JSON limpia y con el mismo formato en todos los casos.

![](images/clipboard-3581793290.png)

------------------------------------------------------------------------

### Paso 31: Interceptor de respuestas estándar (`response.interceptor.ts`)

Creamos el interceptor de respuestas en `src/common/interceptors/` para envolver todos los retornos exitosos de los endpoints en una estructura ordenada con confirmación, datos y marca de tiempo.

![](images/clipboard-2758283863.png)

------------------------------------------------------------------------

### Paso 32: Interceptor de registro y auditoría (`logging.interceptor.ts`)

Implementamos el interceptor de logs para registrar en la consola el método HTTP, la URL consultada y la duración exacta de cada petición que procesa el servidor.

![](images/clipboard-4039789995.png)

------------------------------------------------------------------------

### Paso 33: Interceptor de tiempo límite de peticiones (`timeout.interceptor.ts`)

Configuramos el interceptor de timeout para cancelar de forma segura cualquier petición que tarde más del tiempo permitido, evitando que el servidor se quede bloqueado.

![](images/clipboard-3736526020.png)

------------------------------------------------------------------------

### Paso 34: Fábrica de conexión dinámica con Sequelize (`sequelize.factory.ts`)

Creamos la función fábrica `sequelizeFactory` en `src/infrastructure/database/sequelize/sequelize.factory.ts` para instanciar Sequelize según el motor activo y registrar el arreglo centralizado `ALL_MODELS`.

![](images/clipboard-1953404609.png)

------------------------------------------------------------------------

### Paso 35: Módulo global de base de datos Sequelize (`sequelize.module.ts`)

Configuramos `sequelize.module.ts` como un módulo global que conecta Sequelize con la base de datos y sincroniza los modelos al arrancar la aplicación.

![](images/clipboard-1730860753.png)

------------------------------------------------------------------------

### Paso 36: Endpoint técnico de monitoreo de salud (`health.controller.ts`)

Implementamos `health.controller.ts` dentro de `src/health/` para exponer la ruta `GET /health`, permitiendo comprobar rápidamente desde el navegador si el servidor está encendido y qué base de datos tiene activa.

![](images/clipboard-1758764378.png)

------------------------------------------------------------------------

### Paso 37: Archivo de arranque principal con Swagger (`main.ts`)

Estructuramos `src/main.ts` donde se inicializa la aplicación NestJS, se activan los pipes de validación (`ValidationPipe`), los interceptores, el filtro de errores y la documentación interactiva en `http://localhost:3002/api/docs`.

![](images/clipboard-4258991011.png)

------------------------------------------------------------------------

### Paso 38: Primera prueba de arranque del servidor en desarrollo

Ejecutamos `npm run start:dev` y confirmamos en la terminal que el backend inicia sin errores, carga los módulos base y queda listo para recibir peticiones en el puerto 3002.

![](images/clipboard-3897032497.png)

------------------------------------------------------------------------

## Issue 3: Feature de Clientes (clients)

### Paso 39: Entidad de dominio de cliente (`client.entity.ts`)

En `src/features/business/clients/domain/entities/`, definimos la clase pura `Client` con los atributos fundamentales del cliente (`id`, `name`, `email`, `phone`, `address` y `status`), manteniéndola libre de dependencias de bases de datos.

![](images/clipboard-2539423928.png)

------------------------------------------------------------------------

### Paso 40: Contrato del repositorio de clientes (`client.repository.ts`)

Declaramos la interfaz `IClientRepository` en `domain/interfaces/` junto con el token `CLIENT_REPOSITORY`, definiendo los métodos para crear, actualizar, listar y buscar clientes sin atarse a Sequelize.

![](images/clipboard-2722704499.png)

------------------------------------------------------------------------

### Paso 41: Excepciones de dominio de clientes (`domain/exceptions/`)

Creamos las excepciones personalizadas del módulo de clientes para manejar situaciones de negocio como la búsqueda de un cliente inexistente o correos duplicados.

![](images/clipboard-916323934.png)

------------------------------------------------------------------------

### Paso 42: DTO de entrada para creación de clientes (`create-client.dto.ts`)

Definimos el DTO en `application/dto/` con las reglas de validación de `class-validator` y decoradores de Swagger para documentar los campos obligatorios al registrar un cliente.

![](images/clipboard-3034465676.png)

------------------------------------------------------------------------

### Paso 43: Mapper de clientes (`client.mapper.ts`)

Implementamos el mapper en `application/mappers/` para transformar limpiamente entre los DTOs que llegan por HTTP, la entidad de dominio y los objetos JSON que se envían como respuesta.

![](images/clipboard-364478051.png)

------------------------------------------------------------------------

### Paso 44: Caso de uso para crear clientes (`CreateClientUseCase`)

En `application/use-cases/`, implementamos `CreateClientUseCase` para coordinar el registro de un nuevo cliente, validando sus datos antes de solicitar su persistencia al repositorio.

![](images/clipboard-1849351583.png)

------------------------------------------------------------------------

### Paso 45: Caso de uso para consultar cliente por ID (`GetClientByIdUseCase`)

Creamos `GetClientByIdUseCase` para buscar un cliente específico por su identificador numérico y lanzar una excepción clara si no se encuentra en la base de datos.

![](images/clipboard-2872868834.png)

------------------------------------------------------------------------

### Paso 46: Caso de uso para listar y paginar clientes (`ListClientsUseCase`)

Implementamos `ListClientsUseCase` para consultar el listado de clientes registrados con soporte de paginación y límite de resultados.

![](images/clipboard-1825084865.png)

------------------------------------------------------------------------

### Paso 47: Modelo Sequelize para la tabla `clients` (`client.model.ts`)

En `infrastructure/persistence/models/`, definimos `ClientModel` con decoradores de Sequelize, mapeando cada columna con su tipo de dato para sincronizar la tabla `clients` en la base de datos.

![](images/clipboard-1889476970.png)

------------------------------------------------------------------------

### Paso 48: Repositorio de Sequelize para clientes (`client.repository.ts`)

En `infrastructure/persistence/repositories/`, implementamos `ClientRepository` cumpliendo con la interfaz de dominio, usando `ClientModel` para guardar, consultar y actualizar los registros reales.

![](images/clipboard-1335460621.png)

------------------------------------------------------------------------

### Paso 49: Seeder de clientes de demostración (`client.seeder.ts`)

Creamos un seeder para precargar automáticamente un cliente de demostración (`demo.cliente@tecnogua.edu.co`) cuando la base de datos esté vacía, facilitando las pruebas de los endpoints.

![](images/clipboard-2136413724.png)

------------------------------------------------------------------------

### Paso 50: Controlador HTTP de clientes (`clients.controller.ts`)

En `presentation/http/controllers/`, implementamos `ClientsController` etiquetado con `@ApiTags('clients')`, exponiendo las rutas REST `POST /clients`, `GET /clients` y `GET /clients/:id`.

![](images/clipboard-3331515001.png)

------------------------------------------------------------------------

### Paso 51: Módulo de clientes y exportación del repositorio (`clients.module.ts`)

En `clients.module.ts`, agrupamos el controlador, los casos de uso, el seeder y conectamos la interfaz con la implementación de Sequelize, exportando el repositorio para que otros módulos puedan usarlo.

![](images/clipboard-2070953934.png)

------------------------------------------------------------------------

### Paso 52: Registro de `ClientModel` en la fábrica Sequelize (`sequelize.factory.ts`)

Actualizamos `src/infrastructure/database/sequelize/sequelize.factory.ts` importando `ClientModel` e incorporándolo al arreglo `ALL_MODELS` para que Sequelize cargue y sincronice la tabla al iniciar.

![](images/clipboard-1095639418.png)

------------------------------------------------------------------------

### Paso 53: Integración de `ClientsModule` en el módulo raíz (`app.module.ts`)

Registramos `ClientsModule` dentro del arreglo `imports` de `src/app.module.ts` para que NestJS lo reconozca y quede activo en la aplicación.

![](images/clipboard-1822183103.png)

------------------------------------------------------------------------

### Paso 54: Verificación de rutas de clientes en consola

Iniciamos el servidor con `npm run start:dev` y confirmamos en la terminal que se cargó el módulo de clientes y que las rutas HTTP correspondientes quedaron debidamente mapeadas.

![](images/clipboard-1392727739.png)

------------------------------------------------------------------------

### Paso 55: Comprobación interactiva de clientes en Swagger UI

Abrimos el navegador en `http://localhost:3002/api/docs` y corroboramos que el grupo **clients** aparece disponible para realizar pruebas interactivas de creación y consulta.

![](images/clipboard-4273590055.png)

------------------------------------------------------------------------

## Issue 4: Feature de Tipos de Productos (product-types)

### Paso 56: Entidad de dominio de tipos de producto (`product-type.entity.ts`)

En `src/features/business/product-types/domain/entities/`, creamos la entidad `ProductType` que modela las categorías de productos con sus propiedades `id`, `name`, `description` y `status`.

![](images/clipboard-4117774527.png)

------------------------------------------------------------------------

### Paso 57: Contrato del repositorio de tipos de producto (`product-type.repository.ts`)

Definimos la interfaz `IProductTypeRepository` y el token `PRODUCT_TYPE_REPOSITORY` con las operaciones necesarias: crear, listar, buscar por ID y verificar nombres existentes.

![](images/clipboard-515091790.png)

------------------------------------------------------------------------

### Paso 58: Excepciones de dominio de tipos de producto (`product-type.exceptions.ts`)

Creamos las excepciones para cuando no se encuentra una categoría por su ID (`ProductTypeNotFoundException`) o cuando se intenta registrar un nombre repetido (`ProductTypeNameAlreadyExistsException`).

![](images/clipboard-3482351172.png)

------------------------------------------------------------------------

### Paso 59: DTO de creación de tipos de producto (`create-product-type.dto.ts`)

Definimos `CreateProductTypeDto` en la capa de Aplicación aplicando validaciones de texto y anotaciones de Swagger para documentar el nombre y la descripción de la categoría.

![](images/clipboard-181117078.png)

------------------------------------------------------------------------

### Paso 60: Mapper de tipos de producto (`product-type.mapper.ts`)

Creamos `ProductTypeMapper` para transformar limpiamente entre el DTO de entrada, la entidad de negocio y el formato JSON devuelto en las respuestas HTTP.

![](images/clipboard-3337555345.png)

------------------------------------------------------------------------

### Paso 61: Caso de uso para crear tipos de producto (`CreateProductTypeUseCase`)

Implementamos el caso de uso para registrar nuevas categorías, comprobando antes que no exista otra categoría con el mismo nombre en la base de datos.

![](images/clipboard-3287301155.png)

------------------------------------------------------------------------

### Paso 62: Casos de uso de consulta por ID y listado de tipos (`product-types`)

Creamos los casos de uso para consultar una categoría por su identificador y para listar todas las categorías con soporte de paginación y formateo.

![](images/clipboard-3894115374.png)

------------------------------------------------------------------------

### Paso 63: Modelo Sequelize de tipos de producto (`product-type.model.ts`)

En `infrastructure/persistence/models/`, definimos `ProductTypeModel` mapeado a la tabla `product_types` con nombre único no nulo y timestamps automáticos.

![](images/clipboard-1381634182.png)

------------------------------------------------------------------------

### Paso 64: Repositorio Sequelize de tipos de producto (`product-type.repository.ts`)

Implementamos el repositorio de persistencia `ProductTypeRepository` conectándolo a Sequelize para interactuar con la tabla `product_types` y convertir los datos a entidades de dominio.

![](images/clipboard-2121395114.png)

------------------------------------------------------------------------

### Paso 65: Seeder de categorías iniciales (`product-type.seeder.ts`)

Creamos el seeder para insertar categorías iniciales de demostración de manera automática y sin duplicados al levantar el servidor.

![](images/clipboard-2184940826.png)

------------------------------------------------------------------------

### Paso 66: Controlador HTTP de tipos de producto (`product-types.controller.ts`)

En `presentation/http/controllers/`, definimos `ProductTypesController` con `@ApiTags('product-types')` exponiendo las rutas `POST /product-types`, `GET /product-types` y `GET /product-types/:id`.

![](images/clipboard-3996428410.png)

------------------------------------------------------------------------

### Paso 67: Verificación en consola de rutas de tipos de producto

Iniciamos el backend y comprobamos en la terminal que `ProductTypesModule` fue cargado con éxito y que las tres rutas del controlador quedaron mapeadas sin errores.

![](images/clipboard-4110600696.png)

------------------------------------------------------------------------

### Paso 68: Comprobación de tipos de producto en Swagger UI

Abrimos Swagger UI en `http://localhost:3002/api/docs` y verificamos que el grupo **product-types** aparece completamente funcional con sus esquemas y endpoints listos.

![](images/clipboard-1144059305.png)

------------------------------------------------------------------------

## Issue 5: Feature de Productos y Gestión de Stock (products)

### Paso 69: Entidad de dominio de productos y regla de stock (`product.entity.ts`)

En `src/features/business/products/domain/entities/`, definimos la entidad `Product` con el método `reduceStock()`, el cual valida que haya suficiente cantidad antes de restar existencias para evitar inventario negativo.

![](images/clipboard-1953043203.png)

------------------------------------------------------------------------

### Paso 70: Contrato del repositorio de productos (`product.repository.ts`)

Declaramos `IProductRepository` y el token `PRODUCT_REPOSITORY` en `domain/interfaces/` con los métodos necesarios para crear, buscar por ID, listar y actualizar productos.

![](images/clipboard-1344973735.png)

------------------------------------------------------------------------

### Paso 71: DTO de creación de productos con validaciones (`create-product.dto.ts`)

Creamos `CreateProductDto` con validaciones de `class-validator` para nombre, precio, cantidad de stock y el identificador obligatorio de su categoría (`productTypeId`).

![](images/clipboard-1724698254.png)

------------------------------------------------------------------------

### Paso 72: Caso de uso para crear productos con validación cruzada (`CreateProductUseCase`)

En `CreateProductUseCase`, inyectamos los repositorios de productos y de categorías. Antes de registrar el producto, validamos que la categoría indicada realmente exista en la base de datos.

![](images/clipboard-2708465177.png)

------------------------------------------------------------------------

### Paso 73: Casos de uso de consulta y listado de productos

Implementamos los casos de uso para buscar un producto por su ID (`GetProductByIdUseCase`) y para obtener el catálogo de productos con paginación (`ListProductsUseCase`).

![](images/clipboard-445525447.png)

------------------------------------------------------------------------

### Paso 74: Modelo Sequelize de productos con clave foránea (`product.model.ts`)

En `infrastructure/persistence/models/`, definimos `ProductModel` mapeado a la tabla `products`, configurando la relación de clave foránea hacia `ProductTypeModel` mediante `@ForeignKey` y `@BelongsTo`.

![](images/clipboard-976394963.png)

------------------------------------------------------------------------

### Paso 75: Repositorio Sequelize de productos (`product.repository.ts`)

Implementamos `ProductRepository` cumpliendo con el contrato de dominio para realizar las operaciones de guardado, consulta y actualización en la tabla de productos.

![](images/clipboard-4076455548.png)

------------------------------------------------------------------------

### Paso 76: Seeder de productos vinculados a categorías (`product.seeder.ts`)

Desarrollamos `ProductSeeder` para insertar productos de prueba asociados a las categorías existentes, asegurando que el catálogo cuente con datos iniciales para probar ventas.

![](images/clipboard-3619074067.png)

------------------------------------------------------------------------

### Paso 77: Controlador HTTP de productos (`products.controller.ts`)

En `presentation/http/controllers/`, creamos `ProductsController` decorado con `@ApiTags('products')` con las rutas `POST /products`, `GET /products` y `GET /products/:id`.

![](images/clipboard-1151970402.png)

------------------------------------------------------------------------

### Paso 78: Módulo de productos con importación cruzada (`products.module.ts`)

En `products.module.ts`, importamos `ProductTypesModule` para poder acceder al repositorio de categorías, y registramos el controlador, casos de uso, seeder y repositorio de productos.

![](images/clipboard-258491903.png)

------------------------------------------------------------------------

### Paso 79: Registro de `ProductModel` en la fábrica Sequelize (`sequelize.factory.ts`)

Agregamos `ProductModel` al arreglo global `ALL_MODELS: [ClientModel, ProductTypeModel, ProductModel]` en `sequelize.factory.ts` para que Sequelize sincronice los tres modelos vinculados.

![](images/clipboard-2612446697.png)

------------------------------------------------------------------------

### Paso 80: Integración de `ProductsModule` en el módulo raíz (`app.module.ts`)

Registramos `ProductsModule` dentro del arreglo `imports` de `src/app.module.ts`, consolidando los módulos de clientes, tipos de producto y productos en el núcleo de NestJS.

![](images/clipboard-2422783382.png)

------------------------------------------------------------------------

### Paso 81: Verificación de productos en Swagger UI

Abrimos el navegador en `http://localhost:3002/api/docs` y comprobamos que Swagger UI muestra los cuatro bloques de la API sincronizados (**Health**, **clients**, **product-types** y **products**).

![](images/clipboard-3590732119.png)

------------------------------------------------------------------------

## Issue 6: Feature de Ventas y Transacciones Atómicas (sales)

### Paso 82: Entidad de dominio de detalle de venta (`product-sale.entity.ts`)

En `src/features/business/sales/domain/entities/`, creamos la entidad `ProductSale` para modelar cada ítem de una venta: `id`, `saleId`, `productId`, `quantity`, `unitPrice` y `total`.

![](images/clipboard-876311955.png)

------------------------------------------------------------------------

### Paso 83: Entidad raíz agregada de venta (`sale.entity.ts`)

Creamos la entidad raíz `Sale` con los atributos de cabecera: fecha de venta, subtotal, impuestos, descuentos, total, cliente asociado y la lista de ítems (`ProductSale[]`).

![](images/clipboard-83828015.png)

------------------------------------------------------------------------

### Paso 84: Servicio de dominio de cálculo financiero (`sale-calculator.ts`)

En `domain/services/sale-calculator.ts`, implementamos `SaleCalculator` para calcular el subtotal multiplicando cantidad por precio unitario, y el total sumando impuestos y restando descuentos.

![](images/clipboard-3697403577.png)

------------------------------------------------------------------------

### Paso 85: Contrato del repositorio de ventas (`sale.repository.ts`)

Definimos el contrato `ISaleRepository` con los métodos `create(sale: Sale)` y `findById(id: number)`, junto con el token de inyección `SALE_REPOSITORY`.

![](images/clipboard-2513220454.png)

------------------------------------------------------------------------

### Paso 86: DTOs anidados de entrada para ventas (`create-sale.dto.ts`)

En `create-sale.dto.ts`, diseñamos `SaleItemDto` y `CreateSaleDto` con validaciones anidadas (`@ValidateNested`, `@ArrayMinSize(1)`) para validar que cada venta contenga al menos un ítem con datos válidos.

![](images/clipboard-1030416540.png)

------------------------------------------------------------------------

### Paso 87: Mapper de respuestas de venta (`sale.mapper.ts`)

Creamos `SaleMapper` en `application/mappers/` para transformar la entidad de venta y sus detalles en una respuesta JSON ordenada para los clientes HTTP.

![](images/clipboard-194921426.png)

------------------------------------------------------------------------

### Paso 88: Caso de uso transaccional de creación de venta (`create-sale.use-case.ts`)

En `CreateSaleUseCase`, inyectamos los repositorios de ventas, clientes y productos. Validamos la existencia del cliente, la disponibilidad de cada producto, ejecutamos `product.reduceStock(quantity)` y calculamos los totales antes de guardar.

![](images/clipboard-2861804225.png)

------------------------------------------------------------------------

### Paso 89: Caso de uso de consulta de venta por ID (`get-sale-by-id.use-case.ts`)

Implementamos `GetSaleByIdUseCase` para consultar ventas por su identificador único y lanzar `SaleNotFoundException` si no existe el registro solicitado.

![](images/clipboard-2406850565.png)

------------------------------------------------------------------------

### Paso 90: Modelo Sequelize de cabecera de venta (`sale.model.ts`)

Creamos `SaleModel` mapeado a la tabla `sales` con clave foránea a `ClientModel` y relación uno a muchos `@HasMany(() => ProductSaleModel)` hacia los detalles de la venta.

![](images/clipboard-2678589959.png)

------------------------------------------------------------------------

### Paso 91: Modelo Sequelize de detalle y repositorio transaccional (`product-sale.model.ts` y `sale.repository.ts`)

Definimos `ProductSaleModel` (tabla `product_sales`). En `sale.repository.ts`, implementamos la persistencia atómica con `this.sequelize.transaction()` y bloqueo `Transaction.LOCK.UPDATE` para asegurar que el descuento de stock y el registro de la venta ocurran de forma segura.

![](images/clipboard-3807812288.png)

------------------------------------------------------------------------

### Paso 92: Controlador REST de ventas (`sales.controller.ts`)

En `presentation/http/controllers/`, creamos `SalesController` etiquetado con `@ApiTags('sales')` con las rutas `POST /sales` (para registrar una venta) y `GET /sales/:id` (para consultar el detalle de una venta).

![](images/clipboard-2194882442.png)

------------------------------------------------------------------------

### Paso 93: Módulo de ventas, registro en Sequelize y en `app.module.ts`

En `sales.module.ts`, importamos `ClientsModule` y `ProductsModule` para resolver dependencias cruzadas. Añadimos `SaleModel` y `ProductSaleModel` a `ALL_MODELS` en Sequelize y registramos `SalesModule` en `src/app.module.ts`.

![](images/clipboard-230410595.png)

------------------------------------------------------------------------

### Paso 94: Verificación interactiva de ventas en Swagger UI

Iniciamos el servidor backend y comprobamos en `http://localhost:3002/api/docs` que el grupo **sales** se encuentra disponible junto con todos los módulos de la aplicación listos para operar.

![](images/clipboard-2145989734.png)

------------------------------------------------------------------------

## Issue 7: Módulo Agrupador de Negocios, Seeders Globales y Pruebas e2e

### Paso 95: Creación del módulo agrupador `BusinessModule` y ejecutor `SeedersRunner`

Para centralizar los cuatro módulos de negocio en un solo lugar y evitar sobrecargar el archivo principal, creamos `BusinessModule` en `src/features/business/business.module.ts`. Además, implementamos `SeedersRunner` con el hook `OnApplicationBootstrap` para ejecutar automáticamente los seeders de clientes, categorías y productos en el orden adecuado al terminar de arrancar el servidor.

![](images/clipboard-4053067441.png)

------------------------------------------------------------------------

### Paso 96: Limpieza y simplificación del módulo principal (`app.module.ts`)

Con el módulo agrupador listo, actualizamos `src/app.module.ts` reemplazando las importaciones individuales de cada feature por únicamente `BusinessModule`. De esta forma, el archivo raíz queda ordenado y limpio, importando solamente `EnvironmentModule`, `SequelizeModule` y `BusinessModule`.

![](images/clipboard-2478144501.png)

------------------------------------------------------------------------

### Paso 97: Configuración y ejecución de pruebas e2e con Vitest (`app.e2e-spec.ts`)

Configuramos las pruebas de extremo a extremo en `test/app.e2e-spec.ts` utilizando Vitest y Supertest. Creamos una prueba para verificar que el endpoint `GET /api/health` responda correctamente con código HTTP 200 y el estado esperado, simulando llamadas reales a la aplicación.

![](images/clipboard-1398414219.png)
