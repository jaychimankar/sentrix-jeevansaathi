// Master Component Database for Edge-AI Wearable Engineering Prototype

export const COMPONENTS = {
  OLED: {
    id: 'OLED',
    name: '0.96-inch Monochrome I2C OLED Display',
    shortName: '0.96" OLED',
    category: 'User Interface / Display',
    description: '128×64 pixel organic light-emitting diode display with SSD1306 controller providing high-contrast telemetry readout.',
    function: 'Real-time local visualization of physiological vitals, environmental conditions, and Edge-AI risk classification.',
    location: 'Top Cover Recessed Pocket (Z: 0.05, Y: 0.25)',
    dimensions: 'Module PCB: 27.0 × 27.0 × 2.4 mm | Active Area: 21.74 × 10.86 mm (2:1 Ratio)',
    rotation: 'Planar top surface facing viewer ([0, 0, 0])',
    mountingMethod: 'Recessed top cover bezel with internal mechanical retaining step and 4 corner fasteners',
    interface: 'I2C Bus (Default Address: 0x3C, SDA: GPIO 8, SCL: GPIO 9)',
    input: 'Graphics framebuffer stream and UI state from ESP32-S3',
    output: 'High-contrast monochrome visual display (2:1 aspect ratio landscape active surface)',
    systemRole: 'Serves as the primary on-wrist user interface delivering zero-latency health and environmental alerts.',
    color: '#2563eb (Cyan Emissive) on #010406 (Black OLED)',
    material: 'FR4 Substrate + Thin Bezel + Chemically Strengthened Display Glass',
    power: '3.3V DC @ ~15-20 mA (typical display content)',
    pipeline: 'ESP32-S3 Framebuffer ➔ SSD1306 Controller (I2C @ 400kHz) ➔ Self-Emissive Organic OLED Pixels',
    pinout: [
      { pin: 'Pin 1', name: 'GND', signal: 'System Ground Return', mcuPin: 'Common Ground Plane' },
      { pin: 'Pin 2', name: 'VCC', signal: 'Power Supply 3.3V', mcuPin: 'Regulated 3.3V Rail' },
      { pin: 'Pin 3', name: 'SCL', signal: 'I2C Serial Clock', mcuPin: 'ESP32-S3 GPIO 9 (400 kHz Fast-Mode)' },
      { pin: 'Pin 4', name: 'SDA', signal: 'I2C Serial Data', mcuPin: 'ESP32-S3 GPIO 8 (Address 0x3C)' }
    ],
    specs: {
      driver: 'SSD1306 I2C Controller',
      resolution: '128 × 64 pixels',
      activeRatio: '2:1 Landscape Active Area',
      contrast: 'Infinite contrast ratio with self-emissive organic pixels',
      refreshRate: '30 Hz continuous update'
    }
  },
  ESP32_S3: {
    id: 'ESP32_S3',
    name: 'ESP32-S3 Edge-AI Core',
    shortName: 'ESP32-S3',
    category: 'Compute & Edge-AI',
    description: 'High-performance dual-core microcontroller equipped with vector instructions for on-device TinyML neural network inference.',
    function: 'Multi-modal sensor acquisition, temporal synchronization, feature extraction, and TinyML risk inference.',
    location: 'Internal Chassis Center Mount (Z: -0.45, Y: 0.08)',
    dimensions: '25.5 × 18.0 × 3.1 mm (Representative Prototype Module)',
    rotation: 'Aligned with longitudinal axis of wearable body',
    mountingMethod: 'Chassis standoffs with M2 vibration dampening bosses and PCB snap-clips',
    interface: 'I2C Master (SDA: GPIO 8, SCL: GPIO 9), SPI, GPIO, UART',
    input: 'Digital telemetry from MAX30102, MPU6050, BME280, and ENS160 over shared I2C bus',
    output: 'Quantized TinyML risk predictions, OLED graphics buffer, RGB PWM signals, Haptic motor PWM pulses',
    systemRole: 'Central Edge-AI processing unit executing local sensor fusion models without cloud latency.',
    color: '#141814 (Matte Black Solder Mask) with #b0bcc5 (Nickel Shield)',
    material: 'FR4 Multi-layer PCB + Stamped Metal RF Shield Can + Copper Inverted-F Antenna',
    power: '3.3V DC @ ~68 mA (Dual 240MHz Active + TinyML Vector Neural Instructions)',
    pipeline: 'Sensor DMA Ring Buffer ➔ 50Hz Temporal Alignment ➔ Multi-Modal Feature Vector ➔ Quantized INT8 TinyML Classifier ➔ Real-Time Actuator Triggers',
    pinout: [
      { pin: 'GPIO 8', name: 'I2C_SDA', signal: 'Shared Multi-Sensor Data Bus', mcuPin: 'Internal Pull-Up 4.7k' },
      { pin: 'GPIO 9', name: 'I2C_SCL', signal: 'Shared Multi-Sensor Clock Bus', mcuPin: '400 kHz Fast-Mode Master' },
      { pin: 'GPIO 10', name: 'HR_INT', signal: 'MAX30102 FIFO Ready Interrupt', mcuPin: 'Active Low Edge Trigger' },
      { pin: 'GPIO 11', name: 'LED_R', signal: 'Red Channel Indicator PWM', mcuPin: 'LEDC Channel 0' },
      { pin: 'GPIO 12', name: 'LED_G', signal: 'Green Channel Indicator PWM', mcuPin: 'LEDC Channel 1' },
      { pin: 'GPIO 13', name: 'LED_B', signal: 'Blue Channel Indicator PWM', mcuPin: 'LEDC Channel 2' },
      { pin: 'GPIO 14', name: 'HAPTIC_DRV', signal: 'ERM Coin Motor Gate Pulse', mcuPin: 'LEDC Channel 3 (PWM)' }
    ],
    specs: {
      cpu: 'Xtensa Dual-Core 32-bit LX7 @ 240 MHz',
      acceleration: 'Vector instructions for neural network / DSP acceleration',
      memory: '512 KB SRAM, 8 MB Octal SPI Flash, 2 MB PSRAM',
      wireless: '2.4 GHz Wi-Fi 4 + Bluetooth 5 (LE) for optional cloud telemetry'
    }
  },
  MAX30102: {
    id: 'MAX30102',
    name: 'MAX30102 Optical Health Sensor',
    shortName: 'MAX30102',
    category: 'Biomedical / Health Sensor',
    description: 'Integrated pulse oximetry and heart-rate monitor module combining dual optical emitters and a low-noise photodetector.',
    function: 'Photoplethysmography (PPG) sensing for cardiovascular pulse rate and blood oxygen saturation (SpO2).',
    location: 'Bottom Enclosure Aperture / Direct Skin Interface (Z: 0.0, Y: -0.32)',
    dimensions: 'Breakout PCB: 14.0 × 12.7 × 1.6 mm | Sensor Package: 5.6 × 3.3 × 1.55 mm',
    rotation: 'Optical sensing surface facing DOWNWARD toward user wrist ([Math.PI, 0, 0])',
    mountingMethod: 'Lower chassis recess sealed with an elastomeric optical isolation gasket',
    interface: 'I2C Bus (Address: 0x57, SDA: GPIO 8, SCL: GPIO 9)',
    input: 'Optical absorption of 660 nm (Red) and 880 nm (Infrared) light by pulsating microvascular capillary bed',
    output: '18-bit dual-channel raw PPG analog-to-digital converter (ADC) time-series samples',
    systemRole: 'Supplies primary physiological vitals (cardiovascular strain and arterial oxygenation) to the sensor fusion engine.',
    color: '#2a1038 (Dark Purple PCB) + #0a0a0d (Black Silicone Gasket)',
    material: 'FR4 PCB + Molded Optical Glass Package + Silicone Elastomer Gasket',
    power: '3.3V DC @ 0.6 mA active (600 µA @ 50 Hz pulse rate)',
    pipeline: '660nm/880nm Dual LED Pulse ➔ Capillary Microvascular Bed ➔ Photodetector ➔ 18-bit ADC ➔ I2C FIFO (0x57) ➔ ESP32 Bandpass Filter ➔ Peak Detection (HR) & AC/DC Ratio (SpO2)',
    pinout: [
      { pin: 'Pin 1', name: 'VIN', signal: 'Sensor Supply 3.3V', mcuPin: 'Regulated 3.3V Power Rail' },
      { pin: 'Pin 2', name: 'SDA', signal: 'I2C Serial Data', mcuPin: 'ESP32-S3 GPIO 8 (Address: 0x57)' },
      { pin: 'Pin 3', name: 'SCL', signal: 'I2C Serial Clock', mcuPin: 'ESP32-S3 GPIO 9 (400 kHz)' },
      { pin: 'Pin 4', name: 'INT', signal: 'Sample Ready FIFO Interrupt', mcuPin: 'ESP32-S3 GPIO 10 (Active Low)' },
      { pin: 'Pin 5', name: 'GND', signal: 'Analog & Digital Ground', mcuPin: 'Common Ground Plane' }
    ],
    specs: {
      emitters: 'Integrated 660 nm (Red) and 880 nm (Infrared) LED duo',
      detector: 'High-sensitivity optical photodetector with ambient light cancellation',
      gasket: '1.2 mm black silicone optical isolation ring preventing optical crosstalk'
    }
  },
  MPU6050: {
    id: 'MPU6050',
    name: 'MPU6050 6-Axis MotionTracking IMU',
    shortName: 'MPU6050',
    category: 'Motion / Inertial Sensor',
    description: 'Micro-Electro-Mechanical Systems (MEMS) inertial measurement unit combining a 3-axis gyroscope and 3-axis accelerometer.',
    function: 'Measures body dynamic acceleration, rotational rates, user activity level, and detects sudden movement artifacts or falls.',
    location: 'Internal Chassis Center Rigid Mount (Z: 0.55, Y: 0.08)',
    dimensions: 'Breakout PCB: 20.0 × 15.5 × 1.6 mm | Sensor Package: 4.0 × 4.0 × 0.9 mm QFN-24',
    rotation: 'Aligned with wearable coordinate frame (X: Lateral, Y: Normal, Z: Longitudinal)',
    mountingMethod: 'Rigid mechanical chassis screw boss to prevent structural flex and vibration damping',
    interface: 'I2C Bus (Address: 0x68, SDA: GPIO 8, SCL: GPIO 9)',
    input: 'Inertial forces (gravity/linear acceleration) and angular rotational velocities',
    output: '6-Degrees-of-Freedom acceleration (Ax, Ay, Az) and angular rate (Gx, Gy, Gz) telemetry',
    systemRole: 'Provides motion context to discriminate between exercise tachycardia versus resting physiological distress.',
    color: '#083358 (Deep Blue PCB) + #1a1a1a (QFN Package)',
    material: 'FR4 PCB + Silicon MEMS Sensor Package',
    power: '3.3V DC @ 3.8 mA (Gyroscope + Accelerometer Active)',
    pipeline: 'MEMS Proof Mass Deflection ➔ Capacitive Bridge ➔ 16-bit ADCs ➔ On-Chip DMP ➔ I2C Bus (0x68) ➔ ESP32 Activity Classification (Resting/Walking/Exertion)',
    pinout: [
      { pin: 'Pin 1', name: 'VCC', signal: 'Module Power 3.3V', mcuPin: 'Regulated 3.3V Rail' },
      { pin: 'Pin 2', name: 'GND', signal: 'Chassis Reference Ground', mcuPin: 'System Ground' },
      { pin: 'Pin 3', name: 'SCL', signal: 'I2C Serial Clock', mcuPin: 'ESP32-S3 GPIO 9' },
      { pin: 'Pin 4', name: 'SDA', signal: 'I2C Serial Data', mcuPin: 'ESP32-S3 GPIO 8 (Address: 0x68)' },
      { pin: 'Pin 5', name: 'INT', signal: 'Motion Wakeup / DMP Interrupt', mcuPin: 'ESP32-S3 GPIO 15' }
    ],
    specs: {
      accelRange: '±2g, ±4g, ±8g, ±16g user programmable',
      gyroRange: '±250, ±500, ±1000, ±2000 °/sec',
      dmp: 'Digital Motion Processor (DMP) executing on-chip motion fusion'
    }
  },
  BME280: {
    id: 'BME280',
    name: 'BME280 Environmental Sensor',
    shortName: 'BME280',
    category: 'Environmental Sensor',
    description: 'Precision environmental sensor measuring ambient barometric pressure, relative humidity, and ambient temperature.',
    function: 'Monitors external thermal stress, humidity conditions, and atmospheric pressure trends.',
    location: 'Side Environmental Chamber (Z: 0.32, Y: 0.08, X: 0.78)',
    dimensions: 'Breakout PCB: 15.0 × 12.0 × 1.6 mm | Sensor Package: 2.5 × 2.5 × 0.93 mm 8-pin LGA',
    rotation: 'Facing lateral ventilation channel with pressure vent aperture exposed to air flow',
    mountingMethod: 'Chassis airflow partition wall isolated from internal battery thermal dissipation',
    interface: 'I2C Bus (Address: 0x76, SDA: GPIO 8, SCL: GPIO 9)',
    input: 'Ambient convective airflow entering through the 10 external side ventilation holes',
    output: 'Calibrated temperature (°C), relative humidity (%RH), and barometric pressure (hPa)',
    systemRole: 'Supplies external environmental thermal index context to calculate heat exhaustion and hypothermia risks.',
    color: '#3c184e (Purple Breakout PCB) + #c5ccd4 (Nickel Lid)',
    material: 'FR4 PCB + Metal Lid LGA Package with Vent Port',
    power: '3.3V DC @ 3.6 µA @ 1 Hz sampling (ultra-low power consumption)',
    pipeline: '10 Lateral Vent Ports ➔ Convective Air Intake ➔ Piezo-Resistive Pressure & Capacitive Humidity ➔ Factory Trimming Parameters ➔ I2C Bus (0x76) ➔ Thermal Strain Index Calculation',
    pinout: [
      { pin: 'Pin 1', name: 'VCC', signal: 'Sensor Power 3.3V', mcuPin: 'Regulated 3.3V Rail' },
      { pin: 'Pin 2', name: 'GND', signal: 'Ground Return', mcuPin: 'System Ground Plane' },
      { pin: 'Pin 3', name: 'SCL', signal: 'I2C Serial Clock', mcuPin: 'ESP32-S3 GPIO 9' },
      { pin: 'Pin 4', name: 'SDA', signal: 'I2C Serial Data', mcuPin: 'ESP32-S3 GPIO 8 (Address: 0x76)' }
    ],
    specs: {
      tempAccuracy: '±0.5 °C (operating range -40 to +85 °C)',
      humidityAccuracy: '±3 %RH with 1s response time',
      pressureAccuracy: '±1 hPa (300 to 1100 hPa altitude compensation)'
    }
  },
  ENS160: {
    id: 'ENS160',
    name: 'ENS160 Multi-Gas Air Quality Sensor',
    shortName: 'ENS160',
    category: 'Environmental / Gas Sensor',
    description: 'Digital multi-gas sensor using 4 independent metal oxide (MOX) hotplate heating elements to detect oxidizing and reducing gases.',
    function: 'Measures Total Volatile Organic Compounds (TVOC), equivalent carbon dioxide (eCO2), and relative Air Quality Index (AQI).',
    location: 'Side Environmental Chamber (Co-located with BME280, Z: 0.88, Y: 0.08, X: 0.78)',
    dimensions: 'Breakout PCB: 15.0 × 12.0 × 1.6 mm | Sensor Package: 3.0 × 3.0 × 0.9 mm LGA',
    rotation: 'Facing lateral ventilation channel with active MOX gas membrane exposed to ambient air',
    mountingMethod: 'Chassis airflow partition wall directly adjacent to convective ventilation ports',
    interface: 'I2C Bus (Address: 0x53, SDA: GPIO 8, SCL: GPIO 9)',
    input: 'Gaseous chemical pollutants, organic solvent vapors, and respiratory CO2 in ambient air',
    output: 'Standardized AQI (1-5), TVOC concentration (0-65,000 ppb), and eCO2 (400-65,000 ppm)',
    systemRole: 'Provides atmospheric hazard detection, triggering warnings when poor air quality compounds respiratory vulnerability.',
    color: '#161c1a (Black PCB) + #2d3339 (Sensor Package with Active Membrane Window)',
    material: 'FR4 PCB + Silicon MOX Gas Sensor Package',
    power: '3.3V DC @ 29 mA (heater cycling active)',
    pipeline: 'Ambient Gas Diffusion ➔ 4 Micro-machined MOX Hotplates ➔ Surface Resistance Shift ➔ Internal Processing ASICs ➔ Standardized AQI & TVOC ➔ I2C Bus (0x53)',
    pinout: [
      { pin: 'Pin 1', name: 'VDD', signal: 'Sensor Core Supply 3.3V', mcuPin: 'Regulated 3.3V Rail' },
      { pin: 'Pin 2', name: 'GND', signal: 'System Ground', mcuPin: 'Common Ground Plane' },
      { pin: 'Pin 3', name: 'SCL', signal: 'I2C Serial Clock', mcuPin: 'ESP32-S3 GPIO 9' },
      { pin: 'Pin 4', name: 'SDA', signal: 'I2C Serial Data', mcuPin: 'ESP32-S3 GPIO 8 (Address: 0x53)' }
    ],
    specs: {
      hotplates: '4 independent micro-machined MOX gas sensor hotplates',
      tvocRange: '0 to 65,000 ppb TVOC',
      eco2Range: '400 to 65,000 ppm eCO2 equivalent'
    }
  },
  BATTERY: {
    id: 'BATTERY',
    name: '3.7 V 500 mAh Li-Po Pouch Cell',
    shortName: 'Li-Po Battery',
    category: 'Power Source',
    description: 'Rechargeable lithium-ion polymer pouch battery with integrated safety protection circuit module (PCM).',
    function: 'Provides autonomous portable DC electrical energy storage for continuous operation.',
    location: 'Lower Chassis Dedicated Insulated Pocket (Z: 0.0, Y: -0.08, X: -0.15)',
    dimensions: '30.0 × 25.0 × 5.0 mm (Representative Prototype Dimension)',
    rotation: 'Horizontal orientation seated firmly inside retaining tray',
    mountingMethod: 'Dedicated chassis tray with retaining perimeter lip thermally isolated from sensor chamber',
    interface: '2-Wire Silicon Leads (Red/Black) terminating in a micro JST-PH 2.0 mm connector',
    input: 'Constant-current / constant-voltage (CC/CV) charging power from PMIC circuit',
    output: 'Nominal 3.7 V (3.0 V cut-off to 4.2 V peak) continuous DC power rail',
    systemRole: 'Supplies clean continuous power to the power regulation subsystem for 18+ hours of on-device sensing.',
    color: '#9aa5b0 (Silver Aluminum Foil Pouch) + #c89618 (Kapton Tape Tab)',
    material: 'Aluminum Laminate Pouch + Kapton Insulation Tape + Silicone Wires',
    power: '500 mAh / 1.85 Wh nominal energy (3.7V nominal, 4.2V peak charge)',
    pipeline: 'Chemical Lithium Cobalt Oxide Cells ➔ Integrated PCM (DW01A + FS8205A) ➔ JST-PH Connector ➔ TP4056 PMIC Board ➔ Low-Dropout 3.3V Regulator',
    pinout: [
      { pin: 'Lead 1 (Red)', name: 'BAT+', signal: 'Positive DC Power (3.0V - 4.2V)', mcuPin: 'TP4056 PMIC VBAT Pin' },
      { pin: 'Lead 2 (Black)', name: 'BAT-', signal: 'Protected Negative Return', mcuPin: 'Integrated PCM Ground' }
    ],
    specs: {
      capacity: '500 mAh / 1.85 Wh nominal energy',
      voltage: '3.7 V nominal (4.2 V charge termination)',
      protection: 'Integrated PCM for over-charge, over-discharge, and short-circuit cutoff'
    }
  },
  CHARGING_PCB: {
    id: 'CHARGING_PCB',
    name: 'Power Management & USB-C Interface',
    shortName: 'USB-C / PMIC',
    category: 'Power Management',
    function: 'Li-Po battery charging, battery protection, and regulated 3.3 V low-dropout rail generation.',
    location: 'Chassis Lateral Perimeter Aligned with Enclosure Port Cutout (Z: -0.6, Y: -0.04, X: -0.85)',
    dimensions: '18.0 × 14.0 × 3.5 mm PCB Assembly',
    rotation: 'Perpendicular to side wall so USB-C receptacle faces external port opening',
    mountingMethod: 'Chassis perimeter slide-in guide rails with anti-shear connector retaining ribs',
    interface: 'USB Type-C Connector (5 V VBUS, CC1/CC2 5.1k configuration resistors)',
    input: '5 V DC power from external USB-C cable',
    output: 'Regulated 3.3 V system power rail for ESP32-S3 and sensors; 4.2 V CC/CV battery charging current',
    systemRole: 'Facilitates external recharging and provides stable, low-noise power distribution across the device.',
    color: '#1a2e22 (Green PCB) + #c0cad2 (Metallic USB-C Receptacle)',
    material: 'FR4 PCB + Stainless Steel Shielded Connector Shell with Gold Plated Contacts',
    power: '5.0V USB Input | 3.3V @ 500 mA Peak System Distribution Rail',
    pipeline: 'External USB-C 5V ➔ TP4056 Charge Controller ➔ 4.2V CC/CV Battery Charging ➔ RT9193 Ultra-Low Dropout LDO ➔ Clean 3.3V System Bus',
    pinout: [
      { pin: 'VBUS', name: 'USB_5V', signal: 'External 5V DC Power Input', mcuPin: 'Mid-Mount Type-C Shell' },
      { pin: 'CC1/CC2', name: 'CC_PULLDOWN', signal: '5.1k Resistor Host Negotiation', mcuPin: 'USB-PD 5V / 3A Sink Mode' },
      { pin: 'VBAT', name: 'BATT_CONN', signal: '4.2V CC/CV Charging Output', mcuPin: 'Li-Po Battery Leads' },
      { pin: '3V3_OUT', name: 'SYS_3V3', signal: 'Ultra-Low Dropout Regulated Rail', mcuPin: 'Mainboard Power Plane' },
      { pin: 'GND', name: 'PWR_GND', signal: 'Power Ground Plane', mcuPin: 'Common System Ground' }
    ],
    specs: {
      controller: 'TP4056 Linear Li-Ion Charger IC',
      regulator: 'Ultra-low dropout 3.3V 500mA LDO regulator',
      connector: 'Mid-mount USB Type-C 16-pin receptacle'
    }
  },
  VIBRATION_MOTOR: {
    id: 'VIBRATION_MOTOR',
    name: '10 mm Coin ERM Vibration Motor',
    shortName: 'Haptic Motor',
    category: 'Haptic Feedback',
    function: 'Generates tactile vibration alerts to warn the user during critical physiological or environmental alarms.',
    location: 'Bottom Chassis Cradle for Direct Wrist Mechanical Coupling (Z: 1.15, Y: -0.16, X: -0.55)',
    dimensions: 'Ø10.0 × 3.0 mm stainless steel disc body',
    rotation: 'Flat disc oriented parallel to bottom wrist contact surface',
    mountingMethod: 'Chassis press-fit circular retention cradle with silicone dampening ring',
    interface: 'GPIO Transistor Driver (PWM Haptic Profile Control from ESP32-S3)',
    input: 'Tactile alert trigger waveform and PWM pulse signals from ESP32-S3',
    output: '1.2G peak mechanical vibration transmitted directly through bottom cover to wrist',
    systemRole: 'Ensures urgent notifications are perceived immediately even when the screen is not in direct view.',
    color: '#b5bcc4 (Brushed Stainless Steel Disc) + #15171a (Rubber Cushion)',
    material: 'Stainless Steel Case + Neodymium Magnet + Eccentric Rotating Mass',
    power: '3.0V DC @ 75 mA peak pulse current',
    pipeline: 'ESP32-S3 TinyML Alarm ➔ GPIO 14 PWM Pulses ➔ NPN Driver Transistor ➔ Neodymium ERM Coin Motor Spin (12,000 RPM) ➔ 1.2G Tactile Feedback to Wrist',
    pinout: [
      { pin: 'Lead 1 (Red)', name: 'MOTOR+', signal: '3.3V DC Power Rail', mcuPin: 'System 3.3V Rail' },
      { pin: 'Lead 2 (Blue)', name: 'MOTOR-', signal: 'Low-Side Transistor Collector', mcuPin: 'ESP32-S3 GPIO 14 (via NPN Switch)' }
    ],
    specs: {
      motorType: 'Eccentric Rotating Mass (ERM) Coin Motor',
      voltage: '3.0 V DC rated (2.5 V - 3.8 V operating)',
      speed: '12,000 RPM nominal @ 3.0V'
    }
  },
  RGB_LED: {
    id: 'RGB_LED',
    name: 'RGB Status Indicator & Optical Light Pipe',
    shortName: 'RGB Light Pipe',
    category: 'Visual Alert System',
    function: 'Provides ambient glanceable color-coded risk notifications visible from wide peripheral angles.',
    location: 'Top Bezel Corner / Light Pipe Conduit to Mainboard (Z: 1.35, Y: 0.16, X: 0.82)',
    dimensions: 'SMD 5050 LED on PCB + Ø2.5 × 4.0 mm PMMA optical light pipe conduit',
    rotation: 'Vertical optical conduit connecting internal LED to external top bezel lens',
    mountingMethod: 'Press-fit optical lens in top cover mated to mainboard emitter',
    interface: 'GPIO PWM (Red, Green, Blue individual duty-cycle channels from ESP32-S3)',
    input: 'Risk classification state signal from TinyML inference engine',
    output: 'Diffused optical light: Green (Safe / Low Risk), Yellow (Warning / Medium Risk), Red (Danger / High Risk)',
    systemRole: 'Allows instantaneous peripheral gaze risk awareness without requiring screen focus.',
    color: 'Dynamic: #00ff88 (Low), #ffcc00 (Medium), #ff0044 (High)',
    material: 'SMD LED Package + Optical Grade Polymethyl Methacrylate (PMMA)',
    power: '3.3V DC @ ~18 mA (full brightness illumination)',
    pipeline: 'TinyML Anomaly Score ➔ ESP32-S3 Triple PWM (GPIO 11, 12, 13) ➔ SMD 5050 RGB LED ➔ PMMA Light Pipe Total Internal Reflection ➔ 140° Frosted Bezel Lens',
    pinout: [
      { pin: 'Pin 1', name: 'RED_CATHODE', signal: 'Red PWM Channel', mcuPin: 'ESP32-S3 GPIO 11' },
      { pin: 'Pin 2', name: 'GRN_CATHODE', signal: 'Green PWM Channel', mcuPin: 'ESP32-S3 GPIO 12' },
      { pin: 'Pin 3', name: 'BLU_CATHODE', signal: 'Blue PWM Channel', mcuPin: 'ESP32-S3 GPIO 13' },
      { pin: 'Pin 4', name: 'COM_ANODE', signal: 'Common Power Rail (+3.3V)', mcuPin: 'Regulated 3.3V Rail' }
    ],
    specs: {
      wavelength: 'Red: 625 nm, Green: 520 nm, Blue: 465 nm',
      opticalDiffusion: 'Frost-textured top exit face for 140° wide viewing angle'
    }
  },
  CHASSIS: {
    id: 'CHASSIS',
    name: 'Internal Structural Chassis',
    shortName: 'Internal Chassis',
    category: 'Mechanical Architecture',
    function: 'Provides rigid structural mounting, component spatial alignment, thermal isolation, and cable routing.',
    location: 'Internal Core Enclosure (Sandwiched between Top and Bottom Shells)',
    dimensions: '66.0 × 41.0 × 16.0 mm (Injection molded polycarbonate / ABS blend)',
    rotation: 'Central reference frame for all internal components ([0, 0, 0])',
    mountingMethod: 'Sandwiched rigidly between top and bottom enclosure shells with interlocking perimeter ribs',
    interface: 'M2 Threaded Standoffs, Snap-Fit Retaining Clips, Cable Clearances',
    input: 'External mechanical shocks, torsional forces, and thermal gradients',
    output: 'Rigid geometric registration of sensors, optical path, and PCB subassemblies',
    systemRole: 'Integrates all sub-modules into a coherent, vibration-resistant, and thermally partitioned architecture.',
    color: '#23272d (Dark Technical Polycarbonate / ABS)',
    material: 'Injection Molded Polycarbonate / ABS Composite Blend',
    power: 'Passive structural member (0 mA)',
    pipeline: 'Mechanical Load Path: Outer Enclosure ➔ Interlocking Perimeter Ribs ➔ Chassis Core ➔ M2 Brass Bushings ➔ PCB Dampening',
    pinout: [
      { pin: 'Boss 1-5', name: 'M2_STANDOFFS', signal: 'PCB Rigid Structural Registration', mcuPin: 'Internal Brass Bushings' },
      { pin: 'Divider', name: 'THERMAL_WALL', signal: 'Acoustic & Heat Barrier', mcuPin: 'Battery / Sensor Isolation' }
    ],
    specs: {
      partition: 'Thermal & airflow divider isolating side sensor chamber from battery heat',
      standoffs: '5 integrated standoffs with brass threaded inserts for M2 fasteners',
      pockets: 'Dedicated recessed pockets for battery, vibration motor, and charging PCB'
    }
  },
  TOP_COVER: {
    id: 'TOP_COVER',
    name: 'Top Enclosure Shell (Graphite PETG)',
    shortName: 'Top Cover',
    category: 'Industrial Design / Enclosure',
    function: 'Upper external protective shell housing the OLED display module, light pipe aperture, and aesthetics.',
    location: 'Top Outer Surface (Z: 0.0, Y: 0.25)',
    dimensions: '70.0 × 45.0 × 12.0 mm (2 mm wall thickness, 5 mm corner radius)',
    rotation: 'Upper half of wearable housing ([0, 0, 0])',
    mountingMethod: 'Mates with internal chassis and bottom cover via perimeter tongue-and-groove seam and corner screws',
    interface: 'Mechanical Seam, Recessed OLED Pocket, RGB Light Pipe Opening',
    input: 'Physical user handling and environmental exposure',
    output: 'Ergonomic display bezel and structural impact protection',
    systemRole: 'Provides sleek industrial design styling and protects delicate internal electronics.',
    color: '#181b1e (Graphite PETG Matte Finish)',
    material: '3D Printed / Injection Molded PETG with Fine Matte Bead-Blasted Texture',
    power: 'Passive enclosure (0 mA)',
    pipeline: 'Ergonomic Human Interface: Recessed 0.96" OLED Bezel Pocket ➔ 140° RGB Light Pipe Window ➔ Technical Markings',
    pinout: [
      { pin: 'Cavity A', name: 'OLED_BEZEL', signal: 'Recessed Window Collar', mcuPin: 'Flush Display Glass Seating' },
      { pin: 'Aperture B', name: 'RGB_LENS', signal: 'PMMA Optical Light Exit', mcuPin: 'Glanceable Status Notification' }
    ],
    specs: {
      wallThickness: '2.0 mm nominal wall thickness',
      cornerRadius: '5.0 mm smooth filleted corner transitions',
      recess: 'Precision recessed cavity holding the 0.96-inch OLED module'
    }
  },
  BOTTOM_COVER: {
    id: 'BOTTOM_COVER',
    name: 'Bottom Enclosure Shell (Skin Interface)',
    shortName: 'Bottom Cover',
    category: 'Industrial Design / Enclosure',
    function: 'Lower external protective shell providing ergonomic wrist contact, optical sensor window, vent grille, and strap lugs.',
    location: 'Bottom Outer Surface (Z: 0.0, Y: -0.28)',
    dimensions: '70.0 × 45.0 × 8.0 mm (2 mm wall thickness, 5 mm corner radius)',
    rotation: 'Lower half of wearable housing ([0, 0, 0])',
    mountingMethod: 'Perimeter mechanical seam fastening to upper shell with 4 recessed M2 fasteners',
    interface: 'Optical Window Aperture, 10 Side Vent Holes, 22 mm Strap Lug Bosses, USB-C Cutout',
    input: 'Ergonomic wrist contact pressure and ambient convective air intake',
    output: 'Optical coupling path for PPG sensing and convective air delivery to BME280/ENS160 chamber',
    systemRole: 'Houses the skin-facing optical sensor and environmental air vents in a water-resistant package.',
    color: '#181b1e (Graphite PETG Matte Finish)',
    material: '3D Printed / Injection Molded PETG with Ergonomic Curved Wrist Contours',
    power: 'Passive enclosure (0 mA)',
    pipeline: 'Convective Air Intake (10 Lateral Vent Ports) ➔ Isolated Sensor Chamber | Wrist Contact Surface ➔ MAX30102 Optical Gasket Retainer',
    pinout: [
      { pin: 'Cutout 1-10', name: 'VENT_GRILLE', signal: 'Ambient Air Inflow Port', mcuPin: 'Chamber to BME280 / ENS160' },
      { pin: 'Port Lateral', name: 'USBC_PORT', signal: 'Mid-Mount USB Connector Port', mcuPin: 'Recharging Cable Interface' },
      { pin: 'Aperture Base', name: 'PPG_WINDOW', signal: 'Optical Sensor Aperture', mcuPin: 'MAX30102 Skin Interface' }
    ],
    specs: {
      vents: '10 real cut cylindrical vent holes (2 rows × 5 holes, ~2.5 mm diameter)',
      opticalAperture: 'Recessed bottom aperture with dark optical gasket seat',
      lugs: 'Integrated dual anterior/posterior strap lugs accommodating 22 mm spring bars'
    }
  },
  STRAPS: {
    id: 'STRAPS',
    name: '22 mm Flexible TPU Wrist Straps',
    shortName: 'TPU Straps',
    category: 'Ergonomics / Wearable Straps',
    function: 'Secures wearable body against the user wrist with consistent tension required for accurate optical PPG sensing.',
    location: 'Anterior (Z: -2.6) & Posterior (Z: 2.8) Enclosure Lug Hinges',
    dimensions: '22.0 mm width × 2.8 mm thickness × 120 mm / 80 mm dual strap length',
    rotation: 'Curved flexible anatomical contours wrapping around wrist form factor',
    mountingMethod: '22 mm stainless steel quick-release spring bars seated in enclosure lug holes',
    interface: 'Quick-release spring bar pins and stainless steel tang buckle',
    input: 'Mechanical strapping tension exerted by user adjustment',
    output: 'Stable, motion-artifact-minimized skin contact pressure',
    systemRole: 'Maintains optimal sensor contact pressure against skin without occluding capillary blood flow.',
    color: '#131618 (Matte Charcoal Textured Elastomer)',
    material: 'Thermoplastic Polyurethane (TPU 85A Shore Hardness) + Stainless Steel Buckle',
    power: 'Passive ergonomic mechanical strap (0 mA)',
    pipeline: 'Wrist Tension Adjustment ➔ Transverse Grooved Inner Surface (Sweat Breathability) ➔ Continuous Optical Skin Coupling',
    pinout: [
      { pin: 'Lug Pin 1', name: 'SPRING_BAR_N', signal: '22mm Stainless Steel Quick-Release', mcuPin: 'North Enclosure Hinge' },
      { pin: 'Lug Pin 2', name: 'SPRING_BAR_S', signal: '22mm Stainless Steel Quick-Release', mcuPin: 'South Enclosure Hinge' }
    ],
    specs: {
      strapWidth: '22 mm standard watch strap lug width',
      buckle: 'Brushed 316L stainless steel buckle and dual keeper loops',
      texture: 'Precision ribbed knit grooves with sweat-breathing transverse channels'
    }
  },
  TMP117: {
    id: 'TMP117',
    name: 'TMP117 High-Precision Medical Temperature Sensor',
    shortName: 'TMP117 Medical Temp',
    category: 'Biomedical / Temperature',
    description: 'Ultra-high accuracy (±0.1°C) digital temperature sensor meeting ASTM E1112 and ISO 80601-2-56 clinical thermometry standards.',
    function: 'Clinical-grade continuous skin & core body temperature tracking for early fever, hypothermia, and infection detection in elderly patients.',
    location: 'Bottom Contact Plate / Direct Thermal Via to Skin (Z: 0.8, Y: -0.32, X: 0.4)',
    dimensions: 'WSON-6 Package: 2.0 × 2.0 × 0.8 mm (Breakout: 12.0 × 10.0 × 1.2 mm)',
    rotation: 'Thermal contact pad facing bottom skin interface ([Math.PI, 0, 0])',
    mountingMethod: 'Direct thermal via coupling to bottom conductive gold contact pad',
    interface: 'I2C Bus (Default Address: 0x48, SDA: GPIO 8, SCL: GPIO 9)',
    input: 'Transcutaneous conductive thermal flow from radial artery skin surface',
    output: '16-bit calibrated digital temperature telemetry (0.0078125°C resolution)',
    systemRole: 'Detects micro-thermal changes signaling nocturnal fever, sepsis onset, or heat exhaustion in senior citizens.',
    color: '#2563eb (Medical Blue Substrate) + #ffd700 (Gold Thermal Contact Via)',
    material: 'WSON-6 Silicon Die + Gold Thermal Via + Lead-Free RoHS Substrate',
    power: '3.3V DC @ 3.5 µA (1 Hz Low Power Active Sampling)',
    pipeline: 'Skin Thermal Conduction ➔ Gold Thermal Via ➔ 16-bit Sigma-Delta ADC ➔ I2C Bus (0x48) ➔ ESP32-S3 Fever Threshold Engine',
    pinout: [
      { pin: 'Pin 1', name: 'SCL', signal: 'I2C Serial Clock', mcuPin: 'ESP32-S3 GPIO 9' },
      { pin: 'Pin 2', name: 'GND', signal: 'Ground Reference', mcuPin: 'Common Ground Plane' },
      { pin: 'Pin 3', name: 'ALERT', signal: 'High/Low Temp Programmable Interrupt', mcuPin: 'ESP32-S3 GPIO 4' },
      { pin: 'Pin 4', name: 'ADD0', signal: 'I2C Address Select (GND=0x48)', mcuPin: 'Tied to GND' },
      { pin: 'Pin 5', name: 'VCC', signal: '3.3V Power Supply', mcuPin: 'Regulated 3.3V Rail' },
      { pin: 'Pin 6', name: 'SDA', signal: 'I2C Serial Data', mcuPin: 'ESP32-S3 GPIO 8' }
    ],
    specs: {
      accuracy: '±0.1°C clinical accuracy across -20°C to +50°C range without calibration',
      standard: 'ASTM E1112 and ISO 80601-2-56 clinical thermometry compliant',
      resolution: '0.0078125°C (16-bit precision)',
      conversionTime: '15.5 ms continuous conversion'
    }
  },
  AD8232: {
    id: 'AD8232',
    name: 'AD8232 Single-Lead ECG / Heart Rate Monitor',
    shortName: 'AD8232 ECG Lead',
    category: 'Biomedical / Cardiac Front-End',
    description: 'Integrated signal conditioning block for ECG and biopotential measurement applications with motion artifact filtering.',
    function: 'Captures clinical single-lead electrocardiogram (ECG) waveforms to identify cardiac arrhythmias, tachycardia, and bradycardia.',
    location: 'Internal Substrate Interfacing Dual Bottom/Side Dry Electrodes (Z: -0.9, Y: -0.15, X: 0.6)',
    dimensions: 'Module PCB: 28.0 × 18.0 × 2.0 mm (QFN Package: 4.0 × 4.0 × 0.8 mm)',
    rotation: 'Parallel to main board ([0, 0, 0])',
    mountingMethod: 'Chassis retaining slot with direct spring contact to dry titanium watch electrodes',
    interface: 'Analog ADC Input (ESP32-S3 ADC1 Channel 0, GPIO 1) + Lead-Off Digital Pins',
    input: 'Micro-volt cardiac electrical depolarization signals through differential dry electrodes',
    output: 'Conditioned amplified analog ECG signal (0.5 Hz - 40 Hz bandpass) + Lead-Off status',
    systemRole: 'Provides diagnostic rhythm validation to complement optical PPG pulse oximetry.',
    color: '#dc2626 (Cardiac Red) + #ffffff (Silkscreen Lead-Off Indicators)',
    material: 'FR4 PCB + Instrumentation Amplifier Silicon + Dry Contact Electrodes',
    power: '3.3V DC @ 170 µA quiescent supply current',
    pipeline: 'Dry Skin Electrodes ➔ Instrumentation Amplifier (Gain 100) ➔ 2-Pole High-Pass Filter ➔ ESP32-S3 12-bit ADC DMA ➔ Real-Time QRS Peak Detection',
    pinout: [
      { pin: 'OUTPUT', name: 'ECG_OUT', signal: 'Amplified Conditioned ECG Waveform', mcuPin: 'ESP32-S3 GPIO 1 (ADC1_CH0)' },
      { pin: 'LO+', name: 'LEAD_OFF_POS', signal: 'Positive Electrode Detach Interrupt', mcuPin: 'ESP32-S3 GPIO 2' },
      { pin: 'LO-', name: 'LEAD_OFF_NEG', signal: 'Negative Electrode Detach Interrupt', mcuPin: 'ESP32-S3 GPIO 3' },
      { pin: 'SDN', name: 'SHUTDOWN', signal: 'Ultra-low power sleep trigger', mcuPin: 'ESP32-S3 GPIO 5' },
      { pin: '3.3V', name: 'VCC', signal: 'Filtered Low-Noise Power Supply', mcuPin: 'Analog 3.3V LDO Rail' },
      { pin: 'GND', name: 'GND', signal: 'Isolated Analog Ground', mcuPin: 'Analog Ground Plane' }
    ],
    specs: {
      bandwidth: '0.5 Hz to 40 Hz optimized for motion-resilient wearable QRS extraction',
      cmrr: '80 dB common-mode rejection ratio (dc to 60 Hz)',
      leads: 'Single-lead differential dry electrode interface with right-leg drive (RLD)',
      leadOffDetection: 'Continuous DC lead-off detection circuitry'
    }
  },
  NEO_6M: {
    id: 'NEO_6M',
    name: 'NEO-6M Ultra-Compact GNSS / GPS Module',
    shortName: 'NEO-6M GPS',
    category: 'Telemetry / Geolocation & SOS',
    description: 'High-sensitivity 50-channel positioning engine with integrated ceramic patch antenna and rechargeable backup battery.',
    function: 'Real-time latitude/longitude tracking, safe-zone geofencing for Alzheimer’s/dementia wandering prevention, and automated SOS dispatch coordinates.',
    location: 'Top Bezel Antenna Bay for Maximum Sky Visibility (Z: 1.2, Y: 0.18, X: -0.6)',
    dimensions: 'Receiver PCB: 16.0 × 12.2 × 2.4 mm | Ceramic Antenna: 18.0 × 18.0 × 4.0 mm',
    rotation: 'Ceramic patch facing zenith upward ([0, 0, 0])',
    mountingMethod: 'Top enclosure RF-transparent recessed cradle with electromagnetic isolation foil',
    interface: 'UART Serial (TX: GPIO 17, RX: GPIO 18, Baud: 9600 bps)',
    input: '1575.42 MHz GPS L1 C/A satellite radio frequency signals',
    output: 'NMEA 0183 standard sentences ($GPGGA, $GPRMC) with 2.5m CEP accuracy',
    systemRole: 'Provides mission-critical location coordinates in emergency SOS alerts and triggers automated caregiver alerts when wandering outside safe perimeter.',
    color: '#059669 (Emerald Green Shield) + #d1d5db (Ceramic Patch Antenna)',
    material: 'High-Dielectric Ceramic Antenna Patch + Nickel Plated Shield Can + Gold Contact Pads',
    power: '3.3V DC @ 45 mA during active satellite acquisition / 11 mA Eco Mode',
    pipeline: 'GPS Satellite Constellation ➔ Ceramic Patch ➔ LNA Filter ➔ Baseband Processor ➔ NMEA Sentences (UART @ 9600) ➔ ESP32-S3 Geofence Radius Calculation',
    pinout: [
      { pin: 'VCC', name: 'PWR_3V3', signal: '3.3V DC Power Input', mcuPin: 'Regulated 3.3V Rail' },
      { pin: 'RX', name: 'UART_RX', signal: 'GPS Serial Input', mcuPin: 'ESP32-S3 GPIO 17 (TXD)' },
      { pin: 'TX', name: 'UART_TX', signal: 'NMEA Sentence Serial Output', mcuPin: 'ESP32-S3 GPIO 18 (RXD)' },
      { pin: 'GND', name: 'GND', signal: 'RF Ground Return', mcuPin: 'Common Ground Plane' },
      { pin: 'PPS', name: 'TIME_PULSE', signal: '1 Hz Precision Time Pulse Interrupt', mcuPin: 'ESP32-S3 GPIO 19' }
    ],
    specs: {
      sensitivity: '-161 dBm tracking sensitivity for urban canyons and indoors near windows',
      channels: '50-channel tracking engine with Time-To-First-Fix (TTFF) < 1s hot start',
      updateRate: 'Up to 5 Hz navigation update rate',
      accuracy: 'Horizontal position accuracy 2.5 meters CEP'
    }
  }
}

export const COMPONENT_LIST = Object.values(COMPONENTS)
