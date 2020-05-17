import { getRepository, In, getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CsvLines {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

async function loadCSV(filePath: string): Promise<CsvLines[]> {
  // Read the csv file and return all transactions that it has.
  const readCSVStream = fs.createReadStream(filePath);
  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);
  const lines: CsvLines[] = [];

  parseCSV.on('data', line => {
    const [title, type, value, category] = line;
    lines.push({
      title,
      value,
      type,
      category,
    });
  });

  // Indicate the end of file reading
  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

async function addCategories(categories: string[]): Promise<Category[]> {
  // Search in DB if alterady exists the categories
  const categoryRepository = getRepository(Category);
  const categoryExists = await categoryRepository.find({
    title: In(categories),
  });

  // Keep only the title
  const categoriesExistsTitles = categoryExists.map(
    (category: Category) => category.title,
  );
  // Get only the category not founded in DB
  const addCategoryTitles = categories.filter(
    category => !categoriesExistsTitles.includes(category),
  );
  // insert the new categories using bulking insert strategy
  const newCategories = categoryRepository.create(
    addCategoryTitles.map(title => ({
      title,
    })),
  );
  await categoryRepository.save(newCategories);

  // Concat the new categories and those that already exist and return
  const allCategories = [...categoryExists, ...newCategories];

  return allCategories;
}

interface Request {
  csvFilePath: string;
}

class ImportTransactionsService {
  async execute({ csvFilePath }: Request): Promise<Transaction[]> {
    const transactionsCSV = await loadCSV(csvFilePath);

    // Get only categories
    const categories = transactionsCSV.map(transaction => transaction.category);
    // Remove duplicates
    const categoriesFilter = categories.filter((value, index, array) => {
      return array.indexOf(value) === index;
    });

    // Insert new categories in DB or get the category ID if already exists
    const newCategories = await addCategories(categoriesFilter);

    const transactionRepository = getCustomRepository(TransactionsRepository);

    // Add the category element to each transaction
    const transactions = transactionsCSV.map(transaction => ({
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      category: newCategories.find(
        category => category.title === transaction.category,
      ),
    }));

    // Create the transactions and save in DB
    const newTransactions = transactionRepository.create(transactions);
    await transactionRepository.save(newTransactions);

    return newTransactions;
  }
}

export default ImportTransactionsService;
