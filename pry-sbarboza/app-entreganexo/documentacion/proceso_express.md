# Guía Paso a Paso: Backend con Express + TypeScript + Sequelize - EntregaNexo

**Asignatura:** Desarrollo Web\
**Proyecto:** EntregaNexo\
**Documento:** Guía práctica del proceso de desarrollo del backend con Express

------------------------------------------------------------------------

## 1. Introducción y Contexto del Proyecto

EntregaNexo es una plataforma de entregas a domicilio pensada para conectar comercios locales, clientes y repartidores independientes. En esta etapa reconstruimos el backend utilizando **Express** como framework, siguiendo la *Guía Backend 2026 - Express* del curso. El objetivo es obtener un backend organizado por *features*, en el que cada petición recorre todas las capas sin saltarse ninguna:

`HTTP → Controller → Service → Repository → Model → Sequelize → BD`

Mantenemos las rutas de la API que ya consume el frontend de EntregaNexo (por ejemplo `/api/auth/login` y `/api/product-types`), de modo que la aplicación Angular siga funcionando sin cambios.

### Tecnologías que utilizamos

- **Docker y Docker Compose:** contenedores de las bases de datos (el entorno se documentó en `proceso.md`, Pasos 1 a 15).
- **Node.js y npm:** entorno de ejecución y gestor de paquetes.
- **Express 5:** framework HTTP sobre el que se construye la API.
- **TypeScript:** tipado estático del código del backend.
- **Sequelize:** ORM para los modelos, las relaciones y las transacciones.
- **Faker:** generación de datos de prueba en los seeders.
- **Swagger (OpenAPI):** documentación interactiva de los endpoints.
- **JWT y Bcrypt:** tokens de sesión y encriptación de contraseñas.

### Organización del trabajo

El desarrollo está organizado en dos fases y en bloques (*issues*), cada uno cerrado con su compuerta de verificación (GATE):

1.  **Fase I: Business (sin autenticación)**
    - **ISS-00:** Requisitos previos.
    - **ISS-01:** Esqueleto del proyecto.
    - **ISS-02:** Infraestructura de base de datos.
    - **ISS-03:** Feature de Clientes (CRUD por capas).
    - **ISS-04:** Seeders con Faker.
    - **ISS-05:** Swagger / OpenAPI.
    - **ISS-06:** Feature de Tipos de Producto.
    - **ISS-07:** Feature de Productos.
    - **ISS-08:** Feature de Ventas y Detalle de Ventas.
    - **Cierre de la Fase I.**
2.  **Fase II: Autenticación con RBAC**
    - **ISS-09:** Base de seguridad compartida y modelos de autenticación.
    - **ISS-10:** Feature de Usuarios.
    - **ISS-11:** Features de Roles y Recursos.
    - **ISS-12:** Asignaciones de roles y concesiones de permisos.
    - **ISS-13:** Middlewares de acceso y las tres modalidades.
    - **ISS-14:** Tokens de refresco (sesiones renovables y revocables).
    - **ISS-15:** Sesión (login, refresh, logout, perfil y permisos).
    - **Cierre de la Fase II.**

A continuación, detallamos cada uno de los pasos que realizamos.

------------------------------------------------------------------------

## ISS-00: Requisitos Previos

Antes de escribir una sola línea del backend verificamos que el entorno de trabajo esté listo: Node.js en versión 20 o superior, npm disponible y un motor de base de datos accesible. Este bloque no crea archivos; su función es de diagnóstico.

### Paso 1: Verificación de la versión de Node.js

Ejecutamos `node -v` para comprobar la versión del intérprete de Node.js. Express 5, TypeScript y ts-node requieren una versión moderna; obtuvimos la versión 24, que cumple el requisito de v20 o superior.

![](images/express/iss00-01-node-version.png)

------------------------------------------------------------------------

### Paso 2: Verificación de la versión de npm

Ejecutamos `npm -v` para confirmar que el gestor de paquetes responde correctamente, ya que todos los bloques siguientes instalan dependencias con `npm install`.

![](images/express/iss00-02-npm-version.png)

------------------------------------------------------------------------

### Paso 3: Levantamiento del contenedor de MySQL

Comprobamos con `docker ps` que el contenedor `entreganexo-mysql`, definido en nuestro `docker-compose.yml`, se encuentra en ejecución y expone el puerto 3306. Utilizamos MySQL porque es el motor recomendado para la primera sincronización de las tablas.

![](images/express/iss00-03-docker-mysql.png)

------------------------------------------------------------------------

### Paso 4: Comprobación de que el motor de base de datos responde

Ejecutamos `mysqladmin ping` dentro del contenedor, leyendo la contraseña desde la variable de entorno del propio contenedor para no escribirla en la consola. La respuesta `mysqld is alive` confirma que el motor está accesible y listo para la conexión que haremos en el ISS-02.

![](images/express/iss00-04-mysql-ping.png)

------------------------------------------------------------------------

### Paso 5: Verificación conjunta del ISS-00 (GATE)

Ejecutamos `node -v && npm -v`, el comando de verificación que define el ISS. El operador `&&` ejecuta el segundo comando solo si el primero tuvo éxito, por lo que ambas versiones impresas sin errores confirman que el entorno cumple los criterios de aceptación:

- [x] `node -v` muestra v20 o superior (v24.x).
- [x] `npm -v` responde.
- [x] Motor de base de datos accesible (MySQL).

![](images/express/iss00-05-verificacion-gate.png)

------------------------------------------------------------------------

## ISS-01: Esqueleto del Proyecto

En este bloque creamos el proyecto npm del backend en la carpeta `backend-express`, definimos la estructura de carpetas por *features*, instalamos las dependencias base de Express y TypeScript, configuramos el compilador y escribimos el esqueleto del servidor HTTP.

### Paso 6: Creación del proyecto con `npm init`

Creamos la carpeta `backend-express` junto a los demás proyectos de EntregaNexo, entramos en ella e inicializamos el proyecto con `npm init -y`, que genera un `package.json` con valores por defecto. También creamos la carpeta `docs` para la documentación del backend.

![](images/express/iss01-01-npm-init.png)

------------------------------------------------------------------------

### Paso 7: Parche de scripts y tipo de módulo en `package.json`

Editamos el `package.json` generado para dejar únicamente los dos scripts del proyecto: `build`, que ejecuta `tsc` y compila `src/` hacia `dist/`, y `dev`, que arranca `nodemon` vigilando los archivos `.ts` de `src/` y ejecutando el servidor con `ts-node`. Confirmamos además que `"type"` sea `"commonjs"`, el sistema de módulos que usa todo el proyecto.

![](images/clipboard-2330491368.png)

------------------------------------------------------------------------

### Paso 8: Verificación de los scripts definidos

Comprobamos desde la consola que el `package.json` contiene exactamente los scripts `build` y `dev`, leyendo el archivo con Node.

![](images/express/iss01-02-verificar-scripts.png)

------------------------------------------------------------------------

### Paso 9: Creación de la estructura de carpetas por features

Creamos con un solo comando `mkdir -p` el árbol de carpetas del backend: `config` (arranque), `database/seeders` (infraestructura de datos), `routes` (agregador de rutas), `shared` con sus subcarpetas `errors`, `http` y `database` (utilidades transversales) y `features/business/clients`, la primera *feature* de negocio.

![](images/express/iss01-03-crear-carpetas.png)

------------------------------------------------------------------------

### Paso 10: Verificación del árbol de carpetas

Listamos los directorios de `src/` con `find src -type d | sort` para confirmar que la estructura quedó creada tal como la define la arquitectura por *features*.

![](images/express/iss01-04-arbol-carpetas.png)

------------------------------------------------------------------------

### Paso 11: Instalación de las dependencias de producción

Instalamos las dependencias base del servidor: `express` (framework HTTP), `cors` (peticiones desde el frontend en otro origen), `dotenv` (lectura de variables de entorno) y `morgan` (registro de peticiones en consola).

![](images/express/iss01-05-npm-install-deps.png)

------------------------------------------------------------------------

### Paso 12: Instalación de las dependencias de desarrollo

Instalamos como dependencias de desarrollo `typescript` (fijado en la versión 5.9.x por compatibilidad con `ts-node`), `ts-node` (ejecuta TypeScript sin compilar), `nodemon` (reinicia el servidor al detectar cambios) y los paquetes de tipos `@types/*` de Node, Express, CORS y Morgan.

![](images/express/iss01-06-npm-install-devdeps.png)

------------------------------------------------------------------------

### Paso 13: Verificación de las dependencias instaladas

Ejecutamos `npm ls --depth=0` para listar las dependencias de primer nivel y confirmar que todas quedaron instaladas con sus versiones.

![](images/express/iss01-07-npm-ls.png)

------------------------------------------------------------------------

### Paso 14: Configuración de TypeScript (`tsconfig.json`)

Creamos el archivo `tsconfig.json` con la configuración estricta del compilador: el código fuente vive en `./src` (`rootDir`) y la salida compilada en `./dist` (`outDir`); el sistema de módulos es `commonjs`, coherente con el `package.json`; y `strict: true` obliga a tipar correctamente desde el primer día.

![](images/clipboard-3422258209.png)

------------------------------------------------------------------------

### Paso 15: Verificación de la configuración del compilador

Comprobamos con `npx tsc --showConfig` la configuración efectiva que aplica TypeScript, confirmando `rootDir`, `outDir`, `module` y `strict`.

![](images/express/iss01-08-tsc-showconfig.png)

------------------------------------------------------------------------

### Paso 16: Punto de entrada del servidor (`src/server.ts`)

Creamos `src/server.ts`, el punto de entrada de la aplicación. Es deliberadamente mínimo: importa la clase `App`, la instancia dentro de una función `main()` asíncrona y espera a que el servidor quede escuchando con `app.listen()`.

![](images/clipboard-3761301054.png)

------------------------------------------------------------------------

### Paso 17: Esqueleto de la clase `App` (`src/config/index.ts`)

Creamos la clase `App`, que concentra la configuración del servidor Express. Su constructor ejecuta en orden las etapas `settings()` (puerto), `middlewares()` (morgan, cors y lectura de JSON), `routes()`, `docs()` y `errorHandling()` (traduce un JSON malformado a un error 400 limpio, sin exponer el *stack trace*). El método `listen()` primero conecta a la base de datos con `dbConnection()` y después abre el puerto. En este bloque `routes()`, `docs()` y `dbConnection()` quedan como *placeholders* que se completarán en los siguientes ISS.

![](images/clipboard-1539613513.png)

------------------------------------------------------------------------

### Paso 18: Archivo `.gitignore` del backend

Creamos un `.gitignore` en `backend-express` para excluir del repositorio la carpeta `node_modules`, la salida compilada `dist` y el archivo `.env` con las credenciales.

![](images/clipboard-1781041447.png)

------------------------------------------------------------------------

### Paso 19: Verificación de tipos sin errores

Ejecutamos `npx tsc --noEmit`, la verificación de cierre del ISS: comprueba los tipos de todo el proyecto sin generar archivos. El comando termina sin errores.

![](images/express/iss01-09-tsc-noemit.png)

------------------------------------------------------------------------

### Paso 20: Listado de los archivos de código

Listamos los archivos de `src/` con `find src -type f | sort`, confirmando que existen `src/server.ts` y `src/config/index.ts`.

![](images/express/iss01-10-archivos-src.png)

------------------------------------------------------------------------

### Paso 21: Arranque del servidor en modo desarrollo (GATE)

Ejecutamos `npm run dev`: `nodemon` vigila la carpeta `src/` y arranca el servidor con `ts-node`. El servidor inicia sin errores y queda escuchando en el puerto 4000; luego lo detenemos con `Ctrl+C`. Con esto se cumplen los criterios de aceptación del ISS-01:

- [x] `package.json` con `"type": "commonjs"` y scripts `build` / `dev`.
- [x] Árbol `src/` con `config`, `database/seeders`, `routes`, `shared` y `features/business/clients`.
- [x] Dependencias de Express y TypeScript instaladas.
- [x] `tsconfig.json` con `rootDir: ./src`, `outDir: ./dist` y `strict: true`.
- [x] Existen `src/server.ts` y `src/config/index.ts`.
- [x] `npx tsc --noEmit` sin errores.

![](images/express/iss01-11-npm-run-dev.png)

------------------------------------------------------------------------
