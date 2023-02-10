<?php
session_start();
if(array_key_exists('close-session', $_POST)) {
    logout();
}
function logout(){
    session_destroy();
    header("Location: /");
}
require_once "conexion.php";
if(isset($_POST["btnLogin"])){
    $Username = $_POST["email"];
    $Password = $_POST["password"];
    require_once "conexion.php";
    $SqlLogin = "SELECT usuario, contraseña FROM usuario WHERE usuario = '$Username' and contraseña= '$Password'";
    $ResultSet = $cn->query($SqlLogin);
    if($ResultSet->num_rows>0){
        $row = $ResultSet->fetch_assoc();
        $_SESSION['usuario'] = $row['usuario'];
        $_SESSION['contraseña'] = $row['contraseña'];
        $_SESSION['Logueado'] = true;
        echo "Conexion exitosa";
        header("Location: /paginaLogueado.php");
    }else{
        echo  header("Location: /? fallo=true");
    }
}

?>