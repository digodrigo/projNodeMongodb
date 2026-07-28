# 📊 Dashboard Financeiro

> ⚠️ **Versão Inicial (v0.1.0) - Em Desenvolvimento**
> Esta é uma versão inicial e experimental da aplicação, desenvolvida com o objetivo de criar uma prova de conceito focada na integração de um servidor **Node.js HTTP nativo** (sem frameworks como Express) com o **MongoDB Atlas** via driver oficial e uma interface em **React com Bootstrap**.

---

## 🚀 Tecnologias Utilizadas

### Backend
* **Node.js** (Módulo `http` nativo)
* **MongoDB Driver** (`mongodb`)
* **JavaScript (ES Modules)**

### Frontend
* **React.js** (`useState`, `useEffect`)
* **Bootstrap** & **Bootstrap Icons**

### Banco de Dados
* **MongoDB Atlas** (Cluster Cloud)

---

## 📌 Funcionalidades Atuais

- **API REST Nativa:** Servidor HTTP enxuto que processa requisições e trata requisições de *preflight* (`OPTIONS`) e regras de CORS manualmente.
- **Conexão Direta com MongoDB:** Comunicação e consulta à coleção de dados sem abstrações ou ODMs (como Mongoose).
- **Consumo Dinâmico em React:** Busca de dados via `GET` alimentando o estado do componente e exibindo a listagem de gastos em tabela.
- **Resumo Financeiro:** Estrutura inicial para exibição de categorias e indicadores de despesas.

---

## 🔗 Rotas da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **GET** | `/` | Retorna os registros financeiros armazenados no MongoDB em formato JSON |
| **OPTIONS** | `/` | Tratamento dos cabeçalhos de permissão de CORS |

---

## 🔮 Melhorias Futuras e Roadmap

- [ ] **CRUD Completo:** Implementar rotas e manipuladores para `POST` (criar), `PUT` (editar) e `DELETE` (remover) lançamentos financeiros diretamente na interface.
- [ ] **Autenticação de Usuários:** Integrar fluxo de segurança e autorização de rotas utilizando **JWT (JSON Web Tokens)**.
- [ ] **Parser de Body Nativo:** Criar um utilitário para interpretar fluxos de dados (*streams*) no recebimento de JSON em requisições de criação e atualização.
- [ ] **Filtros e Pesquisas:** Conectar a barra de busca e criar filtros avançados por intervalo de datas e categorias de compras.
- [ ] **Gráficos e Relatórios:** Incorporar biblioteca de gráficos (como Chart.js ou Recharts) para exibição visual da distribuição dos gastos.
