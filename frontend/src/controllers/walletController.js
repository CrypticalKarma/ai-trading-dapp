const mockPortfolio = {
  balanceUSD: 2540.32,
  holdings: [
    { token: "ETH", amount: 1.2, valueUSD: 2200 },
    { token: "USDC", amount: 300, valueUSD: 300 },
    { token: "MATIC", amount: 100, valueUSD: 40.32 }
  ]
};

export const getPortfolio = (req, res) => {
  res.json({
    wallet: req.params.walletAddress,
    portfolio: mockPortfolio
  });
};

export const analyzePortfolio = (req, res) => {
  const totalValue = mockPortfolio.holdings.reduce((sum, h) => sum + h.valueUSD, 0);
  const riskyAssets = mockPortfolio.holdings.filter(h => h.token !== "ETH" && h.token !== "USDC");

  res.json({
    wallet: req.params.walletAddress,
    analysis: {
      total_value_usd: totalValue,
      num_holdings: mockPortfolio.holdings.length,
      risky_assets: riskyAssets.map(h => h.token),
      mental_note: "Keep an eye on altcoins; ETH and USDC are safe."
    }
  });
};
