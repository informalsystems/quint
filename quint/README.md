# `quint`: The core Quint tool

This directory contains the `quint` CLI providing powerful tools for working
with [the Quint specification language](../doc/lang.md).

## Installation

Install the [latest published version from npm](https://www.npmjs.com/package/@informalsystems/quint):

``` sh
npm i @informalsystems/quint
```

## How to run

Check the [quint manual](../doc/quint.md).

## How to develop

### Development environment

 1. Make sure that you have installed [npm][]. This is usually done with your
 OS-specific package manager.

 1. Clone the repository and cd into the `quint` tool's subdirectory
 
    ```sh
    git clone git@github.com:informalsystems/quint.git
    cd quint/quint
    ```

 1. Install dependencies:

    ```sh
    npm install
    ```

 1. Compile `quint`:

    ```sh
    npm run compile
    ```

 1. To run CLI, install the package locally:

    ```sh
    npm link
    ```

 1. You can run CLI by typing:

    ```sh
    quint
    ```

Additionally, if you want to compile the vscode plugin:

 1. Install [yalc][] for local package management:

    ```sh
    npm install yalc -g
    ```

 1. Publish the package locally with yalc:

    ```sh
    yalc publish
    ```


### Code

Extend the code in [src](./src).

### Unit tests

Write unit tests in [test](./test), add test data to
[testFixture](./testFixture). To run the tests and check code coverage, run the
following commands:

 1. Compile and test the parser:

    ```sh
    npm run compile && npm run test
    ```

 1. Check code coverage with tests:

    ```sh
    npm run coverage
    ```

#### Updating the source map test fixtures

  1. Compile and link the parser

     ```sh
     npm run compile && npm link
     ```

  1. Generate new source maps for each map needing to be updated, e.g.,

     ```sh
     quint parse testFixture/SuperSpec.qnt --out testFixture/SuperSpec.json --source-map testFixture/SuperSpec.map.json
     ```

  1. Go into the resulting `.map.json` and `.json` files and replace the
     absolute path on your system with `mocked_path`. E.g., replace
     `/home/me/.../testFixture/SuperSpec.map.json` with
     `mocked_path/testFixture/SuperSpec.map.json`. You can do that with `perl`:

     ```sh
     perl -pi -e 's#"/.*?/testFixture#"mocked_path/testFixture#g' testFixture/SuperSpec{.map,}.json
     ```

### Integration tests

All development dependencies should be tracked in the `package.json` and
`package-lock.json`. These will be installed when you run `npm install` on
this project (unless you have [explicitly told
npm](https://docs.npmjs.com/cli/v9/commands/npm-install#description) to use
production settings).

To [add a new dependency for integration tests or other development
purposes](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file)
run

``` sh
npm install <dep> --save-dev
```

 1. Update tests in [cli-tests.md](./cli-tests.md).

 1. Run integration tests:

    ```sh
    npm run compile && npm link && npm run integration
    ```

[npm]: https://en.wikipedia.org/wiki/Npm_(software)
[yalc]: https://www.npmjs.com/package/yalc
[txm]: https://www.npmjs.com/package/txm

### Parser

We use the `antlr4ts` parser generator to compile the BNF like notation specified
in [./src/generated/Quint.g4](./src/generated/Quint.g4) into a typescript lexer and
parser. To regenerate the parser and lexer, run

``` sh
npm run antlr
```
