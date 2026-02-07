-- إضافة القوالب الموجودة فعلياً على Meta Dashboard
-- هذه القوالب معتمدة ونشطة

-- الحصول على أول مشروع و رقم واتساب
DO $$
DECLARE
    v_project_id UUID;
    v_phone_id UUID;
BEGIN
    SELECT id INTO v_project_id FROM projects LIMIT 1;
    SELECT id INTO v_phone_id FROM whatsapp_numbers LIMIT 1;

    -- 1. invoice_available (تسويق)
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'invoice_available', 'whatsapp',
            'مرحباً {{1}}، نود إعلامك بأن فاتورتك رقم {{2}} أصبحت متاحة الآن. يمكنك مشاهدة الفاتوره عبر الانترنت, تحميله على جهازك أو طبعه مباشرة بجانب خيارات أخرى عبر الرابط التالى.{{3}}🙏',
            NULL, NULL, 'approved', true);

    -- 2. technician_arrival (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'technician_arrival', 'UTILITY', 'ar',
            'مرحبًا {{1}}، سيصل الفني لدينا إلى موقعك خلال {{2}}. اضغط لتتبع الموقع الفعلي.',
            'approved', true);

    -- 3. appointment_scheduling (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'appointment_scheduling', 'UTILITY', 'ar',
            'مرحبًا {{1}}، نحن نحدد موعدًا لزيارة فني إلى {{2}} في {{3}} بين {{4}} و {{5}}. يرجى تأكيد ما إذا كانت هذه الفترة مناسبة لك.',
            'approved', true);

    -- 4. statement_available (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'statement_available', 'UTILITY', 'ar',
            'هذا لإعلامك بأن أحدث بيان لك لحسابك {{1}} متاح الآن. يرجى تسجيل الدخول إلى حسابك للاطلاع على بيانك.',
            'approved', true);

    -- 5. appointment_reschedule_1 (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'appointment_reschedule_1', 'UTILITY', 'ar',
            'مرحبا {{1}}، تم إعادة جدولة موعدك القادم مع {{2}} إلى {{3}} الساعة {{4}}. نحن نتطلع إلى رؤيتك!',
            'approved', true);

    -- 6. feedback_survey_form (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, footer, status, is_active)
    VALUES (v_project_id, v_phone_id, 'feedback_survey_form', 'UTILITY', 'ar',
            'إننا في {{1}}، نولي اهتمامًا كبيرًا لملاحظات العملاء ونستفيد منها في تحسين {{2}} باستمرار. نرجو منك إكمال {{3}} قصير (الرابط موضح أدناه) لتخبرنا بالمزيد عن {{4}} التي أجريتها مؤخرًا معنا. نشكرك مقدمًا.',
            'UberFix - شكراً لثقتكم', 'approved', true);

    -- 7. order_canceled (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'order_canceled', 'UTILITY', 'ar',
            'مرحبًا، نؤكد لك أننا ألغينا بنجاح طلبك رقم {{1}} الذي قدمته مؤخرًا. شكرًا لك.',
            'approved', true);

    -- 8. requests (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'requests', 'UTILITY', 'ar',
            'مرحبًا {{1}}، تم تسليم طلبك {{2}} بنجاح. يمكنك إدارة طلبك أدناه.',
            'approved', true);

    -- 9. support (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'support', 'UTILITY', 'ar',
            'هل ترغب في تلقي مكالمة من أحد ممثلينا؟',
            'approved', true);

    -- 10. technician_visit (أداة مساعدة)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, footer, status, is_active)
    VALUES (v_project_id, v_phone_id, 'technician_visit', 'UTILITY', 'ar',
            'مرحبًا {{1}}، نحن نحدد موعدًا لزيارة فني لـ {{2}} في {{3}} بين {{4}} و {{5}}. يرجى تأكيد ما إذا كانت هذه الفترة مناسبة لك.',
            'UberFix - خدمة الصيانة السريعة', 'approved', true);

    -- 11. uberfix (تسويق)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'uberfix', 'MARKETING', 'ar',
            'كيف يمكننا مساعدتك',
            'approved', true);

    -- 12. hello_world_1 (تسويق - EN)
    INSERT INTO message_templates (project_id, whatsapp_number_id, name, category, language, body, status, is_active)
    VALUES (v_project_id, v_phone_id, 'hello_world_1', 'MARKETING', 'en_US',
            'Hello World',
            'approved', true);

    RAISE NOTICE 'تم إضافة 12 قالب معتمد بنجاح';
END $$;
