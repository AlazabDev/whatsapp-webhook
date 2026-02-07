-- إضافة القوالب المعتمدة على Meta إلى قاعدة البيانات
-- جدول message_templates يحتوي على: project_id, name, channel, content, status, is_active, variables

DO $$
DECLARE
    v_project_id UUID;
BEGIN
    -- الحصول على أول مشروع
    SELECT id INTO v_project_id FROM projects LIMIT 1;
    
    IF v_project_id IS NULL THEN
        RAISE EXCEPTION 'لا يوجد مشروع في قاعدة البيانات';
    END IF;

    -- 1. invoice_available
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'invoice_available', 'whatsapp',
            'مرحباً {{1}}، نود إعلامك بأن فاتورتك رقم {{2}} أصبحت متاحة الآن.',
            'approved', true, '{"1": "customer_name", "2": "invoice_number", "3": "invoice_url"}');

    -- 2. technician_arrival
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'technician_arrival', 'whatsapp',
            'مرحبًا {{1}}، سيصل الفني لدينا إلى موقعك خلال {{2}}.',
            'approved', true, '{"1": "customer_name", "2": "arrival_time"}');

    -- 3. appointment_scheduling
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'appointment_scheduling', 'whatsapp',
            'مرحبًا {{1}}، نحن نحدد موعدًا لزيارة فني إلى {{2}} في {{3}} بين {{4}} و {{5}}.',
            'approved', true, '{"1": "customer_name", "2": "location", "3": "date", "4": "start_time", "5": "end_time"}');

    -- 4. order_canceled
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'order_canceled', 'whatsapp',
            'مرحبًا، نؤكد لك أننا ألغينا بنجاح طلبك رقم {{1}} الذي قدمته مؤخرًا.',
            'approved', true, '{"1": "order_id"}');

    -- 5. requests
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'requests', 'whatsapp',
            'مرحبًا {{1}}، تم تسليم طلبك {{2}} بنجاح.',
            'approved', true, '{"1": "customer_name", "2": "order_id"}');

    -- 6. support
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active)
    VALUES (v_project_id, 'support', 'whatsapp',
            'هل ترغب في تلقي مكالمة من أحد ممثلينا؟',
            'approved', true);

    -- 7. technician_visit
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'technician_visit', 'whatsapp',
            'مرحبًا {{1}}، نحن نحدد موعدًا لزيارة فني لـ {{2}} في {{3}} بين {{4}} و {{5}}.',
            'approved', true, '{"1": "customer_name", "2": "service_type", "3": "date", "4": "start_time", "5": "end_time"}');

    -- 8. uberfix (ترحيب)
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active)
    VALUES (v_project_id, 'uberfix', 'whatsapp',
            'كيف يمكننا مساعدتك',
            'approved', true);

    -- 9. feedback_survey_form
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'feedback_survey_form', 'whatsapp',
            'إننا في {{1}}، نولي اهتمامًا كبيرًا لملاحظات العملاء. نرجو منك إكمال {{2}} قصير.',
            'approved', true, '{"1": "company_name", "2": "survey_type", "3": "service_type"}');

    -- 10. appointment_reschedule
    INSERT INTO message_templates (project_id, name, channel, content, status, is_active, variables)
    VALUES (v_project_id, 'appointment_reschedule_1', 'whatsapp',
            'مرحبا {{1}}، تم إعادة جدولة موعدك القادم مع {{2}} إلى {{3}} الساعة {{4}}.',
            'approved', true, '{"1": "customer_name", "2": "company_name", "3": "date", "4": "time"}');

    RAISE NOTICE 'تم إضافة 10 قوالب معتمدة بنجاح إلى المشروع %', v_project_id;
END $$;
