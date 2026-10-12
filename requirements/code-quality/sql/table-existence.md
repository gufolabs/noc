---
checks:
- id: pgclass-count
  description: SELECT COUNT(*) usages over pg_class
  target: 0
---
# Table Existence Check

To check existence of the table **MUST** use following approach:

```sql
SELECT to_regclass('<table>') IS NOT NULL
```

**MUST NOT** use following approach:

```sql
SELECT COUNT(*) FROM pg_class WHERE relname='{t}'
```

**MUST NOT** access `pg_class` directly to check existence of the table.