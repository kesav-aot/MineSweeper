import React from 'react';
import './square.css';
import bombIcon from '../assets/bomb.png';
import flagIcon from '../assets/minesweeper.png';

const Square = ({ id, status, onClick, isMine, isFlagged }) => {
    // Determine the class based on status
    const getButtonClass = () => {
        const classes = {
            hidden: 'button hidden',
            revealed: 'button revealed',
            mine: `button mine ${isMine ? 'show-icon' : ''}`,
            flagged: `button flagged ${isFlagged ? 'show-icon' : ''}`
        };
        return classes[status] || 'button'; // Default to 'button' if status does not match
    };

    return (
        <div className="square">
            <button
                className={getButtonClass()}
                onClick={() => onClick(id)}
                disabled={status === 'revealed'}
                aria-label={status === 'mine' ? 'Mine' : status === 'flagged' ? 'Flagged' : 'Hidden'}
            >
                {status === 'mine' && <img src={bombIcon} alt="bomb" />}
                {status === 'flagged' && <img src={flagIcon} alt="flag" />}
            </button>
        </div>
    );
};

export default Square;
