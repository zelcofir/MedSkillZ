"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpen, FlaskConical, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const services = [
  {
    icon: BookOpen,
    title: "Asesoría de Tesis",
    description:
      "Acompañamiento metodológico personalizado para que tu tesis cumpla los más altos estándares académicos y científicos.",
  },
  {
    icon: FlaskConical,
    title: "Proyectos de Investigación",
    description:
      "Desarrollo de trabajos originales con rigor científico. Te guiamos desde la concepción de la idea hasta la publicación.",
  },
  {
    icon: FileText,
    title: "Reportes de Caso",
    description:
      "Mentoría especializada para publicaciones clínicas. Aprende a documentar y compartir casos relevantes con la comunidad médica.",
  },
]

export function ServicesSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="servicios" className="bg-secondary py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Lo que hacemos
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tres pilares que impulsan tu desarrollo profesional en el mundo de la investigación médica.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className={cn(
                "group border-0 bg-card shadow-lg transition-all duration-700 hover:shadow-xl hover:-translate-y-1",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-card-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
