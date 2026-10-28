ISS-00 · Requisitos previos

Objetivo: dejar el equipo listo para construir el frontend de StoreLab: Node y npm compatibles con el CLI, Angular CLI 22, un editor con terminal y el backend Django respondiendo en <http://localhost:8000>. Al terminar este ISS no se ha escrito código de Angular; solo se comprueba el entorno y se lee el contrato.

![](images/clipboard-3139779784.png)

instalando prime ng

![](images/clipboard-941710654.png)

IISUE 01

![![](images/clipboard-3478989977.png)](images/clipboard-3845926203.png)

![](images/clipboard-2882459418.png)

![](images/clipboard-3834154304.png)

###  Ajustar el presupuesto en `angular.json` y arrancar

Abre `angular.json` en VS Code, localiza la sección de `budgets` y asegúrate de que el presupuesto inicial tenga estos límites:

![](images/clipboard-3188266294.png)

![](images/clipboard-500653776.png)

![](images/clipboard-200141637.png)

ISSUE 2

### Configurar Environments

Creamos los archivos de entorno apuntando al backend en el puerto `4000` con `requireAuth: true`:

![](images/clipboard-1801244522.png)

### Paso 2: Crear los Modelos en `core/models`

Inyectamos todas las interfaces que representan las tablas y contratos de la API:

![](images/clipboard-1771316460.png)

![](images/clipboard-2229804998.png)

![](images/clipboard-3334431031.png)

![](images/clipboard-3641306111.png)

![](images/clipboard-191471205.png)

![](images/clipboard-1879497547.png)

### Paso 3: Utilidades y Servicios Transversales

Creamos el manejador de errores de la API (`toApiMessage`), el servicio de notificaciones y el `SessionStore` con Signals

![](images/clipboard-2162090017.png)

### Paso 4: Servicios HTTP de las Entidades

Creamos `ClientApi` como base representativa en `src/app/features/clients/`:

![](images/clipboard-3436856362.png)

### Paso 5: Componentes UI y Directiva Estructural

Configuramos los componentes compartidos reutilizables (`PageHeader`, `StatusTag`, `EmptyState`) y la directiva `*appHasPermission`

![](images/clipboard-221586546.png)

![](images/clipboard-185500343.png)

![](images/clipboard-874224274.png)

### Paso 6: Shell y Rutas Base

Creamos el componente `Shell` (con barra superior y navegación) y actualizamos `app.routes.ts` y `app.config.ts` para proveer `HttpClient`:

![![](images/clipboard-1405471669.png)](images/clipboard-1267049618.png)
