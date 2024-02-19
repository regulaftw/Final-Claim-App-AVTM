import React, { useState, useEffect } from 'react';
import logo from './img/aventislogo.png'; // Ensure the logo path is correct
import './NavBar.css'; // Import the CSS file

const NavbarComponent = ( props ) => {
  
  const { web3 } = props.web3;

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [network, setNetwork] = useState(null);

  const handleScroll = () => {
    const offset = window.scrollY;
    setIsScrolled(offset > 50);
};

useEffect(() => {
  window.addEventListener('scroll', handleScroll);

  return () => {
      window.removeEventListener('scroll', handleScroll);
  };
}, []);

  useEffect(() => { 
    
    const fetchNetwork = async () => {
      try {
        const networkId = await web3.eth.net.getId();
        setNetwork(networkId);
      } catch (error) {
        console.error(error.message || 'An error occurred while fetching network information.');
      }
    };
 
    const fetchAccounts = async () => {
      try {
        const fetchedAccounts = await web3.eth.getAccounts();
        setAccounts(fetchedAccounts);
        setSelectedAccount(fetchedAccounts[0] || null);
      } catch (error) {
        console.error(error.message || 'An error occurred while fetching accounts.');
      }
    };

    fetchNetwork();
    fetchAccounts();
  }, [web3]);

  const switchAccount = async (newAccount) => {
    try {
      const accounts = await web3.eth.requestAccounts();
      setSelectedAccount(newAccount || accounts[0] || null);
      setDropdownOpen(false);
    } catch (error) {
      console.error(error.message || 'An error occurred while switching accounts.');
    }
  };

  const renderAccountOptions = () => {
    return accounts.map((account) => (
      <div
        key={account}
        className={`dropdown-item ${account === selectedAccount ? 'active' : ''}`}
        onClick={() => switchAccount(account)}
      >
        {account}
      </div>
    ));
  };

  // A fancy function to shorten someone's wallet address
  const accountTruncate = (str) => {
    return str ? str.substring(0, 5) + "..." + str.substring(str.length - 4) : "";
  };

  return (
    <nav className={`nav ${isScrolled ? 'affix' : ''}`}>
        <div className="container">
            <div className="logo">
                <a href="/#">
                    <img src={logo} alt="Aventis Logo" height="40" />
                </a>
            </div>
            <div className="main_list">
                {/* Add navigation links here if needed */}
            </div>
            <div className="menu">
                <div className="dropdown">
                    <div className={`dropdown-toggle ${isDropdownOpen ? 'open' : ''}`} onClick={() => setDropdownOpen(!isDropdownOpen)}>
                        {selectedAccount ? accountTruncate(selectedAccount) : 'Select Account'}
                    </div>
                    {isDropdownOpen && <div className="dropdown-menu">{renderAccountOptions()}</div>}
                </div>
            </div>
        </div>
    </nav>
);
};

export default NavbarComponent;