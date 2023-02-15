
<?php
    include_once '../includes/header2.php';
?>
<?php
session_start();

require '../conexion.php';
if(array_key_exists('close-session', $_POST)) {
    logout();
}
function logout(){
    session_destroy();
    header("Location: ../PRUEBAS");
}
?>
   <!-- <div class="container">
    <h1>USTED ESTÁ LOGUEADO COMO <?=$_SESSION['usuario']?></H1>
    <form id="buttons-cont" method="post">
            <input type="submit" class="login-btns" value="Cerrar sesion" ">
        </form>
    </div> --> 

<div class="contenido"> 
    <link rel="stylesheet" href="../css/principal.css" type="text/css">
    <div class="titulo">
        <h2>Control de notificaciones de ventanas de mantenimiento</h2>
    </div>
    <div class="container"> <!-- Cards-->
        <div class="row gy-3 row-cols-1 row-cols-md-3">
                <!--tarjeta 1-->
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="../img/lapto.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h3>Actualizar Base de Datos</h3>
                        <p class="card-text">Esta opción permite al usuario actualizar los servicios de 
                            los clientes que maneja.</p>
                    </div>
                    <div class="card-footer">
                        <div class="boton">
                            <a href="../actualizar/actualizar.php" class="btn btn-gris w-50">Actualizar</a>
                        </div>
                    </div>
                </div>
            </div>
                <!--tarjeta 2-->
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="../img/poste.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h3>Crear Notificación de Ventana</h3>
                        <p class="card-text">Esta opción permite al usuario crear una notificacion de 
                            ventana cuando se realizará algun mantenimiento preventivo, correctivo o mandatoria.</p>
                    </div>
                    <div class="card-footer">
                        <div class="boton">
                            <a href="../crearN/crearN.php" class="btn btn-gris w-50">Crear notificación</a>
                        </div>
                    </div>
                </div>
            </div>
                <!--tarjeta 3-->
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="../img/redes.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h3>Notificaciones</h3>
                        <p class="card-text">En esta opción el usuario podrá visualizar las notificaciones que 
                            tanto él como otros usuarios han agendado así como sus detalles de acuerdo al día en 
                            que fue creado.</p>
                    </div>
                    <div class="card-footer">
                        <div class="boton">
                            <a href="../notificaciones/notificaciones.php" class="btn btn-gris w-50">Notificaciones</a>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!--row-->
    </div> <!--container-->
<?php
    include_once '../includes/footer.php';
?>  
</div>




