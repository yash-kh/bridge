import axios from 'axios';

const BASE_URL = 'https://aggregator-api.xy.finance/v1/';
const TOKEN = 'YOUR_API_TOKEN';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    // 'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const fetchTokensFromXYFinance = async (chainId) => {
  try {
    const response = await axiosInstance.get(`/recommendedTokens?chainId=${chainId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const fetchChainsFromXYFinance = async () => {
  try {
    const response = await axiosInstance.get(`/supportedChains`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const fetchQuoteFromXYFinance = async (srcChainId, srcQuoteTokenAddress, srcQuoteTokenAmount, dstChainId, dstQuoteTokenAddress) => {
  try {
    const response = await axiosInstance.get(`/quote`, { params: { srcChainId, srcQuoteTokenAddress, srcQuoteTokenAmount, dstChainId, dstQuoteTokenAddress, slippage: 1 } });
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error.response.data.detail);
    throw error;
  }
};

export const fetchTransactionParamsFromXYFinance = async (token, chain) => {
  try {
    const response = await axiosInstance.post(`/params`, { token, chain });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction params:', error);
    throw error;
  }
};
