# DATABASE.md

Documentação do banco de dados do Fortuna. SQLite via `better-sqlite3` + Lucid ORM.

Observações gerais:

- Todas as tabelas possuem `id` (chave primária autoincrementada).
- Todas as chaves estrangeiras de `user_id` usam `ON DELETE CASCADE` (dono dos dados).
- Soft archive: entidades de domínio possuem `archived` (boolean) e `archived_at` (timestamp nullável).

---

## users

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| full_name | string | nullable |
| email | string(254) | not null, unique |
| password | string | not null |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

---

## settings

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE, unique |
| currency | string(3) | not null, default `'USD'` |
| locale | string(10) | not null, default `'en-US'` |
| timezone | string(64) | not null, default `'UTC'` |
| locale_initialized_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

---

## account_types

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| name | string(120) | not null |
| description | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(user_id, name)`

---

## accounts

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| account_type_id | integer unsigned | FK account_types.id, not null, ON DELETE RESTRICT |
| name | string(120) | not null |
| initial_balance | decimal(14,2) | not null, default `0` |
| current_balance | decimal(14,2) | not null, default `0` |
| currency | string(3) | not null, default `'USD'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(user_id, name)`

---

## category_groups

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| name | string(120) | not null |
| position | integer | not null, default `0` |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | nullable |
| updated_at | timestamp | nullable |

Unique: `(user_id, name)`

---

## categories

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| category_group_id | integer unsigned | FK category_groups.id, not null, ON DELETE RESTRICT |
| name | string(120) | not null |
| type | string(20) | not null, default `'expense'` |
| color | string(20) | nullable |
| icon | string(50) | nullable |
| position | integer | not null, default `0` |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(user_id, name)`

---

## payees

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| name | string(160) | not null |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(user_id, name)`

---

## transactions

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| account_id | integer unsigned | FK accounts.id, not null, ON DELETE RESTRICT |
| category_id | integer unsigned | FK categories.id, nullable, ON DELETE SET NULL |
| payee_id | integer unsigned | FK payees.id, nullable, ON DELETE SET NULL |
| type | string(20) | not null, default `'expense'` |
| amount | decimal(14,2) | not null |
| transaction_date | date | not null |
| status | string(20) | not null, default `'posted'` |
| description | text | nullable |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(user_id, transaction_date)`, `(account_id, transaction_date)`

---

## transfers

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| from_account_id | integer unsigned | FK accounts.id, not null, ON DELETE RESTRICT |
| to_account_id | integer unsigned | FK accounts.id, not null, ON DELETE RESTRICT |
| out_transaction_id | integer unsigned | FK transactions.id, nullable, ON DELETE SET NULL |
| in_transaction_id | integer unsigned | FK transactions.id, nullable, ON DELETE SET NULL |
| amount | decimal(14,2) | not null |
| transfer_date | date | not null |
| status | string(20) | not null, default `'posted'` |
| description | text | nullable |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(user_id, transfer_date)`, `(from_account_id, transfer_date)`, `(to_account_id, transfer_date)`

---

## recurring_transactions

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| account_id | integer unsigned | FK accounts.id, not null, ON DELETE RESTRICT |
| category_id | integer unsigned | FK categories.id, nullable, ON DELETE SET NULL |
| payee_id | integer unsigned | FK payees.id, nullable, ON DELETE SET NULL |
| type | string(20) | not null, default `'expense'` |
| amount | decimal(14,2) | not null |
| frequency | string(20) | not null |
| interval | integer | not null, default `1` |
| start_date | date | not null |
| end_date | date | nullable |
| next_occurrence_date | date | not null |
| status | string(20) | not null, default `'active'` |
| description | text | nullable |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(user_id, status)`, `(user_id, next_occurrence_date)`

---

## budgets

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| name | string(120) | not null |
| period_start | date | not null |
| period_end | date | not null |
| status | string(20) | not null, default `'active'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(user_id, name, period_start)`
Índice: `(user_id, period_start, period_end)`

---

## budget_categories

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| budget_id | integer unsigned | FK budgets.id, not null, ON DELETE CASCADE |
| category_id | integer unsigned | FK categories.id, not null, ON DELETE RESTRICT |
| planned_amount | decimal(14,2) | not null, default `0` |
| carryover_amount | decimal(14,2) | not null, default `0` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(budget_id, category_id)`
Índice: `(user_id, budget_id)`

---

## credit_cards

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| account_id | integer unsigned | FK accounts.id, nullable, ON DELETE SET NULL |
| name | string(120) | not null |
| brand | string(40) | nullable |
| last_four_digits | string(4) | nullable |
| credit_limit | decimal(14,2) | not null, default `0` |
| closing_day | integer | not null |
| due_day | integer | not null |
| status | string(20) | not null, default `'active'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(user_id, name)`
Índice: `(user_id, status)`

---

## credit_card_invoices

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| credit_card_id | integer unsigned | FK credit_cards.id, not null, ON DELETE CASCADE |
| reference_month | string(7) | not null |
| period_start | date | not null |
| period_end | date | not null |
| due_date | date | not null |
| total_amount | decimal(14,2) | not null, default `0` |
| minimum_amount | decimal(14,2) | not null, default `0` |
| paid_amount | decimal(14,2) | not null, default `0` |
| status | string(20) | not null, default `'open'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(credit_card_id, reference_month)`
Índices: `(user_id, status)`, `(user_id, due_date)`

---

## credit_card_purchases

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| credit_card_id | integer unsigned | FK credit_cards.id, not null, ON DELETE CASCADE |
| category_id | integer unsigned | FK categories.id, nullable, ON DELETE SET NULL |
| payee_id | integer unsigned | FK payees.id, nullable, ON DELETE SET NULL |
| description | string(160) | not null |
| total_amount | decimal(14,2) | not null |
| installments_count | integer | not null, default `1` |
| purchase_date | date | not null |
| status | string(20) | not null, default `'open'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(user_id, purchase_date)`, `(credit_card_id, purchase_date)`

---

## credit_card_installments

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| credit_card_purchase_id | integer unsigned | FK credit_card_purchases.id, not null, ON DELETE CASCADE |
| credit_card_invoice_id | integer unsigned | FK credit_card_invoices.id, nullable, ON DELETE SET NULL |
| installment_number | integer | not null |
| amount | decimal(14,2) | not null |
| due_date | date | not null |
| status | string(20) | not null, default `'open'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(credit_card_purchase_id, installment_number)`
Índices: `(user_id, due_date)`, `(credit_card_invoice_id)`

---

## credit_card_invoice_payments

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| credit_card_invoice_id | integer unsigned | FK credit_card_invoices.id, not null, ON DELETE CASCADE |
| account_id | integer unsigned | FK accounts.id, not null, ON DELETE RESTRICT |
| transaction_id | integer unsigned | FK transactions.id, nullable, ON DELETE SET NULL |
| amount | decimal(14,2) | not null |
| payment_date | date | not null |
| status | string(20) | not null, default `'posted'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(user_id, payment_date)`, `(credit_card_invoice_id)`, `(account_id)`

---

## shopping_lists

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| name | string(140) | not null |
| status | string(20) | not null, default `'open'` |
| target_date | date | nullable |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Unique: `(user_id, name)`
Índice: `(user_id, status)`

---

## shopping_list_items

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| shopping_list_id | integer unsigned | FK shopping_lists.id, not null, ON DELETE CASCADE |
| name | string(160) | not null |
| quantity | decimal(12,3) | not null, default `1` |
| unit | string(20) | nullable |
| estimated_price | decimal(14,2) | nullable |
| checked | boolean | not null, default `false` |
| position | integer | not null, default `0` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(shopping_list_id, position)`, `(user_id, checked)`

---

## purchases

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| account_id | integer unsigned | FK accounts.id, nullable, ON DELETE SET NULL |
| shopping_list_id | integer unsigned | FK shopping_lists.id, nullable, ON DELETE SET NULL |
| title | string(160) | not null |
| purchase_date | date | not null |
| total_amount | decimal(14,2) | not null, default `0` |
| status | string(20) | not null, default `'open'` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(user_id, purchase_date)`, `(user_id, status)`

---

## purchase_items

| Coluna | Tipo | Atributos |
| --- | --- | --- |
| id | increments | PK, not null |
| user_id | integer unsigned | FK users.id, not null, ON DELETE CASCADE |
| purchase_id | integer unsigned | FK purchases.id, not null, ON DELETE CASCADE |
| shopping_list_item_id | integer unsigned | FK shopping_list_items.id, nullable, ON DELETE SET NULL |
| category_id | integer unsigned | FK categories.id, nullable, ON DELETE SET NULL |
| payee_id | integer unsigned | FK payees.id, nullable, ON DELETE SET NULL |
| name | string(160) | not null |
| quantity | decimal(12,3) | not null, default `1` |
| unit_price | decimal(14,2) | not null, default `0` |
| total_price | decimal(14,2) | not null, default `0` |
| notes | text | nullable |
| archived | boolean | not null, default `false` |
| archived_at | timestamp | nullable |
| created_at | timestamp | not null |
| updated_at | timestamp | nullable |

Índices: `(purchase_id)`, `(user_id, category_id)`

---

## Resumo de relacionamentos (FKs)

| Tabela | Referência | ON DELETE |
| --- | --- | --- |
| settings | users | CASCADE |
| account_types | users | CASCADE |
| accounts | users / account_types | CASCADE / RESTRICT |
| category_groups | users | CASCADE |
| categories | users / category_groups | CASCADE / RESTRICT |
| payees | users | CASCADE |
| transactions | users / accounts / categories / payees | CASCADE / RESTRICT / SET NULL / SET NULL |
| transfers | users / accounts x2 / transactions x2 | CASCADE / RESTRICT / RESTRICT / SET NULL / SET NULL |
| recurring_transactions | users / accounts / categories / payees | CASCADE / RESTRICT / SET NULL / SET NULL |
| budgets | users | CASCADE |
| budget_categories | users / budgets / categories | CASCADE / CASCADE / RESTRICT |
| credit_cards | users / accounts | CASCADE / SET NULL |
| credit_card_invoices | users / credit_cards | CASCADE / CASCADE |
| credit_card_purchases | users / credit_cards / categories / payees | CASCADE / CASCADE / SET NULL / SET NULL |
| credit_card_installments | users / credit_card_purchases / credit_card_invoices | CASCADE / CASCADE / SET NULL |
| credit_card_invoice_payments | users / credit_card_invoices / accounts / transactions | CASCADE / CASCADE / RESTRICT / SET NULL |
| shopping_lists | users | CASCADE |
| shopping_list_items | users / shopping_lists | CASCADE / CASCADE |
| purchases | users / accounts / shopping_lists | CASCADE / SET NULL / SET NULL |
| purchase_items | users / purchases / shopping_list_items / categories / payees | CASCADE / CASCADE / SET NULL / SET NULL / SET NULL |