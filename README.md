# multimodal-map

A map-centric user interface for exploring data from a [Diana](https://github.com/CDH-DevTeam/diana-backend) server.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [Volar Takeover Mode](https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Choose research project

Choose which project to build for, by specifying the `PROJECT` environment variable:

```sh
PROJECT=rwanda npm run dev
# or...
echo "PROJECT=rwanda" > .env.local
npm run dev
```

It identifies a directory under [projects/](projects/), e.g. `projects/rwanda`, where project-specific configuration lives.
