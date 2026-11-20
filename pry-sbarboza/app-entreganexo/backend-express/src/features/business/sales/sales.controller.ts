import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateSaleDto, PatchSaleDto, UpdateSaleDto, normalizeSaleBody } from "./dto";
import { SalesService } from "./sales.service";

/**
 * Capa Controller del feature Sales.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class SalesController extends BaseController {
  public constructor(private readonly service: SalesService = new SalesService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const sales = await this.service.getAll();
      res.status(200).json({ sales });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const sale = await this.service.getOne(this.paramId(req));
      res.status(200).json({ sale });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const { sale, items } = await this.service.create(
        normalizeSaleBody(req.body) as unknown as CreateSaleDto
      );
      res.status(201).json({ sale, items });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const sale = await this.service.updatePut(
        this.paramId(req),
        normalizeSaleBody(req.body) as UpdateSaleDto
      );
      res.status(200).json({ sale });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const sale = await this.service.updatePatch(
        this.paramId(req),
        normalizeSaleBody(req.body) as PatchSaleDto
      );
      res.status(200).json({ sale });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física (venta + líneas). */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Sale permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `status = inactive` (venta + líneas). */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const sale = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Sale deactivated (logical delete)",
        sale,
      });
    });
  }
}
