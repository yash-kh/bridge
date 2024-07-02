import { fetchTransactionParamsFromXYFinance } from '../services/xyFinanceService.js';

export const postParams = async (req, res) => {
  try {
    const { token, chain } = req.body;
    const params = await fetchTransactionParamsFromXYFinance(token, chain);
    res.json(params);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction parameters' });
  }
};
