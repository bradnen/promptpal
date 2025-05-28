async function handler({ message }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!message?.trim()) {
    return { error: "Message is required" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Failed to get response from ChatGPT"
      );
    }

    await sql`
      INSERT INTO chat_messages (user_id, message, response, created_at)
      VALUES (${session.user.id}, ${message}, ${data.choices[0].message.content}, NOW())
    `;

    return {
      message: data.choices[0].message.content,
    };
  } catch (error) {
    return {
      error: "Failed to process message",
    };
  }
}

export default handler;