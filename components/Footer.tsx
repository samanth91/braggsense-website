import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-white/10 pt-16 pb-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/images/companylogo.jpeg" 
                alt="BraggSense Technologies" 
                className="h-8 w-auto object-contain"
              />
              <span className="font-semibold text-2xl tracking-[-0.02em]">BraggSense</span>
            </div>
            <p className="max-w-sm text-slate-400 text-[15px] leading-relaxed">
              Precision fiber Bragg grating sensing systems. Engineered in Europe for the world's most demanding monitoring applications.
            </p>
            <div className="mt-6 text-sm text-slate-500">
              © {new Date().getFullYear()} BraggSense Technologies GmbH. All rights reserved.
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 text-sm">
            <div className="font-semibold tracking-wider text-xs text-slate-400 mb-4">COMPANY</div>
            <div className="space-y-2.5">
              <Link href="/company" className="footer-link block text-slate-300">About Us</Link>
              <Link href="/technology" className="footer-link block text-slate-300">Technology</Link>
              <Link href="/company#careers" className="footer-link block text-slate-300">Careers</Link>
              <Link href="/company#news" className="footer-link block text-slate-300">News & Insights</Link>
            </div>
          </div>

          <div className="md:col-span-4 text-sm">
            <div className="font-semibold tracking-wider text-xs text-slate-400 mb-4">PRODUCTS & SUPPORT</div>
            <div className="space-y-2.5">
              <Link href="/products" className="footer-link block text-slate-300">Interrogators & Systems</Link>
              <Link href="/products" className="footer-link block text-slate-300">FBG Sensors</Link>
              <Link href="/solutions" className="footer-link block text-slate-300">Applications</Link>
              <Link href="/contact" className="footer-link block text-slate-300">Technical Support</Link>
              <Link href="/contact" className="footer-link block text-slate-300">Request a Quote</Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-[13px] text-slate-500 leading-relaxed">
              Germany · Netherlands · United Kingdom<br />
              Serving clients worldwide
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 md:items-center justify-between text-xs text-slate-500">
          <div className="flex gap-6">
            <Link href="#" className="footer-link">Privacy Policy</Link>
            <Link href="#" className="footer-link">Legal Notice</Link>
            <Link href="#" className="footer-link">Imprint</Link>
          </div>
          <div>
            Precision matters. Every wavelength. Every measurement.
          </div>
        </div>
      </div>
    </footer>
  );
}
