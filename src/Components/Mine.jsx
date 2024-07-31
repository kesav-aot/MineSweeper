import React, { useState, useEffect } from "react";
import './mine.css';
import Square from "./Square";

const Mine = () => {
    const [gridSize, setGridSize] = useState(3); // Default to a 3x3 grid
    const [grid, setGrid] = useState(createGrid(3));
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

    useEffect(() => {
        setGrid(createGrid(gridSize));
    }, [gridSize]);

    function createGrid(size) {
        const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ({
            status: 'hidden', // 'hidden', 'revealed', 'mine', 'flagged'
            isMine: false
        })));

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < Math.floor(size * size / 6)) { // Roughly 1/6th of the grid
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            console.log(row, col)
            if (!grid[row][col].isMine) {
                grid[row][col].isMine = true;
                minesPlaced++;
            }
        }
        return grid;
    }

    function handleSelectChange(e) {
        const size = parseInt(e.target.value, 10);
        setGridSize(size);
        setGameStatus('playing');
        setGrid(createGrid(size)); // Reset the grid
    }

    function handleSquareClick(id) {
        if (gameStatus !== 'playing') return;

        const [row, col] = id.split('-').map(Number);
        const newGrid = grid.map(row => row.slice()); // Deep copy

        if (newGrid[row][col].isMine) {
            newGrid[row][col].status = 'revealed';
            setGrid(newGrid);
            setGameStatus('lost');
        } else {
            revealCell(newGrid, row, col);
            setGrid(newGrid);
            checkWin(newGrid);
        }
    }

    function revealCell(grid, row, col) {
        if (grid[row][col].status !== 'hidden') return;

        grid[row][col].status = 'revealed';

        // Reveal adjacent cells if this cell is not next to any mines
        const adjacentCells = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        let hasAdjacentMine = false;

        for (const [dr, dc] of adjacentCells) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (grid[newRow][newCol].isMine) {
                    hasAdjacentMine = true;
                    break;
                }
            }
        }

        if (!hasAdjacentMine) {
            for (const [dr, dc] of adjacentCells) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                    if (grid[newRow][newCol].status === 'hidden') {
                        revealCell(grid, newRow, newCol);
                    }
                }
            }
        }
    }

    function checkWin(grid) {
        const hiddenCells = grid.flat().filter(cell => cell.status === 'hidden');
        const mines = grid.flat().filter(cell => cell.isMine);
        if (hiddenCells.length === mines.length) {
            setGameStatus('won');
        }
    }

    function handleReset() {
        setGridSize(gridSize); // Reinitialize grid size
        setGameStatus('playing');
        setGrid(createGrid(gridSize)); // Reset the grid
    }

    return (
        <div className="main">
            <h1>Minesweeper</h1>
            <div className="options">
                <div>
                    <label htmlFor="select">Select the number of blocks</label>
                    <select
                        name="select"
                        id="select"
                        onChange={handleSelectChange}
                        value={gridSize}
                    >
                        {Array.from({ length: 6 }, (_, i) => i + 3).map(num => (
                            <option key={num} value={num}>{num}x{num}</option>
                        ))}
                    </select>
                </div>
                <div className="mineBlock">
                    <p>Number of blocks: {gridSize * gridSize}</p>
                    <p>Status: {gameStatus === 'won' ? 'You Won!' : gameStatus === 'lost' ? 'Game Over' : ''}</p>
                    <div className="mines" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                        {grid.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                    <Square
                                        key={`${rowIndex}-${colIndex}`}
                                        id={`${rowIndex}-${colIndex}`}
                                        status={cell.status}
                                        onClick={handleSquareClick}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                    <button className="reset-button" onClick={handleReset}>Reset Game</button>
                </div>
            </div>
        </div>
    );
};

export default Mine;
