"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

export function TargetAudience() {
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

  const weAreFor = [
    "Бренд одежды, стремящийся к масштабированию",
    "Селлер WB / Ozon, готовый увеличить объёмы",
    "Корпоративный заказчик с потребностью в стабильных поставках",
    "Работаете с серийным производством и понимаете его специфику",
    "Готовы к партнёрству в формате B2B",
  ];

  const weAreNotFor = [
    "Частное лицо или ателье",
    "Планируете первую пробную партию до 1 млн ₽",
    "Ищете гибкость вместо стабильности",
    "Не сформировали ТЗ / лекала / понимание объёмов",
  ];

  return (
    <section
      ref={ref}
      id="target"
      className="py-20 md:py-32 bg-[#F5F0E6] text-[#1A1A1A] relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-[#1A1A1A] text-[#F5F0E6] px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            ОПРЕДЕЛИТЕ СЕБЯ
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            КОМУ МЫ{" "}
            <span className="text-primary">ПОДХОДИМ</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* We are FOR */}
          <div
            className={`bg-[#1A1A1A] text-[#F5F0E6] p-8 md:p-10 transition-all duration-1000 delay-200 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary flex items-center justify-center">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>
              <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase">
                МЫ ПОДХОДИМ
              </h3>
            </div>
            <ul className="space-y-4">
              {weAreFor.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 font-serif text-lg"
                  style={{
                    transitionDelay: `${300 + index * 100}ms`,
                  }}
                >
                  <span className="text-primary font-bold text-2xl leading-none">
                    +
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* We are NOT for */}
          <div
            className={`bg-primary text-[#F5F0E6] p-8 md:p-10 transition-all duration-1000 delay-400 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#1A1A1A] flex items-center justify-center">
                <X className="w-10 h-10" strokeWidth={3} />
              </div>
              <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase">
                МЫ НЕ ПОДХОДИМ
              </h3>
            </div>
            <ul className="space-y-4">
              {weAreNotFor.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 font-serif text-lg"
                  style={{
                    transitionDelay: `${500 + index * 100}ms`,
                  }}
                >
                  <span className="text-[#1A1A1A] font-bold text-2xl leading-none">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div
          className={`mt-12 p-6 border-4 border-[#1A1A1A] bg-[#E8E0D0] transition-all duration-1000 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <p className="font-serif text-lg md:text-xl text-center">
            <span className="font-bold">МЫ СПЕЦИАЛИЗИРУЕМСЯ</span> на серийном
            пошиве для устойчивого бизнеса. Это позволяет нам держать стабильные
            сроки и высокое качество.
          </p>
        </div>
      </div>
    </section>
  );
}
