import { Injectable, Logger } from '@nestjs/common';
import { Resource } from '../../../resource.model.js';
import { RESOURCE_CATALOG } from '../../../domain/constants/resource-catalog.js';

@Injectable()
export class ResourceSeeder {
  private readonly logger = new Logger(ResourceSeeder.name);

  async seed(): Promise<void> {
    let created = 0;
    for (const item of RESOURCE_CATALOG) {
      const [resource, wasCreated] = await Resource.findOrCreate({
        where: { method: item.method, path: item.path },
        defaults: { ...item, status: 'active' },
      });
      if (wasCreated) created++;
      else if (resource.status !== 'active') await resource.update({ status: 'active' });
    }
    this.logger.log(`Seeder resources: catálogo reconciliado (58 recursos, ${created} nuevos)`);
  }
}
