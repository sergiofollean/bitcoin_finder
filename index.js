import bitcore from 'bitcore-lib';
import axios from "axios";

let addressesChecked = 0;

const parser = async () => {
    let found = false;

    console.log('parsing...');

    const addresses = [];
    for (let i = 0; i < 200; i++) {
        const privateKey = new bitcore.PrivateKey();
        const address = privateKey.toAddress();
        addresses.push({
            privateKey: privateKey.toString(),
            address: address.toString()
        });
    }

    const addressesString = addresses.map(a => a.address).join('|');

    axios.get(`https://blockchain.info/balance?active=${addressesString}`)
        .then(response => {
            const balances = response.data;
            addresses.forEach(address => {
                let balance = balances[address.address].final_balance;

                if (balance > 0) {
                    console.log(`Address: ${address.address}, Balance: ${balance}, Private Key: ${address.privateKey}`);
                    found = true;
                }
            });

            if (!found) {
                addressesChecked += 200;
                console.log(`Checked ${addressesChecked} addresses`);
                setTimeout(parser, 500);
            }
        })
        .catch(() => {
            console.log('error');
            setTimeout(parser, 15000);
        });
}

parser();