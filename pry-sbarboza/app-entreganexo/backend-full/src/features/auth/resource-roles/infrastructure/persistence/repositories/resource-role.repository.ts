import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, QueryTypes } from 'sequelize';
import { ResourceRole } from '../../../resource-role.model.js';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';

@Injectable()
export class ResourceRoleRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}
  private get repo() { return this.sequelize.getRepository(ResourceRole); }

  async findAllActive(): Promise<ResourceRole[]> { return this.repo.findAll({ where: { status: 'active' } }); }
  
  async findAllByRole(roleId: number, transaction?: Transaction): Promise<ResourceRole[]> {
    return this.repo.findAll({ where: { roleId }, transaction });
  }

  async create(data: Partial<ResourceRole>, transaction?: Transaction): Promise<ResourceRole> {
    return this.repo.create(data as any, { transaction });
  }

  async update(resourceRole: ResourceRole, data: Partial<ResourceRole>, transaction?: Transaction): Promise<ResourceRole> {
    return resourceRole.update(data, { transaction });
  }

  // LA CONSULTA DE AUTORIZACIÓN EFECTIVA (Cruza las 4 tablas exigiendo 'active')
  async findEffectiveForUser(userId: number): Promise<{ method: string, path: string }[]> {
    const query = `
      SELECT r.method, r.path
      FROM resource_roles rr
      INNER JOIN roles ro ON rr.role_id = ro.id
      INNER JOIN role_users ru ON ro.id = ru.role_id
      INNER JOIN resources r ON rr.resource_id = r.id
      WHERE rr.status = 'active'
        AND ro.status = 'active'
        AND ru.status = 'active'
        AND r.status = 'active'
        AND ru.user_id = :userId
    `;
    return this.sequelize.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });
  }

  // Consulta detallada de permisos para auditoría y almacén de sesión del frontend
  async findFullEffectiveForUser(userId: number): Promise<Array<{
    resource_id: number;
    method: string;
    path: string;
    description: string | null;
    role_id: number;
    role_name: string;
  }>> {
    const query = `
      SELECT 
        r.id AS resource_id,
        r.method,
        r.path,
        r.description,
        ro.id AS role_id,
        ro.name AS role_name
      FROM role_users ru
      INNER JOIN roles ro ON ru.role_id = ro.id
      INNER JOIN resource_roles rr ON ro.id = rr.role_id
      INNER JOIN resources r ON rr.resource_id = r.id
      WHERE rr.status = 'active'
        AND ro.status = 'active'
        AND ru.status = 'active'
        AND r.status = 'active'
        AND ru.user_id = :userId
      ORDER BY r.path ASC, r.method ASC
    `;
    return this.sequelize.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT
    });
  }
}
