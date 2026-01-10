-- إضافة القوالب الـ 23 المحددة لـ "العزب هاب"
-- ملاحظة: هذه القوالب تُضاف كـ "DRAFT" حتى يتم إرسالها لميتا

INSERT INTO public.message_templates (
  whatsapp_number_id,
  name,
  category,
  language,
  status,
  content
)
VALUES 
-- 1. إنشاء طلب جديد
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'order_created', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم استلام طلب الصيانة بنجاح.\n\nرقم الطلب: {{order_id}}\nالخدمة: {{service_name}}\nالموقع: {{location}}\n\nسيتم مراجعة الطلب والتواصل معك قريباً."}]'),

-- 2. تأكيد الحجز
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'booking_confirmation', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم تأكيد حجزك بنجاح ✅\n\nتفاصيل الحجز:\nرقم الطلب {{order_id}}\nالخدمة {{service_name}}\nالتاريخ {{date}} في {{time}}\n\nنتمنى لك تجربة مميزة."}]'),

-- 3. تعيين الفني
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'technician_assigned', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم تعيين فني لطلب الصيانة الخاص بك.\n\nرقم الطلب {{order_id}}\nالفني {{technician_name}}\nالموعد {{date}} - {{time}}"}]'),

-- 4. الفني في الطريق
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'technician_on_the_way', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "الفني في الطريق إلى موقعك الآن.\n\nرقم الطلب {{order_id}}\nيرجى الاستعداد لاستقباله."}]'),

-- 5. بدء التنفيذ
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'work_started', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم بدء تنفيذ أعمال الصيانة.\n\nرقم الطلب: {{order_id}}"}]'),

-- 6. اكتمال التنفيذ
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'work_completed', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم الانتهاء من أعمال الصيانة بنجاح.\n\nرقم الطلب: {{order_id}}\nنشكرك لاستخدام العزب هاب."}]'),

-- 7. إلغاء الطلب
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'order_cancelled', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "نأسف لإبلاغك بأنه تم إلغاء طلب الصيانة.\n\nرقم الطلب: {{order_id}}\nالسبب: {{reason}}"}]'),

-- 8. تذكير الموعد
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'appointment_reminder', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تذكير بموعد الصيانة غداً.\n\nرقم الطلب: {{order_id}}\nالموعد: {{time}}\nيرجى تأكيد التواجد."}]'),

-- 9. عدم التواجد
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'customer_not_available', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تعذر تنفيذ الزيارة لعدم التواجد بالموقع.\n\nرقم الطلب: {{order_id}}\nيرجى التواصل لإعادة الجدولة."}]'),

-- 10. إصدار فاتورة
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'invoice_notification', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم إصدار فاتورة جديدة لخدمتكم.\n\nرقم الفاتورة: {{invoice_id}}\nالمبلغ: {{amount}}\nيمكنك عرضها عبر الرابط: {{link}}"}]'),

-- 11. تذكير سداد
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'payment_reminder', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تذكير بسداد فاتورة خدمة الصيانة.\n\nرقم الفاتورة: {{invoice_id}}\nالمبلغ: {{amount}}\n{{payment_link}}"}]'),

-- 12. تأكيد الدفع
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'payment_received', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم استلام الدفعة بنجاح.\n\nرقم الفاتورة: {{invoice_id}}\nنشكرك على ثقتك."}]'),

-- 13. طلب تقييم
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'request_review', 'MARKETING', 'ar', 'DRAFT', '[{"type": "BODY", "text": "نود معرفة رأيك في خدمتنا!\n\nكيف كانت تجربة الصيانة للطلب {{order_id}}؟\nرأيك يهمنا: {{link}}"}]'),

-- 14. شكوى مسجلة
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'complaint_received', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم تسجيل ملاحظتك بنجاح.\n\nرقم البلاغ: {{ticket_id}}\nسيقوم فريق الدعم بالتواصل معك."}]'),

-- 15. فتح تذكرة دعم
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'support_ticket_created', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم فتح تذكرة دعم فني جديدة.\n\nرقم التذكرة: {{ticket_id}}\nالموضوع: {{subject}}"}]'),

-- 16. تحديث تذكرة دعم
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'support_ticket_update', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "هناك تحديث جديد على تذكرة الدعم الفني {{ticket_id}}.\n\nالتحديث: {{update_text}}"}]'),

-- 17. إغلاق تذكرة دعم
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'support_ticket_closed', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم إغلاق تذكرة الدعم الفني {{ticket_id}}.\n\nنتمنى أن نكون قد أفدناكم."}]'),

-- 18. تأخير الزيارة
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'visit_delayed', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "نعتذر عن تأخر الفني عن الموعد المحدد.\n\nرقم الطلب: {{order_id}}\nالموعد الجديد المتوقع: {{new_time}}"}]'),

-- 19. تعذر التنفيذ
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'service_unavailable', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "نأسف لإبلاغكم بتعذر تنفيذ الخدمة المطلوبة حالياً.\n\nرقم الطلب: {{order_id}}\nيرجى التواصل معنا للمزيد."}]'),

-- 20. طلب معلومات إضافية
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'additional_info_required', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "نحتاج لبعض المعلومات الإضافية لمعالجة طلبكم {{order_id}}.\n\nالمعلومات المطلوبة: {{info_needed}}"}]'),

-- 21. إنشاء حساب
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'account_created', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "مرحباً بك في العزب هاب!\n\nتم إنشاء حسابك بنجاح. يمكنك البدء الآن."}]'),

-- 22. تنبيه أمني
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'security_alert', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تنبيه أمني: تم تسجيل دخول جديد لحسابك.\n\nإذا لم تكن أنت، يرجى التواصل معنا فوراً."}]'),

-- 23. إيقاف خدمة مؤقت
('cbbcca5f-2699-44d5-84d1-e15cc26dcaef', 'service_suspended', 'UTILITY', 'ar', 'DRAFT', '[{"type": "BODY", "text": "تم إيقاف الخدمة مؤقتاً لحسابك.\n\nيرجى مراجعة الإعدادات أو التواصل مع الدعم."}]')

ON CONFLICT (name) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();
