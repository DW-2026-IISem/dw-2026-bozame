import { Application } from "express";
import { authenticate, authorize } from "../../auth/access";
import { ProductSalesController } from "./product-sales.controller";

export class ProductSalesRoutes {
  public productSalesController: ProductSalesController = new ProductSalesController();

  public routes(app: Application): void {
    // ================== JWT + RBAC: authenticate (¿quién eres?) + authorize (¿puedes?) ==================

    // getAll
    app
      .route("/api/detalle-ventas")
      .get(authenticate, authorize, this.productSalesController.getAll.bind(this.productSalesController));

    // getOne
    app
      .route("/api/detalle-ventas/:id")
      .get(authenticate, authorize, this.productSalesController.getOne.bind(this.productSalesController));

    // create
    app
      .route("/api/detalle-ventas")
      .post(authenticate, authorize, this.productSalesController.create.bind(this.productSalesController));

    // update (PUT / PATCH)
    app
      .route("/api/detalle-ventas/:id")
      .put(authenticate, authorize, this.productSalesController.updatePut.bind(this.productSalesController))
      .patch(authenticate, authorize, this.productSalesController.updatePatch.bind(this.productSalesController));

    // delete físico
    app
      .route("/api/detalle-ventas/:id")
      .delete(authenticate, authorize, this.productSalesController.deletePhysical.bind(this.productSalesController));

    // delete lógico
    app
      .route("/api/detalle-ventas/:id/deactivate")
      .patch(authenticate, authorize, this.productSalesController.deleteLogical.bind(this.productSalesController));
  }
}
