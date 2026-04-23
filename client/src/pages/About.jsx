import React from 'react';
import logo from '../components/logo.jpeg'; 
import { Gem, Heart, ShieldCheck, Star, Award, Zap, Coffee, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-28 pb-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      
      {/* --- Section 1: The Main Character Energy (Hero) --- */}
      <div className="max-w-5xl mx-auto text-center px-6 mb-24">
        <div className="mb-12 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-900">
              <img 
                src={logo} 
                alt="Occasionals Logo" 
                className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight text-gray-900 dark:text-white mb-4 uppercase">
          Occasionals<span className="text-pink-600">.</span>
        </h1>
        <p className="text-[10px] md:text-xs tracking-[0.6em] text-pink-600 dark:text-pink-400 font-black mb-8">NO BS. JUST PREMIUM DRIP.</p>
        <div className="w-24 h-1 bg-gray-900 dark:bg-white mx-auto mb-10 rounded-full"></div>
        
        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-400 italic leading-relaxed font-light">
          "Drip so real, they’ll think it’s 24K. Because your vibe shouldn't cost a fortune."
        </p>
      </div>

      {/* --- Section 2: The Kota Story (Gen-Z Vibe) --- */}
      <div className="bg-white dark:bg-gray-900 py-24 border-y border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-[10px] font-bold uppercase tracking-widest">
              Straight out of Kota 📍
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">
              The Lore <br/><span className="text-pink-600 italic">Behind the Brand</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Born in the study-vibes and student-hustle of **Kota, Rajasthan**, Occasionals started because we were tired of "aesthetic" jewelry that turns green in two days.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium italic">
              From late-night Chai sessions to becoming the official jewelry partner for your campus fests and wedding guest looks.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              We know the struggle: you want the **Grand Look** for your Instagram but have a student budget. That's why we curate Kundan, AD, and Anti-Tarnish sets that are literally fire.
            </p>
          </div>

          {/* The Black Card: The Brand Code */}
          <div className="relative">
            <div className="bg-[#121212] dark:bg-black p-10 md:p-14 rounded-[40px] shadow-2xl text-white transform md:rotate-2 border border-gray-800">
              <h3 className="font-bold text-pink-500 mb-10 uppercase tracking-[0.3em] text-[10px] flex items-center gap-3">
                <Sparkles size={18} /> THE OCCASIONALS CODE
              </h3>
              <ul className="space-y-12">
                <li className="flex gap-6">
                  <Zap size={28} className="text-pink-500 shrink-0" />
                  <div>
                    <p className="font-bold text-lg uppercase tracking-wider">Aesthetic & Durable</p>
                    <p className="text-sm text-gray-400 font-light">Water-resistant and sweat-proof because we know Kota's heat is no joke.</p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <Award size={28} className="text-pink-500 shrink-0" />
                  <div>
                    <p className="font-bold text-lg uppercase tracking-wider">Hustler Pricing</p>
                    <p className="text-sm text-gray-400 font-light">Direct-to-consumer. No middlemen. Just honest prices for the youth.</p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <Gem size={28} className="text-pink-500 shrink-0" />
                  <div>
                    <p className="font-bold text-lg uppercase tracking-wider">Curated Drip</p>
                    <p className="text-sm text-gray-400 font-light">Limited drops. Unique designs. You won't find this on every other street.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 3: Why Us? (The Hype) --- */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-gray-900 dark:text-white uppercase">The Hype is Real</h2>
          <div className="w-20 h-1.5 bg-pink-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="group p-8 rounded-[32px] hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl transition-all duration-500">
            <div className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:rotate-12">
              <Gem size={32} />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white mb-4 tracking-[0.2em] text-xs">ELITE CATALOG</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              From heavy-duty wedding sets to "quiet luxury" minimal pieces. We got it all.
            </p>
          </div>

          <div className="group p-8 rounded-[32px] hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl transition-all duration-500">
            <div className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:rotate-12">
              <Coffee size={32} />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white mb-4 tracking-[0.2em] text-xs">MADE FOR HUSTLERS</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Founded by students, for students. We understand the value of every single rupee.
            </p>
          </div>

          <div className="group p-8 rounded-[32px] hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl transition-all duration-500">
            <div className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:rotate-12">
              <Zap size={32} />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white mb-4 tracking-[0.2em] text-xs">EXPRESS VIBES</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Fast shipping from Kota across India. Because we know you need that look *ASAP*.
            </p>
          </div>
        </div>
      </div>

      {/* --- Section 4: Final Shoutout --- */}
      <div className="max-w-4xl mx-auto px-6 text-center border-t border-gray-100 dark:border-gray-800 pt-20">
        <p className="text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.5em]">
          Stay Sparkling. Stay Real.
        </p>
      </div>

    </div>
  );
};

export default About;