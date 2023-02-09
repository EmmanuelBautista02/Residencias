<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Control de notificaciones">
        <meta name="keywords" content="Notificaciones, Bestel, Mantenimiento">
        <meta name="author" content="Emmanuel Bautista Palacios, Nisi Jared Vallejo Luria">
        <title>Control de Notificaciones de Ventanas para Mantenimiento</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
        rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
        crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css?family=Anton|Montserrat&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="css/index.css" type="text/css">
    </head>
<body>
  <!-- Barra de menu superior HEADER-->
  <?php
    include_once 'includes/header.php';
  ?>

  <div class="centro d-flex align-items-center">
    <div class="morado">
      <p>Favor de iniciar sesión para agregar alguna ventana de mantenimiento</p>
    </div>
      <img src="img/ventana.png" class="ventana">
  </div>

  <div class="sobrepuestos">
    <img src="img/principal2.jpg" class="principal2">
    <div class="verde">
      <p>Sitio web dedicado para los trabajadores del área de Control, en función de gestionar
        las notificaciones en las ventanas de mantenimiento que realizan los trabajadores del 
        área de operaciones. </p>
    </div>
  </div>

  <!--<h1>PRUEBA DE CONEXION A BD LOCAL, a verrrrr</h1>
    <form action="conexion.php" method="post">
        <button type="submit">ENVIAR DATOS</button>
  </form> -->

  <!-- Barra de inferior FOOTER-->
  <?php
    include_once 'includes/footer.php';
  ?>
</body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
  
</html>    