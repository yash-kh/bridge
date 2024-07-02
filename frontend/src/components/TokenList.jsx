import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { handelXYError } from "../utils/XYApi";

const TokenList = ({
  title,
  disableInput,
  token,
  updateToken,
  chain,
  updateChain,
  setInputValue,
  toValue,
  usdValue,
}) => {
  const [tokens, setTokens] = useState([]);
  const [blockchains, setBlockchains] = useState([]);
  let timer = null;

  const handleValueChange = (e) => {
    if (!setInputValue) return;
    const newValue = e.target.value;

    // Clear the previous timer
    clearTimeout(timer);

    // Set a new timer to update the value after 200ms
    timer = setTimeout(() => {
      setInputValue(newValue);
    }, 500);
  };

  useEffect(() => {
    const fetchBlockchains = async () => {
      try {
        const response = await axiosInstance.get("tokens/blockchains");
        handelXYError(response);
        setBlockchains(response.data.supportedChains);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlockchains();
  }, []);

  async function fetchTokens(chainId) {
    try {
      const response = await axiosInstance.get(`tokens?chainId=${chainId}`);
      handelXYError(response);
      setTokens(response.data.recommendedTokens);
    } catch (error) {
      console.log(error);
    }
  }

  function onBCSelect(e) {
    const selectedBC = blockchains.find(
      (bc) => bc.chainId === parseInt(e.target.value)
    );
    updateChain(selectedBC);
    fetchTokens(selectedBC.chainId);
    updateToken("");
  }

  return (
    <div className="border border-gray-600 rounded-lg p-4 bg-gray-900 mb-7 relative">
      {title && (
        <span className="text-white mb-4 bg-gray-900 absolute -top-5 p-2">
          {title}
        </span>
      )}
      <div className="relative my-2">
        <select
          className="w-full p-2 appearance-none bg-gray-700 text-white border border-gray-600 rounded leading-tight hover:outline-none hover:ring-1 hover:ring-blue-700 hover:border-blue-700"
          onChange={onBCSelect}
          value={chain ? chain.chainId : ""}
        >
          <option value="">Select Blockchain</option>
          {blockchains.map((bc) => (
            <option
              key={bc.chainId}
              value={bc.chainId}
              className="hover:bg-gray-800"
            >
              {bc.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
          </svg>
        </div>
      </div>

      <div>
        <div className="relative my-2">
          <select
            className={`w-full p-2 appearance-none bg-gray-700 text-white border border-gray-600 rounded leading-tight ${
              tokens.length > 0
                ? "hover:outline-none hover:ring-1 hover:ring-blue-700 hover:border-blue-700"
                : "cursor-not-allowed"
            }`}
            value={token.address}
            onChange={(e) => {
              let temp = tokens.find(
                (token) => token.address === e.target.value
              );
              updateToken(temp);
            }}
            disabled={tokens.length === 0}
          >
            <option value="">Select Token</option>
            {tokens.map((token) => (
              <option
                key={token.address}
                value={token.address}
                className="hover:bg-gray-800"
              >
                {token.name} ({token.symbol})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            {token && token.logoURI ? (
              <img
                src={token.logoURI}
                alt={token.name}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="relative my-2">
        <input
          type="text"
          value={toValue && toValue}
          className={`w-full p-2 appearance-none bg-gray-700 text-white border border-gray-600 rounded leading-tight ${
            !disableInput && !!token
              ? "hover:outline-none hover:ring-1 hover:ring-blue-700 hover:border-blue-700"
              : "cursor-not-allowed"
          }`}
          placeholder="0"
          onChange={handleValueChange}
          disabled={!disableInput && !token}
          style={{ paddingBottom: "24px" }}
        />
        <div
          className="absolute top-3 left-2 text-gray-400 text-sm"
          style={{ transform: "translateY(100%)" }}
        >
          = $ {usdValue || 0}
        </div>
      </div>
    </div>
  );
};

export default TokenList;
