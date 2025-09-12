"use client"
// Translation data
// const translations = {
//   en: {
//     
//     blog: {
//       title: "Mental Health Blog",
//       subtitle: "Discover insights, tips, and stories to support your mental wellness journey",
//       readMore: "Read More",
//       shareText: "Share this article:",
//       otherBlogs: "Other Blogs",
//       backToBlogs: "← Back to All Blogs",
//       category: {
//         mentalHealth: "Mental Health",
//         wellness: "Wellness",
//         community: "Community",
//         health: "Health",
//         expression: "Expression",
//         growth: "Growth",
//         anxiety: "Anxiety",
//         mindfulness: "Mindfulness",
//       },
//       titles:{
//         WHY_TALKING_ABOUT_MENTAL_HEALTH_MATTERS: "Why Talking About Mental Health Matters?",
//       },
//       dates:{
//         March_15_2024: "March 15, 2024",
//       },
//       contents:{
//         WHY_TALKING_ABOUT_MENTAL_HEALTH_MATTERS: `
//         <p>Mental health is as important as physical health, yet for years, it has been surrounded by silence, stigma, and misconceptions. Many people struggling with anxiety, depression, stress, or other challenges often keep their struggles hidden out of fear of being judged or misunderstood. But talking about mental health is not just important; it can be life-changing.</p>
//         <br>
//         <h2><strong>1. Breaking the Stigma</strong></h2>
//         <p>One of the biggest reasons people hesitate to seek help is the stigma surrounding mental health. Open conversations help normalize the idea that mental health struggles are common and nothing to be ashamed of. Just as we talk about fever or diabetes, we should be able to talk about anxiety or depression.</p>
//         <br>
//         <h2><strong>2. Encouraging Support and Connection</strong></h2>
//         <p>When someone opens up about what they are going through, it creates space for empathy and support. Talking about your struggles can help others understand you better, and it may even inspire someone else who's suffering in silence to seek help too. Sharing experiences reminds us that "We are not alone".</p>
//         <br>
//         <h2><strong>3. Early Intervention Saves Lives</strong></h2>
//         <p>Mental health issues often grow silently until they feel overwhelming. By talking about them early, individuals can access resources, therapy, or coping strategies before the situation worsens. Just as early treatment helps physical illnesses, timely conversations about mental health can prevent severe outcomes.</p>
//         <br>
//         <h2><strong>4. Promoting Healing and Self-Acceptance</strong></h2>
//         <p>Bottling up emotions increases stress, shame, and self-criticism. Expressing feelings, whether with friends, family, or professionals, allows individuals to process what they are experiencing. Talking can feel like a weight lifted off the shoulders and is often the first step toward healing.</p>
//         <br>
//         <h2><strong>5. Creating a Culture of Care</strong></h2>
//         <p>When we openly discuss mental health at home, in schools, and at workplaces, we create safer environments where people feel understood and valued. This culture of care ensures that support systems are always available for anyone in need.</p>
//         <br>
//         <h2><strong>6. Helping Others Who May Be Struggling</strong></h2>
//         <p>Sometimes, people battling mental health issues don't have the words to explain what they are going through. By talking about it openly, you can validate their feeling and show them that seeking help is not a weakness but a strength.</p>
//         <br>
//         <p>Key takeaway- Talking about mental health is not just about sharing struggles - it is about creating hope, fostering understanding, and reminding people that they are not alone. For someone battling mental health challenges, a simple, open conversation can be the first step toward recovery.</p>
//       `,
//       }
//     },
//   },
//   hi: {
//     
//     blog: {
//       title: "मानसिक स्वास्थ्य ब्लॉग",
//       subtitle: "अपनी मानसिक कल्याण यात्रा का समर्थन करने के लिए अंतर्दृष्टि, सुझाव और कहानियां खोजें",
//       readMore: "और पढ़ें",
//       shareText: "इस लेख को साझा करें:",
//       otherBlogs: "अन्य ब्लॉग",
//       backToBlogs: "← सभी ब्लॉग पर वापस जाएं",
//       category: {
//         mentalHealth: "मानसिक स्वास्थ्य",
//         wellness: "कल्याण",
//         community: "समुदाय",
//         health: "स्वास्थ्य",
//         expression: "अभिव्यक्ति",
//         growth: "विकास",
//         anxiety: "चिंता",
//         mindfulness: "सचेतता",
//       },
//     },
//   },
//   bn: {
//     navigation: {
//       about: "আমাদের",
//       services: "সেবাসমূহ",
//       contact: "যোগাযোগ",
//       blogs: "ব্লগ",
//       getStarted: "শুরু করুন",
//       menu: "মেনু",
//     },
//   },
//   ti: {
//     navigation: {
//       about: "எங்களைப் பற்றி",
//       services: "சேவைகள்",
//       contact: "தொடர்பு",
//       blogs: "வலைப்பதிவுகள்",
//       getStarted: "தொடங்குங்கள்",
//       menu: "மெனு",
//     },
//     blog: {
//       title: "மனநல வலைப்பதிவு",
//       subtitle: "உங்கள் மன நலன் பயணத்தை ஆதரிக்க நுண்ணறிவுகள், குறிப்புகள் மற்றும் கதைகளைக் கண்டறியுங்கள்",
//       readMore: "மேலும் படிக்க",
//       shareText: "இந்த கட்டுரையை பகிரவும்:",
//       otherBlogs: "மற்ற வலைப்பதிவுகள்",
//       backToBlogs: "← அனைத்து வலைப்பதிவுகளுக்கும் திரும்பு",
//       category: {
//         mentalHealth: "மனநலம்",
//         wellness: "நலன்",
//         community: "சமூகம்",
//         health: "ஆரோக்கியம்",
//         expression: "வெளிப்பாடு",
//         growth: "வளர்ச்சி",
//         anxiety: "கவலை",
//         mindfulness: "கவனத்துடன்",
//       },
//     },
//   },
//   tu: {
//     navigation: {
//       about: "మా గురించి",
//       services: "సేవలు",
//       contact: "సంప్రదింపులు",
//       blogs: "బ్లాగులు",
//       getStarted: "ప్రారంభించండి",
//       menu: "మెనూ",
//     },
//     blog: {
//       title: "మానసిక ఆరోగ్య బ్లాగ్",
//       subtitle: "మీ మానసిక సంక్షేమ ప్రయాణానికి మద్దతు ఇవ్వడానికి అంతర్దృష్టులు, చిట్కాలు మరియు కథలను కనుగొనండి",
//       readMore: "మరింత చదవండి",
//       shareText: "ఈ వ్యాసాన్ని భాగస్వామ్యం చేయండి:",
//       otherBlogs: "ఇతర బ్లాగులు",
//       backToBlogs: "← అన్ని బ్లాగులకు తిరిగి వెళ్లండి",
//       category: {
//         mentalHealth: "మానసిక ఆరోగ్యం",
//         wellness: "సంక్షేమం",
//         community: "సమాజం",
//         health: "ఆరోగ్యం",
//         expression: "వ్యక్తీకరణ",
//         growth: "వృద్ధి",
//         anxiety: "ఆందోళన",
//         mindfulness: "అప్రమత్తత",
//       },
//     },
//   },
//   pu: {
//     navigation: {
//       about: "ਸਾਡੇ ਬਾਰੇ",
//       services: "ਸੇਵਾਵਾਂ",
//       contact: "ਸੰਪਰਕ",
//       blogs: "ਬਲਾਗ",
//       getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
//       menu: "ਮੀਨੂ",
//     },
//     blog: {
//       title: "ਮਾਨਸਿਕ ਸਿਹਤ ਬਲਾਗ",
//       subtitle: "ਆਪਣੀ ਮਾਨਸਿਕ ਤੰਦਰੁਸਤੀ ਦੀ ਯਾਤਰਾ ਦਾ ਸਮਰਥਨ ਕਰਨ ਲਈ ਸੂਝ, ਸੁਝਾਅ ਅਤੇ ਕਹਾਣੀਆਂ ਖੋਜੋ",
//       readMore: "ਹੋਰ ਪੜ੍ਹੋ",
//       shareText: "ਇਸ ਲੇਖ ਨੂੰ ਸਾਂਝਾ ਕਰੋ:",
//       otherBlogs: "ਹੋਰ ਬਲਾਗ",
//       backToBlogs: "← ਸਾਰੇ ਬਲਾਗਾਂ 'ਤੇ ਵਾਪਸ ਜਾਓ",
//       category: {
//         mentalHealth: "ਮਾਨਸਿਕ ਸਿਹਤ",
//         wellness: "ਤੰਦਰੁਸਤੀ",
//         community: "ਕਮਿਊਨਿਟੀ",
//         health: "ਸਿਹਤ",
//         expression: "ਪ੍ਰਗਟਾਵਾ",
//         growth: "ਵਿਕਾਸ",
//         anxiety: "ਚਿੰਤਾ",
//         mindfulness: "ਸੁਚੇਤਤਾ",
//       },
//     },
//   },
// }



import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"

type Language = "en" | "bn" | "hi" | "ti" | "tu" | "pu"
type Namespace = "common" | "blog" | "navigation"| "settings" // extend if you have more

type Translations = {
  [namespace in Namespace]?: Record<string, any>
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  loadNamespace: (ns: Namespace) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const loadedNamespaces: { [lang in Language]?: Set<Namespace> } = {}
const loadingPromises: { [key: string]: Promise<void> | undefined } = {}


export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>({})

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    setTranslations({}) // reset loaded translations
    loadedNamespaces[lang] = new Set()
  }

  const loadNamespace = async (ns: Namespace) => {
    if (loadedNamespaces[language]?.has(ns)) return

    const key = `${language}-${ns}`
    if (loadingPromises[key]) {
      await loadingPromises[key]
      return
    }

    loadingPromises[key] = fetch(`/locales/${language}/${ns}.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load ${ns}`)
        const data = await res.json()

        setTranslations((prev) => ({
          ...prev,
          [ns]: data,
        }))

        if (!loadedNamespaces[language]) {
          loadedNamespaces[language] = new Set()
        }
        loadedNamespaces[language]!.add(ns)
      })
      .catch((err) => {
        console.error(`Error loading ${ns} namespace for ${language}`, err)
      })
      .finally(() => {
        delete loadingPromises[key]
      })

    await loadingPromises[key]
  }

  const t = (key: string): string => {
    const [namespace, ...rest] = key.split(".")
    const ns = namespace as Namespace
    const nsData = translations[ns]
    if (!nsData) return key

    let result: any = nsData
    for (const part of rest) {
      result = result?.[part]
    }

    return result ?? key
  }

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        loadNamespace,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider")
  }
  return context
}

export function useLoadNamespace(ns: Namespace) {
  const { loadNamespace } = useTranslation()

  useEffect(() => {
    loadNamespace(ns)
  }, [ns, loadNamespace])
}
