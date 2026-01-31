/**
 * Unit tests for Game Routes
 */

import request from 'supertest';
import app from '../src/app.js';

describe('Game Routes', () => {
  let gameId;
  let userId;

  describe('POST /api/v1/games/generate', () => {
    it('should generate a new puzzle with default difficulty', async () => {
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({})
        .expect(201);

      expect(response.body).toHaveProperty('gameId');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('puzzle');
      expect(response.body).toHaveProperty('difficulty', 'medium');
      expect(response.body.puzzle).toHaveLength(81);
      
      gameId = response.body.gameId;
      userId = response.body.userId;
    });

    it('should generate puzzle with specified difficulty', async () => {
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'hard' })
        .expect(201);

      expect(response.body.difficulty).toBe('hard');
    });

    it('should reject invalid difficulty', async () => {
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'impossible' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should create new user if userId not provided', async () => {
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'easy' })
        .expect(201);

      expect(response.body.userId).toBeDefined();
    });

    it('should use existing user if userId provided', async () => {
      // First create a game
      const first = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'easy' });

      const firstUserId = first.body.userId;

      // Create second game with same userId
      const second = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'medium', userId: firstUserId })
        .expect(201);

      expect(second.body.userId).toBe(firstUserId);
    });

    it('should not include solution in response', async () => {
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'medium' })
        .expect(201);

      expect(response.body).not.toHaveProperty('solution');
    });
  });

  describe('POST /api/v1/games/:gameId/move', () => {
    beforeEach(async () => {
      // Create a fresh game before each test
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'easy' });
      
      gameId = response.body.gameId;
    });

    it('should accept valid move', async () => {
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/move`)
        .send({ row: 0, col: 0, value: 5 })
        .expect(200);

      expect(response.body).toHaveProperty('gameId', gameId);
      expect(response.body).toHaveProperty('userSolution');
      expect(response.body).toHaveProperty('valid');
    });

    it('should reject move on invalid position', async () => {
      await request(app)
        .post(`/api/v1/games/${gameId}/move`)
        .send({ row: 10, col: 0, value: 5 })
        .expect(400);

      await request(app)
        .post(`/api/v1/games/${gameId}/move`)
        .send({ row: 0, col: -1, value: 5 })
        .expect(400);
    });

    it('should reject invalid value', async () => {
      await request(app)
        .post(`/api/v1/games/${gameId}/move`)
        .send({ row: 0, col: 0, value: 10 })
        .expect(400);

      await request(app)
        .post(`/api/v1/games/${gameId}/move`)
        .send({ row: 0, col: 0, value: -1 })
        .expect(400);
    });

    it('should allow clearing a cell with value 0', async () => {
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/move`)
        .send({ row: 0, col: 0, value: 0 })
        .expect(200);

      expect(response.body.valid).toBe(true);
    });

    it('should reject move on non-existent game', async () => {
      await request(app)
        .post('/api/v1/games/fake-game-id/move')
        .send({ row: 0, col: 0, value: 5 })
        .expect(404);
    });

    it('should reject move on immutable cells', async () => {
      // First, find a cell that's part of the initial puzzle
      const generateResponse = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'easy' });

      const newGameId = generateResponse.body.gameId;
      const puzzle = generateResponse.body.puzzle;

      // Find first non-zero cell in puzzle
      let immutableRow = -1;
      let immutableCol = -1;
      
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const index = i * 9 + j;
          if (puzzle[index] !== '0') {
            immutableRow = i;
            immutableCol = j;
            break;
          }
        }
        if (immutableRow !== -1) break;
      }

      if (immutableRow !== -1) {
        const response = await request(app)
          .post(`/api/v1/games/${newGameId}/move`)
          .send({ row: immutableRow, col: immutableCol, value: 9 })
          .expect(400);

        expect(response.body.error).toBe('Cell is immutable');
      }
    });
  });

  describe('POST /api/v1/games/:gameId/hint', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'medium' });
      
      gameId = response.body.gameId;
    });

    it('should provide a hint', async () => {
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/hint`)
        .expect(200);

      expect(response.body).toHaveProperty('hint');
      expect(response.body.hint).toHaveProperty('row');
      expect(response.body.hint).toHaveProperty('col');
      expect(response.body.hint).toHaveProperty('value');
      expect(response.body).toHaveProperty('hintsUsed', 1);
      expect(response.body).toHaveProperty('hintsRemaining', 2);
    });

    it('should allow up to 3 hints', async () => {
      await request(app).post(`/api/v1/games/${gameId}/hint`).expect(200);
      await request(app).post(`/api/v1/games/${gameId}/hint`).expect(200);
      const thirdHint = await request(app).post(`/api/v1/games/${gameId}/hint`).expect(200);

      expect(thirdHint.body.hintsUsed).toBe(3);
      expect(thirdHint.body.hintsRemaining).toBe(0);
    });

    it('should reject 4th hint request', async () => {
      await request(app).post(`/api/v1/games/${gameId}/hint`).expect(200);
      await request(app).post(`/api/v1/games/${gameId}/hint`).expect(200);
      await request(app).post(`/api/v1/games/${gameId}/hint`).expect(200);
      
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/hint`)
        .expect(400);

      expect(response.body.error).toBe('No hints remaining');
    });

    it('should reveal correct answer from solution', async () => {
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/hint`)
        .expect(200);

      const { row, col, value } = response.body.hint;
      
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThanOrEqual(9);
    });

    it('should update userSolution with hint', async () => {
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/hint`)
        .expect(200);

      expect(response.body).toHaveProperty('userSolution');
      expect(response.body.userSolution).toHaveLength(81);
    });

    it('should reject hint for non-existent game', async () => {
      await request(app)
        .post('/api/v1/games/fake-game-id/hint')
        .expect(404);
    });
  });

  describe('POST /api/v1/games/:gameId/reset', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/games/generate')
        .send({ difficulty: 'medium' });
      
      gameId = response.body.gameId;
    });

    it('should reset game to initial state', async () => {
      // Make some moves
      await request(app)
        .post(`/api/v1/games/${gameId}/move`)
        .send({ row: 0, col: 0, value: 5 });

      // Use a hint
      await request(app).post(`/api/v1/games/${gameId}/hint`);

      // Reset
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/reset`)
        .expect(200);

      expect(response.body.hintsUsed).toBe(0);
      expect(response.body).toHaveProperty('userSolution');
    });

    it('should reset hints counter', async () => {
      // Use all hints
      await request(app).post(`/api/v1/games/${gameId}/hint`);
      await request(app).post(`/api/v1/games/${gameId}/hint`);
      await request(app).post(`/api/v1/games/${gameId}/hint`);

      // Reset
      const response = await request(app)
        .post(`/api/v1/games/${gameId}/reset`)
        .expect(200);

      expect(response.body.hintsUsed).toBe(0);
    });

    it('should reject reset for non-existent game', async () => {
      await request(app)
        .post('/api/v1/games/fake-game-id/reset')
        .expect(404);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/api/v1/unknown')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});
