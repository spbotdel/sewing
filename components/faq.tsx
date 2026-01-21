"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Gear } from "./gear";

export function FAQ() {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

  const faqs = [
    {
      q: "Можно ли приехать на производство?",
      a: "Да, по предварительному согласованию. Фото/видео без постановки — мы ничего не скрываем.",
    },
    {
      q: "Вы помогаете с закупкой ткани?",
      a: "Нет, мы специализируемся на пошиве на давальческом сырье. Вы контролируете материалы — мы контролируем производство.",
    },
    {
      q: "Можно ли начать с небольшой партии?",
      a: "Наш минимальный заказ — от 1 млн ₽. Это обеспечивает фокус на стабильности и качестве.",
    },
    {
      q: "Вы работаете с маркетплейсами?",
      a: "Да, мы сотрудничаем с селлерами WB / Ozon и понимаем специфику их работы — сроки, упаковка, маркировка.",
    },
    {
      q: "Какие сроки производства?",
      a: "Сроки зависят от объёма и сложности заказа. Точные сроки обсуждаются после получения ТЗ и расчёта.",
    },
  ];

  return (
    <section
      ref={ref}
      id="faq"
      className="py-20 md:py-32 bg-[#1A1A1A] text-[#F5F0E6] relative overflow-hidden"
    >
      {/* Gear decoration */}
      <div className="absolute bottom-20 left-10 opacity-10">
        <Gear size={150} color="#F5F0E6" speed={0.3} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-primary text-primary-foreground px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            ВОПРОСЫ
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            ЧАСТО <span className="text-primary">ЗАДАВАЕМЫЕ</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-4 border-[#F5F0E6] transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <button
                type="button"
                className="w-full p-6 flex items-center justify-between text-left hover:bg-[#F5F0E6]/10 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-sans font-bold text-lg md:text-xl uppercase pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-48" : "max-h-0"}`}
              >
                <p className="px-6 pb-6 font-serif text-lg opacity-80">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
