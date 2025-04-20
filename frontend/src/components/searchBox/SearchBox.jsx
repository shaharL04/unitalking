import { useState } from 'react';
import './searchBox.css';

const SearchBox = ({ options, onUserSelect }) => {
  const [input, setInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);

    if (value) {
      const filtered = options.filter((option) =>
        option.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const handleOptionClick = (option) => {
    setInput(''); 
    setFilteredOptions([]);
    onUserSelect(option); // Notify parent about the selected user
  };

  return (
    <div className="search-box">
      <p> Group Members</p>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search..."
        className="search-input"
      />
      {filteredOptions.length > 0 && (
        <ul className="dropdownWrapper">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className="dropdown-item"
            >
              {option.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
