# SQL Scripts Execution Order

تحذير مهم: يجب تنفيذ SQL scripts بالترتيب الصحيح التالي، حيث أن بعضها يعتمد على الجداول الأخرى.

## ترتيب التنفيذ الصحيح:

### 1. scripts/001_create_projects_table.sql
يُنشئ جدول المشاريع (لا يعتمد على أي جدول آخر)

### 2. scripts/002_create_users_table.sql
يُنشئ جدول المستخدمين (يعتمد على auth.users من Supabase)

### 3. scripts/003_create_project_members.sql
يُنشئ جدول أعضاء المشروع (يعتمد على projects و users)

### 4. scripts/004_create_whatsapp_tables.sql
يُنشئ جدول أرقام WhatsApp (يعتمد على projects)

### 5. scripts/005_create_messages_table.sql
يُنشئ جدول الرسائل (يعتمد على whatsapp_numbers)

### 6. scripts/006_create_contacts_table.sql
يُنشئ جدول جهات الاتصال (يعتمد على projects و whatsapp_numbers)

### 7. scripts/007_create_message_templates.sql
يُنشئ جدول قوالب الرسائل (يعتمد على projects و users)

### 8. scripts/008_create_analytics_table.sql
يُنشئ جدول الإحصائيات (يعتمد على projects)

### 9. scripts/009_create_trusted_users_table.sql
يُنشئ جداول المستخدمين الموثوقين والجلسات (مستقل)

## خطوات التنفيذ:

1. اذهب إلى Supabase SQL Editor
2. انسخ محتوى كل script بالترتيب المذكور أعلاه
3. نفذ كل script واحداً تلو الآخر
4. تأكد من نجاح كل script قبل الانتقال للتالي

## ملاحظات مهمة:

- تأكد من أن Supabase authentication مفعل
- جميع الـ RLS policies مفعلة تلقائياً
- الفهارس (indexes) تُنشأ تلقائياً لتحسين الأداء
- استخدم `CASCADE` للحذف لمنع مشاكل البيانات اليتيمة
