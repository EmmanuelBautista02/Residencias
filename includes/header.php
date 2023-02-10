<header class="header">
  <div class="nav">
    <div class="container">
      <nav class="navbar navbar-expand-sm navbar-light">
        <a class="navbar-brand" href="#">
          <img src="img/Bestel.svg" class="logo" alt="logo de bestel">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navg navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="#">Contactanos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/Residencias">Inicio</a>
            </li>
            <li class="nav-item">
              <!--<a class="nav-link active" href="#Login">Ingresar</a> -->
              <button type="button" class="boton_ingresar" data-bs-toggle="modal" data-bs-target="#Login">Ingresar</button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>

  <div class="text-header d-flex align-items-center">
    <div class="container">
      <div class="row rectanguloNegro">
        <h1>Control de notificaciones de ventana preventiva</h1>
        <!--<a href="#" class="btn btn-yo nav-link">Iniciar sesion</a> -->
        <button type="button" class="btn btn-yo" data-bs-toggle="modal" data-bs-target="#Login">Iniciar sesion</button>
      </div>
    </div>
  </div>
</header>
<!-- login -hacer un archivo nuevo donde solo contenga el login-->
<div class="modal fade" id="Login" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <!-- header del login-->
        <div class="container">
          <h5 class="modal-title" id="exampleModalLabel">Inicie sesion</h5>
          <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      </div>
      <!--body del login-->
      <div class="modal-body ">
      <form action="sesion.php" method="post">
          <div class="mb-3">
            <label for="email" class="col-form-label">Usuario:</label>
            <input type="email" class="form-control" id="email" name="email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="col-form-label">Password:</label>
            <input type="password" class="form-control" id="password" name="password" required>
          </div>
          <input type="submit" value="Acceder" name="btnLogin" id="btnLogin">
          <?php
                    if (isset($_GET["fallo"]) && $_GET["fallo"] == 'true') {
                        echo "<div style='color:red'>Usuario o contraseña invalido </div>";
                    }
                    ?>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>