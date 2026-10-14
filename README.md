# API REST — Locadora de Veículos

API REST desenvolvida com Node.js, Express e MySQL/MariaDB para cadastrar, consultar, atualizar e excluir carros de uma locadora.

## Requisitos

- Node.js 22 (ou uma versão LTS compatível) e npm.
- MySQL ou MariaDB em execução.
- Postman para testar as requisições (opcionalmente, também é possível testar com `curl`).

## Estrutura do projeto

```text
locadora-veiculos-api/
├── config/
│   └── db.js
├── routes/
│   └── carro.js
├── postman/
│   └── locadora-veiculos.postman_collection.json
├── app.js
├── server.js
├── database.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 1. Configurar o banco de dados

O script `database.sql` cria o banco `locadora_veiculos` e a tabela `carro`, com os campos `id`, `placa`, `modelo` e `diaria`.

Em uma instalação Debian/MariaDB em que o administrador usa autenticação local, execute:

```bash
sudo mariadb < database.sql
```

Em seguida, crie (ou confira) o usuário que será usado pela API. Entre no MariaDB:

```bash
sudo mariadb
```

Execute os comandos SQL abaixo. Troque `defina_uma_senha_local` por uma senha da sua escolha:

```sql
CREATE USER IF NOT EXISTS 'locadora_user'@'localhost'
IDENTIFIED BY 'defina_uma_senha_local';
GRANT ALL PRIVILEGES ON locadora_veiculos.*
TO 'locadora_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Se o usuário já existir com outra senha, atualize a senha dele com `ALTER USER` e use exatamente a mesma no arquivo `.env`.

## 2. Configurar as variáveis de ambiente

Na pasta do projeto, copie o modelo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure os dados reais da sua instalação:

```env
DB_HOST=localhost
DB_USER=locadora_user
DB_PASSWORD=defina_uma_senha_local
DB_NAME=locadora_veiculos
PORT=3000
```

O conteúdo de `DB_PASSWORD` deve coincidir com a senha do usuário MariaDB. **Nunca publique o arquivo `.env`**: ele está listado no `.gitignore`. O arquivo `.env.example` é apenas um modelo e não deve conter senhas reais.

## 3. Instalar e iniciar a API

Na pasta do projeto, execute:

```bash
npm install
npm start
```

Durante o desenvolvimento, use `npm run dev` para iniciar com Nodemon. Por padrão, a API ficará disponível em `http://localhost:3000`.

Para conferir se o servidor iniciou, acesse `http://localhost:3000` no navegador ou execute:

```bash
curl -i http://localhost:3000/
```

A resposta esperada é HTTP `200` com uma mensagem JSON indicando que a API está funcionando.

## 4. Rotas da API

Todas as respostas são enviadas em JSON.

| Método | Caminho | Finalidade | Resposta típica de sucesso |
|---|---|---|---|
| `GET` | `/carro` | Lista os carros cadastrados | `200 OK` |
| `GET` | `/carro/:id` | Consulta um carro pelo ID | `200 OK` |
| `POST` | `/carro` | Cadastra um carro | `201 Created` |
| `PUT` | `/carro/:id` | Atualiza placa, modelo e diária | `200 OK` |
| `DELETE` | `/carro/:id` | Exclui um carro pelo ID | `200 OK` |

Exemplo de corpo JSON para `POST /carro` e `PUT /carro/:id`:

```json
{
  "placa": "ABC1D23",
  "modelo": "Fiat Argo",
  "diaria": 150.00
}
```

O `id` é gerado automaticamente pelo banco. A placa deve ser única; os campos placa, modelo e diária são obrigatórios, e a diária deve ser maior que zero.

Códigos de erro previstos incluem `400` para dados ou IDs inválidos, `404` quando o carro não é encontrado, `409` para placa duplicada e `500` para erro interno de banco de dados.

## 5. Testar pelo Postman

A coleção pronta para importação está em:

`postman/locadora-veiculos.postman_collection.json`

Para importar:

1. Abra o Postman.
2. Clique em **Import** e selecione o arquivo JSON acima.
3. Confirme que `baseUrl` está configurada como `http://localhost:3000`.
4. Confirme que a API está em execução e clique em **Run collection** para executar as requisições na ordem indicada.

A coleção contém uma verificação de saúde e requisições para as cinco rotas CRUD. Ela cria um carro de teste com placa gerada automaticamente, consulta e atualiza esse registro, exclui-o e verifica que o ID excluído retorna `404`. Assim, a sequência completa não depende de um ID previamente cadastrado e não apaga o Fiat Argo usado em exemplos manuais.

Se preferir, cada requisição pode ser executada individualmente. Nesse caso, execute o `POST` primeiro para definir automaticamente a variável `carroId` utilizada nas requisições seguintes.

## Dependências utilizadas

- **Express:** criação do servidor e definição de rotas.
- **mysql:** acesso ao MySQL/MariaDB.
- **Nodemon:** reinício automático durante o desenvolvimento.
- **Morgan:** registro das requisições no terminal.
- **Body-parser:** leitura dos dados enviados no corpo da requisição.
- **CORS:** configuração do compartilhamento de recursos entre origens.
- **dotenv:** leitura de variáveis de ambiente.
