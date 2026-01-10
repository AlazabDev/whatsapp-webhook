# دليل الاختبار الشامل

## اختبار المصادقة

### 1. إنشاء حساب جديد
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User"
  }'
```

### 2. تسجيل الدخول
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

## اختبار WhatsApp Integration

### 1. التحقق من الويبهوك
```bash
curl "http://localhost:3000/api/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=YOUR_VERIFY_TOKEN"
```

### 2. محاكاة رسالة واردة
```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "metadata": {
            "phone_number_id": "YOUR_PHONE_NUMBER_ID"
          },
          "messages": [{
            "id": "msg123",
            "from": "201234567890",
            "timestamp": "1234567890",
            "type": "text",
            "text": { "body": "Hello test" }
          }],
          "contacts": [{
            "wa_id": "201234567890",
            "profile": { "name": "Test Contact" }
          }]
        }
      }]
    }]
  }'
```

### 3. إرسال رسالة
```bash
curl -X POST http://localhost:3000/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "whatsappNumberId": "YOUR_WA_NUMBER_UUID",
    "recipientPhone": "201234567890",
    "message": "مرحبا، هذه رسالة اختبار",
    "messageType": "text"
  }'
```

## اختبار القوالب

### 1. إنشاء قالب
```bash
curl -X POST http://localhost:3000/api/templates/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "projectId": "YOUR_PROJECT_ID",
    "whatsappNumberId": "YOUR_WA_NUMBER_UUID",
    "name": "تأكيد الطلب",
    "category": "TRANSACTIONAL",
    "language": "ar",
    "content": {
      "body": "شكراً لك على طلبك {{orderNumber}}"
    },
    "variables": ["orderNumber"]
  }'
```

### 2. جلب القوالب
```bash
curl http://localhost:3000/api/templates/list?whatsappNumberId=YOUR_WA_NUMBER_UUID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## اختبار الفريق

### 1. إضافة عضو
```bash
curl -X POST http://localhost:3000/api/team/members/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "projectId": "YOUR_PROJECT_ID",
    "email": "team@example.com",
    "role": "member"
  }'
```

### 2. جلب أعضاء الفريق
```bash
curl http://localhost:3000/api/team/members/list?projectId=YOUR_PROJECT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## اختبار الإحصائيات

### 1. جلب الإحصائيات
```bash
curl http://localhost:3000/api/analytics/project?projectId=YOUR_PROJECT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## اختبار RLS (Row Level Security)

### 1. التحقق من RLS
```sql
-- في Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'messages';
```

### 2. اختبار الوصول
```sql
-- ينبغي أن يرجع فقط رسائل المشروع الخاص به
SELECT * FROM messages;
```

## اختبار الأداء

### 1. عدد الاستعلامات
```bash
# قم بتشغيل مع QUERY_LOG_ENABLED
curl http://localhost:3000/api/whatsapp/get-messages?contactId=xxx
```

### 2. حجم الاستجابة
```bash
curl -I http://localhost:3000/api/whatsapp/get-messages?contactId=xxx
```

## اختبار الأمان

### 1. اختبار الحقن SQL
```bash
# يجب أن يرفع الخطأ
curl "http://localhost:3000/api/whatsapp/get-messages?contactId='); DROP TABLE messages; --"
```

### 2. اختبار الوصول غير المصرح
```bash
# بدون Authentication
curl -X POST http://localhost:3000/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
# يجب أن يرجع 401
```

## قائمة الفحوصات النهائية قبل الإطلاق

- [ ] يمكن إنشاء حساب وتسجيل الدخول
- [ ] يمكن إنشاء مشروع جديد
- [ ] يمكن إضافة حساب WhatsApp
- [ ] الويبهوك يستقبل الرسائل بشكل صحيح
- [ ] يمكن إرسال الرسائل
- [ ] يمكن إنشاء القوالب
- [ ] يمكن إضافة أعضاء الفريق
- [ ] الإحصائيات تظهر بشكل صحيح
- [ ] RLS يعمل بشكل صحيح
- [ ] لا توجد Errors في الـ Logs
