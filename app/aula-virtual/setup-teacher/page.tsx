import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function CreateFirstTeacher() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/aula-virtual/login')
    }

    // Use upsert to ensure the profile exists and set role to teacher
    await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            role: 'teacher',
            updated_at: new Date().toISOString()
        })

    redirect('/aula-virtual/admin')
}
