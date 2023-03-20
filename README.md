# multimodal-map

A map-centric user interface for exploring data from a [Diana](https://github.com/CDH-DevTeam/diana-backend) server.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [Volar Takeover Mode](https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode).

## Development tasks

### Setup

```sh
yarn install
```

### Start local development server

```sh
yarn dev
```

### Build for deployment

```sh
yarn build
```

### Choose research project

Choose which project to build for, by specifying the `PROJECT` environment variable:

```sh
PROJECT=rephotography yarn dev
# or...
echo "PROJECT=rephotography" > .env.local
yarn dev
```

It identifies a directory under [projects/](projects/), e.g. `projects/rephotography`, where project-specific configuration and code lives.
