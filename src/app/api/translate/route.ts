import { NextResponse } from 'next/server'

// 🧠 Simple in-memory cache (resets on server restart)
const cache = new Map<string, string>()

export async function POST(req: Request) {
  try {
    const { text, targetLang } = (await req.json()) as {
      text: string
      targetLang: string
    }

    if (!text || !targetLang) {
      console.warn('⚠️ Missing required parameters', { text, targetLang })
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const cacheKey = `${text}-${targetLang}`
    if (cache.has(cacheKey)) {
      // 🪄 Instant response from cache
      return NextResponse.json({ translatedText: cache.get(cacheKey) })
    }

    // 🌍 Try MyMemory API first
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${targetLang}`

    let res = await fetch(myMemoryUrl)
    if (res.status === 429) {
      console.warn('🚧 MyMemory rate limit hit — retrying in 3s...')
      await new Promise((r) => setTimeout(r, 3000))
      res = await fetch(myMemoryUrl)
    }

    let translatedText: string | null = null

    if (res.ok) {
      const data = await res.json()
      translatedText = data?.responseData?.translatedText || null
    }

    // 🌐 If MyMemory failed, fallback to LibreTranslate
    if (!translatedText) {
      console.log('🌀 Falling back to LibreTranslate...')
      const libreRes = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text',
        }),
      })

      if (libreRes.ok) {
        const libreData = await libreRes.json()
        translatedText = libreData.translatedText
      } else {
        console.error(`LibreTranslate failed (${libreRes.status})`)
      }
    }

    // ❌ If both failed
    if (!translatedText) {
      throw new Error('Both translation services failed.')
    }

    // 🧠 Cache result to avoid repeated calls
    cache.set(cacheKey, translatedText)

    return NextResponse.json({ translatedText })
  } catch (error: any) {
    console.error('🔥 Translation API error:', error.message || error)
    return NextResponse.json({ error: error.message || 'Translation failed' }, { status: 500 })
  }
}

// ✅ Friendly GET endpoint
export async function GET() {
  return NextResponse.json({
    message: '🌐 Explore Maharashtra Translation API',
    usage: {
      method: 'POST',
      body: { text: 'Hello', targetLang: 'mr' },
    },
  })
}
