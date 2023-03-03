const mysql= require('mysql2');

const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sistema',
    port: 3306
});

connection.connect((error)=>{
    if(error){
        console.log('El error de conexion es:'+error)
        return;
    }
    console.log('Conectado a la BD');
});

module.exports =connection;