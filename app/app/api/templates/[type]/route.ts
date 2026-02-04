import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  if (!projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    );
  }
  
  const supabase = createClient();
  
  // جلب القوالب حسب النوع
  const { data: templates, error } = await supabase
    .from('communication_templates')
    .select('*')
    .eq('project_id', projectId)
    .eq('channel', type)
    .order('created_at', { ascending: false });
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ templates });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    const body = await request.json();
    const { projectId, ...templateData } = body;
    
    const supabase = createClient();
    
    // إنشاء قالب جديد
    const { data: template, error } = await supabase
      .from('communication_templates')
      .insert({
        project_id: projectId,
        channel: type,
        ...templateData,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      template,
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}