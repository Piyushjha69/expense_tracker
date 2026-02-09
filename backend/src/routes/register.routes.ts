import { Router, Request, Response } from 'express';
import { RegisterSchema, RegisterInput } from '../schemas/register.schema';
import { AuthService } from '../services/auth.service';
import { generateTokens } from '../utils/jwt.utils';

export const registerRouter = Router();

registerRouter.post('/register', async (req: Request, res: Response) => {
  try {
    if (!req.db) {
      return res.status(500).json({ message: 'Database not initialized' });
    }

    // Validate request body
    const validatedData: RegisterInput = RegisterSchema.parse(req.body);

    // Register user
    const authService = new AuthService(req.db);
    const user = await authService.register(validatedData);

    // Generate tokens for new user
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully', 
      data: {
        user,
        tokens
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error', 
        errors: error.errors 
      });
    }

    if (error.message && error.message.includes('already exists')) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});
