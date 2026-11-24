# API do MyTrack

URL local: `http://localhost:3333`

> **Status:** hábitos e check-ins estão implementados. Tudo marcado como **(planejado)** é a especificação das categorias do usuário, ainda em implementação. Hoje o código ainda usa o campo `category` com uma lista fixa de três nomes.

## Convenções

**Autenticação.** Todas as rotas, menos `/health`, exigem o token do Supabase no cabeçalho:

```
Authorization: Bearer <access_token>
```

O dono dos dados é sempre o usuário do token. A API nunca lê `user_id` do corpo do pedido.

**Datas.** Formato `AAAA-MM-DD` (exemplo: `2026-11-24`). A API não converte fuso horário: o frontend envia a data local do usuário.

**Dias da semana (`weekdays`).** Lista de números de 0 a 6, onde `0` = domingo, `1` = segunda, ..., `6` = sábado (a mesma convenção do `Date.getDay()` do JavaScript).

**Erros.** Sempre no formato `{ "error": "mensagem" }`.

| Código | Quando |
|---|---|
| 400 | Dados inválidos (nome vazio, categoria inexistente, cor fora da paleta, data inválida, JSON malformado) |
| 401 | Token ausente, inválido ou expirado |
| 404 | Recurso inexistente ou que pertence a outro usuário (a resposta é a mesma nos dois casos) |
| 409 | Conflito: nome de categoria repetido, ou exclusão que precisa de confirmação **(planejado)** |
| 500 | Erro interno |

## Paleta de cores **(planejado)**

As categorias usam uma chave de cor, e o frontend escolhe o tom de cada tema (claro e escuro) para manter o contraste.

| Chave | Observação |
|---|---|
| `verde` | |
| `azul` | |
| `laranja` | |
| `roxo` | |
| `rosa` | |
| `vermelho` | |
| `amarelo` | |
| `ciano` | |

Qualquer outro valor é recusado com 400.

## Objetos

### Categoria **(planejado)**

```json
{
  "id": "5d1c2a3e-8f7b-4c6d-9a0e-1b2c3d4e5f60",
  "name": "Saúde",
  "color": "verde",
  "created_at": "2026-11-24T00:04:13.763698+00:00"
}
```

### Hábito

```json
{
  "id": "9b39fc65-5402-4644-8ddf-05a21fae2ffe",
  "user_id": "0b3f77c3-d086-42ad-9313-63680fc1fe81",
  "name": "Beber 2L de água",
  "category_id": "5d1c2a3e-8f7b-4c6d-9a0e-1b2c3d4e5f60",
  "weekdays": [0, 1, 2, 3, 4, 5, 6],
  "archived": false,
  "created_at": "2026-11-24T00:04:13.763698+00:00"
}
```

`category_id` **(planejado)** substitui o antigo campo `category` (texto). Vale `null` quando a categoria do hábito foi excluída, e o app mostra "Sem categoria". Para exibir o nome e a cor, o frontend busca `GET /categories` uma vez e relaciona pelo `id`.

## Rotas

### GET /health

Sem autenticação. Confirma que a API alcança o banco.

- **200:** `{ "status": "ok", "database": "connected" }`

### GET /me

Temporária, usada para testar a autenticação.

- **200:** `{ "user": { "id": "...", "email": "..." } }`
- **401:** token ausente ou inválido

## Categorias **(planejado)**

Cada usuário tem as suas categorias. No primeiro acesso, o usuário recebe três categorias iniciais: **Saúde** (`verde`), **Estudos** (`azul`) e **Treino** (`laranja`). Depois disso, pode renomear, recolorir, excluir e criar outras.

### GET /categories

Lista as categorias do usuário, da mais antiga para a mais nova.

- **200:** lista de objetos Categoria

### POST /categories

Cria uma categoria.

| Campo | Tipo | Regra |
|---|---|---|
| `name` | texto | obrigatório, até 30 caracteres (espaços das pontas são removidos); não pode repetir uma categoria do mesmo usuário, ignorando maiúsculas e minúsculas |
| `color` | texto | obrigatório, uma chave da paleta |

Cada usuário pode ter no máximo 20 categorias.

```json
{ "name": "Finanças", "color": "roxo" }
```

- **201:** a categoria criada
- **400:** nome ausente ou longo demais, cor fora da paleta, limite de categorias atingido
- **409:** já existe uma categoria com esse nome

### PATCH /categories/:id

Edita nome e/ou cor, com as mesmas regras do `POST`. Pelo menos um campo é obrigatório.

- **200:** a categoria atualizada
- **400:** nenhum campo para atualizar, ou algum valor inválido
- **404:** categoria não encontrada
- **409:** já existe outra categoria com esse nome

### DELETE /categories/:id

Exclui uma categoria.

- Se a categoria **não tem hábitos**, é excluída direto.
- Se **tem hábitos** (ativos ou arquivados) e a requisição **não** traz `?confirm=true`, a API recusa com 409 e informa a quantidade. O app usa isso para mostrar o aviso antes de confirmar.
- Com `?confirm=true`, a categoria é excluída e os hábitos dela continuam existindo, com `category_id` nulo.

Respostas:

- **204:** excluída, sem corpo
- **404:** categoria não encontrada
- **409:** a categoria tem hábitos e falta a confirmação:

```json
{
  "error": "A categoria ainda tem hábitos. Confirme para excluir.",
  "habits_count": 3
}
```

## Hábitos

### GET /habits

Lista os hábitos ativos (não arquivados) do usuário, do mais antigo para o mais novo.

- **200:** lista de objetos Hábito

### POST /habits

Cria um hábito.

| Campo | Tipo | Regra |
|---|---|---|
| `name` | texto | obrigatório, até 80 caracteres (espaços das pontas são removidos) |
| `category_id` **(planejado)** | texto | obrigatório, o `id` de uma categoria do próprio usuário |
| `weekdays` | lista de números | opcional, inteiros de 0 a 6; se omitido, vale todos os dias |

```json
{
  "name": "Ler 20 páginas",
  "category_id": "5d1c2a3e-8f7b-4c6d-9a0e-1b2c3d4e5f60",
  "weekdays": [1, 3, 5]
}
```

- **201:** o hábito criado
- **400:** nome ausente ou longo demais, categoria inexistente ou de outro usuário, dias inválidos

### PATCH /habits/:id

Edita um hábito. Envie só os campos que mudam (`name`, `category_id`, `weekdays`), com as mesmas regras do `POST`. Pelo menos um campo é obrigatório. Outros campos do corpo são ignorados.

- **200:** o hábito atualizado
- **400:** nenhum campo para atualizar, ou algum valor inválido
- **404:** hábito não encontrado

### PATCH /habits/:id/archive

Arquiva um hábito. Ele deixa de aparecer em `GET /habits`, e o histórico de check-ins continua guardado.

- **200:** o hábito, com `archived: true`
- **404:** hábito não encontrado

## Check-ins

### GET /checkins?from=AAAA-MM-DD&to=AAAA-MM-DD

Lista os check-ins do usuário no intervalo (inclui as duas pontas), em ordem de data.

`from` e `to` são obrigatórios, `from` não pode ser depois de `to`, e o intervalo tem no máximo 366 dias.

- **200:**

```json
[
  { "habit_id": "9b39fc65-5402-4644-8ddf-05a21fae2ffe", "checked_on": "2026-11-24" }
]
```

- **400:** data ausente ou inválida, intervalo invertido ou grande demais

### PUT /checkins/:habitId/:date

Marca o hábito como feito naquele dia. Pode ser repetido sem problema: marcar duas vezes o mesmo dia tem o mesmo efeito de marcar uma.

- **200:** `{ "habit_id": "...", "checked_on": "2026-11-24" }`
- **400:** data inválida, data futura, hábito arquivado
- **404:** hábito não encontrado

A data futura é definida como depois de hoje em UTC mais um dia, para não recusar quem está num fuso à frente.

### DELETE /checkins/:habitId/:date

Desmarca o hábito naquele dia. Também pode ser repetido: desmarcar um dia sem check-in não dá erro. Funciona mesmo em hábito arquivado.

- **204:** sem corpo
- **400:** data inválida
- **404:** hábito não encontrado