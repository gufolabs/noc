Testing container with alpine linux and dropbear ssh server

Login as test/pw1234567890

SSH keys are also available

Docker Compose usage:
``` yaml
  sshd:
    image: "ghcr.io/gufolabs/dropbear:v1"
    restart: "no"
    command: /usr/sbin/dropbear -F -E
    networks:
      - noc
```