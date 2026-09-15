creacion del docker-compose.yml

![](images/clipboard-3466989596.png)

creacion del .env con credenciales:

![](images/clipboard-1528650608.png)

## Ahora sí: nuestros cuatro contenedores

Vamos a crear:

```         
entreganexo-mysql entreganexo-postgres entreganexo-mssql entreganexo-oracle
```

Y cada uno utilizará las carpetas que ya creaste:

```         
data/ ├── mysql/ ├── postgres/ ├── mssql/ └── oracle/
```

Eso significa que **no vamos a tocar los datos anteriores**.

![](images/clipboard-2549667650.png)

![](images/clipboard-3037047914.png)

Eso significa que **Docker Compose creó automáticamente la red interna del proyecto**. Justamente lo que hablábamos antes: no tuviste que crearla manualmente

comprobamos acceso y creacion de la bd en mysql

![](images/clipboard-2002902236.png)

lo mismo para postgre

![](images/clipboard-3179852791.png)

ahora para mssql

![](images/clipboard-2929556709.png)

creamos la db en mssql

![](images/clipboard-2098138174.png)

verificamos oracle

![](images/clipboard-561364117.png)
