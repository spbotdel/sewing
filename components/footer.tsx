"use client";

import { Gear } from "./gear";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#F5F0E6] py-12 relative overflow-hidden">
      {/* Gear decoration */}
      <div className="absolute -bottom-20 -right-20 opacity-5">
        <Gear size={200} color="#F5F0E6" speed={0.1} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <path
                    d="M20 5 L35 15 L35 30 L20 35 L5 30 L5 15 Z"
                    fill="none"
                    stroke="#F5F0E6"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 18 L20 28 L28 18"
                    fill="none"
                    stroke="#F5F0E6"
                    strokeWidth="2.5"
                  />
                  <circle cx="20" cy="12" r="3" fill="#F5F0E6" />
                </svg>
              </div>
              <span className="font-sans font-bold text-xl tracking-wider">
                ПРОИЗВОДСТВО
              </span>
            </div>
            <p className="font-serif opacity-70 max-w-md">
              Контрактное швейное производство в Москве. Серийный пошив для
              брендов, маркетплейс-селлеров и корпоративных клиентов.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-bold uppercase text-sm tracking-wider mb-4">
              Навигация
            </h4>
            <nav className="space-y-2">
              <a
                href="#target"
                className="block font-serif opacity-70 hover:opacity-100 hover:text-primary transition-all"
              >
                Кому подходим
              </a>
              <a
                href="#services"
                className="block font-serif opacity-70 hover:opacity-100 hover:text-primary transition-all"
              >
                Специализация
              </a>
              <a
                href="#process"
                className="block font-serif opacity-70 hover:opacity-100 hover:text-primary transition-all"
              >
                Процесс работы
              </a>
              <a
                href="#faq"
                className="block font-serif opacity-70 hover:opacity-100 hover:text-primary transition-all"
              >
                FAQ
              </a>
              <a
                href="#blog"
                className="block font-serif opacity-70 hover:opacity-100 hover:text-primary transition-all"
              >
                Блог
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans font-bold uppercase text-sm tracking-wider mb-4">
              Контакты
            </h4>
            <div className="space-y-2 font-serif">
              <p className="opacity-70">+7 (000) 000-00-00</p>
              <p className="opacity-70">info@company.ru</p>
              <p className="opacity-70">г. Москва</p>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-4">
              {["TG", "WA", "VK"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 border-2 border-[#F5F0E6]/30 flex items-center justify-center font-sans text-xs font-bold hover:bg-primary hover:border-primary transition-all"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F5F0E6]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-serif text-sm opacity-60">
            {`© ${new Date().getFullYear()} ООО «Компания». Все права защищены.`}
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="font-serif text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              className="font-serif text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              Оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
