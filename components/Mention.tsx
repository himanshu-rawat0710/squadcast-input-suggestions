import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
}

interface MentionProps {
  data: User[];
  onMentionSelect: (selectedOption: string) => void;
}

const Mention: React.FC<MentionProps> = ({ data, onMentionSelect }) => {
  const [mentionInput, setMentionInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);


  //useEffects

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  //event handlers for input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMentionInput(value);

    if (value.includes("@")) {
      setShowSuggestions(true);
      const searchTerm = value.split("@")[1].toLowerCase();

      const filtered = data.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm) || user.last_name.toLowerCase().includes(searchTerm)
      );

      setFilteredUsers(filtered);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleUserClick = (user: User) => {
    onMentionSelect(`@${user.first_name} ${user.last_name}`);
    setShowSuggestions(false);
    setMentionInput((prevInput) => {
      const prefix = prevInput.split("@")[0];
      return `${prefix}@${user.first_name} ${user.last_name} `;
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex <= 0 ? filteredUsers.length - 1 : prevIndex - 1
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex >= filteredUsers.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex !== -1) {
        const selectedUser = filteredUsers[selectedSuggestionIndex];
        onMentionSelect(`@${selectedUser.first_name} ${selectedUser.last_name}`);
        setShowSuggestions(false);
        setMentionInput((prevInput) => {
          const prefix = prevInput.split("@")[0];
          return `${prefix}@${selectedUser.first_name} ${selectedUser.last_name} `;
        });
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={mentionInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type here..."
      />
      {showSuggestions && (
        <div
          ref={suggestionRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 999,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            maxHeight: '150px',
            overflowY: 'auto',
          }}
          tabIndex={0}
        >
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              style={{
                cursor: 'pointer',
                padding: '5px',
                backgroundColor: selectedSuggestionIndex === index ? 'lightblue' : 'inherit',
              }}
              aria-selected={selectedSuggestionIndex === index}
            >
              {`@${user.first_name} ${user.last_name}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mention;
