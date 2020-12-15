import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  //? Create a default constructor
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    changeLightStartsOn: 0.25
  };
  constructor(props) {
    super(props);
    //? Create initial state
    this.state = {
      hasWon: false,
      board: this.createBoard()
    };
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    for (let i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (let j = 0; j < this.props.ncols; j++) {
        row.push(Math.random() < this.props.changeLightStartsOn); // will push true if the rand is < 0.25
      }
      board.push(row);
    }
    return board;
  }

  flipCellsAround(coord) {
    console.log('Flipping', coord);
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split('-').map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // Flip center cell , left right up down
    flipCell(y, x);
    flipCell(y, x - 1);
    flipCell(y, x + 1);
    flipCell(y - 1, x);
    flipCell(y + 1, x);

    let hasWon = board.every(row => row.every(cell => !cell)); // For every cell in every row should be false
    // Setting new state
    this.setState({ board: board, hasWon: hasWon });
  }

  render() {
    if (this.state.hasWon) {
      return (
        <div className="Board-Title">
          <div className ="winner">
          <span className="neon-orange">You</span>
          <span className="neon-blue">Win</span>
          </div>
        </div>
      );
    }

    let tableBoard = [];
    let i, j;
    for (i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (j = 0; j < this.props.ncols; j++) {
        let coord = `${i}-${j}`;
        row.push(
          <Cell
            key={coord}
            isLit={this.state.board[i][j]}
            flipCellsAround={() => this.flipCellsAround(coord)}
          />
        );
      }
      tableBoard.push(<tr key={i}>{row}</tr>);
    }

    return (
      <div>
        <div className="Board-Title">
          <div className="neon-orange">Lights</div>
          <div className="neon-blue">Out</div>
        </div>
        <table className="Board">
          <tbody>{tableBoard}</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
