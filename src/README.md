# แอพคำนวณบิลอาหาร

แอพคำนวณบิลอาหารที่ช่วยแบ่งเงินระหว่างเพื่อน โดยไม่ต้องมีการคำนวณทิป

## ฟีเจอร์

- ✅ เพิ่มรายการอาหารแต่ละจานพร้อมราคา
- ✅ เลือกได้ว่าใครบ้างที่กินอาหารจานนั้น
- ✅ ระบุคนที่จ่ายเงินสำหรับแต่ละรายการอาหาร
- ✅ คำนวณว่าแต่ละคนต้องจ่ายเท่าไหร่ตามสัดส่วนอาหารที่กิน
- ✅ แสดงการโอนเงินด้วยลูกศรจากคนที่ต้องคืนเงินชี้ไปยังคนที่จ่ายก่อน
- ✅ ดาวน์โหลดสรุปเป็นรูปภาพ
- ✅ ส่วนติดต่อผู้ใช้เป็นภาษาไทยทั้งหมด

## การ Deploy ไปยัง GitHub Pages

### ขั้นตอนที่ 1: Push โค้ดไปยัง GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### ขั้นตอนที่ 2: เปิดใช้งาน GitHub Pages

1. ไปที่ GitHub repository ของคุณ
2. คลิกที่ **Settings** (ตั้งค่า)
3. ไปที่เมนู **Pages** ในแถบด้านซ้าย
4. ในส่วน **Source** เลือก **GitHub Actions**
5. GitHub Actions workflow จะทำงานอัตโนมัติเมื่อคุณ push โค้ด

### ขั้นตอนที่ 3: ตรวจสอบการ Deploy

1. ไปที่แท็บ **Actions** ใน repository
2. รอให้ workflow ทำงานเสร็จสิ้น (สีเขียว ✓)
3. เว็บไซต์ของคุณจะพร้อมใช้งานที่: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## การพัฒนาในเครื่อง

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview
```

## เทคโนโลยีที่ใช้

- React
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (สำหรับไอคอน)
- html2canvas (สำหรับดาวน์โหลดรูปภาพ)
