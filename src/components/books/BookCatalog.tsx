"use client";

import { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, BookOpen, X, ChevronDown, ChevronUp } from "lucide-react";
import { BookCard } from "./BookCard";
import { motion, AnimatePresence } from "framer-motion";
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

// CATEGORIES are now loaded dynamically from props

const CONDITIONS = [
  { id: "ALL", label: "Tất cả tình trạng" },
  { id: "NEW", label: "Mới" },
  { id: "GOOD", label: "Tốt" },
  { id: "OLD", label: "Cũ" },
];

const PRICE_RANGES = [
  { id: "ALL", label: "Tất cả giá" },
  { id: "under-50", label: "Dưới 50.000đ", min: 0, max: 50000 },
  { id: "50-100", label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
  { id: "100-200", label: "100.000đ - 200.000đ", min: 100000, max: 200000 },
  { id: "over-200", label: "Trên 200.000đ", min: 200000, max: Infinity },
];

export function BookCatalog({ initialBooks, initialSearch = "", categories = [] }: { initialBooks: Book[], initialSearch?: string, categories?: any[] }) {
  const [search, setSearch] = useState(initialSearch);
  const [authorSearch, setAuthorSearch] = useState("");
  const { t, language } = useLanguage();

  const conditionKeys: Record<string, string> = {
    "ALL": "condition.all",
    "NEW": "condition.new",
    "GOOD": "condition.good",
    "OLD": "condition.old"
  };

  const priceKeys: Record<string, string> = {
    "ALL": "price.all",
    "under-50": "price.under50",
    "50-100": "price.50to100",
    "100-200": "price.100to200",
    "over-200": "price.over200"
  };
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCondition, setSelectedCondition] = useState("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState("ALL");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  const categoriesList = useMemo(() => {
    return [
      { id: "ALL", label: t("category.all") },
      ...categories.map((c: any) => ({ id: c.id, label: t(`category.${c.slug || c.id.toLowerCase()}`) }))
    ];
  }, [categories, language, t]);

  const filteredBooks = useMemo(() => {
    return initialBooks
      .filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
        const matchesAuthor = !authorSearch || (book.author?.toLowerCase().includes(authorSearch.toLowerCase()));
        const matchesCategory = selectedCategory === "ALL" || (() => {
          const selectedCat = categories.find(c => c.id === selectedCategory);
          if (!selectedCat) return false;
          return book.category === selectedCat.slug || book.categoryId === selectedCat.id;
        })();
        const matchesCondition = selectedCondition === "ALL" || (() => {
          if (selectedCondition === "NEW") {
            return book.condition === "NEW_100" || book.condition === "LIKE_NEW";
          }
          return book.condition === selectedCondition;
        })();
        const matchesStock = !onlyInStock || book.stockQuantity > 0;
        
        let matchesPrice = true;
        if (selectedPriceRange !== "ALL") {
          const range = PRICE_RANGES.find(r => r.id === selectedPriceRange);
          if (range) {
            matchesPrice = book.price >= range.min && book.price <= range.max;
          }
        }

        return matchesSearch && matchesAuthor && matchesCategory && matchesCondition && matchesStock && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0; // Default
      });
  }, [initialBooks, search, authorSearch, selectedCategory, selectedCondition, selectedPriceRange, onlyInStock, sortBy]);

  return (
    <div className="container mx-auto px-6 md:px-12 pb-24">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 mb-4 tracking-tight">{t("catalog.title")}</h1>
          <p className="text-zinc-500 font-medium text-lg">{t("catalog.subtitle")}</p>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-10 shrink-0">
          {/* Author Search */}
          <div>
            <h3 className="font-black text-zinc-900 uppercase tracking-widest text-xs mb-4">{t("catalog.searchAuthor")}</h3>
            <div className="relative">
              <input
                type="text"
                placeholder={t("catalog.searchAuthorPlaceholder")}
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-primary/20"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-primary" />
              <h3 className="font-black text-zinc-900 uppercase tracking-widest text-xs">{t("catalog.categories")}</h3>
            </div>
            <div className="space-y-2">
              {categoriesList.slice(0, isCategoriesExpanded ? categoriesList.length : 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              {categoriesList.length > 5 && (
                <button
                  onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-primary hover:bg-zinc-50 rounded-xl transition-all"
                >
                  <span>{isCategoriesExpanded ? t("catalog.collapse") : t("catalog.expand")}</span>
                  {isCategoriesExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-black text-zinc-900 uppercase tracking-widest text-xs mb-6">{t("catalog.priceRange")}</h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setSelectedPriceRange(range.id)}
                  className={`w-full text-left px-4 py-2 text-xs font-bold transition-all rounded-lg ${
                    selectedPriceRange === range.id
                      ? "text-primary bg-primary/5"
                      : "text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {t(priceKeys[range.id] || range.label)}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h3 className="font-black text-zinc-900 uppercase tracking-widest text-xs">{t("catalog.condition")}</h3>
            </div>
            <div className="space-y-2">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.id}
                  onClick={() => setSelectedCondition(cond.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedCondition === cond.id
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {t(conditionKeys[cond.id] || cond.label)}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-6 border-t border-zinc-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" 
              />
              <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">{t("catalog.onlyInStock")}</span>
            </label>
          </div>

          {/* Sort */}
          <div>
             <h3 className="font-black text-zinc-900 uppercase tracking-widest text-xs mb-6">{t("catalog.sort")}</h3>
             <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10"
             >
                <option value="newest">{t("catalog.sort.newest")}</option>
                <option value="price-asc">{t("catalog.sort.priceAsc")}</option>
                <option value="price-desc">{t("catalog.sort.priceDesc")}</option>
             </select>
          </div>
        </aside>

        {/* Catalog Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-zinc-400 font-bold text-sm">
              {t("catalog.showResults").split("{count}")[0]}
              <span className="text-zinc-900">{filteredBooks.length}</span>
              {t("catalog.showResults").split("{count}")[1]}
            </p>
            {(selectedCategory !== "ALL" || selectedCondition !== "ALL" || search) && (
              <button 
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedCondition("ALL");
                  setSearch("");
                }}
                className="text-xs font-black text-primary hover:underline uppercase tracking-wider"
              >
                {t("catalog.clearFilters")}
              </button>
            )}
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredBooks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full py-32 bg-zinc-50 rounded-[40px] flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-100"
                >
                  <BookOpen className="w-20 h-20 mb-6 opacity-10" />
                  <h3 className="text-xl font-bold mb-2 text-zinc-900">{t("catalog.notFound")}</h3>
                  <p className="max-w-xs text-center font-medium">{t("catalog.notFoundDesc")}</p>
                </motion.div>
              ) : (
                filteredBooks.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
