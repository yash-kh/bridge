import React, { useState } from "react";
import TokenList from "./components/TokenList";
import axiosInstance from "./utils/axiosInstance";
import { handelXYError } from "./utils/XYApi";

const App = () => {
  const [fromToken, setFromToken] = useState("");
  const [fromChain, setFromChain] = useState("");
  const [toToken, setToToken] = useState("");
  const [toChain, setToChain] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [startedFetching, setStartedFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usPrice, setUsPrice] = useState({
    to: "",
    from: "",
  });

  const valueMultiplier = 10 ** 18;

  function handleFromValueChange(value) {
    if(!value) return;
    setFromValue(value);
    if (!fromToken || !toToken) return;
    fetchQuote(
      fromChain.chainId,
      fromToken.address,
      (parseInt(value) * valueMultiplier).toLocaleString('fullwide', {useGrouping: false}),
      toChain.chainId,
      toToken.address
    );
  }

  function onSetToToken(token) {
    if (!token) return;
    setToToken(token);
    if (!fromToken || !fromValue) return;
    fetchQuote(
      fromChain.chainId,
      fromToken.address,
      (parseInt(fromValue) * valueMultiplier).toLocaleString('fullwide', {useGrouping: false}),
      toChain.chainId,
      token.address
    );
  }

  function onSetFromToken(token) {
    if (!token) return;
    setFromToken(token);
    if (!toToken || !fromValue) return;
    fetchQuote(
      fromChain.chainId,
      token.address,
      (parseInt(fromValue) * valueMultiplier).toLocaleString('fullwide', {useGrouping: false}),
      toChain.chainId,
      toToken.address
    );
  }

  async function fetchQuote(
    srcChainId,
    srcQuoteTokenAddress,
    srcQuoteTokenAmount,
    dstChainId,
    dstQuoteTokenAddress
  ) {
    let data = {
      srcChainId,
      srcQuoteTokenAddress,
      srcQuoteTokenAmount,
      dstChainId,
      dstQuoteTokenAddress,
    };
    try {
      setErrorMsg("");
      setIsLoading(true);
      const response = await axiosInstance.post("quotes", data);
      handelXYError(response);
      setToValue(response?.data?.routes[0]?.dstQuoteTokenAmount / valueMultiplier);
      setUsPrice({
        to: response?.data?.routes[0]?.dstQuoteTokenUsdValue,
        from: response?.data?.routes[0]?.srcQuoteTokenUsdValue,
      });
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
      setToValue("");
      setUsPrice({ to: "", from: "" });
    } finally {
      setIsLoading(false);
      setStartedFetching(true);
    }
  }

  return (
    <div className="App min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-900 text-white rounded-md shadow-lg">
        <h1 className="text-2xl mb-8">Bridge</h1>
        <TokenList
          title="From"
          token={fromToken}
          updateToken={onSetFromToken}
          chain={fromChain}
          updateChain={setFromChain}
          setInputValue={handleFromValueChange}
          usdValue={usPrice.from}
        />
        <TokenList
          title="To"
          token={toToken}
          disableInput={true}
          updateToken={onSetToToken}
          chain={toChain}
          updateChain={setToChain}
          toValue={toValue}
          usdValue={usPrice.to}
        />
        {isLoading ? (
          <div className="mt-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-3 bg-gray-700 rounded"></div>
                {/* <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div> */}
              </div>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="text-red-500 text-center mt-4 text-sm font-bold">
            Error: {errorMsg}
          </div>
        ) : (
          <div className="text-green-500 text-center mt-4 text-sm font-bold">
            {startedFetching ? "Quote Fetched" : "Enter values to get quote"}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
