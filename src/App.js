import './App.css';
import './components/background1.css';

//React Stuff
import React, { useState, useEffect, Component } from 'react';

//My Components
import NavbarComponent from './components/NavBar.js';
import SilverClaim from './components/SilverClaim.js';
import GoldClaim from './components/GoldClaim.js';
import UtcClock from './components/UtcClock.js';
import Background1 from './components/background1.js';
import Title from './components/title.js';

//Import Contracts
import { firstSilverContractABI } from './abi/smartContractABI.js';

//External Libraries
import Web3 from 'web3';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      SilverNFT: true,
      UserWalletAddress: "",
      ListofContractInformation : []
    };
    this.pageHandleChange = this.pageHandleChange.bind(this);
  }

  async componentDidMount() {
    await this.initWeb3();
    await this.loadBlockchainData();
  }

  loadBlockchainData = async () => {
    //Wait for Web3 to Have a Vallue
    while (!this.state.web3) {
      // Wait for a short duration before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
 
    //Initiate web3 object after initialisation
    const web3Instance = this.state.web3;

    //Fetch Accounts after Enabling
    const accounts = await web3Instance.eth.getAccounts();
    this.setState({ UserWalletAddress: accounts[0] });

    //Start Parsing Contract
    const networkId = await web3Instance.eth.net.getId();

    const firstSilverContractData = firstSilverContractABI[0].networks[networkId];

    /* if(firstSilverContractData){
      const tokenClaimContract = new web3Instance.eth.net.Contract()
    } */
    
    if(firstSilverContractData){
      const numberofContracts = firstSilverContractABI.length;
      let _listofContractInformation = [];

      //Create and Set New Array of Contracts
      for(let i=0; i<numberofContracts; i++){
        console.log(
          "Contract Number :" + i +
          "\nContract Address :" +  firstSilverContractABI[i].networks[networkId].address
        )
        _listofContractInformation.push(
          new web3Instance.eth.Contract(
            firstSilverContractABI[i].abi,
            firstSilverContractABI[i].networks[networkId].address
          )
        );
      }

      //Record to State List of Contracts
      this.setState({ListofContractInformation : _listofContractInformation});
    } else {
      window.alert("Wrong Network...We're on Polygon!")
      window.location.reload();
    }

  }

  initWeb3 = async () => {
    try {
      if (window.ethereum) {
        // Use MetaMask provider
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.setState({ web3: web3Instance });

      } else {
        window.alert('MetaMask not detected! Please install MetaMask.');
        window.location.reload();
      }
    } catch (error) {
      console.error(error.message || 'An error occurred during initialization.');
      window.location.reload();
    }
  };


  pageHandleChange = (isSilverNFT) => {
    this.setState({ SilverNFT: isSilverNFT });
  };

  //Function to Interact with Web3 Interface
  claimTokens = (id, address) => {

    this.setState({ loading: true });
    this.state.tokenClaimContract.methods.claimTokens(id, address)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
            this.setState({ loading: false });
        }).catch((e) => {
            window.location.reload(false);
        });

};



  render() {
     let content = this.state.SilverNFT;
    //Renter Content Selection Here Before Displaying on Final Draft

    return (
      <div>
        <Background1/>
        <NavbarComponent web3={this.state} />
        <Title/>
        
        <div id='bg2'>
          
        <UtcClock />
        <div className="centered-buttons" >
          <button className="custom-button" onClick={() => this.pageHandleChange(true)}>Silver NFT</button>
          <button className="custom-button" onClick={() => this.pageHandleChange(false)}>Gold NFT</button>
        </div>
        
        {this.state.SilverNFT ?
          <SilverClaim _props={this.state} /> :
          <GoldClaim _props={this.state}/>
        }
      </div>
      <br/><br/><br/><br/><br/><br/><br/>

      </div>
    );
  }
}

export default App;

