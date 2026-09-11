#!/usr/bin/env bash
# Exporta o banco de desenvolvimento para um arquivo SQL em dumps/.
set -euo pipefail

DB="${DB:-nest-clean}"
SERVICE="postgres"
CONTAINER="nest-clean-pg"

if ! grep -q "$CONTAINER" <<<"$(docker compose ps --status running)"; then
  echo "[dump] Container '$CONTAINER' não está rodando. Suba com: docker compose up -d"
  exit 1
fi

mkdir -p dumps
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="dumps/${DB}-${STAMP}.sql"

# --clean --if-exists: o dump já inclui os DROPs, facilitando o restore
# em cima de um banco que já tem as tabelas (via migrations).
docker compose exec -T "$SERVICE" \
  pg_dump -U postgres --clean --if-exists -d "$DB" > "$OUT"

echo "[dump] Banco '$DB' exportado para: $OUT"