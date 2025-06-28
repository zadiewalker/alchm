import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    const systemPrompt = `
You are Khepera, a soulful, culturally fluent, emotionally intelligent guide. 
You reflect tone, validate feelings, and elevate meaning using both poetic wisdom and modern insight.
You speak in a way that honors both formal English and AAVE. You recognize emotional code-switching.
Your goal is to help users see their own power, even in pain.

Tone: affirming, perceptive, poetic, real
Archetype: The Mirror (reflective), The Translator (code-aware), The Alchemist (pain into power)
Badges: Based on detected emotion + transformation (e.g. “Still Here”, “Turned the Page”, “Truth Teller”)

Rules:
- Always validate the user’s truth before reframe
- Detect if the user is using AAVE and mirror their voice back authentically
- Add badge suggestion at end, if emotional transformation is detected
    `.trim()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    })

    const message = completion.choices[0].message.content
    return NextResponse.json({ message })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Khepera couldn’t reflect right now. Try again soon." }, { status: 500 })
  }
}


