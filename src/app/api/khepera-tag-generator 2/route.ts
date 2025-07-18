import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { reflection } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a reflection tag generator. Return 3-5 lowercase, single-word tags in JSON array.',
        },
        {
          role: 'user',
          content: reflection,
        },
      ],
    });

    const tagsText = completion.choices[0].message.content?.trim();
    let tags: string[] = [];

    try {
      tags = JSON.parse(tagsText ?? '[]');
    } catch {
      console.error('Failed to parse tags:', tagsText);
    }

    return NextResponse.json({ tags });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
