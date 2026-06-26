# [discovery] section

[Discovery](../services-reference/discovery.md) service configuration

## max_threads

|                |                             |
| -------------- | --------------------------- |
| Default value  | `20`                        |
| YAML Path      | `discovery.max_threads`     |
| Key-Value Path | `discovery/max_threads`     |
| Environment    | `NOC_DISCOVERY_MAX_THREADS` |

## sample

|                |                        |
| -------------- | ---------------------- |
| Default value  | `0`                    |
| YAML Path      | `discovery.sample`     |
| Key-Value Path | `discovery/sample`     |
| Environment    | `NOC_DISCOVERY_SAMPLE` |

## max_id_mac_range

Maximal allowed MAC range for id discovery. 

* `0` - disable check (default)
* `>0` - skip too broad ranges

|                |                                  |
| -------------- | -------------------------------- |
| Default value  | `0`                              |
| YAML Path      | `discovery.max_id_mac_range`     |
| Key-Value Path | `discovery/max_id_mac_range`     |
| Environment    | `NOC_DISCOVERY_MAX_ID_MAC_RANGE` |
