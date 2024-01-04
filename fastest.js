import fs from 'fs';
// import readline from 'readline';
import bitcore from 'bitcore-lib';

let addressesList = './rich_bitcoin_addresses.txt';
let checkedAddresses = 0;
let checkedPrivateKeys = 0;
let found = false;

// Create file with found addresses if not exists
if (!fs.existsSync('./found.txt')) {
    fs.writeFileSync('./found.txt', '');
}

const foundFile = fs.createWriteStream('./found.txt', {
    flags: 'a'
});

// const file = readline.createInterface({
//     input: fs.createReadStream(addressesList),
// });

// const parser = async () => {
//     return new Promise((resolve, reject) => {
//         file.on('line', async (line) => {
//             const address = line.split('\t')[0];
//
//             let addressToCheck;
//             const privateKey = new bitcore.PrivateKey();
//             addressToCheck = privateKey.toAddress().toString();
//             // addressToCheck = '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF';
//
//             if (address === addressToCheck) {
//                 foundFile.write(`Address: ${address}, Private Key: ${privateKey.toString()}\n`);
//                 found = true;
//                 file.close();
//             } else {
//                 checkedAddresses++;
//             }
//         });
//
//         file.on('close', () => {
//             resolve(found);
//         });
//
//         file.on('error', (err) => {
//             console.log('error', err);
//             reject(err);
//         });
//     });
// };

// parser();
//
const consoleInterface = () => {
    if (!found) {
        console.clear();
        console.log(`Checked ${checkedAddresses} addresses, ${checkedPrivateKeys} private keys`);
    } else {
        let totalFound = fs.readFileSync('./found.txt', 'utf8');
        console.clear();
        console.log(totalFound);
        console.log(`Found! Checked ${checkedAddresses} addresses, ${checkedPrivateKeys} private keys`);
    }
};

// setInterval(consoleInterface, 1000);

const parser = () => {
    let readStream = fs.createReadStream(addressesList);

    readStream.on('data', (chunk) => {
        let lines = chunk.toString().split('\n');

        let addressToCheck;
        const privateKey = new bitcore.PrivateKey();
        addressToCheck = privateKey.toAddress().toString();
        // addressToCheck = '18xixV7nVhUvn2nVAkfNec1QkU5jH9Pg9c';
        checkedPrivateKeys++;

        lines.forEach((line) => {
            const address = line.split('\t')[0];
            if (address === addressToCheck) {
                foundFile.write(`Address: ${address}, Private Key: ${privateKey.toString()}\n`);
                found = true;
                readStream.close();
            } else {
                checkedAddresses++;
            }
        });

        consoleInterface();
    });

    readStream.on('close', () => {
        if (!found) {
            parser();
        }
    });
}

parser();