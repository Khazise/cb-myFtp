const net = require('net')
const readline = require('readline')

const ipClient = process.argv[2] // '127.0.0.1'
const portServer = process.argv[3]

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];


const client = new net.Socket()

client.connect(portServer, ipClient , () => {
  console.log('connected')
  
        rl.on('line', (line) => {
            client.write(line);
        });
  //client.write('USER dylan \n\r')
})

client.on('data', (data) => {  
    console.log(data.toString())
})

client.on('end', function() { 
    console.log('disconnected from server');
 });