---
namespace: sql
checks:
    - id: select-count-existance
      description: Amounts of usages of SELECT COUNT to check existance of the record
      target: 0
---
# Record Existence Check

To check the record exist in table **MUST** use following pattern
```sql
SELECT 1
FROM <table>
WHERE <condition>
LIMIT 1
```

and **MUST NOT** use following approach:

```sql
SELECT COUNT(*)
FROM <table>
WHERE <condition>
```