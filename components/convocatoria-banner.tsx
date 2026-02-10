"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CalendarDays, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ConvocatoriaBanner() {
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
    <section id="convocatoria" className="bg-background py-20 md:py-28">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-7xl px-6 transition-all duration-700",
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <div className="overflow-hidden rounded-3xl bg-primary shadow-2xl">
          <div className="grid items-center md:grid-cols-2">
            {/* Text Side */}
            <div className="flex flex-col justify-center px-8 py-12 md:px-14 md:py-16">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                <CalendarDays className="h-4 w-4" />
                Convocatoria abierta
              </div>

              <h2 className="mt-6 text-2xl font-bold leading-tight text-primary-foreground md:text-3xl lg:text-4xl text-balance">
                Grupo de Reportes de Caso
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-primary-foreground/85">
                Únete a nuestro equipo de investigación. Convocatoria abierta para Reportes de Caso.
              </p>

              <p className="mt-4 text-primary-foreground/85">
                Fecha límite de inscripción:{" "}
                <span className="font-bold text-primary-foreground">24 de Febrero</span>
              </p>

              <ul className="mt-6 space-y-2 text-sm text-primary-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Ser estudiante o profesional de ciencias de la salud
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Tener un caso que desees publicar
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Ganas de aprender
                </li>
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                >
                  <a
                    href="https://forms.gle/EdUbhwJKZog6ingB7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Postular ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative hidden md:block">
              <div className="relative aspect-square w-full">
                <Image
                  src="/Grupo_Reportes_Caso.jpg"
                  alt="Grupo de Reportes de Caso - Equipo de profesionales médicos colaborando"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
