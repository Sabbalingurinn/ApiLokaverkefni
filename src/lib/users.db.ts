import type { PrismaClient, User } from '@prisma/client';
import type { ILogger } from './logger.js';
import type { Result, UserToCreate, UserCreateResult } from '../types.js';
import bcrypt from 'bcrypt';

export class UsersDbClient {
  constructor(
    private prisma: PrismaClient,
    private logger: ILogger,
  ) {}

  async createUser(data: UserToCreate): Promise<Result<UserCreateResult>> {
    try {
      const existing = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });

      if (existing) {
        return { ok: true, value: { created: false, reason: 'exists', user: existing } };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10); // hash lykilorð
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return { ok: true, value: { created: true, user } };
    } catch (error) {
      this.logger.error('createUser error', data, error);
      return { ok: false, error: error as Error };
    }
  }

  async verifyUser(username: string, password: string): Promise<Result<User | null>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!user) return { ok: true, value: null };

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) return { ok: true, value: null };

      return { ok: true, value: user };
    } catch (error) {
      this.logger.error('verifyUser error', username, error);
      return { ok: false, error: error as Error };
    }
  }

  async getAllUsers(): Promise<Result<User[]>> {
    try {
      const users = await this.prisma.user.findMany();
      return { ok: true, value: users };
    } catch (error) {
      this.logger.error('getAllUsers error', error);
      return { ok: false, error: error as Error };
    }
  }

  async getUserById(id: string): Promise<Result<User | null>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      return { ok: true, value: user };
    } catch (error) {
      this.logger.error('getUserById error', id, error);
      return { ok: false, error: error as Error };
    }
  }

  async getUserByUsername(username: string): Promise<Result<User | null>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { username } });
      return { ok: true, value: user };
    } catch (error) {
      this.logger.error('getUserByUsername error', username, error);
      return { ok: false, error: error as Error };
    }
  }

  async deleteUser(id: string): Promise<Result<boolean>> {
    try {
      const found = await this.prisma.user.findUnique({ where: { id } });
      if (!found) return { ok: true, value: false };

      await this.prisma.user.delete({ where: { id } });
      return { ok: true, value: true };
    } catch (error) {
      this.logger.error('deleteUser error', id, error);
      return { ok: false, error: error as Error };
    }
  }
}
