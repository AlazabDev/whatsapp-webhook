# 📚 Backend API Documentation - Kapso WhatsApp Hub

## نظرة عامة

هذا المستند يحتوي على جميع الـ APIs المطلوبة لإكمال تطبيق Kapso WhatsApp Hub بناءً على الهيكل الكامل للمنصة.

---

## 📊 حالة قاعدة البيانات

### الجداول الموجودة (33 جدول)

#### Core Tables (أساسية)
- ✅ **users** - المستخدمون
- ✅ **projects** - المشاريع
- ✅ **project_members** - أعضاء المشاريع
- ✅ **tenants** - الكيانات (Multi-tenant)

#### WhatsApp Tables
- ✅ **whatsapp_numbers** - أرقام واتساب
- ✅ **contacts** - جهات الاتصال
- ✅ **messages** - الرسائل
- ✅ **conversations** - المحادثات
- ✅ **media_files** - ملفات الوسائط
- ✅ **calls** - المكالمات

#### Templates & Messaging
- ✅ **templates** - قوالب واتساب (Meta)
- ✅ **message_templates** - قوالب عامة
- ✅ **broadcasts** - البث الجماعي
- ✅ **broadcast_recipients** - مستلمو البث

#### Automation
- ✅ **workflows** - سير العمل
- ✅ **workflow_steps** - خطوات سير العمل
- ✅ **custom_functions** - الدوال المخصصة
- ✅ **custom_pages** - الصفحات المخصصة

#### Integration & Webhooks
- ✅ **integrations** - التكاملات الخارجية
- ✅ **webhook_endpoints** - نقاط استقبال Webhooks
- ✅ **webhook_events** - أحداث Webhooks

#### AI & Analytics
- ✅ **ai_configurations** - إعدادات الذكاء الاصطناعي
- ✅ **communication_analytics** - تحليلات الاتصالات
- ✅ **ctwa_ads** - إعلانات Click-to-WhatsApp

#### Email & Notifications
- ✅ **email_logs** - سجلات البريد
- ✅ **email_attachments** - مرفقات البريد
- ✅ **notification_preferences** - تفضيلات الإشعارات
- ✅ **mail** - البريد العام

#### System & Logs
- ✅ **system_logs** - سجلات النظام
- ✅ **inbox_embeds** - دمج صندوق الوارد
- ✅ **user_sessions** - جلسات المستخدمين
- ✅ **magic_links** - روابط سحرية
- ✅ **trusted_users** - المستخدمون الموثوقون

---

## 🔌 قائمة APIs الكاملة

### 1. Dashboard APIs

#### GET /api/dashboard/stats
**الوصف:** إحصائيات لوحة التحكم الرئيسية

**Response:**
```typescript
{
  totalMessages: number
  messagesIn24h: number
  totalContacts: number
  activeNumbers: number
  conversationsOpen: number
  broadcastsSent: number
  analyticsData: {
    date: string
    sent: number
    received: number
  }[]
}
```

**الموجود:** ✅ `/api/stats/route.ts`

---

### 2. Phone Numbers APIs

#### GET /api/numbers
**الوصف:** قائمة أرقام واتساب

**Query Params:**
- `type`: connected | digital | sandbox
- `page`, `limit`

**Response:**
```typescript
{
  numbers: WhatsAppNumber[]
  total: number
}
```

**الموجود:** ✅ `/api/numbers/route.ts`

#### POST /api/numbers
**الوصف:** إضافة رقم جديد

**Body:**
```typescript
{
  display_phone_number: string
  phone_number_id: string
  verified_name: string
}
```

**الموجود:** ✅ `/api/numbers/route.ts`

#### DELETE /api/numbers/[id]
**الوصف:** حذف رقم

**مطلوب إنشاؤه:** ❌

---

### 3. Webhooks APIs

#### GET /api/webhooks
**الوصف:** قائمة نقاط استقبال Webhooks

**الموجود:** ❌ (مطلوب)

#### POST /api/webhooks
**الوصف:** إنشاء webhook endpoint جديد

**Body:**
```typescript
{
  url: string
  events: string[]
  secret: string
}
```

**الموجود:** ❌ (مطلوب)

#### POST /api/webhook (WhatsApp Webhook Receiver)
**الوصف:** استقبال أحداث واتساب من Meta

**الموجود:** ✅ `/api/webhook/route.ts`

---

### 4. API Keys APIs

#### GET /api/api-keys
**الوصف:** قائمة مفاتيح API

**الموجود:** ❌ (مطلوب)

#### POST /api/api-keys
**الوصف:** إنشاء مفتاح API جديد

**الموجود:** ❌ (مطلوب)

---

### 5. Templates APIs

#### GET /api/templates
**الوصف:** قائمة قوالب واتساب المعتمدة

**الموجود:** ✅ `/api/templates/route.ts`

#### POST /api/templates/sync
**الوصف:** مزامنة القوالب من Meta

**الموجود:** ✅ `/api/templates/sync/route.ts`

#### POST /api/templates/send-test
**الوصف:** إرسال قالب تجريبي

**الموجود:** ✅ `/api/templates/send-test/route.ts`

---

### 6. WhatsApp Flows APIs

#### GET /api/flows
**الوصف:** قائمة النماذج التفاعلية

**الموجود:** ✅ `/api/flows/route.ts`

#### POST /api/flows
**الوصف:** إنشاء Flow جديد

**الموجود:** ✅ `/api/flows/route.ts`

---

### 7. Tenants APIs

#### GET /api/tenants
**الوصف:** قائمة الكيانات

**الموجود:** ❌ (مطلوب)

#### POST /api/tenants
**الوصف:** إنشاء كيان جديد

**الموجود:** ❌ (مطلوب)

---

### 8. Customers (Contacts) APIs

#### GET /api/contacts
**الوصف:** قائمة العملاء/جهات الاتصال

**الموجود:** ✅ `/api/contacts/route.ts`

#### POST /api/contacts
**الوصف:** إضافة عميل جديد

**الموجود:** ✅ `/api/contacts/route.ts`

---

### 9. Conversations APIs

#### GET /api/conversations
**الوصف:** قائمة المحادثات

**Query Params:**
- `status`: open | closed | assigned
- `assigned_to`: user_id

**الموجود:** ❌ (مطلوب)

#### GET /api/conversations/[id]
**الوصف:** تفاصيل محادثة

**الموجود:** ❌ (مطلوب)

#### PATCH /api/conversations/[id]
**الوصف:** تحديث حالة محادثة

**Body:**
```typescript
{
  status?: 'open' | 'closed'
  assigned_to?: string
}
```

**الموجود:** ❌ (مطلوب)

---

### 10. Messages APIs

#### GET /api/messages
**الوصف:** قائمة الرسائل

**Query Params:**
- `contact_id`
- `conversation_id`
- `direction`: inbound | outbound

**الموجود:** ✅ `/api/messages/route.ts`

#### POST /api/messages
**الوصف:** إرسال رسالة

**الموجود:** ✅ `/api/messages/route.ts`

---

### 11. Media APIs

#### GET /api/media
**الوصف:** قائمة الملفات

**الموجود:** ✅ `/api/media/route.ts`

#### GET /api/media/[id]
**الوصف:** تفاصيل ملف

**الموجود:** ✅ `/api/media/[id]/route.ts`

#### POST /api/media/[id]/copy
**الوصف:** نسخ رابط الملف

**الموجود:** ✅ `/api/media/[id]/copy/route.ts`

---

### 12. Calls APIs

#### GET /api/calls
**الوصف:** قائمة المكالمات

**الموجود:** ❌ (مطلوب)

---

### 13. CTWA Ads APIs

#### GET /api/ads
**الوصف:** بيانات إعلانات Click-to-WhatsApp

**الموجود:** ❌ (مطلوب)

---

### 14. Analytics APIs

#### GET /api/analytics
**الوصف:** تحليلات الأداء

**Query Params:**
- `start_date`, `end_date`
- `metrics`: messages | contacts | broadcasts

**الموجود:** ✅ `/api/analytics/route.ts`

---

### 15. Workflows APIs

#### GET /api/workflows
**الوصف:** قائمة سير العمل

**الموجود:** ❌ (مطلوب)

#### POST /api/workflows
**الوصف:** إنشاء workflow جديد

**Body:**
```typescript
{
  name: string
  trigger_type: string
  steps: WorkflowStep[]
}
```

**الموجود:** ❌ (مطلوب)

---

### 16. Broadcasts APIs

#### GET /api/broadcasts
**الوصف:** قائمة حملات البث

**الموجود:** ❌ (مطلوب)

#### POST /api/broadcasts
**الوصف:** إنشاء حملة بث جديدة

**Body:**
```typescript
{
  name: string
  template_id: string
  recipients: string[]
  scheduled_at?: string
}
```

**الموجود:** ❌ (مطلوب)

#### POST /api/broadcasts/[id]/send
**الوصف:** إرسال حملة بث

**الموجود:** ❌ (مطلوب)

---

### 17. Functions APIs

#### GET /api/functions
**الوصف:** قائمة الدوال المخصصة

**الموجود:** ❌ (مطلوب)

#### POST /api/functions
**الوصف:** إنشاء دالة جديدة

**الموجود:** ❌ (مطلوب)

---

### 18. Logs APIs

#### GET /api/logs
**الوصف:** سجلات النظام

**Query Params:**
- `level`: info | warning | error
- `category`: webhook | api | workflow

**الموجود:** ❌ (مطلوب)

---

### 19. Settings APIs

#### GET /api/settings/ai
**الوصف:** إعدادات الذكاء الاصطناعي

**الموجود:** ✅ `/api/settings/ai/route.ts`

#### POST /api/settings/ai
**الوصف:** تحديث إعدادات AI

**الموجود:** ✅ `/api/settings/ai/route.ts`

#### GET /api/settings/integrations
**الوصف:** قائمة التكاملات

**الموجود:** ✅ `/api/settings/integrations/route.ts`

---

### 20. Project APIs

#### GET /api/project
**الوصف:** معلومات المشروع الحالي

**الموجود:** ❌ (مطلوب)

#### PATCH /api/project
**الوصف:** تحديث معلومات المشروع

**الموجود:** ❌ (مطلوب)

#### GET /api/project/members
**الوصف:** أعضاء المشروع

**الموجود:** ❌ (مطلوب)

#### POST /api/project/members
**الوصف:** إضافة عضو للمشروع

**الموجود:** ❌ (مطلوب)

---

## ملخص الحالة

### APIs الموجودة (18):
✅ webhook, templates, flows, contacts, messages, media, analytics, stats, numbers, health, queue/whatsapp, settings/ai, settings/integrations

### APIs المطلوبة (25):
❌ webhooks, api-keys, tenants, conversations, calls, ads, workflows, broadcasts, functions, logs, pages, project, project/members, embeds, voice-agents

---

## الخطوات التالية

1. ✅ إنشاء الجداول المفقودة (تم)
2. ⏳ إنشاء APIs المفقودة
3. ⏳ إنشاء Edge Functions للـ WhatsApp
4. ⏳ إنشاء دوال SQL مساعدة إضافية
5. ⏳ اختبار جميع APIs

