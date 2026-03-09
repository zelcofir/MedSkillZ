import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, GraduationCap, LayoutDashboard, User } from 'lucide-react'
import { LogoutButton } from '@/components/aula-virtual/logout-button'

export default async function AulaVirtualPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/aula-virtual/login')
    }

    // Fetch user profile to check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch courses
    const { data: courses } = await supabase
        .from('courses')
        .select(`
      *,
      teacher:profiles(full_name)
    `)

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Mis Cursos</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-slate-500 text-sm">Bienvenido de nuevo, {profile?.full_name || user.email}</p>
                        <LogoutButton />
                    </div>
                </div>

                {profile?.role === 'teacher' && (
                    <Link href="/aula-virtual/admin">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Panel de Docente
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses && courses.length > 0 ? (
                    courses.map((course) => (
                        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                            <div className="aspect-video bg-slate-100 relative group">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                                        <BookOpen size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <Link href={`/aula-virtual/cursos/${course.id}`}>
                                        <Button variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90 font-bold border-none shadow-lg">Continuar Aprendiendo</Button>
                                    </Link>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl line-clamp-1">{course.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1 text-slate-400">
                                    <GraduationCap size={14} className="text-primary" />
                                    {course.teacher?.full_name || 'Instructor'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Progreso</span>
                                        <span>0%</span>
                                    </div>
                                    <Progress value={0} className="h-1.5 bg-slate-100" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center space-y-4 bg-white border-2 border-dashed border-slate-100 rounded-[2rem] shadow-sm">
                        <div className="bg-primary/5 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-2 animate-pulse">
                            <BookOpen className="text-primary/40" size={48} />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <h3 className="text-xl font-bold text-slate-900">Aún no hay cursos</h3>
                            <p className="text-slate-400 text-sm mt-2">Estamos preparando los mejores contenidos médicos para ti. ¡Vuelve pronto!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
