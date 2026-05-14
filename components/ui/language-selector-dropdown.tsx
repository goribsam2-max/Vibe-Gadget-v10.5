import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "US" },
  { code: "bn", label: "বাংলা", flag: "BD" },
];

export const LanguageSelectorDropdown = () => {
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('vibe_lang');
    return saved === 'bn' ? languages[1] : languages[0];
  });
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: typeof languages[0]) => {
    setSelected(lang);
    setOpen(false);
    localStorage.setItem('vibe_lang', lang.code);
    localStorage.setItem('vibe_lang_selected', 'true');
    
    if (lang.code === 'bn') {
      document.cookie = 'googtrans=/en/bn; path=/';
      document.cookie = 'googtrans=/en/bn; path=/; domain=' + window.location.hostname;
    } else {
      document.cookie = 'googtrans=/en/en; path=/';
      document.cookie = 'googtrans=/en/en; path=/; domain=' + window.location.hostname;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    }
    window.location.reload();
  };

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center justify-between w-full rounded-xl border px-3 py-2 text-sm text-left",
          "bg-white/60 dark:bg-zinc-900/90 shadow-sm",
          "border-zinc-200 dark:border-zinc-700",
          "text-zinc-800 dark:text-zinc-200",
          "hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-medium"
        )}
      >
        <div className="flex items-center gap-2">
          <span>{selected.flag}</span>
          <span>{selected.label}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={cn(
            "absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-50",
            "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl",
            "shadow-lg border border-zinc-200 dark:border-zinc-700",
            "animate-fade-in"
          )}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
                selected.code === lang.code
                  ? "font-semibold text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <span>{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {selected.code === lang.code && (
                <Check className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
