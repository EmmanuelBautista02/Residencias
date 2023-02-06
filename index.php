<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROYECTITO</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
<?php
    include_once 'includes/header.php';
?>
    <h1>PRUEBA DE CONEXION A BD LOCAL</h1>
    <form action="conexion.php" method="post">
        <button type="submit">ENVIAR DATOS</button>
    </form>
    <?php
    include_once 'includes/footer.php';
?>
</body>
</html>