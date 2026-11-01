import type { Product, Shipment } from "../types/models";

export function findProductBySKU(products: Product[], sku: string): Product | null {
  const target: string = sku.toLowerCase();
  for (const product of products) {
    if (product.sku.toLowerCase() === target) return product;
  }
  return null;
}
export function findShipmentById(shipments: Shipment[], id: string): Shipment | null {
  for (const shipment of shipments) {
    if (shipment.id === id) return shipment;
  }
  return null;
}
export function binarySearchProductByWeight(sortedProducts: Product[], targetWeight: number): number {
  let left: number = 0;
  let right: number = sortedProducts.length - 1;
  while (left <= right) {
    const middle: number = Math.floor((left + right) / 2);
    const weight: number = sortedProducts[middle].weightKg;
    if (weight === targetWeight) return middle;
    if (weight < targetWeight) left = middle + 1;
    else right = middle - 1;
  }
  return -1;
}