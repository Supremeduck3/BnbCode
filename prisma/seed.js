import bcrypt from 'bcryptjs';

try {
    process.loadEnvFile();
} catch {
    console.error('   ❌ parceria ... arquivo .env não encontrado');
    process.exit(1);
}

const { criptografar } = await import('../src/lib/cripto.js');
const { prisma } = await import('../src/lib/prisma.js');

const dados = {
    usuario: [
        { nome: 'admin', senha: bcrypt.hashSync('admin123', 10) },
        { nome: 'corretor', senha: bcrypt.hashSync('corretor123', 10) },
        { nome: 'atendente', senha: bcrypt.hashSync('atendente123', 10) },
    ],
    clientes: [
        { nome: 'Ana Souza', cpf: criptografar('123.456.789-01'), endereco: 'Rua das Flores, 123', celular: '(11) 91111-1111' },
        { nome: 'Bruno Lima', cpf: criptografar('234.567.890-12'), endereco: 'Av. Paulista, 1500', celular: '(11) 92222-2222' },
        { nome: 'Carla Mendes', cpf: criptografar('345.678.901-23'), endereco: 'Rua Augusta, 800', celular: '(11) 93333-3333' },
    ],
    imoveis: [
        { tipo: 'Apartamento', disponivel: false, comodos: 4, clientes_id: 1 },
        { tipo: 'Casa', disponivel: true, comodos: 6, clientes_id: 2 },
        { tipo: 'Kitnet', disponivel: false, comodos: 2, clientes_id: 3 },
    ],
    Alugueis: [
        { data: new Date('2026-11-01'), imoveis_id: 1 },
        { data: new Date('2026-11-05'), imoveis_id: 3 },
        { data: new Date('2026-11-10'), imoveis_id: 1 },
    ],
};

const tabelas = Object.keys(dados).reverse().map((t) => `"${t}"`).join(', ');
await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tabelas} RESTART IDENTITY CASCADE`);
console.log('   🧹 registros anteriores apagados (ids reiniciados)');

for (const [tabela, data] of Object.entries(dados)) {
    const modelo = tabela[0].toLowerCase() + tabela.slice(1);
    const { count } = await prisma[modelo].createMany({ data });
    console.log(`   ✅ ${tabela}: ${count} registros`);
}

await prisma.$disconnect();