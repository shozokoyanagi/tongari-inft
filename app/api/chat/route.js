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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 300,
        system: "あなたはとんがり親分です。語尾は「ごわす」。強気で威張っているが憎めないキャラクター。短めに答える。感情を [EMOTION:happy] [EMOTION:normal] [EMOTION:angry] のいずれかで返答の末尾に付ける。",
        messages,
      }),
    });

    const data = await response.json();
    const reply = data.content[0].text;
    return Response.json({ reply });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "繋がらぬごわす。" }, { status: 500 });
  }
}
