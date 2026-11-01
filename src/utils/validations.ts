import type { Carrier, Product, Shipment, ValidationResult } from "../types/models";

function numberInRange(value: number, min: number, max: number, inclusiveMin: boolean): boolean {
  return typeof value === "number" && Number.isFinite(value) && (inclusiveMin ? value >= min : value > min) && value <= max;
}
function nonEmpty(value: unknown): boolean { return typeof value === "string" && value.trim().length > 0; }
function oneOf(value: unknown, choices: readonly string[]): boolean { return typeof value === "string" && choices.includes(value); }
export function validateProduct(product: Product): ValidationResult {
  const errors: string[] = [];
  if (product == null) return { valid: false, errors: ["Falta el producto"] };
  if (!nonEmpty(product.name)) errors.push("Nombre obligatorio");
  if (!oneOf(product.category, ["Fashion", "Electronics", "Cosmetics", "Home", "Other"])) errors.push("Categoría inválida");
  if (!oneOf(product.warehouse, ["Los Angeles", "Zaragoza"])) errors.push("Almacén inválido");
  if (!oneOf(product.status, ["Active", "Low stock", "Out of stock", "Discontinued"])) errors.push("Estado inválido");
  if (typeof product.isFragile !== "boolean") errors.push("Indica si el producto es frágil");
  if (typeof product.sku !== "string" || product.sku.trim() === "") errors.push("SKU obligatorio");
  if (!numberInRange(product.weightKg, 0, 100, false)) errors.push("El peso debe ser > 0 y <= 100 kg");
  if (!product.dimensions || ![product.dimensions.lengthCm, product.dimensions.widthCm, product.dimensions.heightCm].every((n: number): boolean => numberInRange(n, 0, 200, false))) errors.push("Cada dimensión debe ser > 0 y <= 200 cm");
  if (!numberInRange(product.stockQuantity, 0, Infinity, true)) errors.push("El stock debe ser >= 0");
  if (!numberInRange(product.minStockThreshold, 0, Infinity, true)) errors.push("El mínimo de stock debe ser >= 0");
  if (!numberInRange(product.unitCostUSD, 0, Infinity, false)) errors.push("El costo unitario debe ser > 0");
  return { valid: errors.length === 0, errors };
}
export function validateShipment(shipment: Shipment): ValidationResult {
  const errors: string[] = [];
  if (shipment == null) return { valid: false, errors: ["Falta el envío"] };
  if (!nonEmpty(shipment.id) || !nonEmpty(shipment.sku)) errors.push("ID y SKU obligatorios");
  if (!oneOf(shipment.origin, ["Los Angeles", "Zaragoza"])) errors.push("Origen inválido");
  if (!oneOf(shipment.priority, ["Standard", "Express", "Same-day"])) errors.push("Prioridad inválida");
  if (!oneOf(shipment.status, ["Pending", "Assigned", "In transit", "Delivered", "Failed"])) errors.push("Estado inválido");
  if (!(shipment.createdAt instanceof Date) || Number.isNaN(shipment.createdAt.getTime())) errors.push("Fecha de creación inválida");
  if (shipment.carrier !== null && !nonEmpty(shipment.carrier)) errors.push("Transportista inválido");
  if (!shipment.destination || !nonEmpty(shipment.destination.city) || !nonEmpty(shipment.destination.postalCode) || !oneOf(shipment.destination.country, ["United States", "Spain"])) errors.push("Destino incompleto o inválido");
  if (!numberInRange(shipment.quantity, 0, Infinity, false)) errors.push("La cantidad debe ser > 0");
  if (!numberInRange(shipment.declaredValueUSD, 0, Infinity, false)) errors.push("El valor declarado debe ser > 0");
  if (!shipment.destination || !numberInRange(shipment.destination.distanceKm, 0, Infinity, true)) errors.push("La distancia debe ser >= 0");
  return { valid: errors.length === 0, errors };
}
export function validateCarrier(carrier: Carrier): ValidationResult {
  const errors: string[] = [];
  if (carrier == null) return { valid: false, errors: ["Falta el transportista"] };
  if (!nonEmpty(carrier.id) || !nonEmpty(carrier.name)) errors.push("ID y nombre obligatorios");
  if (typeof carrier.handlesFragile !== "boolean") errors.push("Indica si maneja frágiles");
  if (!Array.isArray(carrier.acceptsPriority) || !carrier.acceptsPriority.every((value): boolean => oneOf(value, ["Standard", "Express", "Same-day"]))) errors.push("Prioridades inválidas");
  if (![carrier.baseRateUSD, carrier.ratePerKgUSD, carrier.ratePerKmUSD].every((n: number): boolean => numberInRange(n, 0, Infinity, true))) errors.push("Las tarifas deben ser >= 0");
  if (!numberInRange(carrier.avgDeliveryDays, 0, Infinity, false)) errors.push("El tiempo promedio debe ser > 0");
  if (!numberInRange(carrier.onTimeRate, 0, 100, true)) errors.push("La confiabilidad debe estar entre 0 y 100");
  if (!numberInRange(carrier.maxWeightKg, 0, Infinity, false)) errors.push("El peso máximo debe ser > 0");
  if (!Array.isArray(carrier.operatesIn) || carrier.operatesIn.length === 0 || !carrier.operatesIn.every((value): boolean => oneOf(value, ["United States", "Spain"]))) errors.push("Debe operar en al menos un país");
  return { valid: errors.length === 0, errors };
}