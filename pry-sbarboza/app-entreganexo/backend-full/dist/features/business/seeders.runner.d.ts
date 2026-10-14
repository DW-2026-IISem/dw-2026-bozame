import { OnApplicationBootstrap } from '@nestjs/common';
import { ClientSeeder } from './clients/infrastructure/persistence/seeders/client.seeder.js';
import { ProductTypeSeeder } from './product-types/infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductSeeder } from './products/infrastructure/persistence/seeders/product.seeder.js';
import { UserSeeder } from '../auth/users/infrastructure/persistence/seeders/user.seeder.js';
import { RoleSeeder } from '../auth/roles/infrastructure/persistence/seeders/role.seeder.js';
import { ResourceSeeder } from '../auth/resources/infrastructure/persistence/seeders/resource.seeder.js';
export declare class SeedersRunner implements OnApplicationBootstrap {
    private readonly clientSeeder;
    private readonly productTypeSeeder;
    private readonly productSeeder;
    private readonly userSeeder;
    private readonly roleSeeder;
    private readonly resourceSeeder;
    private readonly logger;
    constructor(clientSeeder: ClientSeeder, productTypeSeeder: ProductTypeSeeder, productSeeder: ProductSeeder, userSeeder: UserSeeder, roleSeeder: RoleSeeder, resourceSeeder: ResourceSeeder);
    onApplicationBootstrap(): Promise<void>;
}
