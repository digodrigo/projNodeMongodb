# 📊 Dashboard Financeiro

Projeto de portfólio em desenvolvimento para praticar JavaScript, React e Node.js, com cadastro de usuários, autenticação e organização de despesas pessoais no MongoDB Atlas.

A versão declarada no `package.json` é `0.0.0`.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, React Router 6, SCSS e Vite 8 |
| Interface | Bootstrap 5 e Bootstrap Icons, carregados via CDN no `index.html` |
| Gráficos | Chart.js, declarado como `^4.5.1` no `package.json` |
| Backend | Node.js, Express 5, `cors` e `dotenv` |
| Banco de dados | MongoDB Atlas e driver oficial `mongodb`, sem Mongoose |
| Autenticação | `jsonwebtoken`, `jwt-decode` e módulo `crypto` do Node.js |

O projeto utiliza JavaScript com ES Modules. O Express interpreta os corpos JSON com `express.json()`, e o middleware `cors()` trata CORS.

## Funcionalidades implementadas

- Cadastro e login de usuários, com senhas derivadas usando `crypto.scryptSync` e salt aleatório.
- Sugestão de domínio de e-mail no login e cadastro: o primeiro Tab aceita a sugestão e o próximo avança para o campo seguinte. Shift + Tab permite voltar normalmente.
- Autenticação JWT e middleware de verificação nas rotas protegidas da API.
- Consulta dos dados e das despesas do usuário autenticado.
- Adição e edição de despesas com categoria, descrição da compra, valor e data.
- Estrutura de tabela com ordenação por colunas e paginação de cinco despesas por página, com pendências de carregamento descritas abaixo.
- Categorias Lazer, Mercado, Transporte e Outros.
- Gráfico doughnut com a **quantidade de despesas por categoria**, sem somar seus valores monetários.
- Cálculo do total de despesas do mês selecionado. A seleção do mês não filtra a tabela nem o gráfico.
- Alternância entre tema claro e escuro.

## Organização do projeto

```text
src/                          Frontend React
  pages/                      Login, cadastro e página do dashboard
  components/
    dashboard/                Tabela, gráfico e paginação
    expenses/                 Formulário compartilhado de adição e edição
  styles/                     Estilos compartilhados de autenticação e dashboard
  assets/                     Imagens e recursos do frontend
  App.jsx                     Rotas do frontend
  main.jsx                    Entrada do React
server/
  src/
    config/env.js             Carregamento das variáveis de ambiente
    middleware/               Verificação do JWT
    server.js                 Servidor Express e rotas da API
  .env.example                Modelo de configuração sem credenciais
public/                       Recursos públicos do Vite
data/examples/                Dados de exemplo, sem uso pela API
scripts/check-dns.js           Experimento de configuração DNS
start.bat                     Inicialização local no Windows
```

## Como executar localmente

### Pré-requisitos

- Node.js `20.19+` na linha 20 ou `22.12+` nas linhas mais recentes, conforme os requisitos das dependências atuais.
- npm.
- Um cluster MongoDB Atlas com usuário de banco e acesso de rede configurados para sua máquina.

### Instalação e configuração

Na raiz do projeto, instale as dependências:

```sh
npm ci
```

Crie o arquivo `server/.env` com as variáveis abaixo e substitua os marcadores pelos seus próprios valores:

```dotenv
MONGO_URI=<sua-string-de-conexao-do-mongodb-atlas>
JWT_SECRET=<sua-chave-secreta-aleatoria>
```

O arquivo `.env` deve permanecer somente na sua máquina e está excluído pelo `.gitignore`. Não publique credenciais no repositório.

O código utiliza o banco `projs` e a coleção `projFinanceiro`.

### Backend

Em um terminal, a partir da raiz:

```sh
npm run server
```

A API escuta na porta `3000`. A configuração resolve `server/.env` a partir do próprio arquivo, independentemente do diretório do terminal. Use `server/.env.example` como modelo.

### Frontend

Em outro terminal, na raiz:

```sh
npm run dev
```

Acesse o endereço exibido pelo Vite no terminal. As chamadas do frontend estão configuradas no código para `http://localhost:3000`.

No Windows, também é possível executar `start.bat` a partir da raiz para iniciar frontend e backend em terminais separados.

### Outros comandos

| Comando | Finalidade |
| --- | --- |
| `npm run server` | Iniciar a API Express |
| `npm run server:dev` | Iniciar a API com reinício automático ao alterar arquivos |
| `npm run build` | Gerar os arquivos do frontend em `dist` |
| `npm run preview` | Servir localmente o frontend gerado pelo build |
| `npm run lint` | Executar a análise estática com ESLint |

O build e o preview não iniciam o backend. A interface também carrega Bootstrap e Bootstrap Icons pela internet.

## Rotas do frontend

| Caminho | Tela |
| --- | --- |
| `/` | Login |
| `/cadastrar` | Cadastro |
| `/dashboard` | Dashboard |
| `/adicionar` | Formulário de adição de despesas |

## Rotas da API

Base local: `http://localhost:3000`.

| Método | Rota | Exige JWT | Descrição |
| --- | --- | --- | --- |
| POST | `/Login` | Não | Recebe `email` e `senha` e retorna um token após autenticar |
| POST | `/cadastrar` | Não | Recebe `email`, `nome` e `senha` e cadastra o usuário |
| GET | `/dashboard` | Sim | Retorna os dados do usuário autenticado |
| POST | `/Adicionar` | Sim | Adiciona uma despesa ao array `compras` do usuário |
| PUT | `/Editar/:id` | Sim | Edita a despesa identificada por seu `_id` dentro do array `compras` do usuário |

Adição e edição recebem `categoria`, `compra`, `valor` e `data` no corpo JSON. Nas requisições protegidas, envie o cabeçalho `Authorization: Bearer <token>`.

Não há rota `GET /` na API nem implementação de exclusão com `DELETE`.

## Dados e autenticação

Cada usuário pode possuir um array `compras`. Cada despesa contém:

| Campo | Conteúdo |
| --- | --- |
| `_id` | Identificador MongoDB da despesa |
| `categoria` | Lazer, Mercado, Transporte ou Outros |
| `compra` | Descrição da compra ou local |
| `valor` | Valor numérico da despesa |
| `data` | Data enviada pelo formulário, no formato `AAAA-MM-DD` |

Nas rotas protegidas, a API obtém o ID do usuário a partir do JWT verificado pelo middleware `verificarToken`. A edição considera tanto o usuário autenticado quanto o identificador da despesa.

O frontend armazena o JWT no `localStorage`, na chave `token`, e utiliza `jwt-decode` para consultar sua expiração no dashboard. A validação da assinatura ocorre no backend. Atualmente, os tokens emitidos expiram em **30 segundos**.

O middleware responde com HTTP `401` quando o token está ausente, inválido ou expirado. O tratamento dessas respostas no frontend ainda precisa ser padronizado.

## Pendências conhecidas e próximas melhorias

- [ ] Implementar exclusão de despesas: o botão existe, mas ainda não possui ação nem rota na API.
- [ ] Conectar o campo de busca à filtragem da listagem.
- [ ] Implementar filtros da tabela por categoria e intervalo de datas.
- [ ] Sincronizar a listagem com os gastos recebidos: `gastoExibido` começa vazio e atualmente só recebe os dados ao ordenar uma coluna.
- [ ] Atualizar a listagem após adicionar ou editar uma despesa, sem depender de uma nova consulta ou recarga.
- [ ] Corrigir o indicador de gasto total: a chamada atual não passa o array para `calcularGastoTotal`, fazendo o cartão mostrar zero.
- [ ] Implementar o cálculo e a exibição do saldo atual, cujo cartão ainda está vazio.
- [ ] Padronizar o tratamento de HTTP `401`, inclusive na edição, e os redirecionamentos para o login: alguns usam `/login`, mas a rota existente é `/`.
- [ ] Revisar a duração da sessão JWT conforme a experiência desejada para a aplicação.

As funcionalidades listadas refletem o código atual; o projeto continua em desenvolvimento e os fluxos ainda precisam de validação completa com a API e o MongoDB Atlas.
