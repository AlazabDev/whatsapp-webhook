# دليل الواجهة البرمجية (API) - WhatsApp Hub

## نظرة عامة
هذا المشروع يوفر منصة متكاملة لإدارة WhatsApp مع واجهة برمجية قوية وسهلة الاستخدام.

## Endpoints المتاحة

### 1. جهات الاتصال (Contacts)

#### الحصول على جهات الاتصال
```
GET /api/contacts
```

**الرد (Response):**
```json
{
  "contacts": [
    {
      "id": "uuid",
      "name": "محمد عزاب",
      "phone_number": "201004006620",
      "email": "admin@alazab.com",
      "status": "active"
    }
  ],
  "total": 10
}
```

#### إضافة جهة اتصال
```
POST /api/contacts
Content-Type: application/json

{
  "name": "أحمد علي",
  "phone_number": "201234567890",
  "email": "ahmed@example.com"
}
```

### 2. الرسائل (Messages)

#### الحصول على الرسائل
```
GET /api/messages
```

**الرد:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "to": "201234567890",
      "body": "مرحبا بك",
      "status": "sent",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50
}
```

#### إرسال رسالة
```
POST /api/messages
Content-Type: application/json

{
  "to": "201234567890",
  "body": "مرحبا بك في النظام"
}
```

### 3. أرقام WhatsApp

#### الحصول على الأرقام
```
GET /api/numbers
```

#### إضافة رقم
```
POST /api/numbers
Content-Type: application/json

{
  "name": "رقم المبيعات",
  "phone_number": "201004006620",
  "type": "connected"
}
```

### 4. الإحصائيات

```
GET /api/stats
```

**الرد:**
```json
{
  "stats": {
    "contacts": 25,
    "messages": 150,
    "numbers": 3
  }
}
```

## معالجة الأخطاء

جميع الأخطاء تُرجع الرد التالي:

```json
{
  "error": "رسالة الخطأ"
}
```

**أكواد الحالة:**
- `200`: نجح
- `201`: تم الإنشاء بنجاح
- `400`: خطأ في الطلب
- `401`: غير مصرح
- `404`: غير موجود
- `500`: خطأ في الخادم

## React Hooks المتاحة

### `useDashboardStats()`
```typescript
const { stats, isLoading, error } = useDashboardStats()
```

### `useContacts()`
```typescript
const { contacts, total, isLoading, error, mutate } = useContacts()
```

### `useMessages()`
```typescript
const { messages, total, isLoading, error, mutate } = useMessages()
```

### `useNumbers()`
```typescript
const { numbers, total, isLoading, error, mutate } = useNumbers()
```

## المكتبات المستخدمة

- **Next.js 16**: إطار عمل React
- **Supabase**: قاعدة البيانات والمصادقة
- **SWR**: جلب البيانات وcaching
- **shadcn/ui**: مكونات واجهة المستخدم
- **Tailwind CSS**: نمذجة CSS

## البدء السريع

1. **استنساخ المشروع:**
```bash
git clone https://github.com/mohamedazab224/whatsapp-hub.git
cd whatsapp-hub
```

2. **تثبيت المتعلقات:**
```bash
npm install
# أو
pnpm install
```

3. **إعداد متغيرات البيئة:**
```bash
cp .env.example .env.local
```

4. **تشغيل الخادم:**
```bash
npm run dev
```

5. **زيارة التطبيق:**
```
http://localhost:3000
```

## هيكل المشروع

```
whatsapp-hub/
├── app/
│   ├── api/              # API endpoints
│   ├── data/             # صفحات البيانات
│   ├── numbers/          # صفحات الأرقام
│   ├── settings/         # صفحات الإعدادات
│   ├── layout.tsx        # الـ layout الرئيسي
│   └── page.tsx          # الصفحة الرئيسية
├── components/
│   ├── dashboard/        # مكونات لوحة التحكم
│   ├── forms/            # النماذج
│   └── ui/               # مكونات واجهة المستخدم
├── hooks/
│   └── use-data.ts       # React hooks للبيانات
├── lib/
│   ├── supabase/         # مكتبات Supabase
│   ├── errors.ts         # معالجة الأخطاء
│   └── api-utils.ts      # أدوات API
└── package.json
```

## المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. Commit التغييرات
4. Push إلى الـ branch
5. فتح Pull Request

## الترخيص

MIT License - انظر LICENSE للتفاصيل
