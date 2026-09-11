#!/usr/bin/env bash
# Restaura um dump .sql no banco de DESENVOLVIMENTO (sobrescreve o conteúdo).
# Uso: npm run db:restore -- dumps/nome-do-dump.sql
set -euo pipefail

DB="${DB:-nest-clean}"
SERVICE="postgres"
CONTAINER="nest-clean-pg"
FILE="${1:-}"

if [[ -z "$FILE" ]]; then
  echo "[restore] Uso: npm run db:restore -- <caminho-do-dump.sql>"
  exit 1
fi

if [[ ! -f "$FILE" ]]; then
  echo "[restore] Arquivo '$FILE' não encontrado."
  exit 1
fi

if ! grep -q "$CONTAINER" <<<"$(docker compose ps --status running)"; then
  echo "[restore] Container '$CONTAINER' não está rodando. Suba com: docker compose up -d"
  exit 1
fi

docker compose exec -T "$SERVICE" \
  psql -U postgres -d "$DB" -v ON_ERROR_STOP=1 < "$FILE"

echo "[restore] Banco '$DB' restaurado a partir de: $FILE"