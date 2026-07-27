import React, { useState } from 'react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';
import { BookOpen, Search, Clock, Bookmark, BookmarkCheck, Sparkles, X, ArrowRight, ShieldCheck, Tag, HelpCircle } from 'lucide-react';
import { getBookmarkedArticleIds, toggleBookmarkArticle } from '../utils/storage';

export const KnowledgeBase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getBookmarkedArticleIds());

  const categories = [
    { id: 'all', label: 'Усі статті' },
    { id: 'anxiety', label: 'Тривога та паніка' },
    { id: 'ptsd', label: 'ПТСР та Травма' },
    { id: 'burnout', label: 'Вигорання' },
    { id: 'sleep', label: 'Сон та Відпочинок' },
    { id: 'support', label: 'Підтримка близьких' }
  ];

  const quickSearchKeywords = [
    'паніка',
    'флешбек',
    'безсоння',
    'вигорання',
    'заземлення',
    'EMDR',
    'кортизол'
  ];

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmarkArticle(id);
    setBookmarkedIds(updated);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredArticles = ARTICLES.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    
    if (!searchQuery.trim()) return matchesCategory;

    const query = searchQuery.toLowerCase().trim();

    const matchesTitle = art.title.toLowerCase().includes(query);
    const matchesSummary = art.summary.toLowerCase().includes(query);
    const matchesCategoryLabel = art.categoryLabel.toLowerCase().includes(query);
    const matchesTakeaways = art.keyTakeaways.some(kt => kt.toLowerCase().includes(query));
    const matchesContent = art.content.some(sec =>
      (sec.heading && sec.heading.toLowerCase().includes(query)) ||
      sec.text.toLowerCase().includes(query) ||
      (sec.bulletPoints && sec.bulletPoints.some(bp => bp.toLowerCase().includes(query)))
    );

    return matchesCategory && (matchesTitle || matchesSummary || matchesCategoryLabel || matchesTakeaways || matchesContent);
  });

  return (
    <div className="space-y-8">
      
      {/* Intro Header & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>База психоосвітніх знань</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Науково доведені матеріали про самодопомогу
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Практичні статті про подолання панічних атак, тривоги, флешбеків при ПТСР, гігієну сну та підтримку рідних від фахівців з психотерапії.
          </p>
        </div>

        {/* Enhanced Search Input */}
        <div className="pt-2 space-y-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Шукати статтю за ключовими словами (паніка, сон, флешбек, вигорання)..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                title="Очистити пошук"
                className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Keyword Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1 font-semibold text-slate-600 dark:text-slate-300">
              <Tag className="w-3 h-3 text-emerald-500" />
              <span>Популярні запити:</span>
            </span>
            {quickSearchKeywords.map(kw => (
              <button
                key={kw}
                onClick={() => setSearchQuery(kw)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300'
                }`}
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Category Pills & Results Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
          Знайдено матеріалів: <span className="font-bold text-slate-900 dark:text-white">{filteredArticles.length}</span>
        </div>
      </div>

      {/* Articles Grid or Empty Search State */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map(article => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            return (
              <div
                key={article.id}
                onClick={() => setReadingArticle(article)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                      {article.categoryLabel}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                      </span>

                      <button
                        onClick={(e) => handleToggleBookmark(article.id, e)}
                        title={isBookmarked ? 'Видалити із закладок' : 'Зберегти у закладки'}
                        className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Читати статтю повністю</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Нічого не знайдено за запитом «{searchQuery}»
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Спробуйте змінити пошукове слово або перевірити матеріали в інших категоріях.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Скинути фільтри та пошук
          </button>
        </div>
      )}

      {/* Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {readingArticle.categoryLabel} • {readingArticle.readTime} читання
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {readingArticle.title}
                </h2>
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Key Takeaways Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Ключові тези матеріалу:</span>
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 list-disc list-inside">
                  {readingArticle.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx}>{takeaway}</li>
                  ))}
                </ul>
              </div>

              {/* Sections */}
              <div className="space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                {readingArticle.content.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    {sec.heading && (
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {sec.heading}
                      </h3>
                    )}
                    <p>{sec.text}</p>

                    {sec.bulletPoints && (
                      <ul className="space-y-1.5 pl-4 list-disc text-slate-700 dark:text-slate-300">
                        {sec.bulletPoints.map((bp, bidx) => (
                          <li key={bidx}>{bp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                onClick={() => setReadingArticle(null)}
                className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                Закрити статтю
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

