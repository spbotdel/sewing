"use client";

import React from "react"

import { useEffect, useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";

export function ApplicationForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    budget: "",
    volume: "",
    deadline: "",
    contact: "",
    comment: "",
  });
  const ref = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("[v0] Form submitted:", { ...formData, files });
    alert("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
  };

  return (
    <section
      ref={ref}
      id="application"
      className="py-20 md:py-32 bg-[#F5F0E6] text-[#1A1A1A] relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="inline-block bg-primary text-primary-foreground px-4 py-2 font-sans text-sm uppercase tracking-widest mb-6">
            НАЧАТЬ РАБОТУ
          </span>
          <h2 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl uppercase">
            ОСТАВИТЬ <span className="text-primary">ЗАЯВКУ</span>
          </h2>
          <p className="font-serif text-lg mt-6 max-w-2xl mx-auto">
            Заполните форму, и мы свяжемся с вами для обсуждения деталей
            производства
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Budget */}
            <div className="space-y-2">
              <label className="font-sans font-bold uppercase text-sm tracking-wider">
                Примерный бюджет *
              </label>
              <select
                required
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className="w-full p-4 bg-transparent border-4 border-[#1A1A1A] font-serif text-lg focus:border-primary focus:outline-none"
              >
                <option value="">Выберите бюджет</option>
                <option value="1-2m">1 000 000 — 2 000 000 ₽</option>
                <option value="2-5m">2 000 000 — 5 000 000 ₽</option>
                <option value="5-10m">5 000 000 — 10 000 000 ₽</option>
                <option value="10m+">Более 10 000 000 ₽</option>
              </select>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <label className="font-sans font-bold uppercase text-sm tracking-wider">
                Планируемый объём
              </label>
              <input
                type="text"
                placeholder="Например: 1000 единиц"
                value={formData.volume}
                onChange={(e) =>
                  setFormData({ ...formData, volume: e.target.value })
                }
                className="w-full p-4 bg-transparent border-4 border-[#1A1A1A] font-serif text-lg focus:border-primary focus:outline-none placeholder:text-[#1A1A1A]/40"
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="font-sans font-bold uppercase text-sm tracking-wider">
                Сроки
              </label>
              <input
                type="text"
                placeholder="Например: до 1 марта 2026"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full p-4 bg-transparent border-4 border-[#1A1A1A] font-serif text-lg focus:border-primary focus:outline-none placeholder:text-[#1A1A1A]/40"
              />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <label className="font-sans font-bold uppercase text-sm tracking-wider">
                Контакт для связи *
              </label>
              <input
                type="text"
                required
                placeholder="Телефон, Telegram или Email"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full p-4 bg-transparent border-4 border-[#1A1A1A] font-serif text-lg focus:border-primary focus:outline-none placeholder:text-[#1A1A1A]/40"
              />
            </div>
          </div>

          {/* Comment */}
          <div className="mt-6 space-y-2">
            <label className="font-sans font-bold uppercase text-sm tracking-wider">
              Комментарий к заказу
            </label>
            <textarea
              rows={4}
              placeholder="Опишите ваш заказ подробнее..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="w-full p-4 bg-transparent border-4 border-[#1A1A1A] font-serif text-lg focus:border-primary focus:outline-none placeholder:text-[#1A1A1A]/40 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="mt-6 space-y-2">
            <label className="font-sans font-bold uppercase text-sm tracking-wider">
              Сопроводительные материалы
            </label>
            <div
              className="border-4 border-dashed border-[#1A1A1A] p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-60" />
              <p className="font-serif text-lg">
                Техническое задание, конструкторская документация, референсы
              </p>
              <p className="font-serif text-sm opacity-60 mt-2">
                Прикрепите имеющиеся материалы для точной оценки проекта
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#E8E0D0] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <span className="font-serif">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-8 py-5 font-sans font-bold uppercase tracking-wider text-xl border-4 border-primary hover:bg-[#1A1A1A] hover:border-[#1A1A1A] transition-all"
            >
              ОТПРАВИТЬ ЗАЯВКУ
            </button>
          </div>

          {/* Note */}
          <p className="mt-6 font-serif text-sm text-center opacity-70">
            Мы рассматриваем только заявки, соответствующие формату производства.
            Это позволяет сохранить высокую производственную дисциплину и
            качество.
          </p>
        </form>
      </div>
    </section>
  );
}
