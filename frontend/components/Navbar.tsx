"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleProvider";
import { useCurrentUser } from "../lib/useCurrentUser";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive ? "text-white" : "text-slate-100/90 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { locale, setLocale, messages } = useLocale();
  const { user, isLoading } = useCurrentUser();
  const navLinks = [
    { href: "/", label: messages.nav.events },
    { href: "/about", label: messages.nav.about },
    { href: "/contact", label: messages.nav.contact }
  ];

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-800 via-brand-700 to-brand-500 opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.1),_transparent_35%)]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/IMG_2352.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="relative z-10 px-4 py-16 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-white drop-shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <span className="text-lg font-semibold">DA</span>
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em]">
                {messages.nav.brandTop}
              </div>
              <div className="text-lg font-semibold leading-5">
                {messages.nav.brandBottom}
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
              {(["PL", "EN"] as const).map((lang) => {
                const isActive = locale === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLocale(lang)}
                    className={`rounded-full px-3 py-1 transition ${isActive ? "bg-white/80 text-brand-700 shadow-sm" : "text-white/80 hover:text-white"}`}
                    aria-pressed={isActive}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
            {user ? (
              <span className="text-sm font-semibold text-white">{user.email}</span>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white hover:text-slate-100"
                >
                  {messages.nav.login}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm hover:bg-slate-100"
                >
                  {messages.nav.join}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="mt-16 flex items-center gap-6 border-t border-white/10 pt-16">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
      </div>
    </header>
  );
}
