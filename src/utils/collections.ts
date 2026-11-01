import type { Carrier, Product, ProductCategory, WarehouseLocation } from "../types/models";

export function filterProductsByWarehouse(products: Product[], warehouse: WarehouseLocation): Product[] {
  return products.filter((product: Product): boolean => product.warehouse === warehouse);
}
export function filterProductsByCategory(products: Product[], category: ProductCategory): Product[] {
  return products.filter((product: Product): boolean => product.category === category);
}
export function filterLowStockProducts(products: Product[]): Product[] {
  return products.filter((product: Product): boolean => product.stockQuantity <= product.minStockThreshold);
}
export function sortProductsByStock(products: Product[], order: "asc" | "desc"): Product[] {
  const direction: number = order === "asc" ? 1 : -1;
  return [...products].sort((a: Product, b: Product): number => direction * (a.stockQuantity - b.stockQuantity) || a.name.localeCompare(b.name));
}
export function sortCarriersByReliability(carriers: Carrier[], order: "asc" | "desc"): Carrier[] {
  const direction: number = order === "asc" ? 1 : -1;
  return [...carriers].sort((a: Carrier, b: Carrier): number => direction * (a.onTimeRate - b.onTimeRate) || a.name.localeCompare(b.name));
}