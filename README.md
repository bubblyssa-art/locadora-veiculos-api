# API REST — Locadora de Veículos

API desenvolvida com Node.js, Express e MySQL/MariaDB para cadastrar, consultar, atualizar e excluir carros.

## Requisitos
- Node.js e npm
- MySQL ou MariaDB

## Configuração
1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e ajuste usuário e senha do banco.
3. Execute o script `database.sql` no MySQL/MariaDB.
4. Inicie com `npm start` ou, durante o desenvolvimento, `npm run dev`.
5. Teste em `http://localhost:3000` e as rotas em `/carro` usando o Postman.

## Rotas
| Método | Caminho | Finalidade |
|---|---|---|
| GET | `/carro` | Lista os carros |
| GET | `/carro/:id` | Consulta um carro pelo ID |
| POST | `/carro` | Cadastra um carro |
| PUT | `/carro/:id` | Atualiza placa, modelo e diária |
| DELETE | `/carro/:id` | Exclui um carro |

Exemplo de corpo JSON para POST e PUT:
```json
{
  "placa": "ABC1D23",
  "modelo": "Fiat Argo",
  "diaria": 150.00
}
```
