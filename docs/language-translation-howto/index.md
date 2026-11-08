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
| `header-` | Report and table column headings |
| `app-title-` | Application titles |
| `app-group-` | Application groups |
| `nav-` | Application menu items |

Card templates use the same function without an import:

{% raw %}
```jinja
<b>{{ t("label-name") }}</b>
```
{% endraw %}

Pass values as named arguments. Use ICU plural patterns when a message changes with a count; do not build a sentence by joining a translation and a number.

{% raw %}
```yaml
msg-item-count: "{count, plural, one {# item} other {# items}}"
```
{% endraw %}

```python
t("msg-item-count", count=item_count)
```

For Russian, include the `one`, `few`, `many`, and `other` plural forms. Use the ICU MessageFormat syntax in every language catalog.

## Translate the JavaScript Interface

JavaScript UI uses `t()` and the same YAML catalogs as Python: `src/noc/i18n/{en,ru,pt_BR}.yml`. The English catalog is the base; each selected language overlays it during the UI build.

1. Add a stable key and English text to `en.yml`.
2. Add the translation under the same key to the language catalogs. Use named arguments and ICU plural forms for dynamic messages.
3. Call `t("btn-save")` in JavaScript.
4. Choose a key prefix by purpose: `app-title-`, `nav-`, `app-group-`, `msg-`, `label-`, `header-`, `help-`, or `btn-`.

## Validate Catalogs

Run the catalog tests after editing YAML translations:

```bash
./scripts/run-dev pytest tests/i18n/test_catalog.py
```

The tests check that each configured catalog loads, contains the same keys as English, and keeps its keys alphabetically sorted.
