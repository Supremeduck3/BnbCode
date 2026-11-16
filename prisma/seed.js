import bcrypt from 'bcryptjs';

try {
    process.loadEnvFile();
} catch {
    console.error('   ❌ parceria ... arquivo .env não encontrado');
    process.exit(1);
}

const { criptografar } = await import('../src/lib/cripto.js');
const { prisma } = await import('../src/lib/prisma.js');

// para ter mais linhas no banco, acrescente mais objetos em cada lista/tabela
const dados = {
    usuario: [{ nome: 'admin', senha: bcrypt.hashSync('admin123', 10) }],
    entidade1: [{ nome: 'Bagui', cpf: criptografar('123.456.789-01'), endereco: 'Rua du Bugui, 123', celular: '(11) 91111-1111' }],
    entidade2: [{ nome: 'Brueguenaiti', entidade1_id: 1 }],
    entidade3: [{ data: new Date('2026-11-10'), entidade2_id: 1 }],
};

const tabelas = Object.keys(dados).reverse().join(', ');
await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tabelas} RESTART IDENTITY CASCADE`);
console.log('   🧹 registros anteriores apagados (ids reiniciados)');

for (const [tabela, data] of Object.entries(dados)) {
    const { count } = await prisma[tabela].createMany({ data });
    console.log(`   ✅ ${tabela}: ${count} registros`);
}

await prisma.$disconnect();
