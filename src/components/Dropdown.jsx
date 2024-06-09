import React, { useEffect, useRef, useState } from 'react';
import '../styles/dropdown.css';
import Fuse from 'fuse.js';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coinsData, setCoinsData] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL COINS');
  const [favorites, setFavorites] = useState([]);

  const modalRef = useRef();
  const toggleButtonRef = useRef();
  const inputRef = useRef();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const changeCoinsCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleClickOutside = (event) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      event.target !== toggleButtonRef.current
    ) {
      setIsOpen(false);
    }
  };

  const toggleFavorite = (coin) => {
    if (favorites.includes(coin)) {
      setFavorites(favorites.filter((c) => c !== coin));
    } else {
      setFavorites([...favorites, coin]);
    }
  };

  useEffect(() => {
    fetch('https://api-eu.okotoki.com/coins')
      .then((res) => res.json())
      .then((data) => setCoinsData(data));
  }, []);

  useEffect(() => {
    const fuse = new Fuse(coinsData, { keys: ['name', 'symbol'], threshold: 0.3 });
    if (searchQuery.trim()) {
      setFilteredCoins(fuse.search(searchQuery).map((result) => result.item));
    } else {
      setFilteredCoins(coinsData);
    }
  }, [searchQuery, coinsData]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="button-menu-container">
      <button
        ref={toggleButtonRef}
        className={`menu-button ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}>
        <svg
          className="button-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24">
          <path
            fill="white"
            d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1l8.05-9.12A8.251 8.251 0 1 0 15.25.01zm0 15a6.75 6.75 0 1 1 0-13.5a6.75 6.75 0 0 1 0 13.5"
          />
        </svg>
        SEARCH
      </button>
      {isOpen && (
        <div className="menu" ref={modalRef}>
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path
              fill="white"
              d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1l8.05-9.12A8.251 8.251 0 1 0 15.25.01zm0 15a6.75 6.75 0 1 1 0-13.5a6.75 6.75 0 0 1 0 13.5"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="menu-options">
            <button
              className={`menu-button ${selectedCategory === 'FAVORITES' ? 'category' : ''}`}
              onClick={() => changeCoinsCategory('FAVORITES')}>
              <svg
                className="favorite-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                />
              </svg>
              FAVORITES
            </button>
            <button
              className={`menu-button ${selectedCategory === 'ALL COINS' ? 'category' : ''}`}
              onClick={() => changeCoinsCategory('ALL COINS')}>
              ALL COINS
            </button>
          </div>
          <div className="menu-section">
            <ul>
              {selectedCategory === 'ALL COINS'
                ? filteredCoins.map((coin, index) => (
                    <li
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(coin);
                      }}>
                      {favorites.includes(coin) ? (
                        <svg
                          className="coins-star-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(coin);
                          }}>
                          <path
                            fill="white"
                            d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="coins-star-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24">
                          <path
                            fill="white"
                            d="m8.85 16.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zM5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275zM12 12.25"
                          />
                        </svg>
                      )}
                      {coin}
                    </li>
                  ))
                : favorites.map((coin, index) => (
                    <li
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(coin);
                      }}>
                      <svg
                        className="coins-star-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24">
                        <path
                          fill="white"
                          d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                        />
                      </svg>
                      {coin}
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
