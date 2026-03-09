import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Play, FileText, Trash2, GripVertical, CheckCircle, Video, Link as LinkIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { revalidatePath } from 'next/cache'

export default async function ManageCoursePage({
    params
}: {
    params: { cursoId: string }
}) {
    const { cursoId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/aula-virtual/login')

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

    if (!course) notFound()

    async function addSection(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        if (!title) return

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase.from('sections').insert({
            course_id: cursoId,
            title,
            order: course.sections.length
        })
        revalidatePath(`/aula-virtual/admin/cursos/${cursoId}`)
    }

    async function addLesson(formData: FormData) {
        'use server'
        const sectionId = formData.get('sectionId') as string
        const title = formData.get('title') as string
        const type = formData.get('type') as string
        const url = formData.get('url') as string

        if (!title || !sectionId) return

        const supabase = await createClient()
        await supabase.from('lessons').insert({
            section_id: sectionId,
            title,
            content_type: type,
            video_url: type === 'video' ? url : null,
            resource_url: type === 'resource' ? url : null,
            order: 0 // Simplificado
        })
        revalidatePath(`/aula-virtual/admin/cursos/${cursoId}`)
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Link href="/aula-virtual/admin" className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 w-fit transition-colors">
                <ChevronLeft size={16} /> Volver al panel
            </Link>

            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                <p className="text-slate-500">Editor de currículo y contenido</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-10">
                    {/* Sections List */}
                    {course.sections
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((section: any) => (
                            <div key={section.id} className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <h3 className="font-bold text-xl flex items-center gap-2">
                                        <span className="bg-slate-900 text-white w-6 h-6 rounded text-xs flex items-center justify-center font-mono">S</span>
                                        {section.title}
                                    </h3>
                                </div>

                                <div className="space-y-2 pl-8">
                                    {section.lessons
                                        .sort((a: any, b: any) => a.order - b.order)
                                        .map((lesson: any) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-200 transition-colors shadow-sm">
                                                <div className="flex items-center gap-3 text-sm">
                                                    {lesson.content_type === 'video' ? <Video size={16} className="text-primary" /> : <FileText size={16} className="text-slate-400" />}
                                                    <span className="font-medium">{lesson.title}</span>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Add Lesson Form Inline */}
                                    <form action={addLesson} className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 flex flex-col md:flex-row gap-2">
                                        <input type="hidden" name="sectionId" value={section.id} />
                                        <Input name="title" placeholder="Título de la lección" className="bg-white flex-1" required />
                                        <select name="type" className="text-sm border rounded px-2 bg-white" defaultValue="video">
                                            <option value="video">Video</option>
                                            <option value="resource">Recurso/PDF</option>
                                        </select>
                                        <Input name="url" placeholder="URL (YouTube/Vimeo o PDF)" className="bg-white flex-1" />
                                        <Button type="submit" size="sm" className="bg-slate-900">
                                            <Plus size={16} />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))}

                    {course.sections.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 italic">No hay secciones todavía. Comienza creando una.</p>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    <Card className="sticky top-8 border-2 border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Añadir Sección</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={addSection} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre de la Sección</label>
                                    <Input name="title" placeholder="Ej. Introducción" required />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Añadir Sección
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
