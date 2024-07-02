import { fetchQuoteFromXYFinance } from '../services/xyFinanceService.js';

export const postQuote = async (req, res) => {
  try {
    const { srcChainId, srcQuoteTokenAddress, srcQuoteTokenAmount, dstChainId, dstQuoteTokenAddress } = req.body;
    const quote = await fetchQuoteFromXYFinance(srcChainId, srcQuoteTokenAddress, srcQuoteTokenAmount, dstChainId, dstQuoteTokenAddress);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};
