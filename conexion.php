<?php
try{
    $hostname="localhost";
	$username="root";
	$password="root";
    $database="sistema";
    $cn = new mysqli($hostname,$username,$password,$database);
    echo "CONEXION CORRECTA";
}catch(Exception $e){
    echo 'Excepción capturada: ',  $e->getMessage(), "\n";
    die("\n Contacta al Departamento de TI");
}
?>
