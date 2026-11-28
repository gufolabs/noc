# NOC Adapters — Agent Guidelines

## Scope
This zone covers the NOC device adapters (drivers) used to manage network equipment. Each adapter implements the complete interaction logic for one vendor/software pair. The matching key is the profile name `<vendor>.<software>`: a single adapter can be shared across multiple hardware models that speak the same protocol/config schema.

`adapters/` is the driver boundary of the hexagonal architecture: everything in this directory talks to the external world (devices) and is driven by the domain code in `sa/` and `core/`. `sa/` is the domain (models, migrations); `adapters/` contains no models.

### Terminology: Profile vs Adapter — do not confuse

- **Profile** (`sa.Profile`) — the domain entity: the logical `<vendor>.<software>` name shown in the database and UI, e.g. `Cisco.IOS`.
- **Adapter** (`adapters/<flat name>/`) — the Python driver of a device; the directory is exactly `mangle_profile_name(profile.name)`.

Names ending in `Profile` in `sa.models` are configuration entities, **not** drivers:

| Class | What it is |
|-------|------------|
| `sa.Profile` | The device profile name (`Vendor.Software`) — the matching key |
| `sa.CapsProfile` | Capability templates per profile |
| `sa.ServiceProfile` | Service-level settings per profile |
| `sa.AuthProfile` | Authentication settings |
| `sa.ManagedObjectProfile` | Per-device profile assignment overrides |

None of these correspond to anything in `adapters/`.

### Directory Structure
```bash
adapters/
├── <flat name>/            # Flat name generated from the profile name (see below)
│   ├── profile.py          # Device adapter — complete interaction logic for this vendor/software pair
│   └── *.py                # Scripts implementing SA interfaces
├── generic__host/          # Generic.Host profile — default SNMP-based scripts
├── vim.py                  # Shared VMware (pyVmomi) helpers
└── connection.py           # Shared VMware connection helpers
```

Current coverage: 108+ vendors, 234 profiles.

### Directory and Module Naming
Profile names in the database and UI are `<vendor>.<software>` (e.g., `Cisco.IOS`, `3Com.4500`). The backing directory is the *flat name* produced by `mangle_profile_name` (`noc.core.profile.names`):

- each dot-separated segment is lowercased;
- every character outside `[a-z0-9]` becomes `_` (consecutive runs collapse to one `_`);
- segments are joined with `__`;
- a leading digit or underscore gets an extra `_` prefix.

Test vectors:

| Profile name | Flat name |
|--------------|-----------|
| `Cisco.IOS` | `cisco__ios` |
| `3Com.4500` | `_3com__4500` |
| `IRE-Polus.Horizon` | `ire_polus__horizon` |
| `Brocade.CER-ADV` | `brocade__cer_adv` |
| `DLink.DxS_Cisco_CLI` | `dlink__dxs_cisco_cli` |
| `Generic.Host` | `generic__host` |
| `Cisco.ROS.XR` | `cisco__ros__xr` |
| `_Foo.Bar` | `__foo__bar` |

The profile loader does not guess names from directory names: it imports each `profile.py` and reads the required `BaseProfile.name` attribute. The directory name must therefore match `mangle_profile_name(name)`.

**Collision caveat:** names that differ only in `-` vs `_` (e.g., `A.B-C` and `A.B_C`) mangle to the same flat name and must not coexist. Resolve by choosing distinct profile names, not by runtime validation.

## Architecture

### Lookup — no fallback chains
Profiles are matched strictly via the profile name. If a matching adapter exists, its `profile.py` is loaded; otherwise, NOC fails to communicate with the device. There is no generic vendor-level or system-wide default adapter falling back on unmatched pairs — each device must have an exact match.

### profile.py Convention
The file `adapters/<flat name>/profile.py` is a full device-specific adapter containing class-level attributes mapped to NOC's internal representation:

| Attribute | Purpose | Example Value |
|-----------|---------|---------------|
| `name` | **Required.** Profile name, e.g. `"Cisco.IOS"` | `"Cisco.IOS"` |
| `config_commands` | SNMP GET commands for config extraction | `{"running-config": ".1.3.6.1.4.1..."}` |
| `version_command` | SNMP command for OS version detection | `".1.3.6.1.2.1.1.1.0"` (sysDescr) |
| `metric_oids` | Performance measurement OID mappings | Custom SNMP/OID tuples per counter |
| `snmp_trap_handlers` | SNMP trap processing logic | Callback classes or dicts |

`BaseProfile.name` is enforced by the profile metaclass: subclassing `BaseProfile` without a `name` raises at import time.

The adapter is comprehensive — it defines everything needed to configure, query, and monitor that specific device type. Scripts in the same directory support the adapter but should not replace the core logic.

### Generic Scripts
`adapters/generic__host/` is the `Generic.Host` profile directory, kept on equal terms with all other adapters — the layout has no special cases. Its scripts are additionally applied to other profiles when the profile does not ship its own version; generic scripts with a `requires = [...]` block are only applied when all required scripts are available for the profile. This is script-application semantics, not a layout concept. Cross-adapter imports point at the flat module path, e.g. `from noc.adapters.generic__host.get_interfaces import Script as BaseScript`.

### Sharing Adapters Across Models
Multiple hardware models can reference the same adapter if they share the same configuration schema (e.g., both Cisco 2900 and Cisco 3800 running IOS use `adapters/cisco__ios/profile.py`). When a new model shares an existing software, only the inventory/model definition needs to point at the pre-existing profile.

### Custom Adapters
Custom profiles live in `<custom root>/adapters/<flat name>/` and follow the exact same conventions as the built-in ones.

## Common Patterns
When writing or modifying adapters:
- **Software-first lookup:** Always check for an existing adapter with a matching profile before creating a new one.
- **Adapters are all-or-nothing:** `profile.py` handles every protocol command, OID mapping, and validation rule for that device class. Do not split logic across multiple modules unless you're just creating helpers invoked from the adapter itself.
- Keep adapters strictly Pythonic — no Django template injection or Jinja2 templating in the adapter layer.
