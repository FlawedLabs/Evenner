# Evenner

A brief description of what this project does and who it's for

## Installation

This project use a monorepo structure and internally uses Lerna.

Git clone the project and create a .env file in the package/server folder.
Then you can add your database URL inside :

```bash
  DATABASE_URL="postgresql://postgres:example@localhost:5432/evenner?schema=public"
```

You can then download all the dependencies

```bash
  lerna bootstrap // Download dependencies

  lerna run dev --parallel
```

## Authors

- [@Kayoshi-dev](https://www.github.com/kayoshi-dev)
- [@Mathiiii](https://www.github.com/mathiiii-dev)

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
