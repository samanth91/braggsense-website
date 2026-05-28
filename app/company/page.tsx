import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CompanyPage() {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        <section className="container py-20 max-w-3xl">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">A EUROPEAN PHOTONICS COMPANY</div>
          <h1 className="section-title mb-6">We build the most precise and reliable FBG sensing systems in the world.</h1>
          <p className="text-2xl text-slate-300">BraggSense Technologies was founded by engineers who spent years fighting the limitations of commercial FBG systems on real infrastructure and aerospace programs. We decided to build something better.</p>
        </section>

        <section className="bg-[#0f2744] py-16">
          <div className="container">
            <div className="max-w-3xl text-xl text-slate-300 space-y-6">
              <p>From the beginning, our focus has been uncompromising measurement fidelity combined with the ruggedness required for permanent installation in the real world — not laboratory conditions.</p>
              <p>Today our systems are trusted on high-speed rail networks, offshore wind farms, composite aircraft, major bridges, and critical energy infrastructure across Europe and increasingly worldwide.</p>
            </div>
          </div>
        </section>

        <section className="container py-20">
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            <div>
              <div className="text-[#00c4d4] text-sm tracking-[2px] mb-2">FOUNDED</div>
              <div className="text-5xl font-semibold tracking-tighter">2016</div>
              <div className="text-slate-400 mt-2">Jena, Germany</div>
            </div>
            <div>
              <div className="text-[#00c4d4] text-sm tracking-[2px] mb-2">TEAM</div>
              <div className="text-5xl font-semibold tracking-tighter">48</div>
              <div className="text-slate-400 mt-2">Engineers, physicists & field specialists across Germany, Netherlands & UK</div>
            </div>
            <div>
              <div className="text-[#00c4d4] text-sm tracking-[2px] mb-2">INSTALLED BASE</div>
              <div className="text-5xl font-semibold tracking-tighter">2,800+</div>
              <div className="text-slate-400 mt-2">Systems deployed on critical infrastructure worldwide</div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 py-16 bg-[#0a1628]">
          <div className="container">
            <h2 className="section-title mb-10 max-w-2xl">What sets us apart</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 text-lg text-slate-300">
              <div>We design and manufacture both the interrogators and the sensors. This complete ownership of the measurement chain is rare and allows us to deliver performance others cannot guarantee.</div>
              <div>Our support team includes physicists and structural engineers who have installed and commissioned hundreds of systems themselves. We speak the language of both the lab and the field.</div>
              <div>We maintain long-term calibration and support commitments. Many of our earliest systems are still operating with the original interrogators and sensors more than eight years later.</div>
              <div>We are independent. No pressure to sell unnecessary channels or software subscriptions. We recommend exactly what your project needs.</div>
            </div>
          </div>
        </section>

        <section id="careers" className="container py-20">
          <div className="max-w-2xl">
            <h2 className="section-title mb-6">Join the team</h2>
            <p className="text-xl text-slate-300 mb-8">We are always looking for exceptional photonics engineers, firmware developers, field application specialists, and structural monitoring experts who want to work on meaningful infrastructure and aerospace challenges.</p>
            <Link href="/contact" className="btn-primary px-8 py-4 rounded-full inline-block">View open positions</Link>
          </div>
        </section>

        <section id="news" className="bg-[#0f2744] py-16">
          <div className="container">
            <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">RECENT HIGHLIGHTS</div>
            <h2 className="section-title mb-10">News &amp; technical insights</h2>

            <div className="space-y-8 max-w-3xl text-lg">
              <div>
                <div className="text-sm text-slate-400 mb-1">March 2025</div>
                <div className="font-semibold text-white">BraggSense BS-4000 selected for major European high-speed rail monitoring program</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">January 2025</div>
                <div className="font-semibold text-white">New femtosecond-written high-temperature FBG sensors qualified to 300 °C continuous operation</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">November 2024</div>
                <div className="font-semibold text-white">BraggSense opens dedicated UK technical support center in Bristol</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
