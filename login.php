<?php
try{
    $hostname="localhost";
	$username="root";
	$password="root";
    $database="sistema";
    
    /*
    $hostname="localhost";
    $username='root';
    $password='';
    $database='proyecto';
    */
    $cn = new mysqli($hostname,$username,$password,$database);
    //mysqli_connect($hostname,$username, $password);
    echo "CONEXION CORRECTA";
}catch(Exception $e){
    echo 'Excepción capturada: ',  $e->getMessage(), "\n";
    die("\n Contacta al Departamento de TI");
}
//Prox semana son avances para que vea, de ahí la siguiente semana sería las revisiones
//revisiones en teams.
//algo simple con que se utilice validacion, seguridad, login, registro y movimientos a la BD, más todo lo de HTML Y CSS.
?>
