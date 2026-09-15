# Bitácora de Configuración del Entorno y Backend - EntregaNexo

**Asignatura:** Desarrollo Web\
**Proyecto:** EntregaNexo\
**Documento:** Guía y registro de configuración del entorno de datos y backend

------------------------------------------------------------------------

## 1. Introducción y Contexto del Proyecto

EntregaNexo es una plataforma concebida para conectar comercios locales, compradores y repartidores independientes. En este sistema: \* Cada pedido puede reunir productos de un comercio específico. \* Los pedidos avanzan y cambian de estado de acuerdo con hitos operativos verificables. \* Se gestiona el cobro al cliente, la comisión correspondiente para la plataforma y la liquidación al comercio aliado. \* Se contempla la asignación eficiente de repartidores según disponibilidad y zona geográfica, el registro del seguimiento de entregas y la resolución de cancelaciones sin generar inconsistencias financieras.

### Objetivo de este documento

Para dar soporte al desarrollo de la aplicación y disponer de la infraestructura requerida para las pruebas de persistencia y lógica de negocio, documenté el proceso técnico realizado hasta el momento: 1. **Infraestructura de Bases de Datos:** Despliegue de cuatro motores relacionales (**MySQL**, **PostgreSQL**, **Microsoft SQL Server** y **Oracle Database**) mediante **Docker Compose**, asegurando persistencia de datos local y conectividad de red interna. 2. **Inicialización del Backend:** Creación del proyecto base en el directorio de backend e instalación de las dependencias requeridas (ORM Sequelize, controladores/drivers de bases de datos, validación y documentación de API).

A continuación, presento la relación cronológica y detallada de los pasos que llevé a cabo:

------------------------------------------------------------------------

## 2. Registro del Procedimiento Paso a Paso

### Paso 1: Creación y configuración del archivo `docker-compose.yml`

Comencé definiendo el archivo `docker-compose.yml` en la raíz del proyecto. En este archivo orquestador configuré los servicios para los cuatro contenedores de bases de datos, estableciendo para cada uno sus imágenes oficiales, el mapeo de puertos hacia el sistema anfitrión, las variables de entorno y los volúmenes de almacenamiento persistente.

![](images/clipboard-3466989596.png)

------------------------------------------------------------------------

### Paso 2: Creación del archivo de variables de entorno (`.env`)

Con el fin de aplicar buenas prácticas de seguridad y evitar dejar credenciales sensibles expuestas en el archivo de composición, creé el archivo `.env`. En él definí las contraseñas de administrador, nombres de bases de datos, puertos y usuarios que Docker Compose inyecta automáticamente al levantar cada servicio.

![](images/clipboard-1528650608.png)

------------------------------------------------------------------------

### Paso 3: Estructuración del almacenamiento local persistente

Para asegurar que los datos registrados no se pierdan al reiniciar o apagar los contenedores, configuré volúmenes locales montados en una carpeta `data/` en la máquina anfitriona. La distribución quedó organizada de la siguiente manera:

``` text
data/
├── mysql/
├── postgres/
├── mssql/
└── oracle/
```

De esta manera, la información almacenada en cada base de datos queda resguardada localmente en mi entorno sin tocar ni comprometer datos previos.

------------------------------------------------------------------------

### Paso 4: Despliegue de los cuatro contenedores del sistema

Una vez listos los archivos de configuración y los directorios de persistencia, ejecuté el despliegue de los contenedores en segundo plano (`docker compose up -d`). Los cuatro contenedores que componen el entorno son: \* `entreganexo-mysql` \* `entreganexo-postgres` \* `entreganexo-mssql` \* `entreganexo-oracle`

![](images/clipboard-2549667650.png)

------------------------------------------------------------------------

### Paso 5: Verificación de la red interna de Docker

Al iniciar los servicios, Docker Compose creó automáticamente una red interna (*bridge*) para el proyecto. Comprobé que todos los contenedores quedaron enlazados a dicha red, lo que permite que se comuniquen entre sí directamente mediante el nombre de su servicio sin necesidad de crear ni configurar la red manualmente.

![](images/clipboard-3037047914.png)

------------------------------------------------------------------------

### Paso 6: Comprobación de acceso y creación de la base de datos en MySQL

Ingresé a la consola interactiva del contenedor `entreganexo-mysql` para comprobar la autenticación y la disponibilidad del servicio. Una vez dentro de la sesión de MySQL, verifiqué el acceso administrativo y validé la creación de la base de datos correspondiente para el proyecto.

![](images/clipboard-2002902236.png)

------------------------------------------------------------------------

### Paso 7: Comprobación de acceso y validación en PostgreSQL

Posteriormente, verifiqué el estado y la conectividad del motor PostgreSQL ingresando al contenedor `entreganexo-postgres`. Validé el acceso con las credenciales establecidas en el archivo `.env` y comprobé la existencia de la base de datos asignada.

![](images/clipboard-3179852791.png)

------------------------------------------------------------------------

### Paso 8: Verificación del servicio de Microsoft SQL Server (MSSQL)

Continué con la verificación del contenedor `entreganexo-mssql`. Revisé que el servicio de SQL Server estuviera arriba, en ejecución continua y listo para recibir conexiones y operaciones de gestión.

![](images/clipboard-2929556709.png)

------------------------------------------------------------------------

### Paso 9: Creación de la base de datos en SQL Server

Utilizando la herramienta de línea de comandos `sqlcmd` dentro del contenedor, ejecuté las instrucciones necesarias para crear la base de datos destinada a EntregaNexo en SQL Server y corroboré que quedara debidamente registrada.

![](images/clipboard-2098138174.png)

------------------------------------------------------------------------

### Paso 10: Verificación del contenedor de Oracle Database

Comprobé el estado del contenedor `entreganexo-oracle`. Debido a los requerimientos de inicialización propios de este motor, revisé los registros para asegurar que la instancia hubiera levantado correctamente y estuviera operativa.

![](images/clipboard-561364117.png)

------------------------------------------------------------------------

### Paso 11: Inicialización del proyecto base en el backend

Una vez que la infraestructura de bases de datos estuvo lista y validada, me dirigí a la carpeta de backend para inicializar la estructura del proyecto base de la aplicación con NestJS / TypeScript.

![](images/clipboard-1019755048.png)

------------------------------------------------------------------------

### Paso 12: Instalación y configuración de dependencias del backend

Procedí con la instalación de los paquetes necesarios para la arquitectura y conectividad del backend:

- **ORM y Modelado de Datos:**
  - `sequelize`: ORM principal para la abstracción y gestión de consultas a las bases de datos.
  - `sequelize-typescript`: Permite definir modelos y relaciones utilizando clases y decoradores tipados en TypeScript.
- **Drivers de Conexión a Bases de Datos:**
  - `mysql2`: Conector para MySQL.
  - `pg`: Conector para PostgreSQL.
  - `tedious`: Conector para Microsoft SQL Server.
  - `oracledb`: Conector para Oracle Database.
- **Validación y Configuración:**
  - `class-validator` y `class-transformer`: Validación y transformación de DTOs (*Data Transfer Objects*) para asegurar la consistencia de las peticiones entrantes.
  - `dotenv`: Gestión de variables de entorno desde archivos `.env`.
  - `@nestjs/swagger`: Generación automatizada de la documentación interactiva de la API (*OpenAPI / Swagger*).

![](images/clipboard-1671832488.png)
