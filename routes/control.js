const express = require('express');
const controller = require('../controllers/controladores');
const router = express.Router();

router.get("/",controller.principal);
router.get('/logueado',controller.logueado);
router.post('/auth',controller.autenticar);
router.get('/csesion', controller.cerrarSesion);
router.get('/contactanos',controller.contactanos);
router.get('/actualizarBD', controller.actualizarBD);
router.get('/crearN', controller.crearN);
router.get('/notificaciones', controller.notificaciones);
router.post('/buscarProveedor',controller.buscarProveedor);
router.post('/buscarCircuito', controller.buscarCircuito);
router.get('/listarServicios/:id', controller.listarServicios);
router.get('/listarServicios/', controller.listarServiciosNoExisten);
router.get('/inhabilitarCircuito/:id', controller.inhabilitarCircuito);
router.post('/agregarCircuito', controller.agregarCircuito);

module.exports = router;