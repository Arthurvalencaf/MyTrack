# MyTrack

App de rastreio de hábitos, com check-ins diários, calendário e dashboard. Pensado para uso no celular, tablet e desktop, com modo claro e escuro.

## Stack

- **Backend:** Node.js + Express (API REST)
- **Banco e autenticação:** Supabase (Postgres + Supabase Auth, com login Google previsto)
- **Frontend:** React Native com Expo (versão web hospedada) — em desenvolvimento

## Estrutura

```
MyTrack/
├── backend/     API (Express)
├── frontend/    App (Expo) — ainda não criado
└── docs/        Documentação da API e decisões
```

O backend é organizado por funcionalidade: cada módulo em `backend/src/modules/` tem rotas, controller, service e repository.

## Rodando o backend

Requisitos: Node.js 20 ou mais novo e um projeto no Supabase.

1. Clone o repositório e entre na pasta do backend:

```
git clone https://github.com/Arthurvalencaf/MyTrack.git
cd MyTrack/backend
npm install
```

2. Crie as tabelas: no SQL Editor do Supabase, execute o conteúdo de `backend/database/schema.sql`.

3. Crie o arquivo `.env` a partir do `.env.example` e preencha:

```
PORT=3333
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CORS_ORIGIN=http://localhost:8081
```

A `SUPABASE_SERVICE_ROLE_KEY` é a chave de servidor (secret). Ela nunca vai para o Git nem para o frontend.

4. Inicie:

```
npm run dev
```

A API sobe em `http://localhost:3333`. Teste em `http://localhost:3333/health`.

## Documentação

As rotas da API estão em [docs/api.md](docs/api.md).

## Status

- [x] Banco de dados e autenticação (token do Supabase)
- [x] Módulo de hábitos
- [x] Módulo de check-ins
- [ ] Estatísticas (dashboard e calendário)
- [ ] Resumo semanal com IA
- [ ] Frontend