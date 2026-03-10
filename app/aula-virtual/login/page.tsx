'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Por favor, completa todos los campos.')
            return
        }

        setIsLoading(true)
        console.log('Intentando login para:', email)

        try {
            const { error, data } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                console.error('Error de login:', error)
                if (error.message === 'Invalid login credentials') {
                    toast.error('Información no registrada o error en el usuario y/o contraseña.')
                } else if (error.message === 'Email not confirmed') {
                    toast.error('Por favor, confirma tu correo electrónico antes de entrar.')
                } else {
                    toast.error(error.message)
                }
            } else {
                console.log('Login exitoso, usuario:', data.user?.id)
                // Check if profile exists, if not create it
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
                    if (!profile) {
                        console.log('Creando perfil para nuevo usuario...')
                        await supabase.from('profiles').insert({
                            id: user.id,
                            full_name: user.user_metadata.full_name || 'Estudiante',
                            role: 'student'
                        })
                    }
                }

                toast.success('¡Bienvenido de nuevo!')
                router.push('/aula-virtual')
                router.refresh()
            }
        } catch (err) {
            console.error('Error inesperado:', err)
            toast.error('Ocurrió un error inesperado al intentar iniciar sesión.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()

        // Password complexity regex: min 6 chars, 1 upper, 1 lower, 1 number, 1 special
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

        if (!passwordRegex.test(password)) {
            toast.error('La contraseña debe tener al menos 6 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).')
            return
        }

        setIsLoading(true)
        console.log('Intentando registro para:', email)
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Error de registro:', error)
            toast.error(error.message)
            setIsLoading(false)
        } else {
            console.log('Registro exitoso (pendiente confirmación):', data.user?.id)
            // Success! No need to insert profile here because RLS will block it if email confirmation is required.
            // Profile will be created upon first successful login in handleLogin.
            toast.success('¡Registro casi completo! Por favor, revisa tu correo para confirmar tu cuenta. Serás redirigido aquí para iniciar sesión.')
            setIsLoading(false)
            setFullName('')
            setEmail('')
            setPassword('')
            setActiveTab('login') // Switch to login tab automatically
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Aula Virtual</CardTitle>
                    <CardDescription>
                        Accede a tus cursos y gestiona tu progreso
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-full">
                            <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary">Iniciar Sesión</TabsTrigger>
                            <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary">Registrarse</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nombre@ejemplo.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Contraseña</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full" type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                                    Entrar
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reg-name">Nombre completo</Label>
                                    <Input
                                        id="reg-name"
                                        type="text"
                                        placeholder="Tu nombre completo"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Correo electrónico</Label>
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        placeholder="nombre@ejemplo.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Contraseña</Label>
                                    <p className="text-[10px] text-slate-400">Mínimo 6 caracteres, mayúscula, minúscula, número y símbolo (@$!%*?&)</p>
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full" type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                    Crear cuenta
                                </Button>
                            </form>
                        </TabsContent>

                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-xs text-center text-slate-500">
                        Al registrarte, aceptas nuestros términos y condiciones.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
