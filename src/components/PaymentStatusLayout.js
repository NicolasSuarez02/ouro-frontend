import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PaymentStatusLayout — Chrome compartido para las páginas de status
 * de pago de MercadoPago (PaymentSuccess / PaymentPending / PaymentFailure).
 *
 * NO se usa para `Success.js` (página de fin de onboarding) — esa tiene
 * estructura distinta y vive con su propia composición.
 *
 * Props:
 *   - variant:       "success" | "pending" | "failure" (default "success")
 *   - eyebrow:       string — opcional. Si se omite, toma el label por variant.
 *   - title:         ReactNode — título grande serif. Puede incluir <em>.
 *   - subtitle:      string — subtítulo serif white-dim.
 *   - children:      ReactNode — contenido extra (info del turno, aviso, etc.)
 *   - primaryCta:    { to, label } — botón principal gold-gradient.
 *   - secondaryCta:  { to, label } — opcional. Ghost gold sutil.
 */

const VARIANTS = {
  success: {
    eyebrowLabel: 'Confirmado',
    ringColor: 'rgba(198, 167, 94, 0.4)',
    dotColor: '#C6A75E',
    dotGlow: '0 0 12px rgba(198, 167, 94, 0.6)',
    eyebrowTextColor: '#C6A75E',
  },
  pending: {
    eyebrowLabel: 'En proceso',
    ringColor: 'rgba(198, 167, 94, 0.4)',
    dotColor: 'rgba(198, 167, 94, 0.7)',
    dotGlow: 'none',
    eyebrowTextColor: 'rgba(198, 167, 94, 0.7)',
  },
  failure: {
    eyebrowLabel: 'No procesado',
    ringColor: 'rgba(160, 74, 58, 0.5)',
    dotColor: '#A04A3A',
    dotGlow: 'none',
    eyebrowTextColor: '#A04A3A',
  },
};

const PaymentStatusLayout = ({
  variant = 'success',
  eyebrow,
  title,
  subtitle,
  children,
  primaryCta,
  secondaryCta,
}) => {
  const cfg = VARIANTS[variant] || VARIANTS.success;
  const eyebrowText = eyebrow || cfg.eyebrowLabel;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-32 lg:pt-40 pb-24">
        <div className="max-w-md w-full">

          {/* Marca circular de status (sobria, sin íconos grandes) */}
          <div className="flex justify-center mb-10">
            <div
              className="w-20 h-20 rounded-full border flex items-center justify-center"
              style={{ borderColor: cfg.ringColor }}
              aria-hidden="true"
            >
              <span
                className="block w-3 h-3 rounded-full"
                style={{
                  background: cfg.dotColor,
                  boxShadow: cfg.dotGlow,
                }}
              />
            </div>
          </div>

          {/* Eyebrow + Title + Subtitle */}
          <div className="text-center mb-8">
            <p
              className="font-sans text-[11px] font-medium uppercase tracking-eyebrow-wide mb-5"
              style={{ color: cfg.eyebrowTextColor }}
            >
              {eyebrowText}
            </p>
            <h1
              className="font-serif font-light text-white mb-4"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="font-serif font-light text-white-dim leading-relaxed"
                style={{ fontSize: 'clamp(16px, 1.2vw, 18px)' }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Contenido custom */}
          {children && (
            <div className="mb-10">
              {children}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            {primaryCta && (
              <Link
                to={primaryCta.to}
                className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow"
              >
                <span>{primaryCta.label}</span>
                <span>→</span>
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.to}
                className="inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-faint hover:text-gold transition-colors duration-300 py-3"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentStatusLayout;
