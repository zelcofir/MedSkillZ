import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, PlayCircle, FileText, CheckCircle2 } from 'lucide-react'

export default async function CourseViewerLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { cursoId: string }
}) {
    const { cursoId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/aula-virtual/login')
    }

    // Fetch course details with sections and lessons
    const { data: course } = await supabase
        .from('courses')
        .select(`
      *,
      sections (
        *,
        lessons (*)
      )
    `)
        .eq('id', cursoId)
        .single()

    if (!course) {
        redirect('/aula-virtual')
    }

    // Fetch user progress for this course
    const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)

    const completedLessonsCount = progress?.filter(p => p.completed).length || 0
    const totalLessonsCount = course.sections.reduce((acc: number, sec: any) => acc + sec.lessons.length, 0)
    const progressPercentage = totalLessonsCount > 0 ? (completedLessonsCount / totalLessonsCount) * 100 : 0

    return (
        <div className="flex flex-col h-[calc(100-64px)] overflow-hidden bg-white">
            {/* Header / Nav */}
            <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/aula-virtual" className="text-slate-500 hover:text-slate-900 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <h2 className="font-bold text-lg line-clamp-1">{course.title}</h2>
                </div>
                <div className="flex items-center gap-6 w-1/3 max-w-xs">
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Progreso del Curso</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-slate-100" />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <aside className="w-80 border-r border-slate-200 overflow-y-auto bg-slate-50 hidden lg:block">
                    <Accordion type="multiple" className="w-full">
                        {course.sections
                            .sort((a: any, b: any) => a.order - b.order)
                            .map((section: any) => (
                                <AccordionItem key={section.id} value={section.id} className="border-b-0">
                                    <AccordionTrigger className="px-5 py-4 hover:bg-slate-100 transition-colors hover:no-underline">
                                        <span className="text-sm font-semibold text-left">{section.title}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-0">
                                        <div className="flex flex-col">
                                            {section.lessons
                                                .sort((a: any, b: any) => a.order - b.order)
                                                .map((lesson: any) => {
                                                    const isCompleted = progress?.some(p => p.lesson_id === lesson.id && p.completed)
                                                    return (
                                                        <Link
                                                            key={lesson.id}
                                                            href={`/aula-virtual/cursos/${cursoId}/lecciones/${lesson.id}`}
                                                            className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors group"
                                                        >
                                                            <div className={isCompleted ? "text-green-500" : "text-slate-400"}>
                                                                {isCompleted ? <CheckCircle2 size={18} /> : lesson.content_type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                                                            </div>
                                                            <span className="text-sm text-slate-700 group-hover:text-blue-600 line-clamp-1">
                                                                {lesson.title}
                                                            </span>
                                                        </Link>
                                                    )
                                                })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                    </Accordion>
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-white p-6 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
