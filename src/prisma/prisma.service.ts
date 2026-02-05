import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Parse connection string to ensure proper format
    let finalConnectionString = connectionString;
    
    // If using Supabase, ensure SSL is enabled and use direct connection if needed
    if (connectionString.includes('supabase.co')) {
      // Add SSL mode if not present
      if (!connectionString.includes('sslmode=')) {
        finalConnectionString = connectionString.includes('?')
          ? `${connectionString}&sslmode=require`
          : `${connectionString}?sslmode=require`;
      }
    }
    
    console.log('Connecting to database...');
    const pool = new Pool({ 
      connectionString: finalConnectionString,
      ssl: connectionString.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
