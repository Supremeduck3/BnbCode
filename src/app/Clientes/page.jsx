import { excluir, salvar } from '@actions/clientes';
import Crud from '@components/Crud';
import { descriptografar } from '@lib/cripto';
import { prisma } from '@lib/prisma';

const colunas = [
    { title: 'Nome', dataIndex: 'nome' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'Endereço', dataIndex: 'endereco' },
    { title: 'Celular', dataIndex: 'celular' },
];

const campos = [
    { name: 'nome', label: 'Nome' },
    { name: 'cpf', label: 'CPF' },
    { name: 'endereco', label: 'Endereço', opcional: true },
    { name: 'celular', label: 'Celular', opcional: true },
];

export default async function Clientes({ searchParams }) {
    const { busca = '' } = await searchParams;
    const termo = busca.toLowerCase();

    const clientes = await prisma.clientes.findMany({ orderBy: { nome: 'asc' } });
    const registros = clientes
        .map((cliente) => ({ ...cliente, cpf: descriptografar(cliente.cpf) }))
        .filter(
            (cliente) => cliente.nome.toLowerCase().includes(termo) || cliente.cpf.includes(termo),
        );

    return <Crud titulo="Clientes" {...{ colunas, campos, registros, salvar, excluir, busca }} />;
}