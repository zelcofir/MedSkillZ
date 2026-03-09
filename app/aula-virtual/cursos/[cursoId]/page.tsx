import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'

export default async function CourseEntryPage({
    params
}: {
    params: { cursoId: string }
}) {
    const { cursoId } = await params
    const supabase = await createClient()

    // Fetch the first lesson of the first section to redirect the user
    const { data: course } = await supabase
        .from('courses')
        .select(`
      id,
      sections (
        id,
        "order",
        lessons (
          id,
          "order"
        )
      )
    `)
        .eq('id', cursoId)
        .single()

    if (!course || !course.sections || course.sections.length === 0) {
        // If no sections yet, show a placeholder or dashboard
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <h1 className="text-2xl font-bold">Este curso aún no tiene contenido</h1>
                <p className="text-slate-500">Contacta con tu instructor o vuelve más tarde.</p>
            </div>
        )
    }

    // Sort sections and lessons to find the very first one
    const firstSection = course.sections.sort((a: any, b: any) => a.order - b.order)[0]
    const firstLesson = (firstSection.lessons || []).sort((a: any, b: any) => a.order - b.order)[0]

    if (!firstLesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <h1 className="text-2xl font-bold">Sin lecciones todavía</h1>
                <p className="text-slate-500">Pronto habrá contenido disponible.</p>
            </div>
        )
    }

    // Redirect to the first lesson
    redirect(`/aula-virtual/cursos/${cursoId}/lecciones/${firstLesson.id}`)
}
