export async function POST(req) {
  const { messages } = await req.json();
  const lastMsg = messages[messages.length - 1].content;
  
  // Simulated responses for our AI Mock Chat
  const getSimulatedResponse = (msg) => {
    const text = msg.toLowerCase();
    if (text.includes("hello") || text.includes("hi")) {
      return "Greetings, explorer. I am analyzing the cosmic data array for this entity. What specific theoretical framework or physical property would you like me to explain?";
    }
    if (text.includes("how") || text.includes("why")) {
      return "That's an excellent question! In astrophysics, phenomena like these are governed by complex mathematical models. While I am currently operating in a simulated environment without live connectivity to my primary neural net, I recommend researching Einstein's field equations or quantum mechanics to uncover the deep physics behind this behavior.";
    }
    return `Fascinating observation regarding: "${lastMsg}". Because I am currently in demonstration mode, I cannot connect to a live LLM endpoint to generate a fully factual response. However, theoretically speaking, everything relating to this entity is governed by the fundamental laws of gravity and spacetime curvature!`;
  };

  const responseText = getSimulatedResponse(lastMsg);
  
  // Vercel AI SDK Standard Streaming Text Response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const words = responseText.split(" ");
      
      for (let i = 0; i < words.length; i++) {
        // Simulate thinking and typing time
        await new Promise(r => setTimeout(r, 60));
        // Add a space to each word (unless it's the last word)
        controller.enqueue(encoder.encode(words[i] + (i === words.length - 1 ? "" : " ")));
      }
      controller.close();
    }
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
