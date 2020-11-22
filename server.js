const net = require('net')
const fs = require('fs')
const readline = require('readline')
const path = require('path')

const port = process.argv[2]
const data = fs.readFileSync('user.json');
const user = JSON.parse(data);


const server = net.createServer((socket) => {
  console.log('new connection')
  let username = ''
  let connected = false;
  socket.on('data', (data) => {
    const [directive, parameter] = data.toString().split(' ')

    switch(directive) {
        case 'USER':
            // check if user exist in database
            // if true
            
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
                    connected = true;
                }    
              });
            socket.write(pwdMessage)
            break;
        
        case 'PWD':
          if(connected == false) break;
            socket.write(`Current directory of the server : ${process.cwd()}`)
            break;
        
        case 'CWD': 
        if(connected == false) break;
        try {
            process.chdir(parameter);
            console.log(`New directory: ${process.cwd()}`);
          } catch (err) {
            console.error(`chdir: ${err}`);
          }
          break;

        case 'LIST' : 
        if(connected == false) break;
        socket.write("List :")
        fs.readdir(process.cwd(), (err, items) => {

          for (var i=0; i<items.length; i++) {
            socket.write(items[i] + '\n');
          }
        });
        break;
            
        /*case 'RETR':
          const writeStream = fs.createWriteStream(parameter)
          socket.write(writeStream.toString())
          break; 
        */ 

        case 'QUIT' :
          if(connected == false) break; 
        socket.end()

        case 'HELP' :
        let help = "USER <username>: check if the user exist PASS <password>: authenticate the user with a password \n"+
                    "LIST: list the current directory of the server\n"+
                    "CWD <directory>: change the current directory of the server\n"+
                    "RETR <filename>: transfer a copy of the file FILE from the server to the client\n" +
                    "STOR <filename>: transfer a copy of the file FILE from the client to the server\n"+
                    "PWD: display the name of the current directory of the server \n"+
                    "QUIT: close the connection and stop the program";
        socket.write(help)

    }
  })

  socket.write('Hello from server')

})

server.listen(port, () => {
  console.log('Server started at port ' + port)
  
})