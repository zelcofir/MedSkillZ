"use client"

import Image from "next/image"
import { ExternalLink, GraduationCap, Award, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Member {
  id: string
  name: string
  title: string
  description: string
  image: string
  publicationsUrl?: string
  specialties?: string[]
}

const members: Member[] = [
  {
    id: "1",
    name: "Frank Zela",
    title: "Director General",
    specialties: ["Data Science", "Investigación Médica"],
    description: "Médico egresado de la Universidad Nacional de San Agustín de Arequipa (UNSA), con enfoque en recolección, limpieza y análisis de datos. Cuenta con experiencia como coordinador regional de la Sociedad Científica Médico Estudiantil Peruana (SOCIMEP) y como director local y presidente de la Sociedad Científica de Estudiantes de Medicina Agustinos (SOCIEMA). Ha ejercido como editor de la Revista del Cuerpo Médico del Hospital Nacional Almanzor Aguinaga Asenjo y Presidente 2024 de SOCIMEP.",
    image: "/members/foto_frank.png",
    publicationsUrl: "https://researchgate.net",
  },
]

export function MembersSection() {
  return (
    <section id="miembros" className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Header con diseño más limpio */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
            Nuestro Equipo
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Profesionales comprometidos con la transformación de la educación e investigación médica en el Perú.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid gap-12">
          {members.map((member) => (
            <div
              key={member.id}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-xl hover:border-primary/20"
            >
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">
                
                {/* Photo Section con Decoración */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    {member.publicationsUrl && (
                      <Button asChild variant="default" size="sm" className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                        <a href={member.publicationsUrl} target="_blank" rel="noopener noreferrer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Publicaciones
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                       <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">
                        {member.title}
                       </Badge>
                       {member.specialties?.map(s => (
                         <span key={s} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                           • {s}
                         </span>
                       ))}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      {member.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic relative">
                      <span className="text-4xl text-primary/20 absolute -left-6 -top-4 font-serif">"</span>
                      {member.description}
                      <span className="text-4xl text-primary/20 absolute -bottom-8 font-serif">"</span>
                    </p>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span>UNSA | Medicina Humana</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Ex-Presidente SOCIMEP</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}