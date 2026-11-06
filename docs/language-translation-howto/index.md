---
tags:
  - how-to
---
# How to Localize the NOC Interface

Set the global `language` parameter to choose the interface language. NOC supports `en`, `ru`, and `pt_BR`; restart the affected services after changing the parameter. See the [`language` configuration reference](../config-reference/global.md#language).

## Add or Update Python Translations

Python translations use stable keys in YAML catalogs. The files are `src/noc/i18n/en.yml`, `src/noc/i18n/ru.yml`, and `src/noc/i18n/pt_BR.yml`.

1. Add the key and English text to `en.yml`.
2. Add the same key and translated text to each language catalog you are updating. A missing key falls back to English.
3. Keep the keys in alphabetical order. The catalog tests check this order.
4. Use the key from Python with `t()`:

   ```python
   from noc.core.i18n import t

   error = t("msg-prefix-not-found")
   ```

Use a key prefix that describes the text's purpose and context:

| Prefix | Use |
| --- | --- |
| `btn-` | Button text, such as `btn-print` |
| `msg-` | User-facing messages and errors |
| `label-` | Form field labels and field headings in cards |
| `help-` | Help text and tooltips |
| `choice-` | Values in a choice list |
| `header-` | Report and table column headings |
| `title-` | Titles that are not application titles |
| `status-` | State and status values |
| `app-title-`, `app-group-`, `nav-` | Application titles, menu groups, and navigation labels |

Card templates use the same function without an import:

```jinja
<b>{{ t("label-name") }}</b>
```

Pass values as named arguments. Use ICU plural patterns when a message changes with a count; do not build a sentence by joining a translation and a number.

```yaml
msg-item-count: "{count, plural, one {# item} other {# items}}"
```

```python
t("msg-item-count", count=item_count)
```

For Russian, include the `one`, `few`, `many`, and `other` plural forms. Use the ICU MessageFormat syntax in every language catalog.

## Translate JavaScript Strings

JavaScript continues to use `__()` and gettext catalogs. For example:

```javascript
__("Save")
```

Extract and update the Web catalog after changing JavaScript strings:

```bash
./noc translation extract web
./noc translation update web
```

Edit `src/noc/services/web/translations/<language>/LC_MESSAGES/messages_js.po`, then compile it:

```bash
./noc translation compile web
```

Compilation writes the JavaScript JSON catalog to `ui/web/translations/<language>.json`. The `translation` commands apply to the gettext catalogs; they do not extract Python `t()` keys. New JavaScript source files must be tracked by Git before extraction because the command scans `git ls-files`.

## Validate Catalogs

Run the catalog tests after editing YAML translations:

```bash
./scripts/run-dev pytest tests/i18n/test_catalog.py
```

The tests check that each configured catalog loads, contains the same keys as English, and keeps its keys alphabetically sorted.
