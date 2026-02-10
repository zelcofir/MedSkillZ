import { Navbar } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { ServicesSection } from "@/components/services-section"
import { ConvocatoriaBanner } from "@/components/convocatoria-banner"
import { TrayectoriaSection } from "@/components/trayectoria-section"
import { SiteFooter } from "@/components/site-footer"
import { Contact } from "@/components/contact"

export default function Page() {
  return (
    <main>
      <Navbar />
      <HeroCarousel />
      <ServicesSection />
      <ConvocatoriaBanner />
      <TrayectoriaSection />
      <Contact/>
      <SiteFooter />
    </main>
  )
}
