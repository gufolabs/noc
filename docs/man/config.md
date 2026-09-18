

# config


## Name

*config*: Config manipulation tool

## Synopsis

    noc config dump

## Description

*config* loads effective configuration and dumps it in YAML format to stdout.
Effective configuration defined by [noc_config](../config-reference/index.md#noc_config) environment variable.
Refer to [admin-configuration](../config-reference/index.md) for details.

## Examples

```bash
$ ./noc config dump
$ NOC_CONFIG=yaml:///etc/noc.yml ./noc config dump
```

## See also

* [noc_config](../config-reference/index.md#noc_config)
* [admin-configuration](../config-reference/index.md)
