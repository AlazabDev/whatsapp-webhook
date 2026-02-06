const alAzabVariables = {
    // قالب استلام طلب الصيانة
    'maintenance-received': [
        { name: 'store_name', display: 'اسم الفرع', type: 'text', required: true },
        { name: 'service_name', display: 'نوع الخدمة', type: 'text', required: true },
        { name: 'title', display: 'عنوان الطلب', type: 'text', required: true },
        { name: 'description', display: 'وصف المشكلة', type: 'text', required: true },
        { name: 'priority', display: 'مستوى الأولوية', type: 'text', required: true },
        { name: 'scheduled_date', display: 'التاريخ المطلوب', type: 'date', required: true },
        { name: 'preferred_time', display: 'الوقت المفضل', type: 'text', required: true },
        { name: 'requester_name', display: 'اسم مقدم الطلب', type: 'text', required: true },
        { name: 'requester_email', display: 'البريد الإلكتروني', type: 'text', required: true },
        { name: 'requester_phone', display: 'رقم الهاتف', type: 'text', required: true },
        { name: 'attachments', display: 'الملفات المرفقة', type: 'array', required: false },
        { name: 'tracking_url', display: 'رابط التتبع', type: 'text', required: false }
    ],
    
    // قالب الفاتورة
    'invoice': [
        { name: 'invoice_number', display: 'رقم الفاتورة', type: 'text', required: true },
        { name: 'customer_name', display: 'اسم العميل', type: 'text', required: true },
        { name: 'total_amount', display: 'المبلغ الإجمالي', type: 'number', required: true },
        { name: 'items', display: 'البنود', type: 'array', required: true },
        { name: 'due_date', display: 'تاريخ الاستحقاق', type: 'date', required: true },
        { name: 'payment_link', display: 'رابط الدفع', type: 'text', required: true }
    ]
};
