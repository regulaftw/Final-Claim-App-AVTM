import React, { useEffect, useState } from 'react';
import './GoldClaim.css'

import ErrorPopup from './ErrorPopup';
import CircularProgress from '@mui/material/CircularProgress';

const GoldClaim = ({ _props }) => {
  //Parsing Props
  const props = _props;

  const _nftAddress = "0xc5995Df3841D328e067680518779490dbD47311e";

  const [clickedButton1, setClickedButton1] = useState(false);
  const [clickedButton2, setClickedButton2] = useState(false);
  const [clickedButton3, setClickedButton3] = useState(false);
  const [clickedButton4, setClickedButton4] = useState(false);

  const [clickedButton1enabled, setClickedButton1enabled] = useState(false);
  const [clickedButton2enabled, setClickedButton2enabled] = useState(false);
  const [clickedButton3enabled, setClickedButton3enabled] = useState(false);
  const [clickedButton4enabled, setClickedButton4enabled] = useState(false);

  const [invalidSubmitt, setInvalidSubmitt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const claimTokens = async (claimBlock) => {
    // Initiate Variables
    let { UserWalletAddress } = props;
    let { ListofContractInformation } = props;
    let tokenClaimContract = ListofContractInformation[claimBlock]; // Change to ClaimBlock Logic later
    let id = 0;
    let address = _nftAddress;

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
  }

  const handleButtonClick = (buttonNumber) => {
    //Get User Input
    setSubmitting(true);
    claimTokens(buttonNumber);
  };

  useEffect(() => {
    //Prepare Time Var to be Used
    const now = new Date();

    const firstWindow = {
      startTime: new Date(2024, 1, 19, 5, 0, 0), // 8:00 AM
      endTime: new Date(2024, 1, 25, 5, 0, 0), // 8:00 AM
    };

    const firstWindowWithinTime = now >= firstWindow.startTime && now <= firstWindow.endTime
    setClickedButton1enabled(firstWindowWithinTime);

    const secondWindow = {
      startTime: new Date(2024, 2, 4, 5, 0, 0), // 8:00 AM
      endTime: new Date(2024, 2, 10, 5, 0, 0), // 8:00 AM
    };

    const secondWindowWithinTime = now >= secondWindow.startTime && now <= secondWindow.endTime
    setClickedButton2enabled(secondWindowWithinTime);

    const thirdWindow = {
      startTime: new Date(2024, 3, 1, 5, 0, 0), // 8:00 AM
      endTime: new Date(2024, 3, 7, 5, 0, 0), // 8:00 AM
    };

    const thirdWindowWithinTime = now >= thirdWindow.startTime && now <= thirdWindow.endTime
    setClickedButton3enabled(thirdWindowWithinTime);

    const fourthWindow = {
      startTime: new Date(2024, 4, 6, 5, 0, 0), // December 5, 2023, 11:00 AM
      endTime: new Date(2024, 4, 12, 5, 0, 0), // December 5, 2023, 12:00 AM (next day)
  };  

    const fourthWindowWithinTime = now >= fourthWindow.startTime && now <= fourthWindow.endTime
    setClickedButton4enabled(fourthWindowWithinTime);



  }, []);


  return (
    <div className="centered-form">
      {submitting  ? (
      <div>
        <CircularProgress size={100} thickness={5} color="secondary" />
      </div>
      ) : (
        <>
          <br />
          <form>
            <button
              type="button"
              onClick={() => handleButtonClick(0)}
              disabled={!clickedButton1enabled}
            >
              Claim 1
            </button>
            <br />
            <button
              type="button"
              onClick={() => handleButtonClick(1)}
              disabled={!clickedButton2enabled}
            >
              Claim 2
            </button>
            <br />
            <button
              type="button"
              onClick={() => handleButtonClick(2)}
              disabled={!clickedButton3enabled}
            >
              Claim 3
            </button>
            <br />
            <button
              type="button"
              onClick={() => handleButtonClick(3)}
              disabled={!clickedButton4enabled}
            >
              Claim 4
            </button>
          </form>
          <br />
          
        </>
      )}
    </div>
  );
};

export default GoldClaim;