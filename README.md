# Edge-AI Enabled Wearable IoT System for Personalized Health & Environmental Risk Prediction

An interactive 3D engineering prototype and multi-modal sensor fusion system for real-time health monitoring and environmental risk assessment.

---

## 🛠️ System Hardware Architecture
1. **Compute & Edge-AI**: ESP32-S3 Dual-Core Xtensa LX7 (240 MHz) with vector neural instructions for on-device TinyML.
2. **Display & UI**: 0.96-inch Monochrome I2C OLED Display (128×64, SSD1306, 2:1 aspect ratio).
3. **Biomedical / Vitals**: MAX30102 PPG Optical Pulse Oximeter & Heart Rate Sensor (660nm Red / 880nm IR).
4. **Motion Tracking**: MPU6050 6-Axis IMU (3-Axis Accelerometer + 3-Axis Gyroscope).
5. **Environmental Climate**: BME280 Barometric Pressure, Ambient Temperature, and Relative Humidity Sensor.
6. **Multi-Gas Air Quality**: ENS160 MOX Gas Sensor (TVOC & eCO2 monitoring).
7. **Power Supply**: 3.7 V 500 mAh Li-Po pouch cell with PMIC charging and USB-C interface.
8. **Enclosure & Straps**: Custom injection-molded 2-piece graphite PETG casing with 10 real-cut air vents, optical wrist gasket, and 22 mm ribbed knit silicone straps.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```
Open your browser at `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎮 Interactive 3D Features
- **360° Omnidirectional Orbit**: Full polar and azimuthal freedom to inspect the wearable from any angle (Zenith, Nadir, Lateral, Oblique).
- **Component Studio Isolation ("Separate Out")**: Select any component to isolate it at the center of the screen on a CAD calibration stage with floating 3D pinout annotations.
- **"Back to Assembly"**: Instant seamless return to the complete prototype in default 45° Hero view.
- **Ghost Focus Mode**: Translucent holographic blueprint rendering of surrounding parts.
- **Electrical & Data Connections Box**: Complete hardware pinout mappings, MCU GPIO routing, bus protocols, and TinyML neural pipelines.
- **Multi-Modal Risk Simulator**: Interactive sliders for Heart Rate, SpO2, Temperature, Air Quality, and Activity with synchronized 3D responses.
