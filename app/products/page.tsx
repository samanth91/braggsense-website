import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/content";

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        <section className="container py-20 md:py-24 max-w-4xl">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">HARDWARE + SOFTWARE + SUPPORT</div>
          <h1 className="section-title mb-6">Complete FBG sensing systems, from interrogator to insight.</h1>
          <p className="text-2xl text-slate-300">Every component is designed, tested, and supported by the same team. We take full responsibility for the measurement chain.</p>
        </section>

        {/* Interrogators */}
        <section className="bg-[#0f2744] py-16">
          <div className="container">
            <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-3">FBG INTERROGATORS</div>
            <h2 className="section-title mb-10">The highest resolution and reliability in their class.</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {siteConfig.products.slice(0, 2).map((product, i) => (
                <div key={i} className="card rounded-3xl overflow-hidden flex flex-col">
                  <div className="product-image-container h-72 flex items-center justify-center p-12">
                    <img src={product.image} alt={product.name} className="max-h-52 object-contain" />
                  </div>
                  <div className="p-10">
                    <div className="text-[#00c4d4] text-sm tracking-[1.5px] mb-2">{product.type}</div>
                    <h3 className="text-3xl font-semibold tracking-[-0.02em] mb-4">{product.name}</h3>
                    <p className="text-lg text-slate-300 mb-6">{product.description}</p>
                    
                    <div className="spec-table text-sm">
                      <table className="w-full">
                        <tbody>
                          {product.specs.split("•").map((spec, idx) => (
                            <tr key={idx}>
                              <td className="text-slate-400 pr-4 py-1 font-mono text-xs tracking-tight">{spec.trim()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8">
                      <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#00c4d4] hover:text-white">
                        Request technical specifications <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sensors */}
        <section className="container py-20">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-3">FBG SENSORS & ARRAYS</div>
          <h2 className="section-title mb-10 max-w-3xl">Sensors engineered for decades of service inside the structures they monitor.</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {siteConfig.products.slice(2, 4).map((product, i) => (
              <div key={i} className="card rounded-3xl p-10 flex flex-col">
                <div>
                  <div className="text-[#00c4d4] text-sm tracking-[1.5px] mb-2">{product.type}</div>
                  <h3 className="text-3xl font-semibold tracking-[-0.02em] mb-4">{product.name}</h3>
                  <p className="text-lg text-slate-300 mb-8">{product.description}</p>
                </div>
                
                <div className="mt-auto pt-8 border-t border-white/10 text-sm font-mono text-slate-400 tracking-tight">
                  {product.specs}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-slate-400 max-w-2xl">
            All sensors are available with custom fiber counts, lengths, connector types (FC/APC, LC/APC), protective jackets, and mounting configurations. We routinely deliver arrays over 200 m long with 5 mm sensor spacing.
          </div>
        </section>

        {/* Software */}
        <section className="border-y border-white/10 bg-[#0f2744] py-20">
          <div className="container">
            <div className="max-w-3xl">
              <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-3">BRAGGSOFT PLATFORM</div>
              <h2 className="section-title mb-6">From raw wavelengths to actionable intelligence.</h2>
              <p className="text-xl text-slate-300">BraggSoft is the complete software layer that turns precise optical measurements into engineering decisions. It runs at the edge, in the cloud, or fully air-gapped.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                "Real-time peak detection and conversion to engineering units",
                "Rule-based and ML alerting with integration to SCADA, MQTT, and REST",
                "Long-term trending, automated reporting, and digital twin connectors",
              ].map((item, i) => (
                <div key={i} className="text-lg text-slate-300 border-l-2 border-[#00c4d4] pl-6">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-20 text-center">
          <p className="text-xl mb-8 text-slate-300 max-w-md mx-auto">Need a custom configuration or OEM interrogator module?</p>
          <Link href="/contact" className="btn-primary px-10 py-4 rounded-full text-lg inline-flex items-center gap-3">
            Talk to our systems team <ArrowRight />
          </Link>
        </section>
      </div>

      <Footer />
    </>
  );
}
