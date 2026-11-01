import type { Carrier, Product, ProductCategory, ProductStatus, WarehouseLocation } from "../types/models";

export interface ProductFilters {
  warehouse?: WarehouseLocation;
  category?: ProductCategory;
  status?: ProductStatus;
  minUnitCostUSD?: number;
  maxUnitCostUSD?: number;
  lowStockOnly?: boolean;
}

export function filterProductsByWarehouse(products: Product[], warehouse: WarehouseLocation): Product[] {
  return products.filter((product: Product): boolean => product.warehouse === warehouse);
}
export function filterProductsByCategory(products: Product[], category: ProductCategory): Product[] {
  return products.filter((product: Product): boolean => product.category === category);
}
export function filterLowStockProducts(products: Product[]): Product[] {
  return products.filter((product: Product): boolean => product.stockQuantity <= product.minStockThreshold);
}
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product: Product): boolean =>
    (filters.warehouse === undefined || product.warehouse === filters.warehouse)
    && (filters.category === undefined || product.category === filters.category)
    && (filters.status === undefined || product.status === filters.status)
    && (filters.minUnitCostUSD === undefined || product.unitCostUSD >= filters.minUnitCostUSD)
    && (filters.maxUnitCostUSD === undefined || product.unitCostUSD <= filters.maxUnitCostUSD)
    && (filters.lowStockOnly !== true || product.stockQuantity <= product.minStockThreshold));
}
export function sortProductsByStock(products: Product[], order: "asc" | "desc"): Product[] {
  const direction: number = order === "asc" ? 1 : -1;
  return [...products].sort((a: Product, b: Product): number => direction * (a.stockQuantity - b.stockQuantity) || a.name.localeCompare(b.name));
}
export function sortCarriersByReliability(carriers: Carrier[], order: "asc" | "desc"): Carrier[] {
  const direction: number = order === "asc" ? 1 : -1;
  return [...carriers].sort((a: Carrier, b: Carrier): number => direction * (a.onTimeRate - b.onTimeRate) || a.name.localeCompare(b.name));
}