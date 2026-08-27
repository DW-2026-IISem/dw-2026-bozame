# Configuración de motores de bases de datos

## 1. Estructura del proyecto

A continuación se presenta la organización de directorios utilizada para el laboratorio de bases de datos `ia-lab`:

![Estructura del proyecto](images/clipboard-1564572728.png)

### Red compartida en Docker

![Creación de red Docker](images/clipboard-2464479962.png)

---

## 2. MySQL

### Pasos de configuración:

1. **Definición del servicio:**  
   Se estructuró el archivo `docker-compose.yml` correspondiente a MySQL:  
   ![docker-compose.yml MySQL](images/clipboard-390269146.png)  

   Posteriormente, se inicializó el contenedor en segundo plano ejecutando `docker compose up -d`:  
   ![Despliegue MySQL](images/clipboard-4133514413.png)

2. **Variables de entorno:**  
   Se definió el archivo `.env` con las credenciales y configuraciones iniciales:  
   ![Archivo .env MySQL](images/clipboard-1336645182.png)

3. **Documentación del servicio:**  
   Se generó el archivo `README.md` con las instrucciones específicas de este motor:  
   ![README MySQL](images/clipboard-2624058944.png)

4. **Conexión remota:**  
   Se comprobó la conectividad remota al servicio desde un cliente externo:  
   ![Conexión remota MySQL](images/clipboard-3329698468.png)

5. **Gestión de usuarios:**  
   Se creó un usuario personalizado con privilegios de acceso remoto:  
   ![Creación de usuario MySQL](images/clipboard-2079434545.png)

6. **Respaldos de base de datos:**  
   Para la gestión de copias de seguridad, se habilitó el directorio `backups/mysql` dentro de la estructura principal de `ia-lab`:  
   ![Backup MySQL](images/clipboard-3961618298.png)

7. **Verificación del estado:**  
   Se ejecutó el levantamiento del contenedor y se verificó que el servicio estuviera operando correctamente:  
   ![Levantamiento de servicio MySQL](images/clipboard-1474780381.png)  
   ![Estado corriendo MySQL](images/clipboard-3335965270.png)

---

## 3. PostgreSQL

### Pasos de configuración:

1. **Definición del servicio:**  
   Se estructuró el archivo `docker-compose.yml` para PostgreSQL y se desplegó la instancia mediante `docker compose up -d`:  
   ![docker-compose.yml PostgreSQL](images/clipboard-2673740245.png)

2. **Variables de entorno:**  
   Se creó el archivo `.env` para almacenar las credenciales correspondientes:  
   ![Archivo .env PostgreSQL](images/clipboard-2137361219.png)

3. **Documentación del servicio:**  
   Se agregó el archivo `README.md` del módulo:  
   ![README PostgreSQL](images/clipboard-1977977680.png)

4. **Conexión remota:**  
   Se validó el acceso remoto a la instancia:  
   ![Conexión remota PostgreSQL](images/clipboard-212391622.png)

5. **Gestión de usuarios:**  
   Se configuró un usuario individual con permisos de conexión remota:  
   ![Creación de usuario PostgreSQL](images/clipboard-160212996.png)

6. **Respaldos de base de datos:**  
   Se habilitó el directorio `backups/postgres` dentro de `ia-lab` para almacenar los respaldos:  
   ![Backup PostgreSQL](images/clipboard-1835100358.png)

7. **Verificación del estado:**  
   Se ejecutó la puesta en marcha del motor y se confirmó su estado activo:  
   ![Estado PostgreSQL](images/clipboard-2474461316.png)

---

## 4. SQL Server

### Pasos de configuración:

1. **Definición del servicio:**  
   Se preparó el archivo `docker-compose.yml` para el motor SQL Server:  
   ![docker-compose.yml SQL Server](images/clipboard-2062062224.png)

2. **Variables de entorno y despliegue:**  
   Se configuró el archivo `.env` y se inició el contenedor con el comando `docker compose up -d`:  
   ![Archivo .env SQL Server](images/clipboard-415240670.png)  
   ![Despliegue SQL Server](images/clipboard-2400930065.png)

3. **Documentación del servicio:**  
   Se creó el archivo `README.md` específico para este entorno:  
   ![README SQL Server](images/clipboard-3107432098.png)

4. **Conexión remota:**  
   Se verificó la conectividad remota hacia el servidor SQL Server:  
   ![Conexión remota SQL Server](images/clipboard-3358588675.png)

5. **Gestión de usuarios:**  
   Se creó un usuario adicional con acceso habilitado desde la red:  
   ![Creación de usuario SQL Server](images/clipboard-3493213979.png)

6. **Respaldos de base de datos:**  
   Se asignó la ruta correspondiente para copias de seguridad dentro de la estructura general:  
   ![Configuración backup SQL Server](images/clipboard-2705237250.png)  
   ![Almacenamiento backup SQL Server](images/clipboard-2489264226.png)

7. **Verificación del estado:**  
   Se confirmó el correcto funcionamiento del servicio:  
   ![Estado SQL Server](images/clipboard-1357104005.png)

---

## 5. Oracle XE

### Pasos de configuración:

1. **Definición del servicio:**  
   Se creó el archivo `docker-compose.yml` necesario para Oracle XE:  
   ![docker-compose.yml Oracle XE](images/clipboard-1944222666.png)

2. **Variables de entorno:**  
   Se estableció el archivo `.env` con los parámetros de conexión y credenciales:  
   ![Archivo .env Oracle XE](images/clipboard-2954948021.png)

3. **Documentación del servicio:**  
   Se añadió el archivo `README.md` descriptivo del entorno:  
   ![README Oracle XE](images/clipboard-73959567.png)

4. **Conexión remota:**  
   Se validó el acceso remoto hacia la base de datos Oracle XE.

5. **Gestión de usuarios:**  
   Se procedió a la creación de un usuario con permisos remotos para la administración del esquema.

6. **Respaldos de base de datos:**  
   Se habilitaron los directorios de backup requeridos en la estructura del proyecto.

7. **Verificación del estado:**  
   Se inició el contenedor de Oracle XE y se confirmó que el proceso se encuentra en ejecución:  
   ![Estado Oracle XE](images/clipboard-2051887535.png)