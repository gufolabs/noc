Testing container with alpine linux and telnet server

Login as test/pw1234567890

Docker Compose usage:
``` yaml
  telnetd:
    image: "ghcr.io/gufolabs/telnetd:v1"
    restart: "no"
    command: /usr/sbin/telnetd -F
    networks:
      - noc
```