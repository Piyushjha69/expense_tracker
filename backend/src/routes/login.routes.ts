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
      message: 'Login successful', 
      user: authResponse.user,
      tokens: authResponse.tokens 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }

    if (error.message && error.message.includes('Invalid')) {
      return res.status(401).json({ message: error.message });
    }

    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
