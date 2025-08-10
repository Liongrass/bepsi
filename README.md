# Bepsi-pi

Code that lives in the bepsi vending machine that does one thing:

- Accept sats, dispense cans

To run:

```bash
yarn
yarn start

# Start
npm install -g pm2
pm2 start index.js --name bepsi-pi --exp-backoff-restart-delay=100
```
