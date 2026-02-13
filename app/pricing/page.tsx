import Pricing from "@/components/pricing"
import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { Contact } from "@/components/contact"

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <Pricing />
      <Contact/>
      <SiteFooter />
    </main>
  )
}
