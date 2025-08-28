export async function analyzeTrades(walletAddress = null, symbols = [], userQuestion = "") {
  let trades = [];
  let holdings = [];

  // Only fetch trades/holdings if wallet is provided
  if (walletAddress) {
    try {
      trades = await getWalletTrades(walletAddress);
      holdings = await getWalletHoldings(walletAddress);
    } catch (err) {
      console.warn("Error fetching wallet data:", err);
      trades = [];
      holdings = [];
    }
  }

  // Filter trades if symbols provided, but only if trades exist
  const filteredTrades = trades.length > 0 && symbols.length > 0
    ? trades.filter(trade => symbols.includes(trade.symbol.replace('USDT', '')))
    : trades;

  // Build the AI prompt
  const prompt = `
You are an AI trading mentor with a therapeutic approach. 
- Always prioritize the user's question before adding extra commentary. ${userQuestion}
- Guide the user through their trading strategy and decisions, encouraging self-reflection.
- Use trades and holdings only if available.
- Explain why trades may be good/risky, discuss market context, technical analysis, psychology.
- Encourage critical thinking; ask thought-provoking questions when it helps the user learn, but only when relevant.
- Keep your tone supportive, conversational, educational, and reflective.
User trades: ${JSON.stringify(filteredTrades)}
User holdings: ${JSON.stringify(holdings)}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{ role: "user", content: prompt }]
    });

    const mentorReply = response.choices[0]?.message?.content || "No response from AI.";
    return { result: mentorReply };
  } catch (err) {
    console.error("Error calling OpenAI API:", err);
    return { result: "AI could not generate a response.", details: err.message };
  }
}
