# دليل إعداد منصة WhatsApp

## المتطلبات الأولية

1. **Supabase Project** - تم إعداده بالفعل
2. **Meta App** - إنشاء تطبيق Meta للوصول إلى WhatsApp Business API
3. **WhatsApp Business Account** - حساب عمل مع رقم هاتف موثق
4. **متغيرات البيئة** - جميع المتغيرات المطلوبة في النظام

## خطوات الإعداد

### 1. تشغيل SQL Migration Scripts

قم بتشغيل السكريبتات التالية بالترتيب في Supabase SQL editor:

```
scripts/001_create_users_table.sql
scripts/002_improve_projects_table.sql
scripts/003_create_project_members.sql
scripts/004_improve_whatsapp_tables.sql
scripts/005_improve_messages_table.sql
scripts/006_improve_contacts_table.sql
scripts/007_improve_message_templates.sql
scripts/008_create_analytics_table.sql
```

### 2. إنشاء حساب مسؤول (Admin User)

بعد تشغيل السكريبتات، قم بإنشاء مستخدم أول عبر التطبيق أو قاعدة البيانات.

### 3. إعداد WhatsApp Webhook

URL الويبهوك:
```
https://yourdomain.com/api/webhooks/whatsapp
```

#### في Meta App Dashboard:

1. اذهب إلى **Settings → Configuration**
2. أضف رابط Webhook:
   - **Callback URL**: `https://yourdomain.com/api/webhooks/whatsapp`
   - **Verify Token**: استخدم القيمة من `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
3. Subscribe to messages, message_status

### 4. اختبار الويبهوك

```bash
# اختبار التحقق من الويبهوك
curl "https://yourdomain.com/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=YOUR_VERIFY_TOKEN"

# يجب أن ترجع: test123
```

## API Endpoints

### 1. إرسال رسالة

```bash
POST /api/whatsapp/send-message

{
  "whatsappNumberId": "uuid-of-whatsapp-number",
  "recipientPhone": "201234567890",
  "message": "مرحبا، هذه رسالة اختبار",
  "messageType": "text"
}
```

### 2. جلب جهات الاتصال

```bash
GET /api/whatsapp/get-contacts?whatsappNumberId=uuid-of-whatsapp-number
```

### 3. جلب الرسائل

```bash
GET /api/whatsapp/get-messages?contactId=uuid-of-contact&limit=50
```

### 4. Webhook للرسائل الواردة

```
POST /api/webhooks/whatsapp

الويبهوك يستقبل:
- الرسائل الجديدة
- تحديثات حالة الرسائل (delivered, read, failed)
- معلومات جهات الاتصال
```

## متغيرات البيئة المطلوبة

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
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# Meta App
META_APP_ID=
META_APP_SECRET=
```

## اختبار شامل

### 1. التحقق من الجداول

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 2. التحقق من RLS

```sql
SELECT * FROM pg_policies WHERE tablename IN ('users', 'projects', 'whatsapp_numbers', 'messages');
```

### 3. إنشاء رقم WhatsApp

أدرج رقم WhatsApp في قاعدة البيانات:

```sql
INSERT INTO public.whatsapp_numbers (
  project_id, 
  phone_number_id, 
  display_phone_number, 
  access_token,
  webhook_token
) VALUES (
  'your-project-uuid',
  'your-phone-number-id',
  '201234567890',
  'your-access-token',
  'your-webhook-token'
);
```

## استكشاف الأخطاء

### الويبهوك لا يعمل

1. تحقق من رابط الويبهوك صحيح وقابل للوصول
2. تحقق من Verify Token صحيح
3. تحقق من السجلات (logs) في Vercel

### لا يمكن إرسال الرسائل

1. تحقق من أن `access_token` صحيح
2. تحقق من أن رقم الهاتف صحيح (بصيغة دولية)
3. تحقق من أن WhatsApp Business Account نشط وموثق

### الرسائل لا تظهر

1. تحقق من RLS Policies صحيحة
2. تحقق من أن المستخدم له الصلاحيات الصحيحة
3. تحقق من الويبهوك يستقبل الرسائل
