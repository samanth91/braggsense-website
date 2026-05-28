import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const solutions = [
  {
    id: "rail",
    title: "Rail & Transportation",
    description: "Continuous, distributed monitoring of tracks, switches, overhead catenary, tunnels, and rolling stock. Detect defects before they cause service disruption or safety incidents.",
    benefits: ["Early detection of track geometry changes and rail breaks", "Switch heating and point machine condition monitoring", "Overhead line tension and temperature in real time", "Axle load and wheel impact monitoring"],
    image: "/images/bridge-monitoring.jpg",
  },
  {
    id: "civil",
    title: "Civil Infrastructure & Structural Health",
    description: "The most precise structural health monitoring available for bridges, tunnels, dams, high-rise buildings, and geotechnical assets. From construction through decades of service.",
    benefits: ["Distributed strain and crack detection with millimeter spatial resolution", "Long-term deflection and shape monitoring", "Pre-stressing force and post-tension monitoring", "Seismic and vibration response characterization"],
    image: "/images/bridge-monitoring.jpg",
  },
  {
    id: "energy",
    title: "Energy, Wind & Power",
    description: "Maximize asset lifetime and availability in wind turbines, substations, transformers, and pipelines. The only sensing technology that survives decades inside blades and high-voltage environments.",
    benefits: ["Blade load, fatigue, and damage monitoring", "Tower base strain and foundation movement", "Transformer and cable hot-spot temperature", "Pipeline leak and third-party intrusion detection"],
    image: "/images/wind-turbine.jpg",
  },
  {
    id: "aerospace",
    title: "Aerospace & Defense",
    description: "Embedded and surface-mounted FBG systems for composite structures, engine components, and ground support equipment. Proven on flight test and operational aircraft.",
    benefits: ["In-flight load and strain monitoring", "Impact and damage detection in composites", "Engine component temperature and vibration", "Ground test and structural certification programs"],
    image: "/images/aerospace-composite.jpg",
  },
  {
    id: "oil-gas",
    title: "Oil, Gas & Hydrogen",
    description: "Intrinsically safe distributed temperature and strain monitoring for pipelines, wellbores, storage, and processing facilities. The technology of choice where electronics cannot go.",
    benefits: ["Pipeline leak and strain detection over hundreds of kilometers", "Well integrity and sand production monitoring", "Hydrogen storage and transport safety systems", "Refinery and LNG terminal fire and overheat detection"],
    image: "/images/wind-turbine.jpg",
  },
  {
    id: "industrial",
    title: "Industrial & Process Manufacturing",
    description: "Precision monitoring inside high-temperature vessels, semiconductor equipment, heavy machinery, and hazardous process environments where conventional sensors fail within weeks.",
    benefits: ["Furnace and reactor lining monitoring", "High-voltage and electromagnetic environments", "Rotating machinery and large structure vibration", "Cleanroom and semiconductor tool integration"],
    image: "/images/interrogator.jpg",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        <section className="container py-20 md:py-24 max-w-4xl">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">APPLICATIONS ACROSS CRITICAL INDUSTRIES</div>
          <h1 className="section-title mb-6">We protect the assets that societies and industries cannot afford to fail.</h1>
          <p className="text-2xl text-slate-300">From high-speed rail networks to offshore wind farms and composite aircraft, BraggSense systems deliver the data that enables confident, condition-based decisions.</p>
        </section>

        {solutions.map((sol, index) => (
          <section key={index} id={sol.id} className="border-t border-white/10 py-16">
            <div className="container">
              <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
                <div className="lg:col-span-7">
                  <h2 className="text-4xl font-semibold tracking-tighter mb-6">{sol.title}</h2>
                  <p className="text-xl text-slate-300 mb-8">{sol.description}</p>

                  <ul className="space-y-3 mb-10">
                    {sol.benefits.map((b, i) => (
                      <li key={i} className="flex gap-3 text-lg text-slate-200">
                        <span className="text-[#00c4d4] mt-1.5">→</span> {b}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="inline-flex items-center gap-2 text-[#00c4d4] hover:text-white font-medium group">
                    Discuss this application with our team <ArrowRight className="group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-3xl overflow-hidden border border-white/10">
                    <img src={sol.image} alt={sol.title} className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="container py-16 text-center border-t border-white/10">
          <p className="text-xl text-slate-300 max-w-lg mx-auto mb-8">Your application may not fit neatly into one category. Our team routinely designs custom sensor layouts and interrogator configurations for unique challenges.</p>
          <Link href="/contact" className="btn-primary px-10 py-4 rounded-full text-lg inline-flex items-center gap-2">
            Start a conversation
          </Link>
        </section>
      </div>

      <Footer />
    </>
  );
}
