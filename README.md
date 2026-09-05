# Thailand Conventions Lab (TCL)

แดชบอร์ดสถานการณ์การจัดประชุมสมาคมนานาชาติของประเทศไทย ตามการจัดอันดับ ICCA Country & City Rankings ปี 2558–2568
ภายใต้การวิจัยการพัฒนาโมเดลการจัดเก็บและรายงานข้อมูลการจัดประชุมนานาชาติของไมซ์ซิตี้ประเทศไทย
โดย TMU – Tourism and MICE Industry Research Development Unit, คณะบริหารธุรกิจและศิลปศาสตร์ (BALA)

## โครงสร้าง
- `index.html` — ไฟล์เดียวจบ (HTML + CSS + JS + GeoJSON 77 จังหวัด + โลโก้ฝัง base64) ไม่ต้องติดตั้งอะไร ไม่มี dependency ภายนอกยกเว้น Google Fonts
- `.github/workflows/deploy.yml` — deploy ขึ้น GitHub Pages อัตโนมัติทุกครั้งที่ push ไป `main`

## วิธี deploy
1. สร้าง repository ใหม่บน GitHub (public หรือ private ก็ได้)
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ (รวม `.github/`) แล้ว push ไป branch `main`
3. ไปที่ **Settings → Pages → Build and deployment → Source** เลือก **GitHub Actions**
4. รอ workflow รันเสร็จ (~1 นาที) แล้วเปิด `https://<username>.github.io/<repo>/`

## การอัปเดตข้อมูล
ข้อมูลทั้งหมดอยู่ตอนต้นของ `<script>` ใน `index.html` (ส่วน `DATA`):
| ตัวแปร | เนื้อหา |
|---|---|
| `TH` | จำนวนงาน/อันดับโลกของประเทศไทยรายปี |
| `BKK` | จำนวนงาน/อันดับโลกของกรุงเทพฯ รายปี |
| `SEC` | เชียงใหม่ / พัทยา / ภูเก็ต / ขอนแก่น รายปี |
| `CITIES` | จังหวัดบนแผนที่ + จำนวนงานปี 2567/2568 |
| `KPI` | ตัวเลขหัวหน้าต่อปี |
| `APAC`, `ASEAN`, `WORLD10`, `CITY_APAC` | ตารางคู่แข่งต่อปี |
| `TOP20`, `TOP10` | เส้นเป้าหมายต่อปี |
| `CRANK`, `CITYRANK` | อันดับประเทศ/เมือง (โลก · APAC · ASEAN) |
| `INFO` | รายละเอียดจังหวัด: สถานที่, งานเด่น, ประวัติ |

เพิ่มปีใหม่: เติมค่าใน `TH`, `BKK`, `SEC`, `KPI`, `CITIES[].n`, `CRANK` และเพิ่มปีใน `YEARS` กับปุ่ม `#myear`

## แหล่งข้อมูล
ICCA GlobeWatch: Business Analytics – Country & City Rankings 2016–2025 · ถ้อยแถลง TCEB · รายงานวิเคราะห์ของ TMU
