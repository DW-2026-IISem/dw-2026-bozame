import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ClientSeeder } from './clients/infrastructure/persistence/seeders/client.seeder.js';
import { ProductTypeSeeder } from './product-types/infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductSeeder } from './products/infrastructure/persistence/seeders/product.seeder.js';
import { UserSeeder } from '../auth/users/infrastructure/persistence/seeders/user.seeder.js';
import { RoleSeeder } from '../auth/roles/infrastructure/persistence/seeders/role.seeder.js';
import { ResourceSeeder } from '../auth/resources/infrastructure/persistence/seeders/resource.seeder.js';

@Injectable()
export class SeedersRunner implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedersRunner.name);

  constructor(
    private readonly clientSeeder: ClientSeeder,
    private readonly productTypeSeeder: ProductTypeSeeder,
    private readonly productSeeder: ProductSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly resourceSeeder: ResourceSeeder,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Verificando datos base (Seeders)...');
    await this.userSeeder.seed();
    await this.roleSeeder.seed();
    await this.resourceSeeder.seed();
    
    await this.clientSeeder.seed();
    await this.productTypeSeeder.seed();
    await this.productSeeder.seed();
    this.logger.log('Seeders verificados correctamente.');
  }
}
