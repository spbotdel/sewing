"use client";

import { useEffect, useRef, useState } from "react";

export function Specialization() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const weDoItems = [
    { name: "Куртки", desc: "Зимние, демисезонные" },
    { name: "Ветровки", desc: "И лёгкие парки" },
    { name: "Трикотаж", desc: "Спортивный и повседневный" },
    { name: "Толстовки", desc: "Худи, комплекты" },
  ];

  const weDontItems = [
    "Единичные изделия, пилотные модели",
    "Мелкие партии без последующего тиража",
    "Экспериментальные проекты без ТЗ и расчётов",
  ];

  return (
    <section
      ref={ref}
      id="services"
      className="py-20 md:py-32 bg-[#F5F0E6] text-[#1A1A1A] relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-primary text-primary-foreground px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            ЧТО МЫ ШЬЁМ
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            СПЕЦИАЛИЗАЦИЯ <span className="text-primary">ПРОИЗВОДСТВА</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* We DO */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}
          >
            <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase mb-8 flex items-center gap-4">
              <span className="w-12 h-12 bg-[#1A1A1A] text-[#F5F0E6] flex items-center justify-center text-2xl">
                +
              </span>
              ОСНОВНЫЕ ИЗДЕЛИЯ
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {weDoItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#1A1A1A] text-[#F5F0E6] p-6 hover:bg-primary transition-colors group"
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {/* Constructivist Icon */}
                  <div className="w-16 h-16 mb-4 relative">
                    <svg viewBox="0 0 64 64" className="w-full h-full">
                      {index === 0 && (
                        // Winter Jacket - puffy with collar and zipper
                        <>
                          {/* Body with puffy look */}
                          <path d="M18 20 L14 54 L26 54 L26 38 L38 38 L38 54 L50 54 L46 20" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Sleeves */}
                          <path d="M18 20 L8 24 L10 44 L18 42" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path d="M46 20 L56 24 L54 44 L46 42" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Collar */}
                          <path d="M18 20 L24 12 L32 16 L40 12 L46 20" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Zipper */}
                          <line x1="32" y1="20" x2="32" y2="54" stroke="#CC0000" strokeWidth="2" />
                          {/* Horizontal quilting lines */}
                          <line x1="16" y1="30" x2="48" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                          <line x1="15" y1="42" x2="49" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                        </>
                      )}
                      {index === 1 && (
                        // Windbreaker - light jacket with hood and diagonal zip
                        <>
                          {/* Body */}
                          <path d="M20 22 L16 54 L28 54 L28 40 L36 40 L36 54 L48 54 L44 22" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Sleeves */}
                          <path d="M20 22 L10 26 L12 46 L18 44" fill="none" stroke="currentColor" strokeWidth="2.5" />
                          <path d="M44 22 L54 26 L52 46 L46 44" fill="none" stroke="currentColor" strokeWidth="2.5" />
                          {/* Hood */}
                          <path d="M20 22 L24 10 L32 8 L40 10 L44 22" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path d="M26 14 Q32 12 38 14" fill="none" stroke="currentColor" strokeWidth="2" />
                          {/* Diagonal zipper */}
                          <line x1="24" y1="22" x2="38" y2="50" stroke="#CC0000" strokeWidth="2" />
                          {/* Wind flap */}
                          <line x1="32" y1="24" x2="32" y2="38" stroke="currentColor" strokeWidth="1.5" />
                        </>
                      )}
                      {index === 2 && (
                        // Knitwear/Sweater - with ribbed texture
                        <>
                          {/* Body */}
                          <path d="M18 18 L18 54 L46 54 L46 18" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Sleeves */}
                          <path d="M18 18 L6 22 L8 42 L18 40" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path d="M46 18 L58 22 L56 42 L46 40" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Neck */}
                          <path d="M18 18 L26 12 L38 12 L46 18" fill="none" stroke="currentColor" strokeWidth="3" />
                          <ellipse cx="32" cy="16" rx="8" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
                          {/* Ribbed texture lines */}
                          <line x1="22" y1="24" x2="22" y2="50" stroke="currentColor" strokeWidth="1" />
                          <line x1="27" y1="24" x2="27" y2="50" stroke="currentColor" strokeWidth="1" />
                          <line x1="32" y1="24" x2="32" y2="50" stroke="#CC0000" strokeWidth="1.5" />
                          <line x1="37" y1="24" x2="37" y2="50" stroke="currentColor" strokeWidth="1" />
                          <line x1="42" y1="24" x2="42" y2="50" stroke="currentColor" strokeWidth="1" />
                          {/* Bottom ribbing */}
                          <rect x="18" y="50" width="28" height="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </>
                      )}
                      {index === 3 && (
                        // Hoodie - with hood, front pocket, drawstrings
                        <>
                          {/* Body */}
                          <path d="M18 24 L16 54 L48 54 L46 24" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Sleeves */}
                          <path d="M18 24 L8 28 L10 46 L18 44" fill="none" stroke="currentColor" strokeWidth="2.5" />
                          <path d="M46 24 L56 28 L54 46 L46 44" fill="none" stroke="currentColor" strokeWidth="2.5" />
                          {/* Hood */}
                          <path d="M18 24 L20 14 L26 8 L38 8 L44 14 L46 24" fill="none" stroke="currentColor" strokeWidth="3" />
                          {/* Hood opening */}
                          <ellipse cx="32" cy="20" rx="10" ry="6" fill="none" stroke="currentColor" strokeWidth="2" />
                          {/* Kangaroo pocket */}
                          <path d="M22 40 L22 50 L42 50 L42 40 Q32 36 22 40" fill="none" stroke="#CC0000" strokeWidth="2" />
                          {/* Drawstrings */}
                          <line x1="28" y1="24" x2="26" y2="34" stroke="currentColor" strokeWidth="1.5" />
                          <line x1="36" y1="24" x2="38" y2="34" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="26" cy="35" r="2" fill="currentColor" />
                          <circle cx="38" cy="35" r="2" fill="currentColor" />
                        </>
                      )}
                    </svg>
                  </div>
                  <h4 className="font-sans font-bold text-xl uppercase mb-2">
                    {item.name}
                  </h4>
                  <p className="font-serif opacity-80 group-hover:opacity-100">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* We DON'T */}
          <div
            className={`transition-all duration-1000 delay-400 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
          >
            <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase mb-8 flex items-center gap-4">
              <span className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-2xl">
                —
              </span>
              НЕ БЕРЁМ В РАБОТУ
            </h3>
            <div className="space-y-4">
              {weDontItems.map((item, index) => (
                <div
                  key={index}
                  className="border-4 border-[#1A1A1A] p-6 flex items-center gap-4 bg-[#E8E0D0]"
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <span className="text-primary font-bold text-3xl">×</span>
                  <span className="font-serif text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
