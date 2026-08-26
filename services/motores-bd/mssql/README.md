# SQL Server 2022 - Motor de Base de Datos

> **Acceso remoto habilitado.** Puerto expuesto en `0.0.0.0:1433`.
> **Usuario por defecto:** `SA` (acceso remoto: habilitado por defecto)

---

## Conectar desde WSL (local)

```bash
docker exec -it sqlserver-container /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '1234'
