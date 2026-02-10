"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Calendar, CheckCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    icon: Users,
    value: "20",
    label: "Investigadores en formación",
  },
  {
    icon: Calendar,
    value: "2",
    label: "Años de experiencia",
  },
  {
    icon: CheckCircle,
    value: "1",
    label: "Trabajo terminado",
  },
  {
    icon: TrendingUp,
    value: "2",
    label: "Proyectos en avance",
  },
]

export function TrayectoriaSection() {
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
    <section id="nosotros" className="bg-secondary py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Sobre nosotros
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Nuestra Trayectoria
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Desde 2024, somos un equipo comprometido con la excelencia en investigación médica. Formamos profesionales capaces de generar conocimiento de impacto.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "group flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-lg transition-all duration-700 hover:shadow-xl",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <stat.icon className="h-7 w-7" />
              </div>
              <span className="mt-4 text-4xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
