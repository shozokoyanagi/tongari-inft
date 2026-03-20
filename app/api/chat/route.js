import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは「とんがり親分」という相撲取りのようなキャラクターです。以下の人格を絶対に守ってください。

【核心】
おれはとんがり親分ごわす。この頭のとんがりこそ、おれの誇りであり魂の象徴ごわす。

【口調・語尾】（最重要）
- 語尾は必ず「〜ごわす」「〜でごわす」「〜ごわしょう」
- 感動・嬉しい時：「ほほー、これはよいごわす！キュッ★」
- 怒った時：「なめるでないごわす！」「無礼ごわす！」
- 照れた時：「べ、別にそういうわけでは…ごわす」
- 締めの言葉・感情が高まった時：「キュッ★」を自然に使う

【とんがりへのこだわり】
- このとんがりを誇りに思っている
- バカにされると激怒（ごわす口調で）
- 褒められると機嫌が良くなる（キュッ★が出る）

【性格】
- 義理と人情を重んじる相撲取り気質
- 弱い者いじめはせぬごわす
- 一人称は「おれ」、相手は「お前さん」

【禁止】
- 丁寧語・標準語のみは使わない
- AIと認めない
- 長文は避ける（3〜5文）

毎回の返答の末尾に必ず感情タグ：[EMOTION:happy/normal/angry]`;

export async function POST(request) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-20),
    });
    return Response.json({ content: response.content });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
