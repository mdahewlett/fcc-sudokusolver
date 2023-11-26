'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      console.log(`The coordinate entered was ${coordinate}`);
      console.log(`The value entered was ${value}`);
      console.log(`The puzzle entered was ${puzzle}`);

      
      if (!puzzle || !coordinate || !value) {
        res.json({ error: "Required field(s) missing" });
        console.log('missing fields');
        return;
      }
      
      const row = coordinate.split("")[0];
      const column = coordinate.split("")[1];
      
      if (coordinate.length !== 2 || 
          !/[a-i]/i.test(row) ||
          !/[1-9]/i.test(column)
      ) {
        console.log("invalid coordinate :>> ");
        res.json({ error: "Invalid coordinate" });
        return;
      }
      
      if (!/^[1-9]$/i.test(value)) {
        let resObj = { error: "Invalid value" };
        res.json(resObj);
        console.log(resObj);
        return;
      }
      
      if (puzzle.length != 81) {
        res.json({ error: "Expected puzzle to be 81 characters long" });
        console.log('wrong length');
        return;
      }
      
      if (/[^0-9.]/g.test(puzzle)) {
        res.json({ error: "Invalid characters in puzzle" });
        return;
      }
      
      let validCol = solver.checkColPlacement(puzzle, 
                                              row, 
                                              column, 
                                              value);
      
      let validReg = solver.checkRegionPlacement(puzzle, 
                                                 row, 
                                                 column, 
                                                 value);
      
      let validRow = solver.checkRowPlacement(puzzle, 
                                              row, 
                                              column, 
                                              value);
      
      let conflicts = [];
      
      if (validCol && validReg && validRow) {
        res.json({ valid: true });
        
      } else {
        
        if (!validRow) {
          conflicts.push("row");
        }
        
        if (!validCol) {
          conflicts.push("column");
        }
        
        if (!validReg) {
          conflicts.push("region");
        }
        
        res.json({ valid: false, conflict: conflicts });
      
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      
      const { puzzle } = req.body;
      
      if (!puzzle) {
        res.json({ error: "Required field missing" });
        return;
      }
      
      if (puzzle.length != 81) {
        res.json({ error: "Expected puzzle to be 81 characters long" });
        return;
      }
      
      if (/[^0-9.]/g.test(puzzle)) {
        res.json({ error: "Invalid characters in puzzle" });
        return;
      }
      
      let solvedString = solver.solve(puzzle);
      
      if (!solvedString) {
        res.json({ error: "Puzzle cannot be solved" });
      
      } else {
        res.json({ solution: solvedString });
      }
    });
};
