/**
 * Documentación OpenAPI del feature Sale.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: desde el ISS-13 todos los endpoints son **JWT + RBAC** (seguridad global del documento).
 */

export const salesSwagger = {
  tags: [
    {
      name: "Ventas",
      description: "CRUD de ventas — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/ventas": {
      get: {
        tags: ["Ventas"],
        summary: "Listar ventas activas",
        description: "JWT + RBAC — retorna ventas con status=active e items (ProductSale)",
        responses: {
          "200": {
            description: "Lista de ventas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sales: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SaleWithItems" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Ventas"],
        summary: "Crear venta (transaccional)",
        description:
          "JWT + RBAC — valida cliente/productos activos y stock; crea Sale + ProductSale y reduce quantity",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SaleCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Venta creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sale: { $ref: "#/components/schemas/Sale" },
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProductSale" },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (cliente/producto/stock)" },
          "404": { description: "Cliente o producto no encontrado" },
        },
      },
    },
    "/api/ventas/{id}": {
      get: {
        tags: ["Ventas"],
        summary: "Obtener venta por id",
        description: "JWT + RBAC — incluye items; 404 si no existe o tiene borrado lógico",
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
            description: "Venta encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    sale: { $ref: "#/components/schemas/SaleWithItems" },
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
        tags: ["Ventas"],
        summary: "Actualizar cabecera de venta (PUT)",
        description:
          "JWT + RBAC — solo tax, discounts, client_id, sale_date, status; recalcula total; no reescribe items",
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
              schema: { $ref: "#/components/schemas/SaleUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Ventas"],
        summary: "Actualizar cabecera de venta (PATCH)",
        description: "JWT + RBAC — parcial; recalcula total si cambian tax/discounts",
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
              schema: { $ref: "#/components/schemas/SalePatch" },
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
        tags: ["Ventas"],
        summary: "Eliminar venta (físico)",
        description: "JWT + RBAC — restaura stock de las líneas activas, borra product_sales y luego la venta (transacción; también si tiene borrado lógico)",
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
    "/api/ventas/{id}/deactivate": {
      patch: {
        tags: ["Ventas"],
        summary: "Eliminar venta (lógico)",
        description: "JWT + RBAC — status = inactive en venta e items, restaurando stock",
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
      // ProductSale schema vive en product-sales.swagger.ts (feature propio)
      Sale: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          sale_date: { type: "string", format: "date-time" },
          subtotal: { type: "number", example: 200.0 },
          tax: { type: "number", example: 19.0 },
          discounts: { type: "number", example: 5.0 },
          total: { type: "number", example: 214.0 },
          client_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SaleWithItems: {
        allOf: [
          { $ref: "#/components/schemas/Sale" },
          {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/ProductSale" },
              },
            },
          },
        ],
      },
      SaleCreate: {
        type: "object",
        required: ["client_id", "items"],
        properties: {
          client_id: { type: "integer" },
          tax: { type: "number", default: 0 },
          discounts: { type: "number", default: 0 },
          sale_date: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["product_id", "quantity"],
              properties: {
                product_id: { type: "integer" },
                quantity: { type: "integer", minimum: 1 },
              },
            },
          },
        },
      },
      SaleUpdate: {
        type: "object",
        properties: {
          sale_date: { type: "string", format: "date-time" },
          tax: { type: "number" },
          discounts: { type: "number" },
          client_id: { type: "integer" },
        },
      },
      SalePatch: {
        type: "object",
        properties: {
          sale_date: { type: "string", format: "date-time" },
          tax: { type: "number" },
          discounts: { type: "number" },
          client_id: { type: "integer" },
        },
      },
    },
  },
};
