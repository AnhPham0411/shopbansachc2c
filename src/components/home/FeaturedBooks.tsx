"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookCard } from "@/components/books/BookCard";
import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/providers/LanguageProvider";


interface Book {
  id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
  author?: string | null;
  imageUrl?: string | null;
  stockQuantity: number;
  seller: {
    id: string;
    name: string;
  };
  reviews?: { rating: number }[];
}

interface FeaturedBooksProps {
  books: Book[];
}

const TABS = [
  { id: "all", labelKey: "featured.all" },
  { id: "old", labelKey: "featured.old" },
  { id: "new", labelKey: "featured.new" },
  { id: "comics", labelKey: "featured.comics" },
  { id: "textbook", labelKey: "featured.textbook" },
];

export function FeaturedBooks({ books }: FeaturedBooksProps) {
  const [activeTab, setActiveTab] = useState("all");
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  
  const userRole = (session?.user as any)?.role;
  const sellLink = !session
    ? `/login?callbackUrl=${encodeURIComponent("/seller/books")}`
    : "/seller/books";

  const filteredBooks = useMemo(() => {
    switch (activeTab) {
      case "old":
        return books.filter(b => b.condition !== "NEW_100").slice(0, 8);
      case "new":
        return books.filter(b => b.condition === "NEW_100").slice(0, 8);
      case "comics":
        return books.filter(b => b.category === "COMICS").slice(0, 8);
      case "textbook":
        return books.filter(b => b.category === "TEXTBOOK").slice(0, 8);
      default:
        return books.slice(0, 8);
    }
  }, [activeTab, books]);

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="explore-books">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">{t("featured.title")}</h2>
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                      : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {t(tab.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <Link href="/books" className="text-primary font-bold hover:underline flex items-center gap-1 group shrink-0">
            {t("featured.viewAll")} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredBooks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="empty"
                className="col-span-full py-24 bg-zinc-50 rounded-[40px] flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-100"
              >
                <BookOpen className="w-16 h-16 mb-4 opacity-10" />
                <p className="font-bold">{t("featured.empty")}</p>
                <Link href={sellLink} className="mt-4 text-primary font-bold hover:underline">{t("featured.beFirst")}</Link>
              </motion.div>
            ) : (
              filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Categories / Trust CTA */}
        <div className="mt-20 p-12 bg-[#F5F9F9] rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/5">
          <div className="max-w-md">
            <h3 className="text-2xl font-black text-zinc-900 mb-4">{t("featured.cta.title")}</h3>
            <p className="text-zinc-600 font-medium">{t("featured.cta.desc")}</p>
          </div>
          <Link href={sellLink} className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-base hover:bg-[#00a39f] transition-all shadow-xl shadow-primary/10 whitespace-nowrap">
            {t("featured.cta.button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
