import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ClientSeeder } from './clients/infrastructure/persistence/seeders/client.seeder.js';
import { ProductTypeSeeder } from './product-types/infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductSeeder } from './products/infrastructure/persistence/seeders/product.seeder.js';
import { UserSeeder } from '../auth/users/infrastructure/persistence/seeders/user.seeder.js';
import { RoleSeeder } from '../auth/roles/infrastructure/persistence/seeders/role.seeder.js';
import { ResourceSeeder } from '../auth/resources/infrastructure/persistence/seeders/resource.seeder.js';
import { RoleUserSeeder } from '../auth/role-users/infrastructure/persistence/seeders/role-user.seeder.js';
import { ResourceRoleSeeder } from '../auth/resource-roles/infrastructure/persistence/seeders/resource-role.seeder.js';

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
    private readonly roleUserSeeder: RoleUserSeeder,
    private readonly resourceRoleSeeder: ResourceRoleSeeder,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Verificando datos base (Seeders)...');
    
    // 1. Catálogos base
    await this.userSeeder.seed();
    await this.roleSeeder.seed();
    await this.resourceSeeder.seed();
    
    // 2. Puentes de seguridad (Asignaciones y Concesiones)
    await this.roleUserSeeder.seed();
    await this.resourceRoleSeeder.seed();
    
    // 3. Datos de negocio
    await this.clientSeeder.seed();
    await this.productTypeSeeder.seed();
    await this.productSeeder.seed();
    
    this.logger.log('Seeders verificados correctamente.');
  }
}
