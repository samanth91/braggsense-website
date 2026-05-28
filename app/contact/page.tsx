"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Please enter your organization"),
  role: z.string().optional(),
  application: z.string().min(3, "Please briefly describe your application"),
  timeline: z.string().optional(),
  message: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      toast.success("Thank you. Our team will contact you within one business day.", {
        description: "A confirmation has been sent to your email.",
      });

      reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", {
        description: "Please try again or email us directly at nagulapallysamanth@gmail.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-20">
        <section className="container py-16 md:py-20 max-w-3xl">
          <div className="uppercase tracking-[3px] text-xs text-[#00c4d4] mb-4">LET'S DISCUSS YOUR PROJECT</div>
          <h1 className="section-title mb-6">Tell us about the measurement challenge you are facing.</h1>
          <p className="text-2xl text-slate-300">Our sensing specialists typically respond within one business day. For urgent infrastructure or safety-critical inquiries, call us directly.</p>

          <div className="mt-8 text-sm text-slate-400">
            Germany +49 3641 5547-0 &nbsp;•&nbsp; Netherlands +31 20 808 3921 &nbsp;•&nbsp; UK +44 117 456 2210
          </div>
        </section>

        <section className="bg-[#0f2744] py-12">
          <div className="container max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-slate-300">Full name</label>
                  <input {...register("name")} className="input w-full rounded-xl px-5 py-3.5" placeholder="Alexandra Weber" />
                  {errors.name && <p className="text-red-400 text-sm mt-1.5">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-2 text-slate-300">Work email</label>
                  <input type="email" {...register("email")} className="input w-full rounded-xl px-5 py-3.5" placeholder="you@company.com" />
                  {errors.email && <p className="text-red-400 text-sm mt-1.5">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-slate-300">Organization</label>
                  <input {...register("company")} className="input w-full rounded-xl px-5 py-3.5" placeholder="Deutsche Bahn Netz" />
                  {errors.company && <p className="text-red-400 text-sm mt-1.5">{errors.company.message}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-2 text-slate-300">Role / Title</label>
                  <input {...register("role")} className="input w-full rounded-xl px-5 py-3.5" placeholder="Lead Structural Engineer" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-300">Primary application / industry</label>
                <input {...register("application")} className="input w-full rounded-xl px-5 py-3.5" placeholder="High-speed rail bridge monitoring — 8 spans, 1.4 km total length" />
                {errors.application && <p className="text-red-400 text-sm mt-1.5">{errors.application.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-slate-300">Expected timeline</label>
                  <select {...register("timeline")} className="input w-full rounded-xl px-5 py-3.5 text-white">
                    <option value="">Select...</option>
                    <option value="Immediate (next 4 weeks)">Immediate (next 4 weeks)</option>
                    <option value="1–3 months">1–3 months</option>
                    <option value="3–6 months">3–6 months</option>
                    <option value="Exploratory / budgeting phase">Exploratory / budgeting phase</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-slate-300">Number of measurement points (approx)</label>
                  <input className="input w-full rounded-xl px-5 py-3.5" placeholder="e.g. 180 sensors, 12 km of fiber" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-slate-300">Additional details or questions</label>
                <textarea {...register("message")} rows={5} className="input w-full rounded-2xl px-5 py-4 resize-y min-h-[120px]" placeholder="We are particularly interested in dynamic strain capability at 2 kHz and long-term drift performance over 10+ years..." />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full md:w-auto mt-4 px-14 py-4 rounded-full text-lg font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Sending inquiry..." : "Submit inquiry"}
                {!isSubmitting && <ArrowRight />}
              </button>

              <p className="text-xs text-slate-400 pt-2">Your information is treated confidentially. We never share project details without explicit permission.</p>
            </form>
          </div>
        </section>

        <section className="container py-16">
          <div className="max-w-2xl text-sm text-slate-400">
            <strong className="text-slate-300">Headquarters</strong><br />
            BraggSense Technologies GmbH<br />
            Hans-Knöll-Straße 6<br />
            07745 Jena, Germany<br /><br />
            For urgent safety or operational matters, please call +49 3641 5547-0 (24h emergency line for existing customers).
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
