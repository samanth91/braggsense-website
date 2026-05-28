"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/content";

export default function BraggSenseHome() {
  return (
    <>
      <Navbar />

      {/* HERO — Premium dark navy with dramatic fiber visual */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-fibers.jpg"
            alt="Fiber optic sensing technology"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0a1628]/95 to-[#0a1628]" />
        </div>

        <div className="container relative z-10 pt-12 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs tracking-[2px] text-slate-300 mb-6">
            EUROPEAN PRECISION • SINCE 2016
          </div>

          <h1 className="display max-w-5xl mx-auto text-white mb-6">
            {siteConfig.hero.headline}
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-200 tracking-tight">
            {siteConfig.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg"
            >
              {siteConfig.hero.ctaPrimary} <ArrowRight size={20} />
            </Link>
            <Link
              href="/technology"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg"
            >
              {siteConfig.hero.ctaSecondary}
            </Link>
          </div>

          <div className="mt-16 text-[11px] tracking-[3px] text-slate-400">
            RAIL • CIVIL • ENERGY • AEROSPACE • INDUSTRIAL
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[10px] tracking-[2px] text-slate-400">
          SCROLL TO EXPLORE <ArrowRight className="rotate-90" size={14} />
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-b border-white/10 bg-[#0f2744]">
        <div className="container py-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-xs tracking-[1.5px] text-slate-400">
          <div>DEUTSCHE BAHN</div>
          <div>SIEMENS ENERGY</div>
          <div>AIRBUS</div>
          <div>NETHERLANDS RAIL</div>
          <div>ØRSTED</div>
          <div>EUROPEAN SPACE AGENCY</div>
        </div>
      </div>

      {/* TECHNOLOGY INTRO */}
      <section className="container pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">THE BRAGGSENSE DIFFERENCE</div>
          <h2 className="section-title text-white mb-6">
            We turn light into certainty.
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed">
            BraggSense designs and manufactures the highest-resolution fiber Bragg grating (FBG) interrogators and sensor systems available. 
            Our technology delivers sub-picometer wavelength precision across hundreds of sensors on a single optical fiber — even in the harshest environments on the planet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {[
            { label: "Wavelength Resolution", value: "0.5 pm" },
            { label: "Sensors per Channel", value: "Up to 256" },
            { label: "Operating Range", value: "−60 °C to +300 °C" },
          ].map((stat, i) => (
            <div key={i} className="border-l-2 border-[#00c4d4] pl-6">
              <div className="text-4xl font-semibold tracking-tighter text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="bg-[#0f2744] py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-3">WHY ENGINEERS CHOOSE BRAGGSENSE</div>
              <h3 className="section-title">Precision that compounds.</h3>
            </div>
            <p className="max-w-md text-lg text-slate-300">
              Every advantage below directly reduces risk, cost, and uncertainty in your most critical assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {siteConfig.advantages.map((adv, index) => (
              <div key={index} className="card p-8 rounded-2xl">
                <div className="text-[#00c4d4] mb-4">
                  <Check size={22} />
                </div>
                <h4 className="text-xl font-semibold tracking-tight mb-3">{adv.title}</h4>
                <p className="text-slate-300 leading-relaxed text-[15px]">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-3">WHERE IT MATTERS MOST</div>
            <h3 className="section-title">Engineered for the world's toughest monitoring challenges.</h3>
          </div>
          <Link href="/solutions" className="inline-flex items-center gap-2 text-[#00c4d4] hover:text-white group font-medium">
            View all solutions <ArrowRight className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {siteConfig.applications.map((app, index) => (
            <Link key={index} href={app.href} className="app-card group block overflow-hidden rounded-2xl bg-[#11223a] border border-white/5">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={app.image} 
                  alt={app.title}
                  className="app-image absolute inset-0 w-full h-full object-cover brightness-[0.85] group-hover:brightness-[0.95] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-semibold tracking-tight mb-3 group-hover:text-[#00c4d4] transition-colors">{app.title}</h4>
                <p className="text-slate-300 leading-relaxed">{app.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="bg-[#0f2744] py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-3">COMPLETE SYSTEMS</div>
              <h3 className="section-title">From sensor to insight.</h3>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-[#00c4d4] hover:text-white group font-medium">
              See full product range <ArrowRight className="group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {siteConfig.products.map((product, index) => (
              <div key={index} className="card rounded-2xl overflow-hidden flex flex-col">
                <div className="product-image-container h-48 flex items-center justify-center p-8">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-h-36 object-contain"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div>
                    <div className="text-xs tracking-[1.5px] text-[#00c4d4] mb-1.5">{product.type}</div>
                    <h4 className="text-[21px] font-semibold tracking-tight leading-tight">{product.name}</h4>
                  </div>
                  <p className="mt-3 text-sm text-slate-300 flex-1">{product.description}</p>
                  <div className="mt-5 pt-4 border-t border-white/10 text-xs font-mono text-slate-400 tracking-tight">
                    {product.specs}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY TEASER + FINAL CTA */}
      <section className="container py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">A EUROPEAN TECHNOLOGY COMPANY</div>
          <h2 className="section-title mb-6">Built by engineers who have lived the measurement problem.</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            BraggSense was founded by photonics and structural health monitoring specialists who were frustrated by the trade-offs in existing FBG systems. 
            Today our technology protects some of the most critical infrastructure in Europe and beyond.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company" className="btn-secondary px-8 py-4 rounded-full text-lg inline-flex items-center justify-center gap-2">
              Meet the team
            </Link>
            <Link href="/contact" className="btn-primary px-8 py-4 rounded-full text-lg inline-flex items-center justify-center gap-2">
              Start a project with us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
