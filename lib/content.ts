// Centralized content for easy editing and future CMS migration
export const siteConfig = {
  company: {
    name: "BraggSense Technologies",
    shortName: "BraggSense",
    tagline: "Precision Fiber Bragg Grating Sensing",
    description: "High-resolution FBG interrogators and complete fiber optic sensor systems for structural health monitoring, rail, energy, aerospace, and industrial applications.",
    location: "Germany · Netherlands · United Kingdom",
  },

  hero: {
    headline: "Certainty Through Light",
    subheadline: "High-resolution fiber Bragg grating interrogators and sensor systems engineered for the most demanding environments on Earth.",
    ctaPrimary: "Explore Products",
    ctaSecondary: "How It Works",
  },

  advantages: [
    {
      title: "Sub-picometer resolution",
      desc: "Industry-leading wavelength precision delivers microstrain and millikelvin accuracy across hundreds of sensors on a single fiber.",
    },
    {
      title: "Harsh environment proven",
      desc: "Operates reliably from −60 °C to +300 °C, in explosive atmospheres, high-voltage fields, and corrosive conditions where electronics fail.",
    },
    {
      title: "Massive multiplexing",
      desc: "Up to 128 sensors per channel. Kilometers of coverage with a single interrogator. Dramatically reduced cabling and installation cost.",
    },
    {
      title: "Long-term stability",
      desc: "Decades of drift-free operation. No recalibration required. The sensor becomes a permanent, maintenance-free part of the asset.",
    },
    {
      title: "Intrinsic safety",
      desc: "Purely optical. No spark risk in gas, oil, or hydrogen environments. ATEX and IECEx certified systems available.",
    },
    {
      title: "German engineering",
      desc: "Designed and manufactured in Europe to the highest standards of precision, reliability, and traceability.",
    },
  ],

  applications: [
    {
      title: "Rail & Transportation",
      desc: "Continuous monitoring of track, switches, overhead lines, and rolling stock. Early detection of defects before service disruption.",
      image: "/images/bridge-monitoring.jpg",
      href: "/solutions#rail",
    },
    {
      title: "Civil Infrastructure",
      desc: "Bridges, tunnels, dams, and high-rise structures. Real-time strain, crack, and shape monitoring with unprecedented spatial density.",
      image: "/images/bridge-monitoring.jpg",
      href: "/solutions#civil",
    },
    {
      title: "Energy & Wind",
      desc: "Blade load monitoring, tower fatigue, substation temperature, and pipeline integrity. Maximize uptime and lifetime.",
      image: "/images/wind-turbine.jpg",
      href: "/solutions#energy",
    },
    {
      title: "Aerospace & Defense",
      desc: "Embedded structural health monitoring in composite airframes, engine components, and ground systems. Weight savings with certainty.",
      image: "/images/aerospace-composite.jpg",
      href: "/solutions#aerospace",
    },
    {
      title: "Oil, Gas & Hydrogen",
      desc: "Distributed temperature and strain for pipelines, well integrity, and storage. Intrinsically safe by design.",
      image: "/images/wind-turbine.jpg",
      href: "/solutions#oil-gas",
    },
    {
      title: "Industrial & Process",
      desc: "High-temperature process vessels, semiconductor equipment, and heavy machinery. Precision where conventional sensors cannot survive.",
      image: "/images/interrogator.jpg",
      href: "/solutions#industrial",
    },
  ],

  products: [
    {
      name: "BS-4000 Interrogator",
      type: "High-Speed 4-Channel",
      specs: "1 pm resolution • 4 kHz sampling • 128 sensors/channel",
      description: "Flagship high-speed interrogator for dynamic measurements in rail, aerospace, and vibration-critical applications.",
      image: "/images/interrogator.jpg",
    },
    {
      name: "BS-1000 Interrogator",
      type: "Precision 8-Channel",
      specs: "0.5 pm resolution • 100 Hz sampling • 256 sensors/channel",
      description: "The workhorse for long-term structural health monitoring projects requiring maximum sensor density and stability.",
      image: "/images/interrogator.jpg",
    },
    {
      name: "EpsilonSensor Array",
      type: "Surface & Embedded FBG",
      specs: "Strain & temperature • Up to 80 m length • Custom spacing",
      description: "Rugged composite-packaged FBG sensor chains. The highest strain transfer and crack detection capability available.",
      image: "/images/interrogator.jpg",
    },
    {
      name: "BraggSoft Platform",
      type: "Data & Analytics",
      specs: "Real-time • Edge + Cloud • API & dashboards",
      description: "Complete software suite for configuration, visualization, alerting, and integration with existing SCADA and digital twin systems.",
      image: "/images/interrogator.jpg",
    },
  ],
};
