import type { Carrier, Product, ProductCategory, Shipment, ShipmentPriority, ShipmentStatus } from "../types/models";

function round2(value: number): number { return Math.round((value + Number.EPSILON) * 100) / 100; }
export function calculateShippingCost(shipment: Shipment, product: Product, carrier: Carrier): number {
  const base: number = carrier.baseRateUSD + product.weightKg * carrier.ratePerKgUSD * shipment.quantity
    + shipment.destination.distanceKm * carrier.ratePerKmUSD;
  const factor: Record<ShipmentPriority, number> = { "Standard": 1, "Express": 1.3, "Same-day": 1.6 };
  return round2(base * factor[shipment.priority]);
}
export function scoreCarrierForShipment(carrier: Carrier, shipment: Shipment, product: Product): number {
  const country: number = carrier.operatesIn.includes(shipment.destination.country) ? 20 : 0;
  const weight: number = product.weightKg * shipment.quantity <= carrier.maxWeightKg ? 20 : 0;
  const priority: number = carrier.acceptsPriority.includes(shipment.priority) ? 15 : 0;
  const fragile: number = !product.isFragile || carrier.handlesFragile ? 15 : 0;
  return round2(country + weight + priority + fragile + carrier.onTimeRate * 0.3);
}
export function selectBestCarrier(carriers: Carrier[], shipment: Shipment, product: Product): { carrier: Carrier; score: number; cost: number } | null {
  const candidates: Array<{ carrier: Carrier; score: number; cost: number }> = carriers
    .map((carrier: Carrier): { carrier: Carrier; score: number; cost: number } => ({
      carrier, score: scoreCarrierForShipment(carrier, shipment, product), cost: calculateShippingCost(shipment, product, carrier),
    }))
    .filter((candidate): boolean => candidate.score >= 50);
  return candidates.reduce<{ carrier: Carrier; score: number; cost: number } | null>(
    (best, current) => best === null || current.cost < best.cost ? current : best, null);
}
export function countProductsByCategory(products: Product[]): Record<ProductCategory, number> {
  const counts: Record<ProductCategory, number> = { Fashion: 0, Electronics: 0, Cosmetics: 0, Home: 0, Other: 0 };
  for (const product of products) counts[product.category] += 1;
  return counts;
}
export function calculateTotalInventoryValue(products: Product[]): number {
  return round2(products.reduce((sum: number, p: Product): number => sum + p.stockQuantity * p.unitCostUSD, 0));
}
export function calculateAverageShipmentDistance(shipments: Shipment[]): number {
  if (shipments.length === 0) return 0;
  return round2(shipments.reduce((sum: number, s: Shipment): number => sum + s.destination.distanceKm, 0) / shipments.length);
}
export function groupShipmentsByStatus(shipments: Shipment[]): Record<ShipmentStatus, Shipment[]> {
  const groups: Record<ShipmentStatus, Shipment[]> = { Pending: [], Assigned: [], "In transit": [], Delivered: [], Failed: [] };
  for (const shipment of shipments) groups[shipment.status].push(shipment);
  return groups;
}
export function findTopCarriers(shipments: Shipment[], topN: number): Array<{ carrier: string; count: number }> {
  if (!Number.isFinite(topN) || topN <= 0) return [];
  const counts: Map<string, number> = new Map();
  for (const shipment of shipments) {
    if (shipment.carrier !== null) counts.set(shipment.carrier, (counts.get(shipment.carrier) ?? 0) + 1);
  }
  return Array.from(counts, ([carrier, count]): { carrier: string; count: number } => ({ carrier, count }))
    .sort((a, b): number => b.count - a.count).slice(0, Math.floor(topN));
}

export function findMinStock(products: Product[]): number | null {
  if (products.length === 0) return null;
  return products.reduce((min: number, p: Product): number => Math.min(min, p.stockQuantity), products[0].stockQuantity);
}
export function findMaxStock(products: Product[]): number | null {
  if (products.length === 0) return null;
  return products.reduce((max: number, p: Product): number => Math.max(max, p.stockQuantity), products[0].stockQuantity);
}