import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import { VideoPlayer } from '@/components/aula-virtual/video-player'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ExternalLink, MessageSquare, User } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function LessonPage({
    params
}: {
    params: { cursoId: string; leccionId: string }
}) {
    const { cursoId, leccionId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/aula-virtual/login')
    }

    // Fetch lesson data
    const { data: lesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', leccionId)
        .single()

    if (!lesson) {
        notFound()
    }

    // Fetch comments
    const { data: comments } = await supabase
        .from('comments')
        .select(`
      *,
      profiles(full_name, role)
    `)
        .eq('lesson_id', leccionId)
        .order('created_at', { ascending: true }) // Order by time to handle threads easily

    // Organize comments into threads
    const rootComments = comments?.filter(c => !c.parent_id) || []
    const repliesMap = comments?.reduce((acc: any, c) => {
        if (c.parent_id) {
            if (!acc[c.parent_id]) acc[c.parent_id] = []
            acc[c.parent_id].push(c)
        }
        return acc
    }, {}) || {}

    // Check if lesson is completed
    const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', leccionId)
        .single()

    const isCompleted = !!progress?.completed

    // Action to toggle completion
    async function toggleCompletion() {
        'use server'
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        if (isCompleted) {
            await supabase
                .from('user_progress')
                .update({ completed: false })
                .eq('user_id', user.id)
                .eq('lesson_id', leccionId)
        } else {
            await supabase
                .from('user_progress')
                .upsert({
                    user_id: user.id,
                    lesson_id: leccionId,
                    completed: true
                })
        }
        revalidatePath(`/aula-virtual/cursos/${cursoId}`)
        revalidatePath(`/aula-virtual/cursos/${cursoId}/lecciones/${leccionId}`)
    }

    // Action to post comment
    async function postComment(formData: FormData) {
        'use server'
        const content = formData.get('content') as string
        const parentId = formData.get('parentId') as string
        if (!content) return

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase.from('comments').insert({
            lesson_id: leccionId,
            user_id: user.id,
            content,
            parent_id: parentId || null
        })

        revalidatePath(`/aula-virtual/cursos/${cursoId}/lecciones/${leccionId}`)
    }

    // Check if user is teacher to show reply options
    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    const isTeacher = currentUserProfile?.role === 'teacher'

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-4">{lesson.title}</h1>

                {lesson.content_type === 'video' && lesson.video_url && (
                    <VideoPlayer url={lesson.video_url} />
                )}

                {lesson.content_type === 'resource' && lesson.resource_url && (
                    <Card className="border-2 border-slate-100 shadow-none bg-slate-50 overflow-hidden group">
                        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                                <ExternalLink size={32} />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg">Recurso Adicional</h3>
                                <p className="text-sm text-slate-500 max-w-sm">Haz clic en el botón para ver o descargar el recurso asociado a esta lección.</p>
                            </div>
                            <a href={lesson.resource_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="default" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"> Abrir Recurso </Button>
                            </a>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex justify-between items-center py-4 border-y border-slate-100">
                <form action={toggleCompletion}>
                    <Button
                        type="submit"
                        variant={isCompleted ? "outline" : "default"}
                        className={isCompleted ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100 rounded-full" : "bg-primary hover:bg-primary/90 text-white rounded-full"}
                    >
                        {isCompleted ? <CheckCircle className="mr-2 h-4 w-4" /> : null}
                        {isCompleted ? "Completado" : "Marcar como COMPLETADO"}
                    </Button>
                </form>
            </div>

            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-2">
                    <MessageSquare className="text-primary" size={24} />
                    <h2 className="text-2xl font-bold text-slate-900">Comentarios</h2>
                </div>

                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardContent className="pt-6">
                        <form action={postComment} className="space-y-4">
                            <Textarea
                                name="content"
                                placeholder="Escribe tu duda o comentario sobre esta lección..."
                                className="min-h-[100px] border-slate-200 focus:border-primary focus:ring-primary bg-slate-50/50"
                                required
                            />
                            <div className="flex justify-end">
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">Publicar Comentario</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6 pt-4">
                    {rootComments.length > 0 ? (
                        rootComments.map((comment: any) => (
                            <div key={comment.id} className="space-y-4">
                                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm relative group">
                                    <div className="shrink-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${comment.profiles?.role === 'teacher' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <User size={24} />
                                        </div>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold text-sm ${comment.profiles?.role === 'teacher' ? 'text-primary' : 'text-slate-900'}`}>
                                                    {comment.profiles?.full_name || "Estudiante"}
                                                    {comment.profiles?.role === 'teacher' && <span className="ml-2 px-2 py-0.5 bg-primary/10 text-[10px] rounded-full">DOCENTE</span>}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>

                                        {isTeacher && (
                                            <div className="pt-2">
                                                <form action={postComment} className="flex gap-2">
                                                    <input type="hidden" name="parentId" value={comment.id} />
                                                    <Input
                                                        name="content"
                                                        placeholder="Responder como docente..."
                                                        className="h-8 text-xs border-slate-100 bg-slate-50/50"
                                                        required
                                                    />
                                                    <Button type="submit" size="sm" className="h-8 bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 text-xs rounded-full">
                                                        Responder
                                                    </Button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Replies */}
                                {repliesMap[comment.id]?.map((reply: any) => (
                                    <div key={reply.id} className="ml-12 flex gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm relative overflow-hidden">
                                        <div className="shrink-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reply.profiles?.role === 'teacher' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                <User size={20} />
                                            </div>
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold text-sm ${reply.profiles?.role === 'teacher' ? 'text-primary' : 'text-slate-900'}`}>
                                                        {reply.profiles?.full_name || "Estudiante"}
                                                        {reply.profiles?.role === 'teacher' && <span className="ml-2 px-2 py-0.5 bg-primary/10 text-[10px] rounded-full uppercase">DOCENTE</span>}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{new Date(reply.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{reply.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                            <MessageSquare className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                            <p className="text-slate-400 text-sm font-medium italic">Sé el primero en comentar esta lección.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
