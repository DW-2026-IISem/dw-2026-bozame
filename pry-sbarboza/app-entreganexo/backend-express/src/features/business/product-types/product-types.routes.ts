import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ProductTypesController } from "./product-types.controller";

export class ProductTypesRoutes {
  public productTypesController: ProductTypesController = new ProductTypesController();

  public routes(app: Application): void {
    // ================== JWT + RBAC: authenticate (¿quién eres?) + authorize (¿puedes?) ==================

    // getAll
    app
      .route("/api/product-types")
      .get(authenticate, authorize, this.productTypesController.getAll.bind(this.productTypesController));

    // getOne
    app
      .route("/api/product-types/:id")
      .get(authenticate, authorize, this.productTypesController.getOne.bind(this.productTypesController));

    // create
    app
      .route("/api/product-types")
      .post(authenticate, authorize, this.productTypesController.create.bind(this.productTypesController));

    // update (PUT / PATCH)
    app
      .route("/api/product-types/:id")
      .put(authenticate, authorize, this.productTypesController.updatePut.bind(this.productTypesController))
      .patch(authenticate, authorize, this.productTypesController.updatePatch.bind(this.productTypesController));

    // delete físico
    app
      .route("/api/product-types/:id")
      .delete(authenticate, authorize, this.productTypesController.deletePhysical.bind(this.productTypesController));

    // delete lógico
    app
      .route("/api/product-types/:id/deactivate")
      .patch(authenticate, authorize, this.productTypesController.deleteLogical.bind(this.productTypesController));
  }
}
