"""
Finance API Service — Live market data + technical indicators.
Uses yfinance for data and `ta` library for RSI, SMA, MACD.
"""
import yfinance as yf
from ta.momentum import RSIIndicator
from ta.trend import SMAIndicator, EMAIndicator, MACD
from app.core.logging import get_logger

log = get_logger(__name__)


class FinanceAPIService:
    """Fetches live market data and computes technical indicators."""

    def get_stock_data(self, ticker: str, period: str = "6mo") -> dict:
        """
        Fetch OHLCV price history for a ticker.
        Returns dict with dates, open, high, low, close, volume.
        """
        log.info(f"Fetching stock data for {ticker} (period={period})")
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period=period)
            if df.empty:
                return {"error": f"No data found for ticker '{ticker}'"}
            return {
                "ticker": ticker,
                "period": period,
                "current_price": round(float(df["Close"].iloc[-1]), 2),
                "price_change_pct": round(
                    float((df["Close"].iloc[-1] - df["Close"].iloc[0]) / df["Close"].iloc[0] * 100), 2
                ),
                "high_52w": round(float(df["High"].max()), 2),
                "low_52w": round(float(df["Low"].min()), 2),
                "avg_volume": int(df["Volume"].mean()),
                "latest_date": str(df.index[-1].date()),
                "data_points": len(df),
            }
        except Exception as e:
            log.error(f"Error fetching stock data: {e}")
            return {"error": str(e)}

    def get_company_info(self, ticker: str) -> dict:
        """
        Fetch fundamental company information:
        market cap, P/E ratio, sector, summary, etc.
        """
        log.info(f"Fetching company info for {ticker}")
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            return {
                "ticker": ticker,
                "name": info.get("shortName", "N/A"),
                "sector": info.get("sector", "N/A"),
                "industry": info.get("industry", "N/A"),
                "market_cap": info.get("marketCap", "N/A"),
                "pe_ratio": info.get("trailingPE", "N/A"),
                "forward_pe": info.get("forwardPE", "N/A"),
                "dividend_yield": info.get("dividendYield", "N/A"),
                "eps": info.get("trailingEps", "N/A"),
                "revenue": info.get("totalRevenue", "N/A"),
                "profit_margin": info.get("profitMargins", "N/A"),
                "debt_to_equity": info.get("debtToEquity", "N/A"),
                "summary": info.get("longBusinessSummary", "N/A")[:500],
            }
        except Exception as e:
            log.error(f"Error fetching company info: {e}")
            return {"error": str(e)}

    def calculate_technical_indicators(self, ticker: str, period: str = "6mo") -> dict:
        """
        Calculate RSI, SMA(20), SMA(50), EMA(20), and MACD for a ticker.
        Returns numeric values + human-readable interpretations.
        """
        log.info(f"Calculating technical indicators for {ticker}")
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period=period)
            if df.empty or len(df) < 50:
                return {"error": f"Not enough data for {ticker} (need 50+ days)"}

            close = df["Close"]

            # ── RSI (14-day) ──
            rsi_indicator = RSIIndicator(close=close, window=14)
            rsi_value = round(float(rsi_indicator.rsi().iloc[-1]), 2)

            # ── SMA ──
            sma_20 = round(float(SMAIndicator(close=close, window=20).sma_indicator().iloc[-1]), 2)
            sma_50 = round(float(SMAIndicator(close=close, window=50).sma_indicator().iloc[-1]), 2)

            # ── EMA ──
            ema_20 = round(float(EMAIndicator(close=close, window=20).ema_indicator().iloc[-1]), 2)

            # ── MACD ──
            macd_obj = MACD(close=close)
            macd_line = round(float(macd_obj.macd().iloc[-1]), 2)
            macd_signal = round(float(macd_obj.macd_signal().iloc[-1]), 2)
            macd_histogram = round(float(macd_obj.macd_diff().iloc[-1]), 2)

            current_price = round(float(close.iloc[-1]), 2)

            # ── Interpretations ──
            rsi_signal = "Overbought (bearish)" if rsi_value > 70 else "Oversold (bullish)" if rsi_value < 30 else "Neutral"
            trend_signal = "Bullish (price > SMA50)" if current_price > sma_50 else "Bearish (price < SMA50)"
            macd_signal_text = "Bullish (MACD > Signal)" if macd_line > macd_signal else "Bearish (MACD < Signal)"

            return {
                "ticker": ticker,
                "current_price": current_price,
                "rsi_14": rsi_value,
                "rsi_signal": rsi_signal,
                "sma_20": sma_20,
                "sma_50": sma_50,
                "ema_20": ema_20,
                "trend_signal": trend_signal,
                "macd_line": macd_line,
                "macd_signal_line": macd_signal,
                "macd_histogram": macd_histogram,
                "macd_signal": macd_signal_text,
            }
        except Exception as e:
            log.error(f"Error calculating technicals: {e}")
            return {"error": str(e)}


# Singleton instance
finance_api_service = FinanceAPIService()
