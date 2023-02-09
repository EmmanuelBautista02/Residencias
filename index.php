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

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script></body>
  
</html>    