# Guía Paso a Paso: Configuración del Entorno y Backend - EntregaNexo

**Asignatura:** Desarrollo Web\
**Proyecto:** EntregaNexo\
**Documento:** Guía práctica del proceso de configuración y desarrollo

------------------------------------------------------------------------

## 1. Introducción y Contexto del Proyecto

EntregaNexo es una plataforma pensada para conectar comercios locales, compradores y repartidores independientes. En la aplicación: \* Cada pedido puede reunir productos de una tienda específica. \* Los pedidos van cambiando de estado según avanzan en la entrega. \* Se gestiona el cobro al cliente, la comisión de la plataforma y el pago correspondiente al comercio aliado. \* Se asigna al repartidor según su zona y disponibilidad, se hace el seguimiento del pedido y se manejan cancelaciones evitando errores con el dinero.

### ¿Qué hicimos en esta etapa?

Para desarrollar el proyecto de manera ordenada, organizamos el trabajo por fases y tareas (*issues*): 1. **Bases de Datos con Docker:** Levantamos cuatro bases de datos distintas (**MySQL**, **PostgreSQL**, **SQL Server** y **Oracle**) usando Docker Compose, guardando la información en carpetas locales. 2. **Estructura Base del Backend (ISS-01):** Creamos el proyecto con NestJS, instalamos librerías necesarias, preparamos herramientas de desarrollo y estructuramos las carpetas. 3. **Configuración Global y Errores (ISS-02):** Validamos variables de entorno, configuramos Sequelize, interceptores, excepciones personalizadas y el filtro global de errores. 4. **Feature Comercios (ISS-03):** Implementamos el módulo de comercios aliados (`merchants`) aplicando Arquitectura Limpia (*Clean Architecture*) en cuatro capas. 5. **Feature Catálogo y Productos (ISS-04 - En Proceso):** Iniciamos el módulo de productos (`catalog`), estableciendo la relación entre comercios y productos.

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

## 6. Fase 5: Feature de Catálogo y Productos (ISS-04 - En Proceso)

Iniciamos la tarea **ISS-04**, donde replicamos el mismo patrón de Arquitectura Limpia para la entidad **Producto** dentro del módulo `catalog`.

En **EntregaNexo**, los productos tienen una relación directa **Comercio 1:N Producto**: un producto no puede existir sin estar asociado a un comercio aliado, y por regla de negocio no se pueden agregar productos a comercios inactivos.

### Paso 34: Capa de dominio de productos (`domain` - En proceso)

Comenzamos definiendo la entidad de dominio para los productos, estableciendo sus atributos principales (nombre, precio, stock, estado y el enlace con el comercio correspondiente).

![](images/clipboard-777435265.png)

### 2. Capa de Aplicación (`application`)

![](images/clipboard-564266017.png)

### 3. Capa de Infraestructura (`infrastructure`)

![](images/clipboard-308269270.png)

### 4. Capa de Presentación y Registro (`presentation`)

![](images/clipboard-1045436499.png)

### 5. Añadir el modelo a Sequelize

![](images/clipboard-3061043949.png)
