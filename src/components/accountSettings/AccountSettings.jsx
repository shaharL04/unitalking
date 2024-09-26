import React, { useState, useEffect } from 'react';
import './accountSettings.css';
import { Select } from '@mantine/core';
import axios from 'axios';  
import Alerts from '../Alerts';

const AccountSettings = () => {
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState(''); 
  const [alerts, setAlerts] = useState([]);
  const [langArr, setLangArr] = useState([]);

  useEffect(() => {
    async function fetchTranslationLangs() {
      try {
        setAlerts([]); // Clear existing alerts before making the request
        const response = await axios.get("http://localhost:8080/getTranslationLangs");
        const modifiedData = response.data.map(({ targets, ...rest }) => rest);
        setLangArr(modifiedData);
        console.log(modifiedData);
      } catch (error) {
        if (error.response) {
          setAlerts([error.response.data]); // Handle server-side errors
          console.error('Error fetching translation languages:', error.response.data);
        } else {
          console.error('Error fetching translation languages:', error.message); // General errors
        }
      }      
    }

    fetchTranslationLangs();
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleSavePassword = async () => {
    try {
      setAlerts([]); // Clear existing alerts before making the request
      const response = await axios.post(
        "http://localhost:8080/updateUserPassword",
        { newPassword: password },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      if (error.response) {
        setAlerts([error.response.data]); // Handle server-side errors
        console.error('Error saving password:', error.response.data);
      } else {
        console.error('Error saving password:', error.message); // General errors
      }
    }
  };  

  const handleSaveLanguage = async () => {
    try {
      setAlerts([]); // Clear existing alerts before making the request
      const response = await axios.post(
        "http://localhost:8080/updatePreferedLang",
        { langCode: language },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      if (error.response) {
        setAlerts([error.response.data]); // Handle server-side errors
        console.error('Error saving language preference:', error.response.data);
      } else {
        console.error('Error saving language preference:', error.message); // General errors
      }
    }
  };
  

  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>

      {/* Password Section */}
      <div className="input-group">
        <label htmlFor="password">Change Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter new password"
        />
        <button className="save-button" onClick={handleSavePassword}>
          Save Password
        </button>
      </div>

      {/* Language Section */}
      <div className="input-group">
        <label htmlFor="language">Language Preferences</label>
        <Select 
          placeholder="Pick a language"
          data={langArr.map((lang) => ({ value: lang.code, label: lang.name }))}
          onChange={handleLanguageChange} 
        />
        <button className="save-button" onClick={handleSaveLanguage}>
          Save Language
        </button>
        <Alerts alerts={alerts}/>
      </div>
    </div>
  );
};

export default AccountSettings;
