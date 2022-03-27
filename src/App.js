// Import hooks from React, functionality from ethers
import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";

// Import abi from Dragon Horde smart contract
import abi from "./contracts/DragonHorde.json";

function App() {

  // Store and update state of
  //    isWalletConnected, yourAddress
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [yourAddress, setYourAddress] = useState(null);
  
  // Store and update state of
  //    dragon, isDragon
  const [isDragon, setIsDragon] = useState(false);
  const [dragon, setDragon] = useState(null);
  
  // Store and update state of
  //    dragonName, isGoodMood, hordeSize
  const [dragonName, setDragonName] = useState(null);
  const [isGoodMood, setIsGoodMood] = useState(null);
  const [hordeSize, setHordeSize] = useState(null);

  // Store and update state of
  //    inputValue
  const [inputValue, setInputValue] = useState( { contribute: "", request: "",
    dragonName: "" , goodMood: "", appoint: "", retire: ""});
  
  // Store and update state of
  //    error
  const [error, setError] = useState(null);

  // Store contract address and abi file
  const contractAddress = '0x523c5cC854e94Cd30D826cDF85D2EcF927bf1A7D';
  const contractABI = abi.abi;

  // Connect Metamask account
  const checkIfWalletIsConnected = async () => {
    try {

      // If ethereum is in window object
      //    Request array of Metamask accounts
      //    Store the account at index 0 in const account
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourAddress(account);
        console.log("Account Connected: ", account);

      // If ethereum is not in window object
      //    Error and console message
      } else {
        setError("Install Metamask to access the horde");
        console.log("No Metamask wallet detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get address of the dragon, deployer of the contract
  const getDragonHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        let owner = await dragonHordeContract.dragon();
        setDragon(owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsDragon(true);
        }
      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Get name of the dragon
  const getDragonName = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        let dragonName = await dragonHordeContract.dragonName();
        dragonName = utils.parseBytes32String(dragonName);
        setDragonName(dragonName.toString());
      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }


  // Set name of the dragon
  const setDragonNameHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await dragonHordeContract.setDragonName(utils.formatBytes32String(inputValue.dragonName));
        console.log("Naming dragon...");
        await txn.wait();
        console.log("Dragon name set.", txn.hash);
        await getDragonName();

      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  // Get mood of the dragon
  const isGoodMoodHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        let isGoodMood = await dragonHordeContract.isGoodMood();
        setIsGoodMood(isGoodMood);

      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const hordeSizeHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        let hordeSize = await dragonHordeContract.getHordeSize();
        setHordeSize(utils.formatEther(hordeSize));
        console.log("Retrieved size of horde.", hordeSize);

      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const appointMinionHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await dragonHordeContract.appointMinion(inputValue.appoint);
        console.log("Appointing minion...");
        await txn.wait();
        console.log("Minion appointed.", txn.hash);

      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const retireMinionHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await dragonHordeContract.retireMinion(inputValue.retire);
        console.log("Retiring minion...");
        await txn.wait();
        console.log("Minion retired.", txn.hash);

      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const contributeGoldHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await dragonHordeContract.contributeGold({ value: ethers.utils.parseEther(inputValue.request) });
        console.log("Contributing gold...");
        await txn.wait();
        console.log("Gold contributed.", txn.hash);

        hordeSizeHandler();

      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const requestGoldHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dragonHordeContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await dragonHordeContract.requestGold(yourAddress, ethers.utils.parseEther(inputValue.contribute));
        console.log("Requesting gold...");
        await txn.wait();
        console.log("Gold requested.", txn.hash);

        hordeSizeHandler();

      } else {
        console.log("No Ethereum object found. Install Metamask");
        setError("Install Metamask to access the horde");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getDragonName();
    getDragonHandler();
    hordeSizeHandler();
    isGoodMoodHandler();
  }, [isWalletConnected])

  return (
    <main>
      <h2><span>Dragon Horde Contract</span></h2>
      <section>
        {error && <p>{error}</p>}
        <div >
          {dragonName === "" && isDragon ?
            <p>"<strong>(Nameless Dragon)</strong>" </p> :
            <p><strong>Dragon Name:</strong> {dragonName}</p>
          }
        </div>
        <div>
          <form >
            <input
              type="text"
              onChange={handleInputChange}
              name="request"
              placeholder="0.0000 ETH"
              value={inputValue.request}
            />
            <button
              onClick={contributeGoldHandler}>Contribute gold (ETH)</button>
          </form>
        </div>
        <div >
          <form >
            <input
              type="text"
              onChange={handleInputChange}
              name="contribute"
              placeholder="0.0000 ETH"
              value={inputValue.contribute}
            />
            <button
              onClick={requestGoldHandler}>
              Request gold (ETH)
            </button>
          </form>
          <div >
          <form >
            <input
              type="text"
              onChange={handleInputChange}
              name="appoint"
              placeholder="Address"
              value={inputValue.appoint}
            />
            <button
              onClick={appointMinionHandler}>
              Appoint minion
            </button>
          </form>
        </div>
        <div>
          <form >
            <input
              type="text"
              onChange={handleInputChange}
              name="retire"
              placeholder="Address"
              value={inputValue.retire}
            />
            <button
              onClick={retireMinionHandler}>
              Retire minion
            </button>
          </form>
        </div>
        </div>
        <div>
          <p><span><strong>Horde size:</strong> </span>{hordeSize}</p>
        </div>
        <div>
          <p><span><strong>Dragon mood:</strong> </span>{isGoodMood ? "Good" : "Bad"}</p>
        </div>
        <div>
          <p><span><strong>Dragon address:</strong> </span>{dragon}</p>
        </div>
        <div>
          {isWalletConnected && <p><span><strong>Your Address:</strong> </span>{yourAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
          </button>
        </div>
      </section>
      {
        isDragon && (
          <section>
            <h2>Dragon Privileges</h2>
            <div>
              <form>
                <input
                  type="text"
                  onChange={handleInputChange}
                  name="dragonName"
                  placeholder="Enter dragon name"
                  value={inputValue.dragonName}
                />
                <button
                  onClick={setDragonNameHandler}>
                  Name the dragon
                </button>
              </form>
            </div>
          </section>
        )
      }
    </main>
  );
}
export default App;