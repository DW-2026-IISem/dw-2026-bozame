import { Application } from "express";
import { ProductTypesController } from "./product-types.controller";

export class ProductTypesRoutes {
  public productTypesController: ProductTypesController = new ProductTypesController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/product-types")
      .get(this.productTypesController.getAll.bind(this.productTypesController));

    // getOne
    app
      .route("/api/product-types/:id")
      .get(this.productTypesController.getOne.bind(this.productTypesController));

    // create
    app
      .route("/api/product-types")
      .post(this.productTypesController.create.bind(this.productTypesController));

    // update (PUT / PATCH)
    app
      .route("/api/product-types/:id")
      .put(this.productTypesController.updatePut.bind(this.productTypesController))
      .patch(this.productTypesController.updatePatch.bind(this.productTypesController));

    // delete físico
    app
      .route("/api/product-types/:id")
      .delete(this.productTypesController.deletePhysical.bind(this.productTypesController));

    // delete lógico
    app
      .route("/api/product-types/:id/deactivate")
      .patch(this.productTypesController.deleteLogical.bind(this.productTypesController));
  }
}
