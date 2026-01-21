"use client";

import { useEffect, useRef, useState } from "react";
import { SewingMachine } from "./sewing-machine";

export function Process() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      num: "01",
      title: "ЗАЯВКА С ТЗ",
      desc: "Вы отправляете техническое задание или описание — мы делаем расчёт сроков и стоимости",
    },
    {
      num: "02",
      title: "ПРОСЧЁТ И ОБСУЖДЕНИЕ",
      desc: "Обсуждаем объёмы, требования, согласовываем партии и этапы",
    },
    {
      num: "03",
      title: "ДОГОВОР",
      desc: "Прозрачные условия, официальное оформление, предоплата",
    },
    {
      num: "04",
      title: "ПРОИЗВОДСТВО",
      desc: "Запуск пошива в согласованные сроки с контролем качества",
    },
    {
      num: "05",
      title: "КОНТРОЛЬ КАЧЕСТВА",
      desc: "Каждая партия проходит проверку перед отгрузкой",
    },
    {
      num: "06",
      title: "ДОСТАВКА",
      desc: "Организуем выдачу/доставку партии удобным способом",
    },
  ];

  return (
    <section
      ref={ref}
      id="process"
      className="py-20 md:py-32 bg-primary text-[#F5F0E6] relative overflow-hidden"
    >
      {/* Sewing Machine Decoration */}
      <div className="absolute bottom-10 right-10 w-64 opacity-20 hidden lg:block">
        <SewingMachine color="#F5F0E6" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-[#1A1A1A] text-[#F5F0E6] px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            ЭТАПЫ РАБОТЫ
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            ПРОСТАЯ И <span className="text-[#1A1A1A]">ЧЕСТНАЯ</span> СХЕМА
          </h2>
          <p className="font-serif text-xl mt-6 max-w-2xl mx-auto opacity-90">
            Вы знаете, за что платите, и что получите
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative bg-[#1A1A1A] p-6 md:p-8 transition-all duration-700 hover:translate-y-[-4px] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary flex items-center justify-center">
                <span className="font-sans font-bold text-2xl">{step.num}</span>
              </div>

              <div className="pt-8">
                <h3 className="font-sans font-bold text-xl uppercase mb-4">
                  {step.title}
                </h3>
                <p className="font-serif opacity-80">{step.desc}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && index !== 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-primary" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div
          className={`mt-12 text-center transition-all duration-1000 delay-800 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <p className="font-serif text-lg inline-flex items-center gap-3">
            <span className="w-8 h-1 bg-[#F5F0E6]" />
            МЫ ВСЕГДА НА СВЯЗИ: можно уточнить статус заказа или приехать на
            производство
            <span className="w-8 h-1 bg-[#F5F0E6]" />
          </p>
        </div>
      </div>
    </section>
  );
}
