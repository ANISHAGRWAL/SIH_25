"use client"


import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Moon, Sun, Globe, Trash2, Shield, User, Download, Bell, Database } from "lucide-react"


export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [notifications, setNotifications] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)


  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])


  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी (Hindi)", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩" },
    { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", flag: "🇮🇳" },
    { code: "or", name: "ଓଡ଼ିଆ (Odia)", flag: "🇮🇳" },
    { code: "as", name: "অসমীয়া (Assamese)", flag: "🇮🇳" },
    { code: "ur", name: "اردو (Urdu)", flag: "🇵🇰" },
    { code: "ne", name: "नेपाली (Nepali)", flag: "🇳🇵" },
    { code: "si", name: "සිංහල (Sinhala)", flag: "🇱🇰" },
  ]


  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    console.log("[MindMates] Language changed to:", languageCode)
  }


  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked)
    console.log("[MindMates] Dark mode:", checked)
  }


  const handleDeleteAccount = () => {
    console.log("[MindMates] Account deletion requested")
  }


  const handleExportData = () => {
    console.log("[MindMates] Data export requested")
  }


  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900' : 'bg-blue-50'}`}>
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className={`mt-2 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Customize your MindMates experience and manage your account preferences.
          </p>
        </div>


        {/* Appearance Settings */}
        <Card className={`transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-xl'
            : 'bg-white/80 border-gray-200 backdrop-blur-sm shadow-xl'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 transition-colors ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              Customize how MindMates looks and feels for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 border border-blue-100 dark:border-slate-600">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className={`text-base font-semibold transition-colors ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  Dark Mode
                </Label>
                <p className={`text-sm transition-colors ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Switch between light and dark themes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Sun className={`h-4 w-4 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-yellow-500'}`} />
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Moon className={`h-4 w-4 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-slate-500'}`} />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Language Settings */}
        <Card className={`transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-xl'
            : 'bg-white/80 border-gray-200 backdrop-blur-sm shadow-xl'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 transition-colors ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <Globe className="h-5 w-5 text-blue-600" />
              Language & Region
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              Choose your preferred language for the MindMates interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="language-select" className={`text-base font-semibold transition-colors ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                Interface Language
              </Label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className={`w-full h-12 rounded-xl transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}>
                  {languages.map((language) => (
                    <SelectItem
                      key={language.code}
                      value={language.code}
                      className={`transition-colors ${
                        isDarkMode
                          ? 'text-slate-100 hover:bg-slate-700 focus:bg-slate-700'
                          : 'text-slate-800 hover:bg-gray-100 focus:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className={`text-sm transition-colors ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Changes will be applied immediately across the entire application.
              </p>
            </div>
          </CardContent>
        </Card>


        {/* Privacy & Notifications */}
        <Card className={`transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-xl'
            : 'bg-white/80 border-gray-200 backdrop-blur-sm shadow-xl'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 transition-colors ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <Shield className="h-5 w-5 text-green-600" />
              Privacy & Notifications
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              Manage your privacy settings and notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notifications" className={`text-base font-semibold transition-colors ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    Push Notifications
                  </Label>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Receive notifications about your mental health journey
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>


            <Separator className={isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} />


            <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Database className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="data-sharing" className={`text-base font-semibold transition-colors ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    Anonymous Data Sharing
                  </Label>
                  <p className={`text-sm transition-colors ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Help improve MindMates by sharing anonymous usage data
                  </p>
                </div>
              </div>
              <Switch
                id="data-sharing"
                checked={dataSharing}
                onCheckedChange={setDataSharing}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </CardContent>
        </Card>


        {/* Account Management */}
        <Card className={`transition-all duration-300 border-red-200 dark:border-red-800 ${
          isDarkMode
            ? 'bg-slate-800/80 backdrop-blur-sm shadow-xl'
            : 'bg-white/80 backdrop-blur-sm shadow-xl'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <User className="h-5 w-5" />
              Account Management
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              Manage your account settings and data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Button
                onClick={handleExportData}
                variant="outline"
                className={`w-full justify-start h-12 rounded-xl transition-all hover:scale-[1.02] ${
                  isDarkMode
                    ? 'bg-slate-700/50 border-slate-600 text-slate-100 hover:bg-slate-600 hover:border-slate-500'
                    : 'bg-white/80 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Download className="h-4 w-4 mr-3" />
                Export My Data
              </Button>


              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-start h-12 rounded-xl bg-red-600 hover:bg-red-700 transition-all hover:scale-[1.02]"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={`${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-white border-gray-200'
                } rounded-2xl`}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className={isDarkMode ? 'text-slate-100' : 'text-slate-800'}>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className={`${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    } space-y-2`}>
                      <p>
                        This action cannot be undone. This will permanently delete your account and remove all your data
                        from our servers, including:
                      </p>
                      <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                        <li>Your profile information</li>
                        <li>Assessment history and results</li>
                        <li>Daily mind log entries</li>
                        <li>Chat conversations</li>
                        <li>Wellness activity progress</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className={`rounded-xl ${
                      isDarkMode
                        ? 'bg-slate-700 text-slate-100 hover:bg-slate-600 border-slate-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>


        {/* Save Changes */}
        <div className="flex justify-end pt-4">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 h-12 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

