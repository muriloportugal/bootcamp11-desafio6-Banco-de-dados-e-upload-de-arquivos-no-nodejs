import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions.reduce((totalIcome, transaction) => {
      if (transaction.type === 'income') {
        return totalIcome + Number(transaction.value);
      }
      return totalIcome;
    }, 0);

    const outcome = transactions.reduce((totalOutcome, transaction) => {
      if (transaction.type === 'outcome') {
        return totalOutcome + Number(transaction.value);
      }
      return totalOutcome;
    }, 0);

    const total = income - outcome;
    const balance: Balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }
}

export default TransactionsRepository;
