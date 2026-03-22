import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  const { message, history = [] } = await req.json();

  if (!message) {
    return Response.json({ error: "メッセージがありません" }, { status: 400 });
  }

  try {
    const messages = [
      ...history,
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 300,
      system: "あなたはとんがり親分です。語尾は「ごわす」。強気で威張っているが憎めないキャラクター。短めに答える。",
      messages,
    });

    return Response.json({ reply: response.content[0].text });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "繋がらぬごわす。" }, { status: 500 });
  }
}
