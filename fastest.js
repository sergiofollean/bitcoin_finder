import fs from 'fs';
import readline from 'readline';
import bitcore from 'bitcore-lib';

let addressesList = './rich_bitcoin_addresses.txt';
let checkedAddresses = 0;
let found = false;

// Create file with found addresses
const foundFile = fs.createWriteStream('./found.txt');

const file = readline.createInterface({
    input: fs.createReadStream(addressesList),
    // output: process.stdout,
});

const parser = async () => {
    return new Promise((resolve, reject) => {
        file.on('line', async (line) => {
            const address = line.split('\t')[0];
            // const balance = line.split('\t')[1];

            let addressToCheck;
            const privateKey = new bitcore.PrivateKey();
            addressToCheck = privateKey.toAddress().toString();
            // addressToCheck = '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF';

            if (address === addressToCheck) {
                foundFile.write(`Address: ${address}, Balance: ${balance}, Private Key: ${privateKey.toString()}\n`);
                found = true;
                file.close();
            } else {
                checkedAddresses++;
            }
        });

        file.on('close', () => {
            resolve(found);
        });

        file.on('error', (err) => {
            console.log('error', err);
            reject(err);
        });
    });
};

parser();

const consoleInterface = () => {
    if (!found) {
        console.clear();
        console.log(`Checked ${checkedAddresses} addresses`);
    } else {
        let totalFound = fs.readFileSync('./found.txt', 'utf8');
        console.clear();
        console.log(totalFound);
        console.log(`Found! Checked ${checkedAddresses} addresses`);
    }
};

setInterval(consoleInterface, 1000);