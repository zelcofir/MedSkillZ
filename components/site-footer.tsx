import Image from "next/image"
import Link from "next/link"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const footerLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Investigación", href: "#convocatoria" },
  { label: "Nosotros", href: "#nosotros" },
]

const socialLinks = [
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/medskillz.empresa/",
    label: "Instagram",
  },
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/profile.php?id=61577900106086",
    label: "Facebook",
  },
]

export function SiteFooter() {
  return (
    <footer id="contacto" className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="#inicio" className="flex items-center gap-3">
              <Image
                src="/logo_white.png"
                alt="MedSkillz logo"
                width={44}
                height={44}
                className="h-11 w-auto brightness-200"
              />
              <span className="text-xl font-bold">MedSkillz</span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Educación e investigación médica de alto nivel. Impulsamos el futuro de la medicina.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Navegación
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
              Síguenos
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-primary-foreground/60">
              Contáctanos:{" "}
              <a href="tel:+51999913119" className="underline hover:text-primary-foreground">
                +51 999 913 119
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/15 pt-6 text-center">
          <p className="text-xs text-primary-foreground/50">
            {"© 2026 MedSkillz. Todos los derechos reservados."}
          </p>
        </div>
      </div>
    </footer>
  )
}
