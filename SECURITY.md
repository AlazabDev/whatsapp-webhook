# أمان منصة WhatsApp

## حماية البيانات

### 1. Row Level Security (RLS)

جميع الجداول محمية باستخدام RLS policies:

- **users**: كل مستخدم يرى بيانته فقط أو بيانات فريقه
- **projects**: يرى المستخدم فقط المشاريع التي ينتمي إليها
- **whatsapp_numbers**: يرى أرقام WhatsApp للمشاريع الخاصة به فقط
- **messages و contacts**: محمية عبر الربط بـ whatsapp_numbers

### 2. Access Tokens

- **Access Tokens**: تُخزن مشفرة في قاعدة البيانات
- **Service Role Key**: تُستخدم فقط في الخادم، لا تُكشف للعميل
- **Webhook Token**: لتحقق من صحة الويبهوكات من Meta

### 3. المصادقة

- نستخدم Supabase Auth مع Email + Password
- Sessions آمنة عبر HTTP-only cookies
- تحديث الـ tokens تلقائياً عبر middleware

## أفضل الممارسات

### 1. API Routes

```typescript
// ✅ صحيح - التحقق من المستخدم دائماً
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

// ❌ خطأ - الوثوق بالبيانات من العميل مباشرة
const userId = request.headers.get("x-user-id")
```

### 2. Database Queries

```typescript
// ✅ صحيح - RLS يضمن سلامة البيانات
const { data } = await supabase.from("projects").select("*")

// ❌ خطأ - الاعتماد على العميل للتصفية
const projectId = request.nextUrl.searchParams.get("projectId")
```

### 3. Sensitive Data

```typescript
// ❌ لا تكشف البيانات الحساسة في API
return NextResponse.json({
  whatsappNumber: {
    accessToken: "..." // ❌ خطر!
  }
})

// ✅ لا ترجع البيانات الحساسة
return NextResponse.json({
  whatsappNumber: {
    id: "...",
    displayName: "...",
    // لا تكشف accessToken
  }
})
```

## مراجعة الأمان قبل النشر

- [ ] جميع الـ RLS policies مفعلة
- [ ] Admin client يستخدم SUPABASE_SERVICE_ROLE_KEY فقط على الخادم
- [ ] لا توجد Secrets في الكود (استخدم environment variables)
- [ ] Webhook يتحقق من Verify Token
- [ ] لا توجد logs حساسة في الإنتاج
- [ ] CORS مُعد بشكل صحيح
- [ ] Database backups مفعلة

## Compliance

- GDPR: نسمح بحذف الحسابات
- CCPA: نسمح بتحميل البيانات الشخصية
- حماية البيانات: التشفير في الانتقال والتخزين
