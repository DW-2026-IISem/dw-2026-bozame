# Guía Paso a Paso: Configuración del Entorno y Backend - EntregaNexo

**Asignatura:** Desarrollo Web\
**Proyecto:** EntregaNexo\
**Documento:** Guía práctica del proceso de configuración y desarrollo

------------------------------------------------------------------------

## 1. Introducción y Contexto del Proyecto

EntregaNexo es una plataforma pensada para conectar comercios locales, compradores y repartidores independientes. En la aplicación: \* Cada pedido puede reunir productos de una tienda específica. \* Los pedidos van cambiando de estado según avanzan en la entrega. \* Se gestiona el cobro al cliente, la comisión de la plataforma y el pago correspondiente al comercio aliado. \* Se asigna al repartidor según su zona y disponibilidad, se hace el seguimiento del pedido y se manejan cancelaciones evitando errores con el dinero.

### ¿Qué hicimos en esta etapa?

Para desarrollar el proyecto de manera ordenada, organizamos el trabajo por fases y tareas (*issues*): 1. **Bases de Datos con Docker:** Levantamos cuatro bases de datos distintas (**MySQL**, **PostgreSQL**, **SQL Server** y **Oracle**) usando Docker Compose, guardando la información en carpetas locales. 2. **Estructura Base del Backend (ISS-01):** Creamos el proyecto con NestJS, instalamos librerías necesarias, preparamos herramientas de desarrollo y estructuramos las carpetas. 3. **Configuración Global y Errores (ISS-02):** Validamos variables de entorno, configuramos Sequelize, interceptores, excepciones personalizadas y el filtro global de errores. 4. **Feature Comercios (ISS-03):** Implementamos el módulo de comercios aliados (`merchants`) aplicando Arquitectura Limpia (*Clean Architecture*) en cuatro capas. 5. **Feature Catálogo y Productos (ISS-04):** Construimos el módulo de productos (`catalog`), relacionando los productos con los comercios. 6. **Feature Clientes (ISS-05):** Desarrollamos el módulo de clientes (`clients`), requisito indispensable para la creación de pedidos. 7. **Feature Pedidos y Transacciones Atómicas (ISS-06):** Implementamos el módulo de pedidos (`orders`) con cabecera y detalle, garantizando transacciones seguras para evitar inconsistencias financieras. 8. **Pruebas y Validación con Swagger:** Configuramos pruebas con Vitest y verificamos el funcionamiento de todos los endpoints visualmente en Swagger UI. 9. **Validación Multibase de Datos:** Comprobamos la portabilidad del backend alternando entre **MySQL**, **PostgreSQL**, **SQL Server** y **Oracle** únicamente modificando el archivo `.env`. 10. **Comprobación Visual en DBeaver:** Confirmamos mediante el gestor gráfico DBeaver que las tablas creadas existen y están sincronizadas en los cuatro motores. 11. **Reestructuración y Consolidación (`backend-full`):** Recreamos el proyecto con NestJS CLI en una estructura limpia y optimizada, configurando dependencias, ESM, tooling de TypeScript, script de puertos y arquitectura modular. 12. **Capa Transversal, Base de Datos y Bootstrap en `backend-full`:** Implementamos variables tipadas, validación, excepciones, filtro global, interceptores, fábrica de conexión Sequelize, endpoint de salud (`/health`) y el arranque central en `main.ts`. 13. **Feature de Clientes en `backend-full` (ISS-03):** Implementamos las cuatro capas completas de Arquitectura Limpia para el módulo de clientes (Dominio, Aplicación, Infraestructura y Presentación), verificando su funcionamiento en consola y en Swagger UI. 14. **Feature Tipos de Productos en `backend-full` (ISS-04 - En Proceso):** Implementamos las capas de Dominio, Aplicación, Infraestructura y el controlador en Presentación para el módulo de categorías y tipos de productos (`product-types`).

A continuación, mostramos en detalle cada uno de los pasos que seguimos:

------------------------------------------------------------------------

## 2. Fase 1: Configuración de las Bases de Datos con Docker

### Paso 1: Creación del archivo `docker-compose.yml`

Comenzamos creando el archivo `docker-compose.yml` en la raíz del proyecto. Aquí definimos los cuatro contenedores de bases de datos que vamos a utilizar, asignando sus puertos y las carpetas locales donde guardarán los datos.

![](images/clipboard-3466989596.png)

------------------------------------------------------------------------

### Paso 2: Creación del archivo `.env` con las credenciales

Creamos un archivo `.env` para guardar las contraseñas, usuarios, puertos y nombres de las bases de datos de forma segura, evitando que queden escritos directamente en el docker-compose.

![](images/clipboard-1528650608.png)

------------------------------------------------------------------------

### Paso 3: Estructura de carpetas para guardar los datos (`data/`)

Para que la información no se borre al apagar o reiniciar los contenedores, organizamos la carpeta `data/` con una subcarpeta para cada base de datos:

``` text
data/
├── mysql/
├── postgres/
├── mssql/
└── oracle/
```

De esta forma, todo lo que guardemos queda almacenado directamente en nuestra computadora.

------------------------------------------------------------------------

### Paso 4: Levantamiento de los cuatro contenedores

Con las configuraciones listas, ejecutamos el comando `docker compose up -d` para iniciar los contenedores en segundo plano. Los cuatro servicios son: \* `entreganexo-mysql` \* `entreganexo-postgres` \* `entreganexo-mssql` \* `entreganexo-oracle`

![](images/clipboard-2549667650.png)

------------------------------------------------------------------------

### Paso 5: Verificación de la red interna de Docker

Revisamos que Docker Compose creara automáticamente la red interna del proyecto. Gracias a esto, los cuatro contenedores pueden conectarse entre sí usando sus propios nombres sin tener que configurar nada más.

![](images/clipboard-3037047914.png)

------------------------------------------------------------------------

### Paso 6: Conexión y creación de la base de datos en MySQL

Entramos a la consola del contenedor `entreganexo-mysql` para comprobar el acceso con nuestro usuario y contraseña, y creamos la base de datos para el proyecto.

![](images/clipboard-2002902236.png)

------------------------------------------------------------------------

### Paso 7: Conexión y verificación en PostgreSQL

Hicimos lo mismo con el contenedor `entreganexo-postgres`: entramos con la herramienta `psql`, probamos las credenciales del archivo `.env` y confirmamos que la base de datos estuviera disponible.

![](images/clipboard-3179852791.png)

------------------------------------------------------------------------

### Paso 8: Verificación del contenedor de SQL Server (MSSQL)

Revisamos el contenedor `entreganexo-mssql` para asegurarnos de que el servicio de SQL Server hubiera arrancado bien y estuviera listo para recibir conexiones.

![](images/clipboard-2929556709.png)

------------------------------------------------------------------------

### Paso 9: Creación de la base de datos en SQL Server

Entramos con la herramienta `sqlcmd` al contenedor de SQL Server y ejecutamos la instrucción para crear la base de datos de EntregaNexo.

![](images/clipboard-2098138174.png)

------------------------------------------------------------------------

### Paso 10: Verificación del contenedor de Oracle

Por último, revisamos el contenedor `entreganexo-oracle`. Como este motor tarda un poco más en iniciar, revisamos los registros para confirmar que ya estuviera listo y operativo.

![](images/clipboard-561364117.png)

------------------------------------------------------------------------

## 3. Fase 2: Configuración Base del Backend (ISS-01)

### Paso 11: Creación del proyecto base de backend

Con las bases de datos funcionando, entramos a la carpeta `backend/` y creamos el proyecto base con NestJS y TypeScript para empezar a construir la aplicación.

![](images/clipboard-1019755048.png)

------------------------------------------------------------------------

### Paso 12: Instalación de dependencias del backend

Instalamos los paquetes que necesitamos para que el backend funcione y se conecte a las bases de datos: \* **Sequelize y sequelize-typescript:** para manejar las bases de datos y crear los modelos con clases en TypeScript. \* **Drivers de conexión:** `mysql2` (MySQL), `pg` (PostgreSQL), `tedious` (SQL Server) y `oracledb` (Oracle). \* **Herramientas de apoyo:** `class-validator` y `class-transformer` para validar los datos que llegan a la API, `dotenv` para leer las variables del `.env`, y `@nestjs/swagger` para documentar la API automáticamente.

![](images/clipboard-1671832488.png)

Revisamos en la terminal que todas las librerías se hubieran instalado correctamente:

![](images/clipboard-3786103803.png)

------------------------------------------------------------------------

### Paso 13: Configuración de módulos ESM y scripts en `package.json`

Modificamos el archivo `package.json` agregando `"type": "module"` para usar módulos modernos. Además, definimos los scripts para compilar el proyecto, iniciarlo en desarrollo con recarga automática, formatear el código y correr pruebas con Vitest.

![](images/clipboard-3987474692.png)

------------------------------------------------------------------------

### Paso 14: Instalación de dependencias de desarrollo y testing

Instalamos herramientas para trabajar de forma más cómoda, revisar errores y hacer pruebas: \* `oxlint`: para revisar errores en el código de forma rápida. \* `prettier`: para que el código quede ordenado y con formato consistente. \* `vitest` y `@vitest/coverage-v8`: para ejecutar las pruebas unitarias y medir la cobertura. \* `supertest`: para hacer pruebas de integración en los endpoints.

![](images/clipboard-1890695527.png)

Revisamos en la terminal que se instalaran sin errores:

![](images/clipboard-1430420439.png)

------------------------------------------------------------------------

### Paso 15: Configuración de TypeScript y herramientas de desarrollo

Ajustamos los archivos de configuración para que el compilador y los linters trabajen de manera coordinada:

- **`tsconfig.json`:** configuración principal de TypeScript con soporte para ESM y decoradores. ![](images/clipboard-587266367.png)

- **`tsconfig.build.json`:** configuración para compilar a producción excluyendo pruebas. ![](images/clipboard-4268597940.png)

- **`nest-cli.json`:** configuración de los comandos del CLI de NestJS. ![](images/clipboard-1104496821.png)

- **`.prettierrc`:** reglas de estilo (comillas, sangría y punto y coma). ![](images/clipboard-4123292685.png)

- **`oxlint.json`:** reglas para la revisión del código. ![](images/clipboard-1590827749.png)

- **`.gitignore`:** confirmamos que estuviera ignorando `node_modules/`, la carpeta de compilación `dist/` y los archivos `.env` con contraseñas reales.

------------------------------------------------------------------------

### Paso 16: Script para liberar puertos y plantilla de entorno

Creamos un pequeño script en `scripts/free-port.js` para que libere automáticamente el puerto antes de iniciar en modo desarrollo y así evitar problemas de puertos ocupados:

![](images/clipboard-3461278376.png)

También creamos el archivo `.env.example` como plantilla con todas las variables que requiere el backend (puertos y conexiones de las cuatro bases de datos), para saber qué valores se necesitan sin exponer contraseñas reales:

![](images/clipboard-1086473457.png)

------------------------------------------------------------------------

### Paso 17: Estructura de carpetas para EntregaNexo

Organizamos las carpetas dentro de `src/` según las responsabilidades de nuestro sistema: \* `config/`: para variables de entorno y configuración general. \* `common/`: para utilidades, filtros de errores y cosas compartidas. \* `features/`: para los módulos del negocio (pedidos, tiendas, repartidores, etc.). \* `health/`: para comprobar que el servicio esté respondiendo. \* `infrastructure/`: para la conexión con las bases de datos.

![](images/clipboard-3317565810.png)

------------------------------------------------------------------------

## 4. Fase 3: Capa de Configuración Global y Errores (ISS-02)

### Paso 18: Tipado de variables de entorno (`env.interface.ts`)

Iniciamos la tarea **ISS-02** encargada de la configuración global del backend. Creamos el archivo `env.interface.ts` en `src/config/environment/` para definir los tipos de datos de cada variable (puerto, entorno, dialecto y credenciales de las bases de datos), asegurando el tipado estricto con TypeScript.

![](images/clipboard-1505834215.png)

------------------------------------------------------------------------

### Paso 19: Validación de variables de entorno (`env.validation.ts`)

Creamos el archivo `env.validation.ts` utilizando decoradores de `class-validator` y `class-transformer` para revisar que las variables obligatorias del dialecto activo (`DB_DIALECT`) estén completas al arrancar la aplicación, evitando errores en ejecución.

![](images/clipboard-1456714325.png)

------------------------------------------------------------------------

### Paso 20: Selector de base de datos activa (`db-env.ts`)

Creamos la función en `db-env.ts` para elegir automáticamente las variables y datos de conexión según el motor que esté seleccionado en `DB_DIALECT`.

![](images/clipboard-576975800.png)

------------------------------------------------------------------------

### Paso 21: Carga centralizada de la configuración (`env.config.ts`)

Creamos el archivo `env.config.ts` para leer y estructurar todas las variables validadas en un solo objeto de configuración accesible en toda la aplicación.

![](images/clipboard-1906502883.png)

------------------------------------------------------------------------

### Paso 22: Módulo global de entorno (`environment.module.ts`)

Definimos `environment.module.ts` como un módulo global (`@Global()`) de NestJS para que cualquier servicio pueda usar la configuración sin necesidad de volver a importar el módulo.

![](images/clipboard-2054307835.png)

------------------------------------------------------------------------

### Paso 23: Archivo de exportación centralizada (`index.ts`)

Creamos el archivo `index.ts` en `src/config/environment/` para exportar de forma limpia interfaces, clases y módulos de esta carpeta.

![](images/clipboard-2961400362.png)

------------------------------------------------------------------------

### Paso 24: Excepciones personalizadas (`common/exceptions`)

Para no manejar errores con códigos genéricos, creamos excepciones propias en `common/exceptions`: \* `domain.exception.ts` y `application.exception.ts`: errores base del dominio y la aplicación. \* `business-rule.exception.ts`: para cuando se incumple una regla del negocio en EntregaNexo. \* `entity-not-found.exception.ts`: para indicar con claridad cuando un registro no existe.

![](images/clipboard-4017690196.png)

![](images/clipboard-3121209796.png)

![](images/clipboard-3966589914.png)

------------------------------------------------------------------------

### Paso 25: Filtro global de errores (`common/filters/global-exception.filter.ts`)

Creamos el filtro `global-exception.filter.ts` para interceptar cualquier fallo en la aplicación y devolver una respuesta clara, estandarizada y ordenada (código de estado, mensaje y fecha).

![](images/clipboard-1628364076.png)

------------------------------------------------------------------------

### Paso 26: Interceptores para logs y respuestas (`common/interceptors`)

Creamos los interceptores en `src/common/interceptors/` para monitorear el rendimiento de la aplicación y estandarizar las respuestas: \* `logging.interceptor.ts`: para registrar cada petición que entra y su duración. \* `response.interceptor.ts`: para dar un formato unificado a todas las respuestas exitosas de la API. \* `timeout.interceptor.ts`: para cancelar peticiones que tarden más de lo debido.

![](images/clipboard-729599352.png)

![](images/clipboard-3125453890.png)

------------------------------------------------------------------------

### Paso 27: Conexión y persistencia con Sequelize (`infrastructure/database`)

Configuramos la capa de persistencia conectando Sequelize con la base de datos activa según las variables de entorno configuradas previamente.

![](images/clipboard-3065265943.png)

------------------------------------------------------------------------

### Paso 28: Verificación y arranque del backend

Completada la configuración global (**ISS-02**), probamos el servidor ejecutando `npm run start:dev` para certificar que compila correctamente, se conecta a la base de datos y queda escuchando peticiones sin errores.

![](images/clipboard-188415831.png)

------------------------------------------------------------------------

## 5. Fase 4: Implementación de la Feature Comercios (ISS-03)

Para construir las funcionalidades del negocio, implementamos la primera feature completa: **Comercios (`merchants`)**, aplicando el patrón de **Arquitectura Limpia (*Clean Architecture*)** dividido en cuatro capas ordenadas: `domain` → `application` → `infrastructure` → `presentation`.

### Paso 29: Capa de dominio de comercios (`domain`)

Definimos la entidad pura `Merchant` y sus reglas de negocio básicas, manteniéndola totalmente independiente de la base de datos y de frameworks externos.

![](images/clipboard-1643829612.png)

------------------------------------------------------------------------

### Paso 30: Capa de aplicación (`application`)

Implementamos los casos de uso y la lógica para crear, consultar y administrar los comercios aliados dentro de EntregaNexo.

![](images/clipboard-2253130582.png)

------------------------------------------------------------------------

### Paso 31: Capa de infraestructura (`infrastructure`)

Implementamos el acceso a datos conectando la entidad con la base de datos mediante los modelos y repositorios de Sequelize.

![](images/clipboard-2411552716.png)

------------------------------------------------------------------------

### Paso 32: Capa de presentación (`presentation`)

Creamos el controlador HTTP con sus endpoints para recibir las solicitudes web y delegar el trabajo a la capa de aplicación.

![](images/clipboard-2021436139.png)

------------------------------------------------------------------------

### Paso 33: Módulo de la feature y registro en Sequelize

Agrupamos todas las capas anteriores dentro de `merchants.module.ts` y registramos el modelo de comercios en la configuración de Sequelize para que la base de datos lo sincronice.

![](images/clipboard-2359390075.png)

![](images/clipboard-2252109006.png)

------------------------------------------------------------------------

## 6. Fase 5: Feature de Catálogo y Productos (ISS-04)

En la tarea **ISS-04**, replicamos el patrón de Arquitectura Limpia para la entidad **Producto** dentro del módulo `catalog`.

En **EntregaNexo**, los productos tienen una relación **Comercio 1:N Producto**: un producto no puede existir sin estar asociado a un comercio aliado, y por regla de negocio no se pueden agregar productos a comercios inactivos.

### Paso 34: Capa de dominio de productos (`domain`)

Definimos la entidad `Product` y sus interfaces de dominio, especificando sus atributos (nombre, precio, stock, estado y el enlace con el comercio correspondiente).

![](images/clipboard-777435265.png)

------------------------------------------------------------------------

### Paso 35: Capa de aplicación (`application`)

Creamos los casos de uso para registrar nuevos productos, validar que el comercio exista y consultar el catálogo de productos disponibles.

![](images/clipboard-564266017.png)

------------------------------------------------------------------------

### Paso 36: Capa de infraestructura (`infrastructure`)

Implementamos la persistencia creando el modelo de Sequelize con su relación hacia la tabla de comercios y el repositorio correspondiente.

![](images/clipboard-308269270.png)

------------------------------------------------------------------------

### Paso 37: Capa de presentación y módulo (`presentation`)

Creamos el controlador HTTP para exponer las rutas del catálogo y agrupamos todo dentro de `catalog.module.ts`.

![](images/clipboard-1045436499.png)

------------------------------------------------------------------------

### Paso 38: Registro del modelo en Sequelize y verificación del servidor

Añadimos el modelo `ProductModel` a la configuración global de Sequelize y comprobamos con `npm run start:dev` que el servidor levanta y sincroniza la nueva tabla sin inconvenientes.

![](images/clipboard-3061043949.png)

![](images/clipboard-43644877.png)

------------------------------------------------------------------------

## 7. Fase 6: Feature de Clientes (ISS-05)

Continuamos con la tarea **ISS-05** implementando la feature de **Clientes (`clients`)**.

Esta feature es un requisito indispensable antes de construir la feature de **Pedidos** (ISS-06). Cada pedido necesita asociar obligatoriamente dos llaves foráneas: un Producto y un Cliente. Sin la tabla de clientes lista, el sistema no permitiría registrar pedidos en la base de datos.

### Paso 39: Capa de dominio de clientes (`domain`)

Definimos la entidad pura `Client` con los atributos esenciales del comprador (nombre, correo, teléfono y dirección).

![](images/clipboard-4185589411.png)

------------------------------------------------------------------------

### Paso 40: Capa de aplicación (`application`)

Implementamos los casos de uso para registrar y consultar clientes en la plataforma.

![](images/clipboard-561364117.png)

------------------------------------------------------------------------

### Paso 41: Capa de infraestructura (`infrastructure`)

Creamos el modelo y repositorio de Sequelize para gestionar la persistencia de los clientes en la base de datos.

![](images/clipboard-1047076292.png)

------------------------------------------------------------------------

### Paso 42: Capa de presentación (`presentation`)

Definimos el controlador HTTP con los endpoints para clientes y agrupamos la feature en `clients.module.ts`.

![](images/clipboard-1412458033.png)

------------------------------------------------------------------------

### Paso 43: Registro del modelo de clientes en Sequelize

Registramos el modelo `ClientModel` en la configuración de Sequelize, dejando la base de datos lista para soportar la creación de pedidos en el siguiente paso.

![](images/clipboard-2407280965.png)

------------------------------------------------------------------------

## 8. Fase 7: Feature de Pedidos y Transacciones Atómicas (ISS-06)

En la tarea **ISS-06**, desarrollamos la feature de **Pedidos (`orders`)**, que agrupa las entidades `Order` (cabecera del pedido) y `OrderDetail` (productos y cantidades solicitadas).

Esta feature es una de las más críticas de la plataforma, ya que maneja reglas financieras y de consistencia: \* Comprueba que el cliente solicitante exista en el sistema. \* Valida que el comercio origen esté registrado y activo. \* Calcula subtotales, comisión de la plataforma y el total final. \* Aplica una **transacción atómica en base de datos**: la cabecera del pedido y todos sus detalles se guardan juntos de manera indivisible. Si ocurre algún error a mitad de camino, la base de datos ejecuta un *rollback* automático (deshace los cambios) para evitar inconsistencias financieras.

### Paso 44: Capa de dominio de pedidos (`domain`)

Definimos las entidades de dominio `Order` y `OrderDetail`, junto con sus estados posibles (pendiente, confirmado, entregado, cancelado) y los métodos para calcular los totales de la compra.

![](images/clipboard-510917357.png)

------------------------------------------------------------------------

### Paso 45: Capa de aplicación de pedidos (`application`)

Implementamos los DTOs, mappers y el caso de uso para crear pedidos, coordinando la validación del cliente, del comercio y del cálculo de importes.

![](images/clipboard-2573580510.png)

------------------------------------------------------------------------

### Paso 46: Capa de infraestructura y transacciones atómicas (`infrastructure`)

Creamos los modelos `OrderModel` y `OrderDetailModel` en Sequelize, y desarrollamos el repositorio implementando transacciones de base de datos (`transaction`). De esta manera, aseguramos que la orden y sus detalles se guarden con atomicidad (todo o nada).

![](images/clipboard-3568792631.png)

![](images/clipboard-2513636659.png)

------------------------------------------------------------------------

### Paso 47: Capa de presentación y módulo (`presentation`)

Construimos el controlador HTTP para recibir las solicitudes de pedidos a través de los endpoints de la API y empaquetamos todo dentro de `orders.module.ts`.

![](images/clipboard-426447687.png)

------------------------------------------------------------------------

### Paso 48: Registro de los modelos de pedidos en Sequelize

Añadimos `OrderModel` y `OrderDetailModel` al arreglo de modelos en `sequelize.factory.ts`, dejando registradas ambas tablas para su sincronización con la base de datos.

------------------------------------------------------------------------

## 9. Fase 8: Pruebas Automatizadas y Validación con Swagger

### Paso 49: Configuración y ejecución de pruebas con Vitest

Configuramos el entorno de pruebas automatizadas con Vitest y ejecutamos una prueba de integración (E2E) para verificar que los componentes y endpoints de la aplicación respondan de forma consistente.

![](images/clipboard-1028348338.png)

![](images/clipboard-1364593190.png)

------------------------------------------------------------------------

### Paso 50: Verificación visual de endpoints mediante Swagger UI

Para probar la API de forma interactiva, aprovechamos la integración con Swagger accediendo desde el navegador a `http://localhost:3002/api/docs`. Allí encontramos documentados todos los endpoints creados para `merchants`, `catalog`, `clients` y `orders`.

![](images/clipboard-926507668.png)

![](images/clipboard-680027137.png)

------------------------------------------------------------------------

### Paso 51: Ejecución de peticiones y respuesta exitosa (HTTP 200)

Realizamos pruebas sobre los endpoints directamente desde la interfaz de Swagger y comprobamos que las solicitudes se procesan correctamente, retornando un código de estado `200 OK` con los datos esperados.

![](images/clipboard-2784400618.png)

------------------------------------------------------------------------

## 10. Fase 9: Pruebas y Validación Multibase de Datos

Una de las ventajas clave de la arquitectura desacoplada que configuramos con Sequelize y variables de entorno es la **portabilidad total**: podemos alternar entre los distintos motores de base de datos relacionales simplemente cambiando una variable en el archivo `.env`, sin necesidad de modificar el código de la aplicación.

### Paso 52: Validación y sincronización en PostgreSQL

Cambiamos la variable `DB_DIALECT` a `postgres` en el archivo `.env`:

![](images/clipboard-4001576782.png)

Iniciamos el servidor en modo desarrollo (`npm run start:dev`) y comprobamos en la consola que la conexión con el contenedor `entreganexo-postgres` se establece sin problemas, sincronizando y creando automáticamente las 5 tablas del proyecto (`merchants`, `products`, `clients`, `orders` y `order_details`):

![](images/clipboard-2418275698.png)

------------------------------------------------------------------------

### Paso 53: Validación y sincronización en Microsoft SQL Server (MSSQL)

Repetimos la prueba configurando el dialecto para SQL Server (`DB_DIALECT=mssql`) en el archivo `.env`:

![](images/clipboard-2298676173.png)

Verificamos en la terminal que el driver `tedious` se conecta correctamente al contenedor `entreganexo-mssql`, levantando el servidor y dejando las tablas sincronizadas en la base de datos:

![](images/clipboard-3170095620.png)

------------------------------------------------------------------------

### Paso 54: Validación y sincronización en Oracle Database

Por último, probamos la conexión con **Oracle** ajustando la configuración a `DB_DIALECT=oracle` en el archivo `.env`.

Comprobamos en los registros de la terminal que el cliente `oracledb` se conecta de forma exitosa a la instancia de Oracle y que el servidor queda activo y listo para operar:

![](images/clipboard-3243058714.png)

------------------------------------------------------------------------

## 11. Fase 10: Comprobación Visual de Tablas en DBeaver

Para tener una confirmación visual directa del estado de las bases de datos en los contenedores Docker, abrimos el gestor **DBeaver** y nos conectamos a cada uno de los cuatro motores. Comprobamos que todas las conexiones están activas:

![](images/clipboard-988046604.png)

A continuación, verificamos que las 5 tablas creadas por el backend (`merchants`, `products`, `clients`, `orders` y `order_details`) existen físicamente con sus columnas y relaciones en cada motor:

### Paso 55: Verificación de tablas en MySQL (DBeaver)

Comprobamos en DBeaver la conexión al contenedor de MySQL y verificamos la presencia de las tablas del marketplace:

![](images/clipboard-3522718187.png)

------------------------------------------------------------------------

### Paso 56: Verificación de tablas en PostgreSQL (DBeaver)

Revisamos en el esquema de PostgreSQL que las tablas y sus tipos de datos se crearon correctamente:

![](images/clipboard-3737651871.png)

------------------------------------------------------------------------

### Paso 57: Verificación de tablas en Microsoft SQL Server (DBeaver)

Nos conectamos a la base de datos de SQL Server y comprobamos las tablas generadas bajo el esquema correspondiente:

![](images/clipboard-4023028902.png)

------------------------------------------------------------------------

### Paso 58: Verificación de tablas en Oracle Database (DBeaver)

Finalmente, accedemos a la instancia de Oracle y corroboramos que todas las tablas y restricciones quedaron registradas en el esquema de la base de datos:

![](images/clipboard-2754250114.png)

------------------------------------------------------------------------

## 12. Fase 11: Reestructuración y Consolidación del Backend (`backend-full`)

Para consolidar el desarrollo en una versión definitiva, limpia y estandarizada con las mejores prácticas de NestJS, iniciamos la reestructuración completa del backend creando el proyecto `backend-full`.

### Paso 59: Creación del proyecto base con NestJS CLI (`backend-full`)

Creamos la carpeta `backend-full` y generamos la estructura limpia del proyecto utilizando el CLI oficial de NestJS:

![](images/clipboard-1454525543.png)

![](images/clipboard-4290269056.png)

------------------------------------------------------------------------

### Paso 60: Instalación de dependencias del núcleo y desarrollo

Instalamos los paquetes necesarios para la arquitectura y conectividad: Sequelize, decoradores tipados, drivers para las cuatro bases de datos (MySQL, PostgreSQL, SQL Server y Oracle), utilidades de validación (`class-validator`), Swagger y herramientas de testing con Vitest:

![](images/clipboard-2427658075.png)

![](images/clipboard-644668646.png)

------------------------------------------------------------------------

### Paso 61: Migración a módulos ESM y scripts en `package.json`

Modificamos el archivo `package.json` agregando `"type": "module"` para utilizar el estándar moderno de módulos ECMAScript y definimos los scripts de compilación, ejecución, formateo y pruebas sin afectar las dependencias instaladas por NestJS:

![](images/clipboard-667243716.png)

------------------------------------------------------------------------

### Paso 62: Configuración de TypeScript y herramientas de compilación

Ajustamos las opciones en `tsconfig.json` y `tsconfig.build.json` para soportar ESM, decoradores y rutas absolutas:

![](images/clipboard-2671170191.png)

------------------------------------------------------------------------

### Paso 63: Script para liberar puertos (`scripts/free-port.js`)

Configuramos el script `free-port.js` que se ejecuta antes de `npm run start:dev` para buscar cualquier proceso que esté ocupando el puerto 3002 y cerrarlo automáticamente, asegurando que NestJS inicie sin conflictos de puerto:

![](images/clipboard-3037541733.png)

------------------------------------------------------------------------

### Paso 64: Estructuración de la arquitectura de EntregaNexo en `backend-full`

Organizamos el árbol de carpetas dentro de `src/` adoptando la Arquitectura Limpia modular (`common`, `config`, `features/business`, `health`, `infrastructure`) para albergar todas las entidades y reglas de negocio del sistema:

![](images/clipboard-2330050971.png)

------------------------------------------------------------------------

## 13. Fase 12: Capa Transversal, Base de Datos y Bootstrap en `backend-full`

Para dotar al nuevo backend de robustez técnica y conectividad completa, implementamos la configuración de entorno, el manejo transversal de excepciones, los interceptores de red, la conexión Sequelize y el punto de arranque de la aplicación.

### Paso 65: Contrato tipado de variables de entorno (`env.interface.ts`)

Definimos en `src/config/environment/env.interface.ts` los tipos estrictos e interfaces para el puerto, entorno, dialectos soportados y bloques de conexión de cada base de datos.

![](images/clipboard-3483315941.png)

------------------------------------------------------------------------

### Paso 66: Validación de variables de entorno (`env.validation.ts`)

Configuramos `env.validation.ts` utilizando decoradores de `class-validator` para validar anticipadamente que los datos de conexión requeridos por el motor activo existan antes de levantar el servidor.

![](images/clipboard-3667879465.png)

------------------------------------------------------------------------

### Paso 67: Selector dinámico de base de datos activa (`db-env.ts`)

Implementamos la función selectora en `db-env.ts` para extraer automáticamente los parámetros de conexión correspondientes al dialecto configurado en `DB_DIALECT`.

![](images/clipboard-165445130.png)

------------------------------------------------------------------------

### Paso 68: Construcción del objeto de configuración global (`env.config.ts`)

Creamos `env.config.ts` para transformar las variables de entorno validadas en un objeto fuertemente tipado consumible por la aplicación.

![](images/clipboard-3105560146.png)

------------------------------------------------------------------------

### Paso 69: Módulo global de configuración con inyección de dependencias (`environment.module.ts`)

Configuramos `environment.module.ts` como un módulo `@Global()` de NestJS para que la configuración esté disponible mediante inyección de dependencias en toda la arquitectura sin duplicar imports.

![](images/clipboard-3816463324.png)

------------------------------------------------------------------------

### Paso 70: Jerarquía de excepciones personalizadas (`src/common/exceptions/`)

Estructuramos las clases de excepción personalizadas (`ApplicationException`, `DomainException`, `BusinessRuleException` y `EntityNotFoundException`) para clasificar adecuadamente cualquier error de negocio o del sistema.

![](images/clipboard-3771194625.png)

------------------------------------------------------------------------

### Paso 71: Filtro global de errores con respuesta uniforme (`global-exception.filter.ts`)

Implementamos `global-exception.filter.ts` para capturar cualquier excepción y responder al cliente con un formato estándar y consistente (código de estado, mensaje y marca de tiempo).

![](images/clipboard-3581793290.png)

------------------------------------------------------------------------

### Paso 72: Interceptor de respuestas estándar (`response.interceptor.ts`)

Creamos el interceptor de respuestas exitosas en `src/common/interceptors/` para envolver todos los retornos de los endpoints en una estructura uniforme con estado y datos.

![](images/clipboard-2758283863.png)

------------------------------------------------------------------------

### Paso 73: Interceptor de observabilidad y auditoría de peticiones (`logging.interceptor.ts`)

Implementamos el interceptor de logs para registrar en consola el método HTTP, la URL consultada y la duración exacta de cada petición que procesa el servidor.

![](images/clipboard-4039789995.png)

------------------------------------------------------------------------

### Paso 74: Interceptor de tiempo límite de peticiones (`timeout.interceptor.ts`)

Configuramos el interceptor de timeout para cancelar de forma segura peticiones que excedan el límite temporal establecido, evitando sobrecarga en el servidor.

![](images/clipboard-3736526020.png)

------------------------------------------------------------------------

### Paso 75: Fábrica de conexión Sequelize (`sequelize.factory.ts`)

Creamos la función fábrica `sequelizeFactory` en `src/infrastructure/database/sequelize/sequelize.factory.ts` para instanciar Sequelize dinámicamente según el dialecto configurado (`mysql`, `postgres`, `mssql`, `oracle`), asignando las credenciales validadas y la lista centralizada de modelos.

![](images/clipboard-1953404609.png)

------------------------------------------------------------------------

### Paso 76: Módulo global de base de datos (`sequelize.module.ts`)

Configuramos `sequelize.module.ts` como un módulo `@Global()` que provee la instancia de Sequelize a través del contenedor de inyección de dependencias de NestJS, permitiendo el acceso a la base de datos sin reconexiones innecesarias.

![](images/clipboard-1730860753.png)

------------------------------------------------------------------------

### Paso 77: Endpoint técnico de monitoreo (`health.controller.ts`)

Implementamos `health.controller.ts` dentro de `src/health/` para exponer una ruta técnica (`/health`) que permite comprobar rápidamente desde el navegador o herramientas de monitoreo si el servidor está activo y respondiendo.

![](images/clipboard-1758764378.png)

------------------------------------------------------------------------

### Paso 78: Bootstrap principal de la aplicación (`main.ts`)

Estructuramos el archivo de arranque `src/main.ts` donde se inicializa la aplicación NestJS, se aplican los pipes globales de validación (`ValidationPipe`), se registran los interceptores y el filtro global de errores, y se inicializa la documentación interactiva con Swagger antes de comenzar a escuchar en el puerto definido.

![](images/clipboard-4258991011.png)

------------------------------------------------------------------------

### Paso 79: Verificación y arranque del backend en desarrollo

Ejecutamos el comando `npm run start:dev` y confirmamos en la terminal que `backend-full` inicia correctamente, compila sin errores, inicializa los módulos y queda listo para recibir peticiones.

![](images/clipboard-3897032497.png)

------------------------------------------------------------------------

## 14. Fase 13: Feature de Clientes en `backend-full` (ISS-03)

Para iniciar la construcción de las features de negocio en `backend-full`, desarrollamos el módulo de **Clientes (`clients`)** aplicando Arquitectura Limpia (*Clean Architecture*) en sus cuatro capas (**Dominio**, **Aplicación**, **Infraestructura** y **Presentación**):

### Paso 80: Entidad de negocio de clientes (`client.entity.ts`)

Definimos la entidad pura `Client` en `src/features/business/clients/domain/entities/` con las propiedades del cliente y sus validaciones esenciales de dominio.

![](images/clipboard-2539423928.png)

------------------------------------------------------------------------

### Paso 81: Puerto del repositorio de clientes (`client.repository.ts`)

Declaramos la interfaz `IClientRepository` en `domain/interfaces/` que actúa como puerto para las operaciones de persistencia, manteniendo la lógica de negocio desacoplada de Sequelize.

![](images/clipboard-2722704499.png)

------------------------------------------------------------------------

### Paso 82: Excepciones de dominio de clientes (`domain/exceptions/`)

Creamos las excepciones específicas del módulo de clientes para emitir errores de negocio precisos (como duplicidad de documentos o correos).

![](images/clipboard-916323934.png)

------------------------------------------------------------------------

### Paso 83: DTO de entrada para clientes (`create-client.dto.ts`)

Definimos el DTO en `application/dto/` con las reglas de validación (`class-validator`) que deben cumplir los datos que llegan desde las peticiones HTTP.

![](images/clipboard-3034465676.png)

------------------------------------------------------------------------

### Paso 84: Mapper de clientes (`client.mapper.ts`)

Implementamos el mapper en `application/mappers/` para transformar de forma limpia entre los datos del DTO, la entidad de dominio y los objetos de respuesta.

![](images/clipboard-364478051.png)

------------------------------------------------------------------------

### Paso 85: Caso de uso para crear clientes (`CreateClientUseCase`)

Implementamos `CreateClientUseCase` en `application/use-cases/` para orquestar la creación de un nuevo cliente, validando reglas de negocio antes de persistirlo en el repositorio.

![](images/clipboard-1849351583.png)

------------------------------------------------------------------------

### Paso 86: Caso de uso para consultar cliente por ID (`GetClientByIdUseCase`)

Creamos `GetClientByIdUseCase` para buscar un cliente por su identificador único y lanzar la excepción `EntityNotFoundException` si no existe.

![](images/clipboard-2872868834.png)

------------------------------------------------------------------------

### Paso 87: Caso de uso para listar y paginar clientes (`ListClientsUseCase`)

Implementamos `ListClientsUseCase` para consultar el listado de clientes registrados con soporte para paginación y formateo de la respuesta.

![](images/clipboard-1825084865.png)

------------------------------------------------------------------------

### Paso 88: Modelo ORM de clientes con Sequelize (`client.model.ts`)

En la capa de Infraestructura (`infrastructure/persistence/models/`), definimos el modelo `ClientModel` extendiendo de `Model` de `sequelize-typescript`. Lo vinculamos a la tabla `clients` con timestamps automáticos y mapeamos las columnas de persistencia (`id`, `name`, `email`, `phone`, `address` y `status`).

![](images/clipboard-1889476970.png)

------------------------------------------------------------------------

### Paso 89: Implementación concreta del repositorio de clientes (`client.repository.ts`)

En `infrastructure/persistence/repositories/`, implementamos la clase `ClientRepository` que cumple con la interfaz `IClientRepository` (el puerto de dominio). Inyectamos la conexión global de Sequelize (`@Inject(SEQUELIZE)`) para realizar las consultas a la base de datos (`create`, `findAll`, `findById`, `findByEmail`, `count`) y convertimos los resultados a entidades de dominio mediante el método privado `toDomain`.

![](images/clipboard-1335460621.png)

------------------------------------------------------------------------

### Paso 90: Seeder para datos iniciales de prueba (`client.seeder.ts`)

Creamos el seeder en `infrastructure/persistence/seeders/` para precargar de manera idempotente un cliente de demostración (`demo.cliente@tecnogua.edu.co`). Si el cliente ya existe en la base de datos, el seeder lo omite; si no, lo registra automáticamente para facilitar las pruebas del laboratorio.

![](images/clipboard-2136413724.png)

------------------------------------------------------------------------

### Paso 91: Controlador HTTP de clientes (`clients.controller.ts`)

En la capa de Presentación (`presentation/http/controllers/`), implementamos `ClientsController` etiquetado para Swagger con `@ApiTags('clients')`. Exponemos las rutas REST para la gestión de clientes: `POST /clients` (creación con validación del DTO), `GET /clients` (listado con paginación por query params) y `GET /clients/:id` (búsqueda por identificador con validación numérica mediante `ParseIntPipe`).

![](images/clipboard-3331515001.png)

------------------------------------------------------------------------

### Paso 92: Módulo de clientes y cableado de dependencias (`clients.module.ts`)

Creamos `clients.module.ts` en `src/features/business/clients/` para conectar todas las piezas de la feature. Declaramos el controlador, registramos los casos de uso y el seeder como providers, y vinculamos la abstracción del puerto con su implementación concreta `{ provide: CLIENT_REPOSITORY, useClass: ClientRepository }`, exportando el repositorio y el seeder.

![](images/clipboard-2070953934.png)

------------------------------------------------------------------------

### Paso 93: Registro del modelo en la fábrica Sequelize (`sequelize.factory.ts`)

Actualizamos `src/infrastructure/database/sequelize/sequelize.factory.ts` importando `ClientModel` e incorporándolo al arreglo `ALL_MODELS`. De esta manera, al inicializarse la conexión a la base de datos, Sequelize carga y sincroniza la tabla de clientes en el motor que esté activo.

![](images/clipboard-1095639418.png)

------------------------------------------------------------------------

### Paso 94: Integración de la feature en el módulo raíz (`app.module.ts`)

Finalmente, registramos `ClientsModule` en el arreglo `imports` de `src/app.module.ts` junto con `EnvironmentModule` y `SequelizeModule`. Con esto, la feature de clientes queda plenamente integrada al ciclo de vida global de NestJS y lista para recibir peticiones HTTP.

![](images/clipboard-1822183103.png)

------------------------------------------------------------------------

### Paso 95: Verificación del backend y mapeo de rutas en consola

Ejecutamos el comando `npm run start:dev` y confirmamos en la terminal que `backend-full` inicia correctamente sin errores, carga los módulos `EnvironmentModule`, `SequelizeModule` y `ClientsModule`, y mapea adecuadamente las rutas para el controlador de clientes (`POST /api/clients`, `GET /api/clients`, `GET /api/clients/:id`) junto con la ruta de salud (`/api/health`).

![](images/clipboard-1392727739.png)

------------------------------------------------------------------------

### Paso 96: Comprobación interactiva en Swagger UI

Abrimos el navegador en `http://localhost:3002/api/docs` y corroboramos que la documentación interactiva de Swagger UI refleja el bloque de endpoints para **clients**, permitiendo probar la creación, el listado y la consulta por ID, además de validar el esquema `CreateClientDto`.

![](images/clipboard-4273590055.png)

------------------------------------------------------------------------

## 15. Fase 14: Feature de Tipos de Productos en `backend-full` (ISS-04 - En Proceso)

Para avanzar con la estructuración del catálogo de productos en `backend-full`, comenzamos la construcción del módulo de **Tipos de Productos (`product-types`)** aplicando Arquitectura Limpia (*Clean Architecture*) en sus cuatro capas:

### Paso 97: Entidad de dominio de tipos de producto (`product-type.entity.ts`)

En la capa de Dominio (`src/features/business/product-types/domain/entities/`), definimos la entidad pura `ProductType` y el tipo `ProductTypeStatus`, encapsulando los atributos fundamentales (`id`, `name`, `description` y `status`) y asignando por defecto el estado `'active'`.

![](images/clipboard-4117774527.png)

------------------------------------------------------------------------

### Paso 98: Puerto del repositorio de tipos de producto (`product-type.repository.ts`)

En `domain/interfaces/`, declaramos el contrato `IProductTypeRepository` y la constante de inyección `PRODUCT_TYPE_REPOSITORY`. Este puerto define los métodos de persistencia requeridos (`create`, `findAll`, `findById`, `findByName` y `count`) sin acoplarse a ningún ORM específico.

![](images/clipboard-515091790.png)

------------------------------------------------------------------------

### Paso 99: Excepciones de dominio para tipos de producto (`product-type.exceptions.ts`)

En `domain/exceptions/`, creamos las excepciones personalizadas del módulo: `ProductTypeNotFoundException` (extendiendo de `EntityNotFoundException`) para cuando no se encuentra un registro por su ID, y `ProductTypeNameAlreadyExistsException` (extendiendo de `BusinessRuleException`) para evitar nombres duplicados.

![](images/clipboard-3482351172.png)

------------------------------------------------------------------------

### Paso 100: DTO de entrada para creación de tipos de producto (`create-product-type.dto.ts`)

En la capa de Aplicación (`application/dto/`), definimos `CreateProductTypeDto` aplicando decoradores de Swagger (`@ApiProperty`, `@ApiPropertyOptional`) y validadores de `class-validator` (`@IsString`, `@IsNotEmpty`, `@MaxLength`, `@IsOptional`) para garantizar la integridad de los datos entrantes.

![](images/clipboard-181117078.png)

------------------------------------------------------------------------

### Paso 101: Mapper de tipos de producto (`product-type.mapper.ts`)

En `application/mappers/`, implementamos `ProductTypeMapper` con los métodos estáticos `toEntity` (para convertir el DTO en una entidad de negocio) y `toResponse` (para dar formato limpio a los datos que se retornan al cliente).

![](images/clipboard-3337555345.png)

------------------------------------------------------------------------

### Paso 102: Caso de uso para crear tipos de producto (`CreateProductTypeUseCase`)

En `application/use-cases/`, creamos `CreateProductTypeUseCase` inyectando el puerto `PRODUCT_TYPE_REPOSITORY`. Antes de registrar el tipo de producto, verifica que no exista otro con el mismo nombre; si ya existe lanza `ProductTypeNameAlreadyExistsException`, y si es válido lo persiste y lo retorna.

![](images/clipboard-3287301155.png)

------------------------------------------------------------------------

### Paso 103: Casos de uso para consultar por ID y listar tipos de producto

Implementamos en `application/use-cases/` los casos de uso de lectura: `GetProductTypeByIdUseCase` para buscar por identificador y lanzar `ProductTypeNotFoundException` si no existe, y `ListProductTypesUseCase` para paginar los resultados calculando el total de páginas y formateando la salida mediante el mapper.

![](images/clipboard-3894115374.png)

------------------------------------------------------------------------

### Paso 104: Modelo ORM de tipos de producto con Sequelize (`product-type.model.ts`)

En la capa de Infraestructura (`infrastructure/persistence/models/`), definimos `ProductTypeModel` mapeado a la tabla `product_types` mediante decoradores de `sequelize-typescript`, estableciendo clave primaria autoincremental, nombre único no nulo, descripción opcional, estado por defecto `'active'` y marcas de tiempo automáticas.

![](images/clipboard-1381634182.png)

------------------------------------------------------------------------

### Paso 105: Implementación concreta del repositorio de tipos de producto (`product-type.repository.ts`)

En `infrastructure/persistence/repositories/`, implementamos `ProductTypeRepository` cumpliendo con la interfaz `IProductTypeRepository`. Inyectamos la conexión Sequelize (`@Inject(SEQUELIZE)`), interactuamos con `ProductTypeModel` para realizar las operaciones CRUD y mapeamos los modelos devueltos a entidades puras de dominio.

![](images/clipboard-2121395114.png)

------------------------------------------------------------------------

### Paso 106: Seeder para datos iniciales de tipos de producto (`product-type.seeder.ts`)

En `infrastructure/persistence/seeders/`, creamos `ProductTypeSeeder` para poblar la base de datos con una categoría inicial de prueba (`'Bebidas'`). La ejecución es idempotente, revisando primero si ya existe para evitar inserciones redundantes.

![](images/clipboard-2184940826.png)

------------------------------------------------------------------------

### Paso 107: Controlador HTTP de tipos de producto (`product-types.controller.ts`)

En la capa de Presentación (`presentation/http/controllers/`), definimos `ProductTypesController` con la ruta base `@Controller('product-types')` y etiquetas para Swagger (`@ApiTags('product-types')`). Exponemos las rutas REST: `POST /product-types` (creación con código HTTP 201), `GET /product-types` (listado paginado por query params) y `GET /product-types/:id` (búsqueda por ID con `ParseIntPipe`).

![](images/clipboard-3996428410.png)

------------------------------------------------------------------------

## 

ejecutamos run dev y vemos que ya aparece nuestra tabla product_types

![![](images/clipboard-1144059305.png)](images/clipboard-4110600696.png)

**ISS-05 · Feature products**

Guía didáctica detallada: FK a product-types y regla de stock

# **Domain: Product y reduceStock()**

**product.entity.ts**

![](images/clipboard-1953043203.png)

**product.repository.ts**

![](images/clipboard-1344973735.png)

# **Application: DTO y validación cruzada**

**create-product.dto.ts (resumen)**

![](images/clipboard-1724698254.png)

**CreateProductUseCase**

![](images/clipboard-2708465177.png)

![](images/clipboard-445525447.png)

# **Infrastructure: FK real**

**Fragmento de product.model.ts**

![](images/clipboard-976394963.png)

![](images/clipboard-4076455548.png)

# **Seeder y módulo**

**product.seeder.ts**

![](images/clipboard-3619074067.png)

![](images/clipboard-1151970402.png)

### El Ensamblaje Final

Observa que el `ProductsModule` ahora importa expresamente el `ProductTypesModule` para poder utilizar su repositorio.

![](images/clipboard-258491903.png)

![](images/clipboard-2612446697.png)

![](images/clipboard-2422783382.png)

vemos nuestras ttablas actualizadas

![](images/clipboard-3590732119.png)

**ISS-06 · Sales y stock ——**

caso transaccional, servicio de dominio y bloqueo
