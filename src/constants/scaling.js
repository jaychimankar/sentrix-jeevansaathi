/**
 * Physical Scaling Constants for Edge-AI Wearable Prototype
 *
 * CONVENTION: 1 scene unit = 10 millimeters
 *
 * This means:
 * - 70 mm device length → 7.0 units
 * - 45 mm device width → 4.5 units
 * - 20 mm device height → 2.0 units
 * - 2 mm wall thickness → 0.2 units
 * - 5 mm corner radius → 0.5 units
 */

// Scale conversion factors
export const SCALE_MM_TO_UNITS = 0.1; // Multiply mm by this to get scene units
export const UNIT_TO_MM = 10; // Multiply scene units by this to get mm

// Device overall dimensions (in scene units)
export const DEVICE = {
  // 70 mm × 45 mm × 20 mm wearable enclosure
  length: 7.0,   // Z-axis (70 mm)
  width: 4.5,    // X-axis (45 mm)
  height: 2.0,   // Y-axis (20 mm)
};

// Enclosure specifications (in scene units)
export const ENCLOSURE = {
  wallThickness: 0.2,     // 2 mm walls
  cornerRadius: 0.5,      // 5 mm corner fillets
  topHeight: 1.2,         // 12 mm top shell
  bottomHeight: 0.8,      // 8 mm bottom shell
  ventHoleDiameter: 0.25, // 2.5 mm vent holes
  ventCount: 10,          // 2 rows × 5 holes
};

// Component dimensions (representative breakout modules, in scene units)
export const COMPONENTS = {
  ESP32_S3: {
    pcb: { x: 2.55, y: 0.08, z: 1.8 }, // 25.5 × 18.0 mm module
    shield: { x: 1.8, y: 0.06, z: 1.4 },
  },
  OLED: {
    pcb: { x: 2.7, y: 0.05, z: 2.7 },       // 27 × 27 mm module
    activeArea: { x: 2.2, y: 0.02, z: 1.1 }, // 2:1 aspect ratio (21.74 × 10.86 mm)
  },
  MAX30102: {
    pcb: { x: 1.4, y: 0.06, z: 1.3 },     // 14 × 13 mm breakout
    sensor: { x: 0.56, y: 0.08, z: 0.33 }, // 5.6 × 3.3 mm package
    gasket: { outerRadius: 0.42, height: 0.06 },
  },
  MPU6050: {
    pcb: { x: 2.0, y: 0.06, z: 1.55 },    // 20 × 15.5 mm breakout
    chip: { x: 0.55, y: 0.065, z: 0.55 }, // 4 × 4 mm QFN-24
  },
  BME280: {
    pcb: { x: 1.1, y: 0.05, z: 0.9 },     // 15 × 12 mm breakout
    sensor: { x: 0.35, y: 0.045, z: 0.35 }, // 2.5 × 2.5 mm LGA
  },
  ENS160: {
    pcb: { x: 1.1, y: 0.05, z: 0.9 },     // 15 × 12 mm breakout
    sensor: { x: 0.42, y: 0.045, z: 0.42 }, // 3 × 3 mm LGA
  },
  BATTERY: {
    pouch: { x: 2.4, y: 0.28, z: 2.9 },   // 30 × 25 × 5 mm (representative)
  },
  CHARGING_PCB: {
    pcb: { x: 0.9, y: 0.06, z: 0.7 },     // 18 × 14 mm
    usbc: { x: 0.62, y: 0.17, z: 0.3 },
  },
  VIBRATION_MOTOR: {
    disc: { radius: 0.38, height: 0.14 }, // Ø10 × 3 mm coin ERM
  },
  RGB_LED: {
    led: { x: 0.2, y: 0.06, z: 0.2 },     // SMD 5050
    pipe: { radius: 0.08, height: 0.3 },  // Light pipe conduit
  },
  STRAP: {
    width: 2.2,      // 22 mm standard
    thickness: 0.22, // 2.2 mm
  },
  CHASSIS: {
    frame: { x: 4.1, y: 0.26, z: 6.6 },   // 66 × 41 × 16 mm internal
  },
};

// Strap dimensions (in mm for reference, converted to units where used)
export const STRAP_DIMS = {
  width: 22,        // mm - standard watch strap width
  thickness: 2.2,   // mm - TPU thickness
  buckleWidth: 22,  // mm - stainless steel buckle
};

// Helper function to convert mm to scene units
export const mm = (value) => value * SCALE_MM_TO_UNITS;

// Helper function to convert scene units to mm (for display)
export const toMm = (units) => units * UNIT_TO_MM;
