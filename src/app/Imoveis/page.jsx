import { excluir, salvar } from '@actions/imoveis';
import Crud from '@components/Crud';
import { prisma } from '@lib/prisma';

const colunas = [
    { title: 'Tipo', dataIndex: 'tipo' },
    { title: 'Cômodos', dataIndex: 'comodos' },
    { title: 'Disponível', dataIndex: 'disponivel_texto' },
    { title: 'Cliente', dataIndex: 'cliente_nome' },
];

export default async function Imoveis() {
    const [imoveis, clientes] = await Promise.all([
        prisma.imoveis.findMany({ orderBy: { tipo: 'asc' }, include: { clientes: true } }),
        prisma.clientes.findMany({ orderBy: { nome: 'asc' } }),
    ]);

    const registros = imoveis.map(({ clientes, ...imovel }) => ({
        ...imovel,
        cliente_nome: clientes.nome,
        disponivel_texto: imovel.disponivel ? 'Sim' : 'Não',
    }));

    const campos = [
        { name: 'tipo', label: 'Tipo' },
        { name: 'comodos', label: 'Cômodos', type: 'number' },
        {
            name: 'disponivel',
            label: 'Disponível',
            opcoes: [
                { value: true, label: 'Sim' },
                { value: false, label: 'Não' },
            ],
        },
        {
            name: 'clientes_id',
            label: 'Cliente',
            opcoes: clientes.map((c) => ({ value: c.id, label: c.nome })),
        },
    ];

    return <Crud titulo="Imóveis" {...{ colunas, campos, registros, salvar, excluir }} />;
}