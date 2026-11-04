# [nbi] section (deprecated)

The `nbi` configuration prefix is deprecated. These values are rewritten to
the corresponding `web` settings and will be removed in NOC 27. The rewrite
also applies to `NOC_NBI_*` environment variables, which should be renamed to
`NOC_WEB_*`.

| Deprecated setting | Replacement |
| --- | --- |
| `nbi.max_threads` | [`web.max_threads`](web.md#max_threads) |
| `nbi.objectmetrics_max_interval` | [`web.objectmetrics_max_interval`](web.md#objectmetrics_max_interval) |
