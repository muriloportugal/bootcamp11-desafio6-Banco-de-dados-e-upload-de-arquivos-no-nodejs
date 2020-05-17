import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome' | string;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!(type === 'income' || type === 'outcome')) {
      throw new AppError('Transaction type must be income or outcome');
    }
    const transactionRepsitory = getCustomRepository(TransactionsRepository);
    // Check if balance is valid
    const { total } = await transactionRepsitory.getBalance();
    if (!(Number(total) > 0 && Number(total) >= value) && type === 'outcome') {
      throw new AppError('No balance.');
    }
    const categoryRepository = getRepository(Category);
    // Get the category id or create a new one
    let categoryExist = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryExist) {
      categoryExist = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoryExist);
    }

    const transaction = transactionRepsitory.create({
      title,
      value,
      type,
      category: categoryExist,
    });

    await transactionRepsitory.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
