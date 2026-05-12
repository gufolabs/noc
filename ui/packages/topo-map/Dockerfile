FROM node:24-alpine

RUN apk upgrade --no-cache

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which sh)" sh -

WORKDIR /app
