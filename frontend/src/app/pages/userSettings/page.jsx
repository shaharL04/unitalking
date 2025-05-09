'use client';

import React, { useState, useLayoutEffect } from 'react';
import { Modal, Button } from '@mantine/core';
import axios from 'axios';
import './UserSettings.css';

// Import Material Icons
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Import the arrow icon

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AccountSettings from '@/src/components/accountSettings/AccountSettings';
import ProfileSettings from '@/src/components/profileSettings/ProfileSettings';
import Alerts from '@/src/components/Alerts';

const UserSettings = () => {
  const [opened, setOpened] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [modalContent, setModalContent] = useState('');
  const [loggedUserData, setLoggedUserData] = useState('');

  const router = useRouter();

  useEffect(() =>{
    const checkIfUserAuthTokenExist = async () => {
      const response = await axios.get("http://localhost:8080/checkToken",{withCredentials: true})
      console.log(response.data.isAuth)
      if(!response.data.isAuth){
        router.push('/pages/login')
      }

    }
    checkIfUserAuthTokenExist()
  },[])

  useLayoutEffect(() => {
    async function getUserInfo() {
      try {
        setAlerts([]); 
        const response = await axios.post(
          "http://localhost:8080/getUserInfo", 
          { text: "test" }, 
          { withCredentials: true }
        );
        
        setLoggedUserData(response.data);
      } catch (error) {
        if (error.response) {
          setAlerts([error.response.data]); // Handle server-side errors
          console.error('Error fetching user info:', error.response.data);
        } else {
          console.error('Error fetching user info:', error.message); // General errors
        }
      }
    }

    getUserInfo();
  }, []);

  const componentMap = {
    'ProfileSettings.jsx': <ProfileSettings name={loggedUserData.username} email={loggedUserData.email} phoneNumber={loggedUserData.phone_number} dateOfBirth={loggedUserData.date_of_birth}/>,
    'AccountSettings.jsx': <AccountSettings />,
  };

  // Update sections with icons
  const settingsSections = [
    { title: 'Profile', description: 'Update your profile details.', icon: <AccountCircleIcon />, fileName: 'ProfileSettings.jsx', componentFolder: 'profileSettings' },
    { title: 'Account', description: 'Manage your account and privacy.', icon: <LockIcon />, fileName: 'AccountSettings.jsx' , componentFolder: 'accountSettings' },
    { title: 'Disclaimer', description: 'Read our disclaimer.', icon: <InfoIcon />, fileName: 'disclaimer.txt' },
    { title: 'Terms & Conditions', description: 'Review terms and conditions.', icon: <GavelIcon />, fileName: 'termsNconditions.txt' },
    { title: 'Privacy Policy', description: 'Understand our privacy policies.', icon: <PolicyIcon />, fileName: 'privacy.txt' },
  ];

  const handleModalOpen = async (section) => {
    setOpened(true);

    try {
      if (componentMap[section.fileName]) {
        // If it's a component, use the map to display the correct one
        setModalContent(componentMap[section.fileName]);
      } else {
        // For text files, fetch the content
        const response = await fetch(`/LegalTxt/${section.fileName}`);
        const content = await response.text();
        setModalContent(<div dangerouslySetInnerHTML={{ __html: content }} />);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setModalContent(<div>Failed to load content.</div>);
    }
  };

  const returnToChatList = () => {
    router.push('/pages/chatsList')
  }

  return (
    <div className='userSettingsDiv'>
    <div className="user-settings-container">
      <div className='settingsHeaderDiv'>
          <h1 className="settings-header">User Settings</h1>
          <button className="returnBtn" onClick={returnToChatList}>
              <img src="/returnBtn.svg" alt="return button icon" className="" />
          </button>
      </div>
      <div className="settings-sections">
        {settingsSections.map((section, index) => (
          <div key={index} className="settings-card" onClick={() => handleModalOpen(section)}>
            <div className="settings-card-content">
              <div className="icon-container">{section.icon}</div>
              <div className="settings-text">
                <h2 className="settings-title">{section.title}</h2>
                <p className="settings-description">{section.description}</p>
              </div>
            </div>
            <ArrowForwardIosIcon className="arrow-icon" /> {/* Add arrow icon here */}
          </div>
        ))}
      </div>

      {/* Mantine Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        withinPortal={true}
        className='mantineContainer'
      >
        {modalContent}
        <Button onClick={() => setOpened(false)}>Close</Button>
      </Modal>
    </div>
      <Alerts alerts={alerts}/>
    </div>
  );
};

export default UserSettings;