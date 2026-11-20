import { Application } from "express";
import { ProductSalesController } from "./product-sales.controller";

export class ProductSalesRoutes {
  public productSalesController: ProductSalesController = new ProductSalesController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/detalle-ventas")
      .get(this.productSalesController.getAll.bind(this.productSalesController));

    // getOne
    app
      .route("/api/detalle-ventas/:id")
      .get(this.productSalesController.getOne.bind(this.productSalesController));

    // create
    app
      .route("/api/detalle-ventas")
      .post(this.productSalesController.create.bind(this.productSalesController));

    // update (PUT / PATCH)
    app
      .route("/api/detalle-ventas/:id")
      .put(this.productSalesController.updatePut.bind(this.productSalesController))
      .patch(this.productSalesController.updatePatch.bind(this.productSalesController));

    // delete físico
    app
      .route("/api/detalle-ventas/:id")
      .delete(this.productSalesController.deletePhysical.bind(this.productSalesController));

    // delete lógico
    app
      .route("/api/detalle-ventas/:id/deactivate")
      .patch(this.productSalesController.deleteLogical.bind(this.productSalesController));
  }
}
