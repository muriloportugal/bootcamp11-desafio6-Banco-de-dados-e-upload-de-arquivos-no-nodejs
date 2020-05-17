import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateTransactions1589642001462
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            // Primeira coluna id
            name: 'id',
            // Do tipo varchar por vamos usar o uuid
            type: 'uuid',
            // Chave PK
            isPrimary: true,
            generationStrategy: 'uuid',
            // Funcao que o postgres usa para gerar o uuid
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'numeric(9,2)',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
    // Criando a chave estrangeira
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        // Nome da foreingKey
        name: 'transactionCategory',
        // Nome da coluna na tabela transactions que será a chave estrangeira
        columnNames: ['category_id'],
        // Nome da coluna na tabela categories que vai vir pra esta tabela
        referencedColumnNames: ['id'],
        // Tabela de onde ta vindo a chave estrangeira
        referencedTableName: 'categories',
        // Se o registro na tabela categories for deletado, nesta tabela (transactions) seta esse campo como null
        onDelete: 'SET NULL',
        // se o id da categoria na tabela categories mudar, muda ele aqui tbm, para manter a identificação
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'transactionCategory');
    await queryRunner.dropTable('transactions');
  }
}
