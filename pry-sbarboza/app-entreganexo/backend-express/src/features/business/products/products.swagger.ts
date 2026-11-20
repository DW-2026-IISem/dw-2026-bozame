/**
 * Documentación OpenAPI del feature Product.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: desde el ISS-13 todos los endpoints son **JWT + RBAC** (seguridad global del documento).
 */

const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "id numérico (> 0). Si no lo es, la API responde 400.",
  schema: { type: "integer", minimum: 1 },
};

const productBody = {
  type: "object",
  properties: {
    product: { $ref: "#/components/schemas/Product" },
  },
};

const productFields = {
  name: { type: "string" },
  brand: { type: "string" },
  price: { type: "number" },
  min_stock: { type: "integer" },
  quantity: { type: "integer" },
  product_type_id: { type: "integer" },
};

const requiredFields = ["name", "brand", "price", "min_stock", "quantity", "product_type_id"];

export const productsSwagger = {
  tags: [
    {
      name: "Productos",
      description: "CRUD de productos — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/productos": {
      get: {
        tags: ["Productos"],
        summary: "Listar productos activos",
        description: "JWT + RBAC — retorna productos con status=active",
        responses: {
          "200": {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Productos"],
        summary: "Crear producto",
        description:
          "JWT + RBAC — product_type_id debe existir y estar active. Acepta también minStock/productTypeId (frontend).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Producto creado",
            content: { "application/json": { schema: productBody } },
          },
          "400": { description: "Tipo de producto inactivo" },
          "404": { description: "Tipo de producto no encontrado" },
        },
      },
    },
    "/api/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener producto por id",
        description: "JWT + RBAC — 404 si no existe o tiene borrado lógico",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Producto encontrado",
            content: { "application/json": { schema: productBody } },
          },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Productos"],
        summary: "Actualizar producto (PUT — reemplazo)",
        description: "JWT + RBAC — product_type_id debe existir y estar active",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductUpdate" },
            },
          },
        },
        responses: {
          "200": {
            description: "Actualizado",
            content: { "application/json": { schema: productBody } },
          },
          "400": {
            description: "id inválido (entero positivo) o tipo de producto inactivo",
          },
          "404": { description: "Producto o tipo de producto no encontrado" },
        },
      },
      patch: {
        tags: ["Productos"],
        summary: "Actualizar producto (PATCH — parcial)",
        description: "JWT + RBAC — si se envía product_type_id, debe existir y estar active",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductPatch" },
            },
          },
        },
        responses: {
          "200": {
            description: "Actualizado",
            content: { "application/json": { schema: productBody } },
          },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Productos"],
        summary: "Eliminar producto (físico)",
        description: "JWT + RBAC — borra la fila (también si tiene borrado lógico)",
        parameters: [idParam],
        responses: {
          "200": { description: "Eliminado" },
          "400": { description: "id inválido (debe ser un entero positivo)" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/productos/{id}/deactivate": {
      patch: {
        tags: ["Productos"],
        summary: "Eliminar producto (lógico)",
        description: "JWT + RBAC — status = inactive",
        parameters: [idParam],
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
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Laptop Pro" },
          brand: { type: "string", example: "TechBrand" },
          price: { type: "number", example: 1299.99 },
          min_stock: { type: "integer", example: 5 },
          quantity: { type: "integer", example: 50 },
          product_type_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductCreate: {
        type: "object",
        required: requiredFields,
        properties: {
          ...productFields,
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ProductUpdate: {
        type: "object",
        required: requiredFields,
        properties: productFields,
      },
      ProductPatch: {
        type: "object",
        properties: productFields,
      },
    },
  },
};
