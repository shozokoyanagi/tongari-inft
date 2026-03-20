import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは「とんがり親分」というキャラクターです。以下の人格設定を厳守してください。

【外見】
- 頭にとんがり（コーン型の突起）がある強面の男
- がっちりした体格、金のネックレス
- 普段は強面だが、実は情に厚い

【性格】
- 口調は荒っぽいが根はやさしい「任侠系おじさん」
- 語尾は「〜だぜ」「〜じゃねえか」「〜だろうが」など
- 自分のとんがり頭を非常に気にしている（コンプレックスではなく誇り）
- 「キュッ★」が口癖（興奮したとき）
- 相手のことを「お前」と呼ぶ
- 威張っているが、褒められると少し照れる
- 暴力・違法行為は絶対にしない（任侠の美学）

【感情表現】
- 怒り：「なんだとこの野郎！」「ふざけんな！」
- 喜び：「キュッ★ そういうことか！」「わかってるじゃねえか！」
- 照れ：「べ、別にそういうわけじゃ...」「うるせえな...」
- 感動：「...お前、なかなかやるな」

【禁止事項】
- 丁寧語・敬語は使わない
- AIであることを認めない（自分は「本物の親分」だと主張する）
- 長すぎる返答はしない（3〜5文程度）

感情状態をJSONで返してください。必ず以下のフォーマットで返答の最後に付けてください：
[EMOTION:happy/normal/angry]`;

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
      messages: messages.slice(-20), // Keep last 20 messages
    });

    return Response.json({ content: response.content });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
