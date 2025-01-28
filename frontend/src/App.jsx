import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0x22ee52a264e34cd11c709526ffef469dce2ffa95";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const contractInstance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
      getBalance(contractInstance);
    } else {
      toast.error("Please install MetaMask to use this app");
    }
  };

  const getBalance = async (contractInstance) => {
    try {
      const balance = await contractInstance.methods.getBalance().call();
      setBalance(balance);
    } catch (error) {
      toast.error("Failed to fetch balance");
    }
  };

  const handleDeposit = async () => {
    if (!amount) return toast.warn("Enter a valid amount");
    try {
      await contract.methods.deposit(amount).send({ from: account });
      toast.success("Deposit successful");
      getBalance(contract);
    } catch (error) {
      toast.error("Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    if (!amount) return toast.warn("Enter a valid amount");
    try {
      await contract.methods.withdraw(amount).send({ from: account });
      toast.success("Withdrawal successful");
      getBalance(contract);
    } catch (error) {
      toast.error("Withdrawal failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Blockchain Assessment DApp</h1>
      <p>Connected Account: {account}</p>
      <p>Contract Balance: {balance} ETH</p>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
      <button onClick={handleWithdraw}>Withdraw</button>
      <ToastContainer />
    </div>
  );
}

export default App;