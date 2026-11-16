import { excluir, salvar } from "@actions/alugueis";
import Crud from "@components/Crud";
import { prisma } from "@lib/prisma";

const colunas = [
    {title:'Data',dataIndex:'data'},
    {title:'Cliente',dataIndex:'cliente'}
]
export default async function  () {
    const[aluguel, clientes]= await Promise.all([
        prisma.alugueis.findmany({
            orderby:{data:'asc'},
            include:{veiculo:{include:{cliente:true}}},
        }),
        prisma.clientes.findMany({orderBy:{nome:'asc'},include:{cliente:true}})
    ]);
    const registro = aluguel.map(({id,data,imovel_id})=>({
        id,
        imovel_id,
        data: data.toISOString().slice(0, 10),
    }))

     const campos = [
        { name: 'data', label: 'Data', tipo: 'date' },
        {
            name: 'veiculo_id',
            label: 'Veículo',
            opcoes: veiculos.map((v) => ({ value: v.id, label: `${v.modelo} (${v.cliente.nome})` })),
        },
    ];
}