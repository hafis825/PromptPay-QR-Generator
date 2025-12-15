# PromptPay QR Generator

สร้าง QR Code พร้อมเพย์ได้ง่ายๆ ด้วย React + Vite

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss)

## คุณสมบัติ

- รองรับเบอร์โทรศัพท์มือถือไทย (10 หลัก)
- รองรับเลขบัตรประชาชน (13 หลัก พร้อม Luhn validation)
- ระบุจำนวนเงินได้ (ไม่บังคับ)
- ดาวน์โหลด QR Code เป็นรูปภาพ PNG
- ประมวลผลทั้งหมดบนเครื่องของคุณ ไม่มีการส่งข้อมูลไปเซิร์ฟเวอร์
- รองรับ Responsive Design

## เทคโนโลยีที่ใช้

- **React 19** - UI Framework
- **Vite 7** - Build Tool
- **Tailwind CSS 4** - Styling
- **qrcode.react** - QR Code Generation

## การติดตั้ง

### ความต้องการเบื้องต้น

- Node.js 18+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. **Clone โปรเจกต์**
   ```bash
   git clone <repository-url>
   cd ProjectX
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **รันโปรเจกต์ในโหมด Development**
   ```bash
   npm run dev
   ```

4. **เปิดเบราว์เซอร์ไปที่** `http://localhost:5173`

## วิธีใช้งาน

### สร้าง QR Code

1. **เลือกประเภทข้อมูล**
   - คลิก **"เบอร์โทร"** สำหรับใช้เบอร์โทรศัพท์มือถือ
   - คลิก **"บัตรประชาชน"** สำหรับใช้เลขบัตรประชาชน

2. **กรอกข้อมูล**
   - **เบอร์โทรศัพท์**: กรอกเบอร์มือถือ 10 หลัก (เช่น `0812345678`)
   - **เลขบัตรประชาชน**: กรอกเลข 13 หลัก

3. **ระบุจำนวนเงิน (ไม่บังคับ)**
   - ใส่จำนวนเงินที่ต้องการรับ
   - เว้นว่างไว้เพื่อให้ผู้จ่ายกรอกจำนวนเงินเอง

4. **QR Code จะแสดงขึ้นมาโดยอัตโนมัติ** เมื่อข้อมูลถูกต้อง

5. **ดาวน์โหลด QR Code**
   - คลิกปุ่ม **"ดาวน์โหลด"** เพื่อบันทึกเป็นภาพ PNG

## คำสั่งที่ใช้บ่อย

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm run dev` | รันโปรเจกต์ในโหมด Development |
| `npm run build` | Build โปรเจกต์สำหรับ Production |
| `npm run preview` | Preview Production Build |
| `npm run lint` | ตรวจสอบ Code ด้วย ESLint |

## โครงสร้างโปรเจกต์

```
ProjectX/
├── src/
│   ├── components/
│   │   └── QRGenerator.jsx    # Component หลักสำหรับสร้าง QR
│   ├── utils/
│   │   ├── promptpay.js       # EMV QR Payload Generation
│   │   └── validation.js      # Input Validation
│   ├── App.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## ความปลอดภัย

แอปพลิเคชันนี้:
- ประมวลผลทุกอย่างบนเครื่องของผู้ใช้ (Client-side)
- ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์
- ไม่เก็บข้อมูลใดๆ

## หมายเหตุ

- QR Code นี้สร้างตามมาตรฐาน EMV QRCPS Merchant Presented Mode
- รองรับการชำระเงินผ่านทุกแอปธนาคารที่รองรับ PromptPay
- คำนวณ CRC16 checksum ให้โดยอัตโนมัติ

## License

MIT License
