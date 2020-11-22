const net = require('net')
const fs = require('fs')
const readline = require('readline');
const { dirname } = require('path');

const port = process.argv[2]
const data = fs.readFileSync('user.json');
const user = JSON.parse(data);

let username = ''

const server = net.createServer((socket) => {
  console.log('new connection')

  socket.on('data', (data) => {
    const [directive, parameter] = data.toString().split(' ')

    switch(directive) {
        case 'USER':
            // check if user exist in database
            // if true

            console.log(user);
            let userExits = 'user not exits';
            user.forEach(data => { 
                if(data.username == parameter)
                {
                    userExits = 'User exits'
                    username = parameter
                }    
              });

              socket.write(userExits)
            break;

        case 'PASS':
            let pwdMessage = 'Wrong password';
            user.forEach(data => { 
                if(data.username == username & data.password == parameter)
                {
                    pwdMessage = 'You are connected'
                }    
              });
            socket.write(pwdMessage)
            break;
        
        case 'LIST':
            socket.write(`Current directory of the server : ${process.cwd()}`)
            break;
        
        case 'CWD': 
        try {
            process.chdir(parameter);
            console.log(`New directory: ${process.cwd()}`);
          } catch (err) {
            console.error(`chdir: ${err}`);
          }

    }
  })

  socket.write('Hello from server')

})

server.listen(port, () => {
  console.log('Server started at port ' + port)
  
})