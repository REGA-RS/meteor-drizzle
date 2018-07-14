- [Getting started](#getting-started)
  * [Drizzle](#drizzle)
    + [Installation](#installation)
    + [Run](#run)
  * [Meteor](#meteor)
    + [Run](#run-1)

# Meteor-Drizzle
Drizzle DAPP with Meteor backend. More information [here](https://medium.com/coinmonks/drizzle-dapp-with-meteor-backend-b16ff0a8dd11).

<!-- toc -->

## Getting Started
### Drizzle
Trough command line enter dapp folder
```bash
cd dapp
```

#### Installation
1. Install Truffle and Ganache CLI globally. If you prefer, the graphical version of Ganache works as well!

```bash
npm install -g truffle
npm install -g ganache-cli
```

2. Run the development blockchain, we recommend passing in a blocktime. Otherwise, its difficult to track things like loading indicators because Ganache will mine instantly.

```bash
// 3 second blocktime.
ganache-cli -b 3
```

3. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with truffle.
To enter development console:
```bash
truffle console
```

then:
```bash
compile
migrate
```

#### Run
Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.

```bash
// Serves the front-end on http://localhost:3000
npm run start
```

----

### Meteor
Trough command line enter meteor folder
```bash
cd ..
cd backend
``` 

#### Run
```bash
npm install
// Serves the back-end on http://localhost:9000
npm start
```
