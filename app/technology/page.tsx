import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TechnologyPage() {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        {/* Hero */}
        <section className="container py-20 md:py-28 max-w-4xl">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">THE SCIENCE OF CERTAINTY</div>
          <h1 className="section-title mb-6">Fiber Bragg Grating technology, engineered to the highest standard.</h1>
          <p className="text-2xl text-slate-300">Every BraggSense system is built on a simple principle: when light meets a precisely written grating inside an optical fiber, the reflected wavelength becomes an extraordinarily accurate and stable sensor.</p>
        </section>

        {/* How FBG Works */}
        <section className="bg-[#0f2744] py-16">
          <div className="container">
            <div className="grid md:grid-cols-12 gap-x-12 gap-y-10 items-center">
              <div className="md:col-span-5">
                <h2 className="text-3xl font-semibold tracking-tight mb-4">How Fiber Bragg Grating sensing works</h2>
                <p className="text-slate-300">A Fiber Bragg Grating is a periodic modulation of the refractive index written into the core of an optical fiber using intense UV or femtosecond laser light.</p>
              </div>
              <div className="md:col-span-7 text-slate-300 space-y-6 text-[15px] leading-relaxed">
                <p>When broadband light travels down the fiber, each grating reflects a very narrow band of wavelengths (the Bragg wavelength). Any change in strain or temperature at the grating location changes the period of the grating and shifts this reflected wavelength with extreme linearity and repeatability.</p>
                <p>BraggSense interrogators measure these wavelength shifts with sub-picometer precision — translating to microstrain and millikelvin resolution — even when hundreds of gratings are multiplexed on the same fiber over many kilometers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Measure */}
        <section className="container py-20">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">PARAMETERS WE MEASURE WITH UNMATCHED FIDELITY</div>
          <h2 className="section-title mb-12 max-w-3xl">One fiber. Many physical quantities. Zero compromises.</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { param: "Strain & Microstrain", detail: "Sub-microstrain resolution. Both static and dynamic (up to 4 kHz). Ideal for crack detection, fatigue, and load monitoring." },
              { param: "Temperature", detail: "From cryogenic (−270 °C) to high temperature (+300 °C+). Millikelvin stability over years with no drift." },
              { param: "Vibration & Acceleration", detail: "High-frequency dynamic strain for modal analysis, impact detection, and condition monitoring of rotating equipment." },
              { param: "Shape & Curvature", detail: "Multi-fiber 3D shape reconstruction for deflection monitoring of bridges, blades, and robotic structures." },
              { param: "Pressure", detail: "Via high-accuracy transducers. Used in oil & gas, hydrogen storage, and process vessels." },
              { param: "Displacement & Crack Width", detail: "Direct measurement of joint movement and crack opening with 1 µm resolution over long baselines." },
            ].map((item, i) => (
              <div key={i} className="card p-8 rounded-2xl">
                <h4 className="font-semibold text-xl tracking-tight mb-3">{item.param}</h4>
                <p className="text-slate-300 leading-relaxed text-[15px]">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why FBG vs Traditional Sensors */}
        <section className="border-y border-white/10 py-16 bg-[#0a1628]">
          <div className="container">
            <h2 className="section-title mb-10">Why FBG outperforms conventional sensing technologies</h2>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 text-[15px]">
              <div className="space-y-8">
                <div>
                  <div className="font-semibold text-white mb-2">Electromagnetic immunity</div>
                  <p className="text-slate-300">Complete immunity to EMI, RFI, high voltage, and lightning. Sensors can be installed directly on high-voltage equipment and in radar environments.</p>
                </div>
                <div>
                  <div className="font-semibold text-white mb-2">Massive multiplexing on one fiber</div>
                  <p className="text-slate-300">Hundreds of sensors per fiber. Kilometers of coverage. Dramatically lower cabling weight, cost, and installation time compared to individual point sensors.</p>
                </div>
                <div>
                  <div className="font-semibold text-white mb-2">Embeddable in composites & concrete</div>
                  <p className="text-slate-300">Sensors become a permanent part of the structure during manufacturing or construction. No surface degradation or protection issues.</p>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="font-semibold text-white mb-2">Intrinsically safe</div>
                  <p className="text-slate-300">No electrical energy at the sensing point. Certified for ATEX Zone 0/1, hydrogen, and other explosive atmospheres.</p>
                </div>
                <div>
                  <div className="font-semibold text-white mb-2">Long-term stability without recalibration</div>
                  <p className="text-slate-300">Decades of drift-free operation. The grating itself does not degrade. Critical for lifetime asset monitoring.</p>
                </div>
                <div>
                  <div className="font-semibold text-white mb-2">Harsh environment durability</div>
                  <p className="text-slate-300">Proven from the Arctic to desert pipelines, from aircraft wings to 300 °C process vessels. No electronics at the measurement location.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-20 text-center">
          <p className="text-xl max-w-lg mx-auto text-slate-300 mb-8">Ready to understand how BraggSense technology can be applied to your specific challenge?</p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg">
            Speak with our sensing specialists <ArrowRight />
          </Link>
        </section>
      </div>

      <Footer />
    </>
  );
}
