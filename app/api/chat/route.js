export async function POST(req) {
  try {
    const body = await req.json()
    const message = body.message
    const history = body.history || []

    if (!message) {
      return Response.json({ error: "メッセージがありません" }, { status: 400 })
    }

    const messages = [...history, { role: "user", content: message }]

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
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
        messages: messages,
      }),
    })

    const data = await apiRes.json()

    if (!data.content || !data.content[0]) {
      console.error("API response error:", JSON.stringify(data))
      return Response.json({ error: data.error?.message || "応答なし" }, { status: 500 })
    }

    const reply = data.content[0].text
    return Response.json({ reply: reply })

  } catch (err) {
    console.error("Error:", err.message)
    return Response.json({ error: "繋がらぬごわす。" }, { status: 500 })
  }
}
