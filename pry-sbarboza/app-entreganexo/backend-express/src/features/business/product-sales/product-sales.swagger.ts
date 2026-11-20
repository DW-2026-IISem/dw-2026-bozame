/**
 * Documentación OpenAPI del feature ProductSale (tabla product_sales).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: en la Fase I todos los endpoints son **SIN AUTH**.
 */

export const productSalesSwagger = {
  tags: [
    {
      name: "DetalleVentas",
      description:
        "CRUD de líneas Sale↔Product (tabla product_sales) — **SIN AUTH**",
    },
  ],
  paths: {
    "/api/detalle-ventas": {
      get: {
        tags: ["DetalleVentas"],
        summary: "Listar detalles de venta activos",
        description: "SIN AUTH — retorna product_sales con status=active",
        responses: {
          "200": {
            description: "Lista de detalles",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_sales: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProductSale" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["DetalleVentas"],
        summary: "Agregar línea a una venta",
        description:
          "SIN AUTH — valida venta/producto activos y stock; crea product_sale, reduce quantity y recalcula totales de la venta",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductSaleCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Línea creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_sale: { $ref: "#/components/schemas/ProductSale" },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (venta/producto/stock)" },
          "404": { description: "Venta o producto no encontrado" },
        },
      },
    },
    "/api/detalle-ventas/{id}": {
      get: {
        tags: ["DetalleVentas"],
        summary: "Obtener detalle por id",
        description: "SIN AUTH — 404 si no existe o tiene borrado lógico",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "id numérico (> 0). Si no lo es, la API responde 400.",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Detalle encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_sale: { $ref: "#/components/schemas/ProductSale" },
                  },
                },
              },
            },
          },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["DetalleVentas"],
        summary: "Actualizar cantidad de línea (PUT)",
        description: "SIN AUTH — ajusta stock y recalcula totales",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "id numérico (> 0). Si no lo es, la API responde 400.",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductSaleUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "id inválido (entero positivo) o stock insuficiente" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["DetalleVentas"],
        summary: "Actualizar línea (PATCH — parcial)",
        description: "SIN AUTH — quantity",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "id numérico (> 0). Si no lo es, la API responde 400.",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductSalePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["DetalleVentas"],
        summary: "Eliminar línea (físico)",
        description: "SIN AUTH — restaura stock y recalcula (también si tiene borrado lógico)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "id numérico (> 0). Si no lo es, la API responde 400.",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/detalle-ventas/{id}/deactivate": {
      patch: {
        tags: ["DetalleVentas"],
        summary: "Eliminar línea (lógico)",
        description: "SIN AUTH — status = inactive; restaura stock y recalcula totales",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "id numérico (> 0). Si no lo es, la API responde 400.",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      ProductSale: {
        type: "object",
        description:
          "Detalle N:M Sale↔Product (tabla product_sales). quantity, unit_price (snapshot), line_total = quantity × unit_price",
        properties: {
          id: { type: "integer", example: 1 },
          sale_id: { type: "integer", example: 1 },
          product_id: { type: "integer", example: 1 },
          quantity: { type: "integer", example: 2 },
          unit_price: { type: "number", example: 100.0 },
          line_total: { type: "number", example: 200.0 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductSaleCreate: {
        type: "object",
        required: ["sale_id", "product_id", "quantity"],
        properties: {
          sale_id: { type: "integer" },
          product_id: { type: "integer" },
          quantity: { type: "integer", minimum: 1 },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ProductSaleUpdate: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "integer", minimum: 1 },
        },
      },
      ProductSalePatch: {
        type: "object",
        properties: {
          quantity: { type: "integer", minimum: 1 },
        },
      },
    },
  },
};
