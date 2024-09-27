import { useState, useEffect } from 'react';
import './addChat.css';
import SearchBox from '../searchBox/SearchBox';
import axios from 'axios';
import Alerts from '../Alerts';

const AddChat = ({ newChatHandler }) => {
  const [groupName, setGroupName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]); 
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const getAllUsersArray = async () => {
      try {
        setAlerts([]); 
        const response = await axios.post(
          'http://localhost:8080/getAllUsers',
          { test: "test" },
          { withCredentials: true }
        );
        console.log("this is all users Arr: " + JSON.stringify(response.data));
        setAllUsers(response.data);
      } catch (error) {
        if (error.response) {
          setAlerts([error.response.data]); // Handle server-side errors
          console.error('Error fetching all users:', error.response.data);
        } else {
          console.error('Error fetching all users:', error.message); // General errors
        }
      }
    };    
    getAllUsersArray();
  }, []);

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setGroupImage(file);
    }
  };

  const handleUserSelect = (user) => {
    if (!selectedMembers.find(member => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleRemoveMember = (member) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim() || !groupImage || selectedMembers.length === 0) {
      alert("Please fill in all fields, select an image, and choose members.");
      return;
    }

    console.log("Group Name:", groupName);
    console.log("Group Image:", groupImage);
    console.log("Selected Members:", selectedMembers);

    const newChatData = {
      groupName,
      groupImage,
      selectedMembers
    };

    newChatHandler(newChatData);
  };

  const filteredOptions = allUsers.filter(user => !selectedMembers.some(member => member.id === user.id));

  return (
    <form className="new-chat-group-form" onSubmit={handleSubmit}>
      {/* Group Name Input */}
      <div className="form-group">
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupNameInput"
          value={groupName}
          onChange={handleGroupNameChange}
          placeholder="Enter group name"
          required
        />
      </div>

      {/* SearchBox Input */}
      <div className='SearchBoxWrapperDiv'>
        <SearchBox options={filteredOptions} onUserSelect={handleUserSelect} />
      </div>

      {/* Selected Members in a Read-Only, Scrollable Text Area */}
      <div className="form-group">
        <label>Selected Members:</label>
        <div className="selected-members-textarea">
          {selectedMembers.map((member, index) => (
            <div key={index} className="selected-member-item">
              {member.username}
              <button type="button" className="remove-button" onClick={() => handleRemoveMember(member)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview and File Input */}
      <div className="form-group">
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="rounded-image" />
        ) : (
          <div className="placeholder rounded-image"> 
            <div className='textNoImageSelected'>
              No Image Selected
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Create Group
      </button>
      <Alerts alerts = {alerts}/>
    </form>
  );
};

export default AddChat;
