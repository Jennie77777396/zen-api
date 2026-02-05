import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 清空现有数据
  await prisma.sentence.deleteMany();
  await prisma.category.deleteMany();

  // 创建分类
  const philosophy = await prisma.category.create({ data: { name: 'Philosophy' } });
  
  // 创建句子（多分类支持）
  await prisma.sentence.create({
    data: {
      content: 'Nothing is so repulsive as a sentimentalist in a dry season.',
      bookName: 'The Picture of Dorian Gray',
      categories: {
        connect: { id: philosophy.id }
      }
    }
  });

  console.log('Seed 数据注入成功！');
}

main().catch(console.error).finally(() => prisma.$disconnect());
