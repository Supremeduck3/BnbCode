import { excluir, salvar } from "@actions/alugueis";
import Crud from "@components/Crud";
import { prisma } from "@lib/prisma";

const colunas = [
    { title: 'Data', dataIndex: 'data' },
    { title: 'Imóvel', dataIndex: 'imovel' },
    { title: 'Cliente', dataIndex: 'cliente' },
];

export default async function Page() {
    const [alugueis, imoveis] = await Promise.all([
        prisma.alugueis.findMany({
            orderBy: { data: 'desc' },
            include: { imoveis: { include: { clientes: true } } },
        }),
        prisma.imoveis.findMany({
            orderBy: { tipo: 'asc' },
            include: { clientes: true },
        }),
    ]);

    const registros = alugueis.map(({ id, data, imoveis_id, imoveis }) => ({
        id,
        imoveis_id,
        data: data.toISOString().slice(0, 10),
        imovel: `${imoveis.tipo} (${imoveis.comodos} cômodos)`,
        cliente: imoveis.clientes.nome,
    }));

    const campos = [
        { name: 'data', label: 'Data', tipo: 'date' },
        {
            name: 'imoveis_id',
            label: 'Imóvel',
            opcoes: imoveis.map((v) => ({ value: v.id, label: `${v.tipo} (${v.clientes.nome})` })),
        },
    ];

    return <Crud titulo="Aluguéis" {...{ colunas, campos, registros, salvar, excluir }} />;
}