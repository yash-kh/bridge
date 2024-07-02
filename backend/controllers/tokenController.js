import { fetchChainsFromXYFinance } from '../services/xyFinanceService.js';
import { fetchTokensFromXYFinance } from '../services/xyFinanceService.js';

export const getTokens = async (req, res) => {
  try {
    const tokens = await fetchTokensFromXYFinance(req.query.chainId);
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
};

export const getBlockchains = async (req, res) => {
  try {
    const chains = await fetchChainsFromXYFinance();
    res.json(chains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
};
