'use server';

import { prisma } from '@lib/prisma';
import { revalidatePath } from 'next/cache';

export async function salvar({ id, comodos, ...dados }) {
    try {
        const data = { ...dados, comodos: Number(comodos) };
        if (id) await prisma.imoveis.update({ where: { id }, data });
        else await prisma.imoveis.create({ data });
    } catch {
        return { erro: 'Erro ao salvar o imóvel' };
    }
    revalidatePath('/Imoveis');
}

export async function excluir(id) {
    try {
        await prisma.imoveis.delete({ where: { id } });
    } catch (e) {
        if (e.code === 'P2003') return { erro: 'Esse imóvel possui aluguéis cadastrados' };
        return { erro: 'Erro ao excluir o imóvel' };
    }
    revalidatePath('/Imoveis');
}