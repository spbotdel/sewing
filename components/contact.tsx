"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export function Contact() {
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

  return (
    <section
      ref={ref}
      id="contact"
      className="py-20 md:py-32 bg-[#F5F0E6] text-[#1A1A1A] relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-[#1A1A1A] text-[#F5F0E6] px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            СВЯЗАТЬСЯ С НАМИ
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            <span className="text-primary">КОНТАКТЫ</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-200 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}
          >
            <h3 className="font-sans font-bold text-2xl uppercase mb-6">
              ОТДЕЛ ПО РАБОТЕ С ЗАКАЗЧИКАМИ
            </h3>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1A1A1A] text-[#F5F0E6] flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-sans font-bold uppercase text-sm mb-1">
                  Телефон
                </p>
                <a
                  href="tel:+70000000000"
                  className="font-serif text-xl hover:text-primary transition-colors"
                >
                  +7 (000) 000-00-00
                </a>
              </div>
            </div>

            {/* Messengers */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <p className="font-sans font-bold uppercase text-sm mb-1">
                  Telegram / WhatsApp
                </p>
                <a
                  href="#"
                  className="font-serif text-xl hover:text-primary transition-colors"
                >
                  Написать в мессенджер
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1A1A1A] text-[#F5F0E6] flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-sans font-bold uppercase text-sm mb-1">
                  Email
                </p>
                <a
                  href="mailto:info@company.ru"
                  className="font-serif text-xl hover:text-primary transition-colors"
                >
                  info@company.ru
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-sans font-bold uppercase text-sm mb-1">
                  Адрес производства
                </p>
                <p className="font-serif text-xl">г. Москва</p>
              </div>
            </div>
          </div>

          {/* Legal Info */}
          <div
            className={`bg-[#1A1A1A] text-[#F5F0E6] p-8 md:p-10 transition-all duration-1000 delay-400 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
          >
            <h3 className="font-sans font-bold text-2xl uppercase mb-8">
              ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ
            </h3>

            <div className="space-y-6 font-serif">
              <div>
                <p className="opacity-60 text-sm uppercase mb-1">
                  Наименование
                </p>
                <p className="text-lg">{`ООО «Компания»`}</p>
              </div>
              <div>
                <p className="opacity-60 text-sm uppercase mb-1">ИНН</p>
                <p className="text-lg">0000000000</p>
              </div>
              <div>
                <p className="opacity-60 text-sm uppercase mb-1">ОГРН</p>
                <p className="text-lg">0000000000000</p>
              </div>
              <div>
                <p className="opacity-60 text-sm uppercase mb-1">
                  Юридический адрес
                </p>
                <p className="text-lg">г. Москва</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#F5F0E6]/20">
              <p className="font-serif opacity-80">
                Мы поможем вам отшить коллекцию в срок и с нужным качеством. Без
                сюрпризов. Без срывов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
