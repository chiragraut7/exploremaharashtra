'use client'

import { useEffect, useState } from 'react'
import { customCorrections } from './customCorrections' // ✅ import your correction dictionary

interface TranslatorProps {
  text: string
  targetLang: string
}

export default function Translator({ text, targetLang }: TranslatorProps) {
  const [translatedText, setTranslatedText] = useState(text)

  useEffect(() => {
    if (!text || text.trim() === '') return

    // 🧠 Skip translation if language is English
    if (targetLang === 'en') {
      setTranslatedText(text)
      return
    }

    const translate = async () => {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang }),
        })

        if (!res.ok) {
          console.error('Translation failed', await res.text())
          return
        }

        const data = await res.json()
        let output = data.translatedText || text

        // 🪄 Apply custom Marathi corrections from dictionary
        if (targetLang === 'mr') {
          Object.entries(customCorrections).forEach(([wrong, correct]) => {
            const regex = new RegExp(wrong, 'g')
            output = output.replace(regex, correct)
          })

          // ✅ Fix for “Explore” cases
          output = output
            .replace(/\bमहाराष्ट्र एक्सप्लोर करा\b/gi, 'महाराष्ट्राचा शोध घ्या')
            .replace(/\bएक्सप्लोर करा\b/gi, 'शोध घ्या')
        }

        setTranslatedText(output)
      } catch (err) {
        console.error('Translation error:', err)
      }
    }

    translate()
  }, [text, targetLang])

  return <>{translatedText}</>
}
