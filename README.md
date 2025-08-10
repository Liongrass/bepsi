# Bepsi-pi

Fork of DCTRL's [bepsi](https://github.com/GitYVR/bepsi-pi)

Code that lives in the bepsi vending machine that does one thing:

- Accept sats, dispense cans

This guide was written for Debian 11.

Prerequisites:

`sudo apt install git make build-essential`

Requires [Node.js](https://nodejs.org/en/download)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 20
```

Requires [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

```bash
npm install --global yarn
```

To install:

```bash
yarn
```

Copy the example environment and fill out the parameters:
```bash
cp .env.example .env
```

To run:

```bash
yarn start
```

# Start
npm install -g pm2
pm2 start index.js --name bepsi-pi --exp-backoff-restart-delay=100
```
