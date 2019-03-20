import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for(let i=0; i < lines.length; ++i) {
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {name: squares[a], row: [a, b, c]};
		}
	}
	return null
}

function getCoordinates(index, rows, columns) {
	columns = columns === undefined ? rows : columns;
	let coordinates = {
		row: Number.parseInt(index / columns) + 1,
		col: index % columns + 1
	};
	return coordinates;
}

function Square(props) {
	return(
		<button
			className={props.classes}
			onClick={props.onClick} >
			{props.value}
		</button>
	);
}

function SortOrderToggle(props) {
	const order = props.value === 'ASC' ? 'Ascending' : 'Decending';
	const value = `Moves in ${order} Order`
	return(
		<button onClick={props.onClick}>
			{value}
		</button>
	);
}

class Board extends React.Component {
	renderBoard() {
		let rows=[];
		for(let i = 0; i < 3; ++i) {
			rows.push(this.renderBoardRow(i))
		}
		return (
			<div>
				{rows}
			</div>
		)
	}

	renderBoardRow(i) {
		let squares = []
		for(let j = 0; j < 3; ++j) {
			squares.push(this.renderSquare(i*3+j))
		}
		return (
			<div key={i} className={'board-row'}>
				{squares}
			</div>
		)
	}

	renderSquare(j) {
		let classes = 'square';
		let winner = this.props.winner;
		if(winner) {
			classes += winner.row.includes(j) ? ' winner' : '';
		}
		return (
			<Square 
				key={j}
				classes={classes}
				value={this.props.squares[j]}
				onClick = {() => {this.props.onClick(j)}}
			/>
		);
	}

	render() {
		return(
			this.renderBoard()
		)
	}
}


class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				move_coordinates: {row: null, col: null}
			}],
			stepNumber: 0,
			xIsNext: true,
			sort: 'ASC'
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(calculateWinner(squares || squares[i])) {
			return;
		}
		if(squares[i] !==  null) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		const move_coordinates = getCoordinates(i, 3)
		this.setState({
			history: history.concat([{squares: squares, move_coordinates}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	handleSortClick() {
		this.setState(function(state, props) {
			let sort = state.sort === 'ASC' ? 'DESC' : 'ASC';
			return {sort: sort};
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		let moves = history.map((step, move) => {
			const desc = move ? `Go to move#${move} - (${step.move_coordinates.row}, ${step.move_coordinates.col})` : `Go to game start`;
			return (
				<li key={move}>
					<button
						className={this.state.stepNumber === move ? 'active' : ''}
						onClick={()=> this.jumpTo(move)}>
						{desc}
					</button>
				</li>
			);
		});
		if(this.state.sort === 'DESC') {
			let startGameButton = moves.shift();
			moves.reverse();
			moves.unshift(startGameButton)
		}

		let status;
		if(winner) {
			status = `Winner : ${winner.name}`
		} else if (this.state.stepNumber < 9) {
			status = `Next Player : ${(this.state.xIsNext ? 'X' : 'O')}`
		} else {
			status = `Match Draw`
		}

		return(
			<div className='game'>
				<div className='game-board'>
					<Board 
					squares={current.squares}
					winner={winner}
					onClick={(i)=>this.handleClick(i)}/>
				</div>
				<div className='game-info'>
					<div className='game-info'>
						<div>{status}</div>
						<div>
							<SortOrderToggle
								value={this.state.sort}
								onClick={()=>this.handleSortClick()}
							/>
						</div>
						<ol>{moves}</ol>
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Game />, document.getElementById('root'));