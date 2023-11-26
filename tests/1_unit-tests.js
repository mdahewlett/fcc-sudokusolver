const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

suite('Unit Tests', () => {
  suite('Solver Tests', () => {
    
    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      const solver = new Solver();
      const solution = solver.solve(validPuzzle);
      assert.equal(solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
      done();
    });
    
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
      const puzzle = '5..91372.3...8.5.9.9.25m.8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      const solver = new Solver();
      const solution = solver.solve(puzzle);
      assert.equal(solution, false);
      done();
    });

    test( 'Logic handles a puzzle string that is not 81 characters in length', (done) => {
      const puzzle = '..9..172.16.58.3....2432......1...69.83.9.....6.62.71...9......1945....172.16.58.3..6..';
      const solver = new Solver();
      const solution = solver.solve(puzzle);
      assert.equal(solution, false);
      done();
    });

    test('Logic handles a valid row placement', (done) => {
      const solver = new Solver();
      assert.equal(
        solver.checkRowPlacement(validPuzzle, 'A', '2', '9'),
        true
      );
      done();
    });

    test('Logic handles an invalid row placement', (done) => {
      const solver = new Solver();
      assert.equal(
        solver.checkRowPlacement(validPuzzle, 'A', '2', '1'),
        false
      );
      done();
    });

    test('Logic handles a valid column placement', (done) => {
      const solver = new Solver();
      assert.equal(
        solver.checkColPlacement(validPuzzle, 'A', '2', '8'),
        true
      );
      done();
      });

    test('Logic handles an invalid column placement', (done) => {
      const solver = new Solver();
      assert.equal(
        solver.checkColPlacement(validPuzzle, 'A', '2', '7'),
        false
      );
      done();
      });

    test('Logic handles a valid region (3x3 grid) placement', (done) => {
      const solver = new Solver();
      assert.equal(
        solver.checkRegionPlacement(validPuzzle, 'E', '4', '8'),
        true
      );
      done();
      });

    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
      const solver = new Solver();
      assert.equal(
        solver.checkRegionPlacement(validPuzzle, 'E', '4', '2'),
        false
      );
      done();
      });

    test( 'Valid puzzle strings pass the solver', (done) => {
      const solver = new Solver();
      const solution = solver.solve(validPuzzle);
      assert.equal(solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
      done();
    });

    test( 'Invalid puzzle strings fail the solver', (done) => {
      const solver = new Solver();
      const solution = solver.solve('..9..172.16.58.3....2432......1...69.83.9.....6.62.71...9......1945....172.16.58.3..6..');
      assert.equal(solution, false);
      done();
    });

    test( 'Solver returns the expected solution for an incomplete puzzle', (done) => {
      const solver = new Solver();
      const solution = solver.solve(validPuzzle);
      assert.equal(solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
      done();
    });
    
  });
});
