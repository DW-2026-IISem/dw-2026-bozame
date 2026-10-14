export interface CatalogResource {
    method: string;
    path: string;
    description: string;
    seller?: boolean;
}
export declare const RESOURCE_CATALOG: readonly CatalogResource[];
