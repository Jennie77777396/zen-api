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
    
    const isSupabase = connectionString.includes('supabase.co');
    
    // Parse connection string - remove sslmode from connection string, we'll handle it in Pool config
    let finalConnectionString = connectionString;
    if (isSupabase) {
      // Remove any existing sslmode parameter to avoid conflicts
      finalConnectionString = finalConnectionString.replace(/[?&]sslmode=[^&]*/g, '');
      // Clean up any trailing ? or & after removal
      finalConnectionString = finalConnectionString.replace(/[?&]$/, '');
    }
    
    console.log('Connecting to database...');
    console.log(`Using Supabase: ${isSupabase}`);
    
    // Check if using connection pooling (port 6543) or direct connection (port 5432)
    const isPooling = finalConnectionString.includes(':6543') || finalConnectionString.includes('pooler.supabase.com');
    if (isSupabase) {
      console.log(`Connection type: ${isPooling ? 'Connection Pooling (recommended for Railway)' : 'Direct connection'}`);
      // Log connection details (without password) for debugging
      const connectionInfo = finalConnectionString.replace(/:[^:@]+@/, ':****@');
      console.log(`Connection string: ${connectionInfo.substring(0, 100)}...`);
    }
    
    // Configure Pool with explicit SSL settings for Supabase
    const poolConfig: any = {
      connectionString: finalConnectionString,
    };
    
    if (isSupabase) {
      // For Supabase, configure SSL to accept self-signed certificates
      // This is necessary for local development with Supabase
      poolConfig.ssl = {
        rejectUnauthorized: false, // Accept self-signed certificates
        require: true, // Require SSL connection
      };
    }
    
    console.log('Pool config SSL:', isSupabase ? 'enabled (rejectUnauthorized: false)' : 'disabled');
    
    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
