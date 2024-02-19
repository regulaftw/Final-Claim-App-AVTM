import React, { useState, useEffect } from 'react';
import './SilverClaim.css';

import ErrorPopup from './ErrorPopup';
import CircularProgress from '@mui/material/CircularProgress';

import { silverWhiteList } from './Whitelist/silverWhiteList';

const SilverClaim = ({ _props }) => {
  //Parsing Props
  const props = _props;

  const _nftAddress = "0x228585D835745FDde074E9254631cE723112bfDB";

  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [number4, setNumber4] = useState('');

  const [number1enabled, setNumber1enabled] = useState('');
  const [number2enabled, setNumber2enabled] = useState('');
  const [number3enabled, setNumber3enabled] = useState('');
  const [number4enabled, setNumber4enabled] = useState('');

  const [invalidSubmitt, setInvalidSubmitt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  //Verify User Valid User Address
  const verifyEligibleUser = (userAddress) => {

    //List of Eligible Address's
    let listofAddress = silverWhiteList;

    for (var i = 0; i < listofAddress.length; i++) {
      if (listofAddress[i] == userAddress) {
        return true;
      }
    }

    return false;

  }

  //Get User Input
  const getUserInput = (listofInputs) => {
    const userInputObject = {};

    for (var i = 0; i < 4; i++) {
      if (listofInputs[i] != '') {
        userInputObject[i] = listofInputs[i];
        return userInputObject;
      }
    }

    //Handle No Input
    window.alert("No Input was Submitted")
    window.location.reload();
  }

  // Handle Claim With Contract
const claimTokens = async (id, address, claimBlock) => {
  // Initiate Variables
  let { UserWalletAddress } = props;
  let { ListofContractInformation } = props;
  let tokenClaimContract = ListofContractInformation[claimBlock]; // Change to ClaimBlock Logic later

  try {
    // setLoading(true);

    // Your claimTokens logic here
    // Your claimTokens logic here
    const receipt = await tokenClaimContract.methods.claimTokens(id, address).send({ from: UserWalletAddress });

    // Check the status property of the receipt
    if (receipt.status === true) {
        // Transaction successful
        setSubmitting(false);
    } else {
        // Transaction reverted
        // Extract the specific reason from the receipt (if available)
        const reason = receipt.revertReason || "Transaction reverted.";
        setErrorMessage(`Error during token claim: ${reason}`);
        console.log(errorMessage);
        window.location.reload();
    }

    // Additional logic after successful claim
  } catch (error) {
    //console.error(error);

    if (error.reason) {
      // Check if the error has a "reason" property (this assumes your contract uses revert with a reason string)
      setErrorMessage(`Error during token claim: ${error.message}`);
      console.log(errorMessage)
      setSubmitting(false);
    } else if (error.message && error.message.includes("denied")) {
      // Check if the error message contains "denied" (user denied signature)
      setErrorMessage("User denied transaction signature");
      console.log(errorMessage)
      setSubmitting(false);
    } else {
      // Handle other types of errors
      setErrorMessage("Error during token claim. Please try again.");
      console.log(errorMessage)
      setSubmitting(false);
    }
  } finally {
    setSubmitting(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();

    //Start Loading Screen
    setSubmitting(true);

    //Check If Address is Eligible, Prevents Inelligible Address's from taking Part
    const { UserWalletAddress } = props;
    if (!verifyEligibleUser(UserWalletAddress)) {
      //Displays Error Message and Resets
      setSubmitting(false);
      setInvalidSubmitt(true);
      return;
    }

    //Carry Out Succesful Submit
    //Get User Input
    const listofInputs = [number1, number2, number3, number4];
    let userInput = getUserInput(listofInputs);

    if(userInput){
    const [[_claimBlock, _nftId]] = Object.entries(userInput);

    let { ListofContractInformation } = props;
    console.log(userInput);
    console.log(ListofContractInformation)

    claimTokens(_nftId,_nftAddress,_claimBlock);
    }

    
  };



  useEffect(() => {
    //Prepare Time Var to be Used
    const now = new Date();

    //Time Starts with 0 Jan is 0, Dec is 11

    const firstWindow = {
      startTime: new Date(2024, 1, 19, 5, 0, 0), // 8:00 AM
      endTime: new Date(2024, 1, 25, 5, 0, 0), // 8:00 AM
    };

    const firstWindowWithinTime = now >= firstWindow.startTime && now <= firstWindow.endTime
    setNumber1enabled(firstWindowWithinTime);

    const secondWindow = {
      startTime: new Date(2024, 2, 4, 5, 0, 0), // 8:00 AM
      endTime: new Date(2024, 2, 10, 5, 0, 0), // 8:00 AM
    };

    const secondWindowWithinTime = now >= secondWindow.startTime && now <= secondWindow.endTime
    setNumber2enabled(secondWindowWithinTime);

    const thirdWindow = {
      startTime: new Date(2024, 3, 1, 5, 0, 0), // 8:00 AM
      endTime: new Date(2024, 3, 7, 5, 0, 0), // 8:00 AM
    };

    const thirdWindowWithinTime = now >= thirdWindow.startTime && now <= thirdWindow.endTime
    setNumber3enabled(thirdWindowWithinTime);

    const fourthWindow = {
      startTime: new Date(2024, 4, 6, 5, 0, 0), // December 5, 2023, 11:00 AM
      endTime: new Date(2024, 4, 12, 5, 0, 0), // December 5, 2023, 12:00 AM (next day)
  };  

    const fourthWindowWithinTime = now >= fourthWindow.startTime && now <= fourthWindow.endTime
    setNumber4enabled(fourthWindowWithinTime);

  }, []);

  return (
    
    <div className="form-container">
      {submitting ? (
      <div>
        <CircularProgress size={100} thickness={5} color="secondary" />
      </div>
      ) : (
        <>
          <ErrorPopup showError={invalidSubmitt} />
          <form onSubmit={handleSubmit} className="silver-claim-form">
              <div className="form-field">
                  <label>Claim 1: </label>
                  <input type="number" value={number1} onChange={(e) => setNumber1(e.target.value)} disabled={!number1enabled} />
              </div>
              <div className="form-field">
                  <label>Claim 2: </label>
                  <input type="number" value={number2} onChange={(e) => setNumber2(e.target.value)} disabled={!number2enabled} />
              </div>
              <div className="form-field">
                  <label>Claim 3: </label>
                  <input type="number" value={number3} onChange={(e) => setNumber3(e.target.value)} disabled={!number3enabled} />
              </div>
              <div className="form-field">
                  <label>Claim 4: </label>
                  <input type="number" value={number4} onChange={(e) => setNumber4(e.target.value)} disabled={!number4enabled} />
              </div>
              
              <button type="submit" className="submit-button">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default SilverClaim;