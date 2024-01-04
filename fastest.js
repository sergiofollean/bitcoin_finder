import fs from 'fs';
// import readline from 'readline';
import bitcore from 'bitcore-lib';
import CoinKey from 'coinkey';

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

const parser = async () => {
    let readStreams = [];

    for (let i = 0; i < 3; i++) {
        readStreams.push(fs.createReadStream(addressesList));

        readStreams[i].on('data', (chunk) => {
            let lines = chunk.toString().split('\n');

            let addressesToCheck = new Map();
            for (let y = 0; y < 100; y++) {
                const ck = new CoinKey.createRandom();
                addressesToCheck.set(ck.publicAddress, ck.privateWif);

                // addressesToCheck.set('1LMqC1gXqzngR4QeBUdfS4VxpKtvqjQQMn', ck.privateWif);
                checkedPrivateKeys++;
            }

            lines.forEach((line) => {
                const address = line.split('\t')[0];
                if (addressesToCheck.has(address)) {
                    const privateKey = addressesToCheck.get(address);
                    foundFile.write(`Address: ${address}, Private Key: ${privateKey}\n`);
                    found = true;
                    readStreams.forEach(rs => rs.close());
                } else {
                    checkedAddresses++;
                }
            });

            consoleInterface();
        });

        readStreams[i].on('close', () => {
            readStreams[i].destroy();

            // check if no more read streams
            if (readStreams.every(rs => rs.destroyed) && i === readStreams.length - 1 && !found) {
                parser();
            }
        });
    }

    await Promise.all(readStreams);
}

parser();