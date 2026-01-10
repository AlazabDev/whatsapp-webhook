# دليل الإعداد الكامل لمنصة WhatsApp

## 1. المتطلبات الأساسية

- حساب Supabase مع مشروع جديد
- بريد إلكتروني لـ Gmail أو أي خدمة بريد
- حساب WhatsApp Business Platform
- Node.js 18+ و npm

## 2. خطوات الإعداد الأولية

### A. إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ المعلومات التالية من Project Settings:
   - Project URL
   - Anon Key
   - Service Role Key

### B. إعداد متغيرات البيئة

أنشئ ملف `.env.local` مع المتغيرات التالية:

```
# لا تعرض هذه المتغيرات علناً - احم مفاتيحك!
# أضفها في ملف .env.local محلياً وفي Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
SUPABASE_JWT_SECRET=<your_jwt_secret>
```

**ملاحظة أمان مهمة:**
- لا تشارك قيم هذه المتغيرات
- استخدم Vercel Dashboard لإضافة المتغيرات في الـ production
- الـ `NEXT_PUBLIC_*` يمكن أن يراها العميل، لكن `*_KEY` يجب أن تكون server-only

## 3. إنشاء الجداول في Supabase

تابع الـ scripts بهذا الترتيب الدقيق:

1. **001_create_projects_table.sql** - إنشاء جدول المشاريع
2. **002_create_users_table.sql** - إنشاء جدول المستخدمين
3. **003_create_project_members.sql** - إنشاء جدول أعضاء المشروع
4. **004_create_whatsapp_tables.sql** - إنشاء جدول أرقام WhatsApp
5. **005_create_messages_table.sql** - إنشاء جدول الرسائل
6. **006_create_contacts_table.sql** - إنشاء جدول جهات الاتصال
7. **007_create_message_templates.sql** - إنشاء جدول قوالب الرسائل
8. **008_create_analytics_table.sql** - إنشاء جدول الإحصائيات
9. **009_create_trusted_users_table.sql** - إنشاء جداول المستخدمين الموثوقين

**خطوات التنفيذ:**
- انسخ محتوى كل script
- اذهب إلى Supabase SQL Editor
- الصق الـ script واضغط "Run"
- تابع التنفيذ للـ script التالي

## 4. إعداد الدخول المباشر (Trusted Users)

الثلاثة حسابات التالية يمكنها الدخول مباشرة بدون كلمة مرور:

- admin@alazab.com
- mohamed@alazab.com
- ceo@alazab.com

هذه الحسابات موجودة في `trusted_users` بعد تنفيذ script 009.

## 5. إعداد WhatsApp Integration

### A. الحصول على البيانات المطلوبة:

1. أنشئ حساب على [Meta for Developers](https://developers.facebook.com)
2. أنشئ تطبيق جديد واختر "WhatsApp Business Platform"
3. ستحصل على:
   - Business Account ID
   - Phone Number ID
   - Access Token
   - Webhook Token (اختياري)

### B. إضافة المتغيرات:

أضف المتغيرات التالية إلى `.env.local`:

```
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_PHONE_NUMBER=your_actual_phone_number
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_token
WHATSAPP_API_VERSION=v18.0
```

## 6. تشغيل التطبيق محلياً

```bash
# تثبيت المتطلبات
npm install

# تشغيل التطبيق
npm run dev
```

ثم اذهب إلى `http://localhost:3000`

## 7. اختبار الدخول

1. اذهب إلى `http://localhost:3000/auth/trusted-login`
2. أدخل أحد الحسابات الثلاثة:
   - admin@alazab.com
   - mohamed@alazab.com
   - ceo@alazab.com
3. سيتم دخولك مباشرة بدون كلمة مرور

## 8. اختبار WhatsApp API

### اختبار Webhook:

استخدم curl لاختبار استقبال الرسائل:

```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "ENTRY_ID",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "messages": [{
            "from": "1234567890",
            "id": "wamid.xxx",
            "timestamp": "1234567890",
            "text": {
              "body": "Hello World"
            },
            "type": "text"
          }]
        }
      }]
    }]
  }'
```

### اختبار إرسال رسالة:

```bash
curl -X POST http://localhost:3000/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890",
    "message": "Hello from WhatsApp Platform",
    "whatsappNumberId": "your_phone_number_id"
  }'
```

## 9. الأمان والـ Security

- تأكد من أن جميع الـ RLS policies مفعلة
- استخدم HTTPS في الـ production
- احم الـ Service Role Key ولا تعرضها
- استخدم متغيرات البيئة لجميع الـ secrets
- فعّل Rate Limiting على الـ API endpoints

## 10. النشر على Vercel

```bash
# ربط الـ project بـ Vercel
vercel link

# إضافة متغيرات البيئة
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... وباقي المتغيرات

# النشر
vercel deploy --prod
```

## 11. استكشاف الأخطاء

### مشكلة GoTrueClient instances:

إذا رأيت تحذير "Multiple GoTrueClient instances"، تأكد من:
- استخدام singleton pattern في `lib/supabase/client.ts`
- عدم إنشاء clients متعددة في نفس الـ request

### مشكلة RLS Policies:

تأكد من تنفيذ جميع الـ scripts بالترتيب الصحيح وأن RLS مفعل على جميع الجداول.

### مشكلة الدخول:

- تحقق من أن `trusted_users` و `user_sessions` موجودة
- تأكد من أن البريد الإلكتروني يطابق بالضبط (حروف صغيرة)

## 12. الخطوات التالية

- [ ] اختبار جميع الـ API endpoints
- [ ] إعداد قوالب الرسائل
- [ ] اختبار إرسال واستقبال الرسائل
- [ ] إضافة صور وملفات
- [ ] إعداد الإحصائيات والتقارير
- [ ] نشر على Vercel
