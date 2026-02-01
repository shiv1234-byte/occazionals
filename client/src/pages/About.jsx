import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Star, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Search // Hum direct Search import kar rahe hain
} from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-28 pb-20">
      {/* Hero Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block"
          >
            Redefining Fashion Consumption
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif mb-8 leading-tight"
          >
            Luxury at your <br/> <span className="italic text-gray-400">Doorstep.</span>
          </motion.h1>
        </div>
      </section>

      {/* Brand Values */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-16">
        <div className="space-y-4 text-center md:text-left">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl mx-auto md:mx-0 shadow-xl">
            <Leaf size={20} />
          </div>
          <h3 className="text-xl font-serif pt-2">Eco-Conscious</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            By promoting rentals over fast fashion, we help reduce the carbon footprint of the textile industry.
          </p>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl mx-auto md:mx-0 shadow-xl">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-xl font-serif pt-2">Pristine Quality</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Every garment undergoes a rigorous 5-step sanitization process, ensuring brand-new condition.
          </p>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl mx-auto md:mx-0 shadow-xl">
            <Star size={20} />
          </div>
          <h3 className="text-xl font-serif pt-2">Curated Style</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Our collection is hand-picked by fashion experts for your most special occasions.
          </p>
        </div>
      </section>

      {/* How it Works - Dark Section */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif mb-16 text-center">The Journey</h2>
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { icon: <Search size={24}/>, title: "1. Select", desc: "Browse our premium designer catalog." },
              { icon: <Calendar size={24}/>, title: "2. Reserve", desc: "Pick your dates. We deliver 24h early." },
              { icon: <Sparkles size={24}/>, title: "3. Celebrate", desc: "Flaunt your look and make memories." },
              { icon: <Truck size={24}/>, title: "4. Return", desc: "We'll pick it up. No cleaning needed." }
            ].map((step, i) => (
              <div key={i} className="space-y-4">
                <div className="mx-auto w-16 h-16 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all">
                  {step.icon}
                </div>
                <h4 className="font-bold uppercase tracking-widest text-[10px]">{step.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <MapPin className="mx-auto text-gray-300 mb-6" size={40} />
        <h2 className="text-3xl font-serif mb-4">Based in Delhi</h2>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="px-8 py-3 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">DTU Campus, Rohini</div>
          <div className="px-8 py-3 bg-gray-50 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">hello@occazionals.com</div>
        </div>
      </section>
    </div>
  );
};

export default About;