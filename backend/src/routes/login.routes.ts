import { Router, Request, Response } from 'express';
import { LoginSchema, LoginInput } from '../schemas/login.schema';
import { AuthService } from '../services/auth.service';

export const loginRouter = Router();

loginRouter.post('/login', async (req: Request, res: Response) => {
  try {
    if (!req.db) {
      return res.status(500).json({ message: 'Database not initialized' });
    }

    // Validate request body
    const validatedData: LoginInput = LoginSchema.parse(req.body);

    // Login user
    const authService = new AuthService(req.db);
    const authResponse = await authService.login(validatedData);

    res.json({ 
      success: true,
      message: 'Login successful', 
      data: {
        user: authResponse.user,
        tokens: authResponse.tokens
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error', 
        errors: error.errors 
      });
    }

    if (error.message && error.message.includes('Invalid')) {
      return res.status(401).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

loginRouter.post('/auth/refresh', async (req: Request, res: Response) => {
  try {
    if (!req.db) {
      return res.status(500).json({ message: 'Database not initialized' });
    }

    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const authService = new AuthService(req.db);
    const tokens = await authService.refreshAccessToken(refreshToken);

    res.json({ 
      success: true,
      data: { accessToken: tokens.accessToken }
    });
  } catch (error: any) {
    console.error('Refresh error:', error);
    res.status(401).json({ message: 'Invalid refresh token', success: false });
  }
});
