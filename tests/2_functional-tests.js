const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  suite('Routing Tests', () => {
    
    suite('POST /api/solve', () => {
      
      test('Solve a puzzle with valid puzzle string', (done) => {
        chai
          .request(server)
          .post('/api/solve')
          .send({ puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
            done();
          });
      });

      test( 'Solve a puzzle with missing puzzle string', (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
      });

      test( 'Solve a puzzle with invalid characters', (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '5..91372.3...8.5.9.9.25m.8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
      });

      test( 'Solve a puzzle with incorrect length', (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '..9..172.16.58.3....2432......1...69.83.9.....6.62.71...9......1945....172.16.58.3..6..'})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 
                       "Expected puzzle to be 81 characters long");
          done();
        });
      });

      test( 'Solve a puzzle that cannot be solved', (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send( { puzzle: '828.4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error,
                      "Puzzle cannot be solved");
          done();
        });
      });
      
    });

    suite('POST /api/check', () => {
      
      test( 'Check a puzzle placement with all fields', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                coordinate: 'A3',
                value: '7'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
      });

      test( 'Check a puzzle placement with single placement conflict', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
               coordinate: 'A2',
               value: '9'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          done();
        });
      });

      test( 'Check a puzzle placement with multiple placement conflicts', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
               coordinate: 'A2',
               value: '5'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          done();
        });
      });

      test( 'Check a puzzle placement with all placement conflicts', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
               coordinate: 'A2',
               value: '2'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          done();
        });
      });

      test( 'Check a puzzle placement with missing required fields', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
               coordinate: 'A2',
               value: ''} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
      });

      test( 'Check a puzzle placement with invalid characters', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1M5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
               coordinate: 'A2',
               value: '9'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
      });

      test( 'Check a puzzle placement with incorrect length', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37',
               coordinate: 'A2',
               value: '9'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
      });

      test( 'Check a puzzle placement with invalid placement coordinate', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
               coordinate: 'Q2',
               value: '9'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
      });

      test( 'Check a puzzle placement with invalid placement value', (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
               coordinate: 'A2',
               value: '10'} )
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
      });
      
    });

  });
});
  

after(() => {
    chai.request(server).get('/api')
});