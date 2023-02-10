<?php
session_start();

require 'conexion.php';
if(array_key_exists('close-session', $_POST)) {
    logout();
}
function logout(){
    session_destroy();
    header("Location: /Residencias");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Control de Notificaciones de Ventanas para Mantenimiento</title>
</head>
<body>
    <h1>USTED ESTÁ LOGUEADO COMO <?=$_SESSION['usuario']?></H1>
    <form id="buttons-cont" method="post">
            <input type="submit" class="login-btns" value="Cerrar sesion" name="close-session">
        </form>
</body>
</html>