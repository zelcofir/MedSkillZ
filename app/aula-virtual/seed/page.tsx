import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SeedCoursePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/aula-virtual/login')
    }

    // 1. Ensure user is a teacher
    await supabase.from('profiles').upsert({ id: user.id, role: 'teacher', full_name: 'Dr. MedSkillZ' })

    // 2. Create the course "Reportes de Caso"
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
            title: 'Maestría en Reportes de Caso Clínico',
            description: 'Aprende a redactar, estructurar y publicar reportes de caso de alto impacto en revistas indexadas.',
            thumbnail_url: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?q=80&w=2070&auto=format&fit=crop',
            teacher_id: user.id
        })
        .select()
        .single()

    if (courseError) return <div>Error creando curso: {courseError.message}</div>

    // 3. Create Sections
    const { data: section1 } = await supabase
        .from('sections')
        .insert({ course_id: course.id, title: 'Fase de Planificación', order: 1 })
        .select().single()

    const { data: section2 } = await supabase
        .from('sections')
        .insert({ course_id: course.id, title: 'Redacción y Estructura', order: 2 })
        .select().single()

    // 4. Create Lessons
    await supabase.from('lessons').insert([
        {
            section_id: section1.id,
            title: '¿Qué es un reporte de caso?',
            content_type: 'video',
            video_url: 'https://www.youtube.com/watch?v=kYI_6Uclp-k',
            order: 1
        },
        {
            section_id: section1.id,
            title: 'Consentimiento Informado',
            content_type: 'resource',
            resource_url: 'https://www.google.com/search?q=formato+consentimiento+informado+medico+filetype:pdf',
            order: 2
        },
        {
            section_id: section2.id,
            title: 'Estructura CARE Guidelines',
            content_type: 'video',
            video_url: 'https://www.youtube.com/watch?v=8XW9o_V-Vyk',
            order: 1
        }
    ])

    redirect('/aula-virtual')
}
