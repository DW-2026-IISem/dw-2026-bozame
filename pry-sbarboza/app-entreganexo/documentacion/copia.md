creacion del docker-compose.yml

creacion del .env con credenciales:

Ahora sí: nuestros cuatro contenedores

Vamos a crear:

entreganexo-mysql entreganexo-postgres entreganexo-mssql entreganexo-oracle

Y cada uno utilizará las carpetas que ya creaste:

data/ ├── mysql/ ├── postgres/ ├── mssql/ └── oracle/

Eso significa que no vamos a tocar los datos anteriores.

Eso significa que Docker Compose creó automáticamente la red interna del proyecto. Justamente lo que hablábamos antes: no tuviste que crearla manualmente

comprobamos acceso y creacion de la bd en mysql

lo mismo para postgre

ahora para mssql

creamos la db en mssql

verificamos oracle

vamos a nuestra carpeta de backend y creamos el proyecto base

Esto instala lo necesario para:

 Sequelize → ORM. 

 sequelize-typescript → usar Sequelize con decoradores. 

 mysql2 → MySQL. 

 pg → PostgreSQL. 

  oracledb → Oracle. 

  tedious → SQL Server. 

  class-validator / class-transformer → validación de DTOs. 

  dotenv → variables .env. 

  @nestjs/swagger → documentación de la API.

