"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export function Blog() {
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

  const posts = [
    {
      title: "КАК ПОДГОТОВИТЬ ТЗ ДЛЯ ШВЕЙНОГО ПРОИЗВОДСТВА",
      category: "РУКОВОДСТВО",
      date: "Скоро",
    },
    {
      title: "5 ОШИБОК ПРИ ВЫБОРЕ ШВЕЙНОЙ ФАБРИКИ",
      category: "СОВЕТЫ",
      date: "Скоро",
    },
    {
      title: "ДАВАЛЬЧЕСКОЕ СЫРЬЁ: ПЛЮСЫ И МИНУСЫ",
      category: "АНАЛИТИКА",
      date: "Скоро",
    },
  ];

  return (
    <section
      ref={ref}
      id="blog"
      className="py-20 md:py-32 bg-[#1A1A1A] text-[#F5F0E6] relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-primary text-primary-foreground px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            ПОЛЕЗНОЕ
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            НАШ <span className="text-primary">БЛОГ</span>
          </h2>
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <article
              key={index}
              className={`group border-4 border-[#F5F0E6] p-6 md:p-8 transition-all duration-700 hover:bg-primary hover:border-primary ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {/* Category Badge */}
              <span className="inline-block bg-[#F5F0E6] text-[#1A1A1A] px-3 py-1 font-sans text-xs uppercase tracking-wider mb-4 group-hover:bg-[#1A1A1A] group-hover:text-[#F5F0E6] transition-colors">
                {post.category}
              </span>

              {/* Title */}
              <h3 className="font-sans font-bold text-xl md:text-2xl uppercase mb-4 leading-tight">
                {post.title}
              </h3>

              {/* Coming Soon */}
              <div className="flex items-center justify-between mt-8">
                <span className="font-serif opacity-60">{post.date}</span>
                <ArrowRight className="w-6 h-6 opacity-60 group-hover:translate-x-2 transition-transform" />
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter or CTA */}
        <div
          className={`mt-12 text-center transition-all duration-1000 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <p className="font-serif text-lg opacity-80">
            Контент появится в ближайшее время. Следите за обновлениями!
          </p>
        </div>
      </div>
    </section>
  );
}
