import type { Carrier, Product, Shipment } from "./types/models";
import { filterLowStockProducts, filterProducts, filterProductsByCategory, filterProductsByWarehouse, sortCarriersByReliability, sortProductsByStock } from "./utils/collections";
import { binarySearchProductByWeight, findProductBySKU, findShipmentById } from "./utils/search";
import { calculateAverageShipmentDistance, calculateShippingCost, calculateTotalInventoryValue, countProductsByCategory, findTopCarriers, findMinStock, findMaxStock, groupShipmentsByStatus, scoreCarrierForShipment, selectBestCarrier } from "./utils/transformations";
import { validateCarrier, validateProduct, validateShipment } from "./utils/validations";

const products: Product[] = [
 { sku: "SHOE-BLK-42", name: "Zapatillas Negras Running - Talla 42", category: "Fashion", weightKg: 0.8, dimensions: {lengthCm: 35, widthCm: 22, heightCm: 12}, warehouse: "Los Angeles", stockQuantity: 45, minStockThreshold: 20, unitCostUSD: 35, isFragile: false, status: "Active" },
 { sku: "LAPTOP-DELL-15", name: "Laptop Dell 15 pulgadas", category: "Electronics", weightKg: 2.3, dimensions: {lengthCm: 40, widthCm: 28, heightCm: 3}, warehouse: "Zaragoza", stockQuantity: 8, minStockThreshold: 10, unitCostUSD: 650, isFragile: true, status: "Low stock" },
 { sku: "PERFUME-COCO-50", name: "Perfume Coco 50ml", category: "Cosmetics", weightKg: 0.3, dimensions: {lengthCm: 12, widthCm: 8, heightCm: 15}, warehouse: "Los Angeles", stockQuantity: 120, minStockThreshold: 30, unitCostUSD: 85, isFragile: true, status: "Active" },
];
const carriers: Carrier[] = [
 { id: "CAR-UPS", name: "UPS", operatesIn: ["United States"], baseRateUSD: 5, ratePerKgUSD: 1.2, ratePerKmUSD: 0.05, avgDeliveryDays: 3, onTimeRate: 88, maxWeightKg: 30, handlesFragile: true, acceptsPriority: ["Standard", "Express"] },
 { id: "CAR-SEUR", name: "SEUR", operatesIn: ["Spain"], baseRateUSD: 6.5, ratePerKgUSD: 1.5, ratePerKmUSD: 0.08, avgDeliveryDays: 2, onTimeRate: 92, maxWeightKg: 25, handlesFragile: true, acceptsPriority: ["Standard", "Express", "Same-day"] },
 { id: "CAR-DHL", name: "DHL Express", operatesIn: ["United States", "Spain"], baseRateUSD: 12, ratePerKgUSD: 2, ratePerKmUSD: 0.1, avgDeliveryDays: 1, onTimeRate: 95, maxWeightKg: 50, handlesFragile: true, acceptsPriority: ["Express", "Same-day"] },
];
const shipment: Shipment = { id: "SH-2024-8821", sku: "LAPTOP-DELL-15", quantity: 1, origin: "Zaragoza", destination: {city: "Madrid", country: "Spain", postalCode: "28001", distanceKm: 320}, priority: "Express", declaredValueUSD: 650, carrier: null, status: "Pending", createdAt: new Date("2024-03-15") };
function check(condition: boolean, description: string): void { if (!condition) throw new Error(description); console.log("✓ " + description); }
const before: string = JSON.stringify(products);
const carriersBefore: string = JSON.stringify(carriers);
check(products.every(p => validateProduct(p).valid), "productos válidos");
check(carriers.every(c => validateCarrier(c).valid) && validateShipment(shipment).valid, "transportistas y envío válidos");
check(!validateProduct({...products[0], weightKg: 0}).valid && !validateProduct({...products[0], dimensions: {...products[0].dimensions, heightCm: 201}}).valid, "rechaza peso y dimensiones fuera de rango");
check(!validateShipment({...shipment, quantity: 0}).valid && !validateCarrier({...carriers[0], onTimeRate: 101}).valid, "rechaza envío y transportista inválidos");
check(filterProductsByWarehouse(products, "Los Angeles").length === 2 && filterProductsByCategory(products, "Electronics").length === 1 && filterLowStockProducts(products)[0].sku === "LAPTOP-DELL-15", "filtros");
const combinedFilter = filterProducts(products, { warehouse: "Los Angeles", category: "Fashion", status: "Active", minUnitCostUSD: 30, maxUnitCostUSD: 40 });
check(combinedFilter.length === 1 && combinedFilter[0].sku === "SHOE-BLK-42", "filtros combinados por almacén, categoría, estado y rango de costo");
check(sortProductsByStock(products, "asc")[0].stockQuantity === 8 && sortProductsByStock(products, "desc")[0].stockQuantity === 120 && sortCarriersByReliability(carriers, "desc")[0].name === "DHL Express", "ordenamientos");
check(JSON.stringify(products) === before, "ordenar no modifica los productos originales");
check(JSON.stringify(carriers) === carriersBefore, "ordenar no modifica los transportistas originales");
check(findProductBySKU(products, "laptop-dell-15")?.sku === "LAPTOP-DELL-15" && findProductBySKU([], "x") === null && findShipmentById([shipment], shipment.id) === shipment && findShipmentById([], "x") === null, "búsqueda lineal y ausencia");
const sortedByWeight: Product[] = [...products].sort((a, b) => a.weightKg - b.weightKg);
check(binarySearchProductByWeight(sortedByWeight, 2.3) === 2 && binarySearchProductByWeight(sortedByWeight, 4) === -1 && binarySearchProductByWeight([], 1) === -1, "búsqueda binaria");
check(calculateShippingCost(shipment, products[1], carriers[1]) === 46.22 && scoreCarrierForShipment(carriers[1], shipment, products[1]) === 97.6, "costo y puntaje de SEUR");
const best = selectBestCarrier(carriers, shipment, products[1]);
check(best?.carrier.name === "UPS" && best.score === 76.4 && best.cost === 30.89 && selectBestCarrier([], shipment, products[1]) === null, "selección según el umbral literal del briefing");
check(countProductsByCategory(products).Home === 0 && countProductsByCategory(products).Fashion === 1 && calculateTotalInventoryValue(products) === 16975, "conteos y valor de inventario");
check(findMinStock(products) === 8 && findMaxStock(products) === 120 && findMinStock([]) === null && findMaxStock([]) === null, "mínimo y máximo de stock");
check(calculateAverageShipmentDistance([shipment]) === 320 && calculateAverageShipmentDistance([]) === 0 && groupShipmentsByStatus([shipment]).Pending.length === 1 && groupShipmentsByStatus([]).Failed.length === 0, "promedio y agrupación");
const assigned: Shipment[] = [{...shipment, carrier: "SEUR"}, {...shipment, id: "SH-2", carrier: "SEUR"}, {...shipment, id: "SH-3", carrier: "DHL"}, shipment];
check(findTopCarriers(assigned, 2)[0].count === 2 && findTopCarriers(assigned, 0).length === 0, "transportistas más usados y topN cero");
console.log("Todas las pruebas pasaron.");