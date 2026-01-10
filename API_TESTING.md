# اختبار APIs

## 1️⃣ اختبار الدخول

### POST /api/auth/trusted-login

```bash
curl -X POST http://localhost:3000/api/auth/trusted-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alazab.com"}'
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح"
}
```

الـ Cookie سيتم تعيينه تلقائياً.

---

## 2️⃣ الحصول على بيانات المستخدم

### GET /api/auth/me

```bash
curl http://localhost:3000/api/auth/me \
  -H "Cookie: trusted_session=YOUR_SESSION_TOKEN"
```

**الاستجابة:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@alazab.com",
    "full_name": "مدير النظام",
    "is_active": true
  }
}
```

---

## 3️⃣ تسجيل الخروج

### POST /api/auth/trusted-logout

```bash
curl -X POST http://localhost:3000/api/auth/trusted-logout \
  -H "Cookie: trusted_session=YOUR_SESSION_TOKEN"
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## 4️⃣ إنشاء مشروع

### POST /api/projects

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: trusted_session=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "مشروعي الأول",
    "description": "وصف المشروع"
  }'
```

---

## 📌 ملاحظات

1. استبدل `YOUR_SESSION_TOKEN` برمز الجلسة الفعلي
2. يمكنك استخدام **Postman** أو **VS Code REST Client** لاختبار سهل
3. جميع الطلبات تحتاج إلى `Content-Type: application/json`

---

## 🔄 سير العمل الكامل

```
1. تسجيل الدخول → GET /api/auth/trusted-login
2. الحصول على بيانات المستخدم → GET /api/auth/me
3. إنشاء مشروع → POST /api/projects
4. إضافة حساب WhatsApp → POST /api/whatsapp/accounts
5. تسجيل الخروج → POST /api/auth/trusted-logout
