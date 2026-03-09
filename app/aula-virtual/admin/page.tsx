import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Edit3, BookOpen, UserCircle, LogOut } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { LogoutButton } from '@/components/aula-virtual/logout-button'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/aula-virtual/login')
    }

    // Check if role is teacher
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'teacher') {
        // If not a teacher, check if they want to BECOME one for demo purposes or just redirect
        // For this implementation, we will allow them to redirect back
        redirect('/aula-virtual')
    }

    // Fetch teacher's courses
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', user.id)

    async function createCourse(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const thumbnail_url = formData.get('thumbnail_url') as string

        if (!title) return

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase.from('courses').insert({
            title,
            description,
            thumbnail_url,
            teacher_id: user.id
        })

        if (error) {
            console.error('Error creating course:', error)
            return
        }

        revalidatePath('/aula-virtual/admin')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel de Docente</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-slate-500 text-sm">Gestiona tus cursos y contenidos</p>
                        <LogoutButton />
                    </div>
                </div>
                <Link href="/aula-virtual">
                    <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">Ver Vista Estudiante</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Crear Nuevo Curso</CardTitle>
                            <CardDescription>Publica un nuevo curso para tus estudiantes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={createCourse} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Título del Curso</label>
                                    <Input name="title" placeholder="Ej. Medicina Interna Avanzada" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Descripción</label>
                                    <Textarea name="description" placeholder="Breve resumen del curso..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">URL Miniatura (Opcional)</label>
                                    <Input name="thumbnail_url" placeholder="https://..." />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Curso
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold">Mis Cursos Publicados</h2>

                    <div className="grid gap-4">
                        {courses && courses.length > 0 ? (
                            courses.map((course) => (
                                <Card key={course.id} className="flex flex-col md:flex-row overflow-hidden border-slate-200 hover:border-blue-200 transition-colors">
                                    <div className="md:w-48 bg-slate-100 aspect-video md:aspect-auto">
                                        {course.thumbnail_url ? (
                                            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <BookOpen size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 p-5 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{course.title}</h3>
                                            <div className="flex gap-2">
                                                <Link href={`/aula-virtual/admin/cursos/${course.id}`}>
                                                    <Button size="icon" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-full">
                                                        <Edit3 size={18} />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2">{course.description || "Sin descripción."}</p>
                                        <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-400">
                                            <span>{new Date(course.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 shadow-sm flex flex-col items-center gap-4">
                                <div className="p-4 bg-primary/5 rounded-full text-primary/40">
                                    <Plus size={32} />
                                </div>
                                <div className="max-w-xs">
                                    <p className="text-slate-900 font-bold text-lg">Crea tu primer curso</p>
                                    <p className="text-slate-400 text-sm mt-1">Usa el formulario de la izquierda para empezar a compartir tu conocimiento.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
