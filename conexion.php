<?php
try{
    $hostname="localhost";
    $username='root';
    $password='root';
    $database='sistema';
    $cn = new mysqli($hostname,$username,$password,$database);
    //mysqli_connect($hostname,$username, $password);
    //echo "CONEXION CORRECTA";
}catch(Exception $e){
    echo 'Excepción capturada: ',  $e->getMessage(), "\n";
    die("\n Contacta al Departamento de TI");
}
?>