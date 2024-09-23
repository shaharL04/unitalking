import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profileSettings.css'; // Your CSS for styles

const ProfileSettings = ({ name, email , phoneNumber, dateOfBirth}) => {
  const [userData, setUserData] = useState({
    name: name,
    email: email,
    phoneNumber: phoneNumber ?? '', 
    dateOfBirth: dateOfBirth ?? ''
  });

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:8080/updateUserData", 
        { newUserData: userData },
        { withCredentials: true }
      );
      console.log('User data saved:', response.data);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="personal-info-container">
      <h2>Personal Information</h2>

      <div className="input-group">
        <label htmlFor="name">Full Name*</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="email">Email Address*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="input-group">
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={userData.dateOfBirth}
          onChange={handleInputChange}
        />
      </div>

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default ProfileSettings;
