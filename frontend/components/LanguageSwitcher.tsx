"use client"

import { useTranslation } from "@/components/I18nProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ti", name: "Tamil", nativeName: "தமிழ்" },
  { code: "tu", name: "Telugu", nativeName: "తెలుగు" },
  { code: "pu", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0]

  const handleLanguageChange = (locale: string) => {
    setLanguage(locale as any)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Button clicked")}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 transition-all duration-200"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${
              language === lang.code
                ? "bg-blue-50 text-blue-600 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-gray-500">{lang.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
