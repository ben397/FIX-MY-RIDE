import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { User } from '../types';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      userType: user.user_type,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  static async register(userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    user_type: 'driver' | 'mechanic';
    phone?: string;
  }): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        password_hash: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name,
        user_type: userData.user_type,
        phone: userData.phone,
      })
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create user', 500);
    }

    // Generate token
    const token = this.generateToken(user as User);

    return { user: user as User, token };
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await this.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('Account is deactivated', 401);
    }

    // Generate token
    const token = this.generateToken(user as User);

    return { user: user as User, token };
  }

  static async getUserById(id: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return user as User;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to update user', 500);
    }

    return user as User;
  }
}