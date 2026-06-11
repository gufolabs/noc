# NOC Ansible — Agent Guidelines

## Scope
This zone covers the Ansible infrastructure for deploying NOC clusters. It handles:

- Deploying NOC components to target devices (roles)
- Executing pre/post-deployment commands
- Managing custom playbooks

Inventory file is prepared by NOC Tower.

### Directory Structure
```
ansible/
├── noc_roles/                # NOC-specific Ansible roles
│   ├── activator/           # SSH/Telnet session automation roles
│   ├── bi/                  # Business Intelligence setup roles
│   ├── card/                # UI card deployment roles
│   ├── classifier/          # Event classification roles
│   ├── correlator/          # Alarm correlation roles  
│   ├── discovery/           # Device/network discovery roles
│   ├── grafanads/           # Grafana dashboard provisioning
│   ├── login/               # Authentication integration roles
│   ├── metrics/             # Metrics export roles
│   ├── migrate/             # Database migration helper roles
│   └── ...                  # Other service-specific roles
├── system_roles/            # Generic infrastructure Ansible roles
├── library/                 # Custom Ansible module(s) — currently yedit.py (YAML editing)
├── lookup_plugins/          # Custom Jinja2 lookups for inventory/configuration data
├── vars/                    # Ansible variable files and group/host vars
├── deploy.yml               # Main deployment playbook
├── site.yml                 # Full site configuration playbook
├── pre.yml / post.yml       # Pre/post execution hook playbooks
└── .ansible-ci.yml          # Ansible CI integration config
```

## Role Conventions

### Creating a new role
1. Directory: `ansible/noc_roles/<service_name>/` with standard Ansible role structure:
```
noc_roles/
  <role>/
    tasks/           # main execution logic (tasks are ordered)
    templates/       # Jinja2 templates for config files
    handlers/        # notifications and callbacks
    defaults/        # default variable values
    README.md        # usage documentation
```

2. Main task file: `main.yml` in `tasks/` — defines the role execution sequence
3. Templates use Jinja2 syntax exclusively (no Django template tags, no Python code)
4. Always reference variables via `{{ variable_name }}`; never hardcode IPs/hostnames

### Variable precedence and structure
- Host-specific vars go in inventory files under `vars/<host_pattern>/*.yml`
- Role defaults go in each role's `defaults/main.yml` — these can be overridden at any level
- Group vars (by infrastructure class: switches, routers, servers) live under `noc_roles/` or `system_roles/` groups

## Testing with Molecule

Roles must have corresponding Molecule test suites to verify they work correctly. Test suites live in the role's directory under `molecule/`:
```
ansible/noc_roles/<role_name>/
  molecule/
    default/
      molecule.yml   # test environment configuration  
      converge.yml   # main test playbook (runs the role)
      verify.yml     # post-run verification steps
```

Run Molecule tests: `molecule test -s default`

## Playbook Patterns

- **deploy.yml**: main deployment entry point — orchestrates all roles in sequence
- **site.yml**: comprehensive site configuration with optional components
- **pre.yml / post.yml**: hooks executed before and after main deployments for custom setup/cleanup

Do not create standalone playbooks outside this structure. New deployment functionality should be added as roles under existing or new directory trees, then referenced from deploy.yml or site.yml.

## Custom Modules & Lookups

- `library/yedit.py` — YAML file editing module (read/write/update/delete keys)
- Lookups in `lookup_plugins/` extend Jinja2 with inventory-aware variables and dynamic value generation for device configurations

When adding modules:
1. Ensure they follow Ansible module best practices (argument_spec, result dicts)
2. Include docstrings in ReST format — this allows proper documentation generation
3. Test both positive/negative paths to confirm idempotency
4. Never import external Python packages; only use stdlib or core Ansible modules

## Important Notes

- All template files: Jinja2 syntax ONLY. No Django templating tags `{% block %}`, `{% extends %}` etc. 
- Inventory-based targeting — no hardcoded hostnames, IPs, credentials
- Variable references should always be in `{{ }}` format (not `$VAR`)
- Roles must be idempotent — running them twice should produce the same result as running once
