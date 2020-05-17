<p align="center">
  <img  src="./assets/BootCamp-GoStack.png">
</p>
<h3 align="center"> Desafio 6 - Banco de dados e upload de arquivos no Node.js  </h3>
<p>
<p>

## Sobre:
Continuamos o desenvolvimento do back-end de uma aplicação financeira que iniciamos no [**desafio 5**](https://github.com/muriloportugal/bootcamp11-desafio5-primeiro-projeto-nodejs), integramos o back-and com o banco de dados [Postgres](https://www.postgresql.org/) e adicinamos a funcionalidade de importar as transações atravéz do envio de um arquivo .csv, um arquivo de exemplo pode ser encontrado na pasta "tmp" na raiz do projeto.

[Detalhes do desafio](https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-database-upload)

## Como testar:
Neste projeto foi utilizado o yarn, então caso ainda não tenha, siga este [guia parar instalação](https://classic.yarnpkg.com/en/docs/install) do mesmo.
Faça o download ou clone este repositório para o seu computador.
Entre na pasta "bootcamp11-desafio6-Banco-de-dados-e-upload-de-arquivos-no-nodejs" e rode o comando abaixo para que sejam instaladas as dependências:
```bash
yarn
```
Você irá precisar ter o banco de dados [Postgres](https://www.postgresql.org/) instalado ou executando o mesmo através do [Docker](https://hub.docker.com/_/postgres), que é como estou utilizando, e criar duas bases, uma chamada "gostack_desafio06" e a outra "gostack_desafio06_tests", essa segunda base só é necessária se acaso quiser rodar os testes integrados.
No arquvio "**ormconfig.json**" que se encontra na raiz do projeto você pode alterar ou usar os mesmos valores para as configurações do seu banco.
```javascript
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "docker",
  "database": "gostack_desafio06",
```
Depois de instalar as dependências, pode executar o comando abaixo para iniciar o serviço e utilizar o [insomnia](https://insomnia.rest/) para envio das requests.
```bash
yarn dev:server
```

## :robot: Tecnologias:
- NodeJS
- TypeScript
- TypeORM
- Postgres
- Docker

---
## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
