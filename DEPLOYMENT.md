# دليل النشر على Vercel

## المتطلبات قبل النشر

### 1. متغيرات البيئة

تأكد من أن جميع المتغيرات التالية موجودة في Vercel:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# WhatsApp
WHATSAPP_API_VERSION=v21.0
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_PHONE_NUMBER=
WHATSAPP_PHONE_NUMBER_ID_2=
WHATSAPP_PHONE_NUMBER_2=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# Meta App
META_APP_ID=
META_APP_SECRET=
META_APP_TOKEN=

# Other APIs
DAFTRA_API_KEY=
OPENAI_API_KEY=
CLAUDE_API_KEY=
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. قاعدة البيانات

تأكد من تشغيل جميع SQL Scripts في Supabase:

```bash
# في Supabase SQL Editor، شغل:
- scripts/001_create_users_table.sql
- scripts/002_improve_projects_table.sql
- scripts/003_create_project_members.sql
- scripts/004_improve_whatsapp_tables.sql
- scripts/005_improve_messages_table.sql
- scripts/006_improve_contacts_table.sql
- scripts/007_improve_message_templates.sql
- scripts/008_create_analytics_table.sql
```

### 3. Webhook URL في Meta Dashboard

تحديث رابط Webhook إلى:
```
https://yourdomain.com/api/webhooks/whatsapp
```

## خطوات النشر

### 1. إعداد GitHub Repository

```bash
# إنشاء repository جديد
git init
git remote add origin https://github.com/yourusername/whatsapp-platform.git

# Push الكود
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. الربط مع Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com)
2. اضغط "New Project"
3. اختر GitHub repository
4. أضف متغيرات البيئة
5. انقر "Deploy"

### 3. اختبار التطبيق بعد النشر

```bash
# 1. اختبار الويبهوك
curl "https://yourdomain.com/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=YOUR_VERIFY_TOKEN"

# 2. اختبار API
curl https://yourdomain.com/api/whatsapp/get-contacts?whatsappNumberId=test

# 3. اختبار الصفحات
- https://yourdomain.com/ (الرئيسية)
- https://yourdomain.com/auth/login (تسجيل الدخول)
- https://yourdomain.com/auth/signup (إنشاء حساب)
```

## الخطوات بعد النشر

### 1. مراقبة الأخطاء

استخدم Vercel Dashboard أو Sentry لمراقبة الأخطاء:

```bash
# عرض السجلات
vercel logs
```

### 2. الأداء

```bash
# اختبار الأداء
vercel analytics

# يجب أن تكون:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
```

### 3. الأمان

- [ ] جميع الـ RLS policies مفعلة
- [ ] لا توجد secrets في الكود
- [ ] CORS مُعدة بشكل صحيح
- [ ] HTTPS قيد التشغيل
- [ ] Webhooks موثوقة

## الخطوات الدورية

### يومياً
- [ ] مراقبة الأخطاء
- [ ] التحقق من الويبهوكات

### أسبوعياً
- [ ] عمل نسخة احتياطية من البيانات
- [ ] مراجعة السجلات

### شهرياً
- [ ] تحديث المكتبات
- [ ] مراجعة الأمان
- [ ] تحسين الأداء

## استكشاف المشاكل

### الويبهوك لا يعمل

```bash
# 1. تحقق من الرابط
curl -v https://yourdomain.com/api/webhooks/whatsapp

# 2. تحقق من السجلات
vercel logs --follow

# 3. تحقق من Meta Webhook Dashboard
# Settings → Webhooks
```

### الرسائل لا تظهر

```bash
# 1. تحقق من الاتصال بقاعدة البيانات
# في Supabase Console → SQL

# 2. تحقق من RLS
SELECT * FROM messages LIMIT 1;

# 3. تحقق من الأخطاء
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;
```

### الأداء بطيء

```bash
# 1. قلل عدد الاستعلامات
# - استخدم pagination
# - استخدم caching

# 2. زيادة موارد Supabase
# Settings → Add-ons

# 3. استخدم CDN
# Vercel analytics
