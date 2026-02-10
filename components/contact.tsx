"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Send, MapPin, Clock, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "medskillz.empresa@gmail.com",
    href: "mailto:medskillz.empresa@gmail.com",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+51 950 779 214 / 999 913 119",
    href: "tel:+51950779214",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Vie: 9:00 AM - 6:00 PM",
    href: null,
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Lima, Perú",
    href: null,
  },
]

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Guardamos la referencia al formulario para evitar el error TypeError: null
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Tu Access Key de Web3Forms
    formData.append("access_key", "45e81d61-59fe-4a17-8f78-0254670ce47e")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        form.reset() // Limpia el formulario usando la referencia guardada
        
        // Reset visual después de 3 segundos
        setTimeout(() => setIsSubmitted(false), 3000)
      } else {
        alert("Hubo un error al enviar el mensaje. Por favor intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error de red:", error)
      alert("Error de conexión. Revisa tu internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contacto" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-kallpa-gold/10 text-kallpa-gold text-sm font-semibold mb-4">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-kallpa-navy mb-6">
            ¿Listo para{" "}
            <span className="text-kallpa-cyan">comenzar?</span>
          </h2>
          <p className="text-lg text-kallpa-ocean max-w-2xl mx-auto leading-relaxed">
            Agenda tu consultoría gratuita y descubre cómo podemos 
            potenciar tu organización.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-kallpa-navy mb-6">
              Información de Contacto
            </h3>
            <p className="text-kallpa-ocean mb-8 leading-relaxed">
              Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios 
              y te responderemos en menos de 24 horas.
            </p>

            <div className="space-y-4 mb-10">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 border-0 bg-secondary/50 hover:bg-secondary hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-kallpa-cyan/10 flex-shrink-0">
                        <info.icon className="w-5 h-5 text-kallpa-cyan" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-kallpa-navy font-semibold hover:text-kallpa-cyan transition-colors inline-block mt-1"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-kallpa-navy font-semibold mt-1">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

           
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 lg:p-8 border border-border/50 shadow-lg bg-background">
              <h3 className="text-2xl font-bold text-kallpa-navy mb-6">
                Envíanos un mensaje
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="p-4 rounded-full bg-green-500/10 mb-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-kallpa-navy mb-2">
                    ¡Mensaje enviado!
                  </h4>
                  <p className="text-kallpa-ocean">
                    Te contactaremos pronto.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="subject" value="Nuevo contacto desde la Web MedSkillZ" />
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-kallpa-navy">
                        Nombres <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder="Tu nombre completo"
                        required
                        className="border border-border focus:border-kallpa-cyan focus:ring-2 focus:ring-kallpa-cyan/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-kallpa-navy">
                        E-mail <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="border border-border focus:border-kallpa-cyan focus:ring-2 focus:ring-kallpa-cyan/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-kallpa-navy">
                        Teléfono / Celular <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        placeholder="+51 999 999 999"
                        required
                        className="border border-border focus:border-kallpa-cyan focus:ring-2 focus:ring-kallpa-cyan/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asunto" className="text-kallpa-navy">
                        Asunto <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="asunto"
                        name="asunto"
                        placeholder="¿En qué podemos ayudarte?"
                        required
                        className="border border-border focus:border-kallpa-cyan focus:ring-2 focus:ring-kallpa-cyan/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje" className="text-kallpa-navy">
                      Mensaje
                    </Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      placeholder="Cuéntanos sobre tu proyecto u organización..."
                      rows={5}
                      className="border border-border focus:border-kallpa-cyan focus:ring-2 focus:ring-kallpa-cyan/20 resize-none transition-all"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#6D28D9] hover:bg-[#6D28D9]/90 text-white font-semibold shadow-lg shadow-[#6D28D9]/30 hover:shadow-[#6D28D9]/40 transition-all duration-300 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Enviar mensaje
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}