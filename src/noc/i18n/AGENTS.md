# Translation Catalog Guidelines

## Source Catalog

- `en.yml` is the canonical catalog and source of translation keys.
- Add each new key to `en.yml` with its English text.
- Add translations to `ru.yml` and `pt_BR.yml` when available. A missing localized key falls back to English.
- Do not add a key to `ru.yml` or `pt_BR.yml` unless it exists in `en.yml`.
- Keep values as strings. Use ICU MessageFormat patterns for plural forms and interpolation, with named arguments.
- Do not put a space before an ellipsis (`...`).
- Do not put spaces before `:`, `;`, `.`, or `,`. Add a space after those marks when prose continues; preserve technical syntax such as decimals, addresses, placeholders, and code expressions.
- Do not leave leading or trailing whitespace in translation values.
- Do not start text with a punctuation mark. Standalone symbols and leading percent signs in unit labels (for example, `% Used`) are allowed.

## Key Prefixes

Choose a prefix that describes the text's role in the interface:

| Prefix | Use |
| --- | --- |
| `app-title-` | Application titles |
| `app-group-` | Application menu groups |
| `nav-` | Navigation items |
| `btn-` | Button labels and actions |
| `msg-` | User-facing messages and errors |
| `label-` | Form fields and card labels |
| `help-` | Help text and tooltips |
| `header-` | Table and report headings |

Use the most specific matching prefix. Keep a key stable when translating the same concept in Python, Jinja, and JavaScript.

## Key Ordering

- Sort every catalog's keys in ascending lexicographic order by the complete key, including its prefix.
- Keep one key per YAML line and do not insert section headers that disrupt this ordering.
- The catalog tests validate alphabetical ordering and reject duplicate keys.
