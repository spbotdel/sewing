"use client";

import { useEffect, useRef, useState } from "react";
import { Gear } from "./gear";

export function WorkFormat() {
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

  const formats = [
    {
      title: "ДАВАЛЬЧЕСКОЕ СЫРЬЁ",
      desc: "Вы контролируете материалы, мы — производство",
      icon: "📦",
    },
    {
      title: "СРОКИ И КАЧЕСТВО",
      desc: "Соблюдение стандартов — без компромиссов",
      icon: "⏱",
    },
    {
      title: "ПРОЗРАЧНОСТЬ",
      desc: "Договор, предоплата, контроль на каждом этапе",
      icon: "📋",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 bg-[#1A1A1A] text-[#F5F0E6] relative overflow-hidden"
    >
      {/* Single gear decoration */}
      <div className="absolute top-10 right-10 opacity-10">
        <Gear size={200} color="#F5F0E6" reverse speed={0.2} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-primary text-primary-foreground px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            ФОРМАТ СОТРУДНИЧЕСТВА
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            КАК МЫ <span className="text-primary">РАБОТАЕМ</span>
          </h2>
        </div>

        {/* Format Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {formats.map((format, index) => (
            <div
              key={index}
              className={`border-4 border-[#F5F0E6] p-8 transition-all duration-1000 hover:bg-primary hover:border-primary group ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="text-5xl mb-6">{format.icon}</div>
              <h3 className="font-sans font-bold text-xl md:text-2xl uppercase mb-4">
                {format.title}
              </h3>
              <p className="font-serif text-lg opacity-80 group-hover:opacity-100">
                {format.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
