"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const isSupabase = connectionString.includes('supabase.co');
const poolConfig = {
    connectionString: connectionString,
};
if (isSupabase) {
    poolConfig.ssl = {
        rejectUnauthorized: false,
    };
}
const pool = new pg_1.Pool(poolConfig);
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    await prisma.sentence.deleteMany();
    await prisma.category.deleteMany();
    const philosophy = await prisma.category.create({ data: { name: 'Philosophy' } });
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
//# sourceMappingURL=seed.js.map