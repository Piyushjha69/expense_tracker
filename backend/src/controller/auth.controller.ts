import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterSchema } from '../schemas/register.schema';
import { LoginSchema } from '../schemas/login.schema';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      if (!req.db) {
        res.status(500).json({ message: 'Database not initialized' });
        return;
      }

      const validatedData = RegisterSchema.parse(req.body);
      const authService = new AuthService(req.db);
      const user = await authService.register(validatedData);

      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          message: 'Validation error',
          errors: error.errors
        });
        return;
      }

      if (error.message.includes('already exists')) {
        res.status(400).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      if (!req.db) {
        res.status(500).json({ message: 'Database not initialized' });
        return;
      }

      const validatedData = LoginSchema.parse(req.body);
      const authService = new AuthService(req.db);
      const authResponse = await authService.login(validatedData);

      res.json({
        message: 'Login successful',
        user: authResponse.user,
        tokens: authResponse.tokens
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          message: 'Validation error',
          errors: error.errors
        });
        return;
      }

      if (error.message.includes('Invalid')) {
        res.status(401).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      if (!req.db) {
        res.status(500).json({ message: 'Database not initialized' });
        return;
      }

      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }

      const authService = new AuthService(req.db);
      const tokens = await authService.refreshAccessToken(refreshToken);

      res.json({
        message: 'Tokens refreshed successfully',
        tokens
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const authService = new AuthService(req.db!);
      await authService.logout(userId);

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
