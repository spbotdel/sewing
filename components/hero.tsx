"use client";

import { useEffect, useState } from "react";
import { Gear } from "./gear";
import { SewingMachine } from "./sewing-machine";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-secondary text-secondary-foreground overflow-hidden pt-16 md:pt-20">
      {/* Diagonal Red Block */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-primary origin-top-right"
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />

      {/* Single Gear - scroll animated */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{ left: "calc(56% - 60px)", top: "calc(74% + 90px)" }}
      >
        <Gear size={180} color="#F5F0E6" speed={0.4} />
      </div>

      {/* Sewing Machine illustration */}
      <div className="absolute bottom-32 right-10 md:right-20 w-48 md:w-72 opacity-30">
        <SewingMachine color="#1A1A1A" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl">
          {/* Slogan Top */}
          <div
            className={`transition-all duration-1000 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
          >
            <span className="inline-block bg-primary text-primary-foreground px-4 py-2 font-sans text-sm md:text-base uppercase tracking-widest mb-6">
              КОНТРАКТНОЕ ШВЕЙНОЕ ПРОИЗВОДСТВО
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`font-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase leading-none mb-6 transition-all duration-1000 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <span className="block text-secondary-foreground">СЕРИЙНЫЙ</span>
            <span className="block text-primary poster-shadow">
              ПОШИВ
            </span>
            <span className="block text-secondary-foreground text-3xl sm:text-4xl md:text-5xl mt-2">
              В МОСКВЕ
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`font-serif text-lg md:text-xl lg:text-2xl max-w-2xl mb-6 leading-relaxed transition-all duration-1000 delay-400 ${mounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            РАБОТАЕМ НА ДАВАЛЬЧЕСКОМ СЫРЬЕ. СТАБИЛЬНОЕ КАЧЕСТВО И СРОКИ ДЛЯ
            БРЕНДОВ, МАРКЕТПЛЕЙС-СЕЛЛЕРОВ И КОРПОРАТИВНЫХ КЛИЕНТОВ.
          </p>

          {/* Minimum order */}
          <div
            className={`inline-block bg-secondary-foreground text-secondary px-6 py-3 mb-8 transition-all duration-1000 delay-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <span className="font-sans font-bold text-xl md:text-2xl">
              МИНИМАЛЬНЫЙ ЗАКАЗ — ОТ 1 000 000 ₽
            </span>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${mounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <a
              href="#application"
              className="bg-primary text-primary-foreground px-8 py-4 font-sans font-bold uppercase tracking-wider text-center text-lg border-4 border-primary hover:bg-transparent hover:text-primary transition-all"
            >
              ОСТАВИТЬ ЗАЯВКУ НА РАСЧЁТ
            </a>
            <a
              href="#process"
              className="bg-transparent text-secondary-foreground px-8 py-4 font-sans font-bold uppercase tracking-wider text-center text-lg border-4 border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-all"
            >
              КАК МЫ РАБОТАЕМ
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 right-4 md:right-10 flex flex-col items-center gap-2">
          <span
            className="font-sans text-xs uppercase tracking-widest writing-mode-vertical opacity-60"
            style={{ writingMode: "vertical-rl" }}
          >
            ПРОКРУТИТЕ ВНИЗ
          </span>
          <div className="w-0.5 h-16 bg-secondary-foreground/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-primary animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom Stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary" />
    </section>
  );
}
