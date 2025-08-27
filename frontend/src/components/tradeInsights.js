import { useEffect, useState } from "react";

export default function TradeInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/analyze");
        if (!res.ok) throw new Error("Failed to fetch insights");
        const data = await res.json();
        setInsights(data.insights);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) return <p>Loading AI trade insights...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>AI Trade Insights</h2>
      <pre>{insights}</pre>
    </div>
  );
}
