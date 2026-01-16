import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'public/data/cultural')
    const files = fs.readdirSync(dirPath)

    const jsonFiles = files.filter((file) => file.endsWith('.json'))
    const data = jsonFiles.map((file) => {
      const filePath = path.join(dirPath, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content)
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
