"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useState } from "react"

const slides = [
  {
    image: "/hero-1.jpg",
    alt: "Estudiantes de medicina colaborando en un ambiente moderno",
  },
  {
    image: "/hero-2.jpg",
    alt: "Investigación médica en laboratorio con equipos modernos",
  },
  {
    image: "/hero-3.jpg",
    alt: "Profesionales médicos presentando resultados de investigación",
  },
]

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }))

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section id="inicio" className="relative w-full h-screen">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0 h-screen">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.image} className="pl-0 relative h-screen">
              <div className="relative w-full h-full">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-foreground/60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 z-10 h-12 w-12 border-0 bg-background/20 text-primary-foreground hover:bg-background/40 md:left-8" />
        <CarouselNext className="absolute right-4 top-1/2 z-10 h-12 w-12 border-0 bg-background/20 text-primary-foreground hover:bg-background/40 md:right-8" />

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-primary-foreground"
                  : "w-2 bg-primary-foreground/50"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Overlay Text */}
      <div className="absolute inset-0 z-[5] flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
            Potenciando tu camino en la Medicina: Educación, Investigación y Resultados
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
            Acompañamiento integral para profesionales y estudiantes de ciencias de la salud
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#servicios"
              className="inline-flex h-12 items-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Nuestros Servicios
            </a>
            <a
              href="#convocatoria"
              className="inline-flex h-12 items-center rounded-lg border-2 border-primary-foreground/40 px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Convocatoria Abierta
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
