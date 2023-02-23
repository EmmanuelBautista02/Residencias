
const connection = require('../database/db');
const controller = {};
let id_Usuario = null;
let idProveedor = null;
let nombreProveedor = null;
let idCircuito = null;
let proveedorSeleccionado = false;
let datos = {};
let circuitoSeleccionado = false;

controller.principal = (req, res) => {
    if (req.session.loggedin) {
        return res.render('principal/principal', {
            login: true,
            name: req.session.name,
            nombre: req.session.name,
            sesion: true
        });
    } else {
        return res.render('index', { msg: "", usu: "" });
    }
}

controller.logueado = (req, res) => {
    if (req.session.loggedin) {
        return res.render('principal/principal', {
            login: true,
            name: req.session.name,
            nombre: req.session.name,
            sesion: true
        });
    } else {
        res.redirect('/');
    }
}

controller.autenticar = (req, res) => {
    const usuario = req.body.email;
    const password = req.body.password;
    if (usuario && password) {
        connection.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async (error, results) => {
            if (results.length == 0 || !(password == results[0].contraseña)) {
                res.render('index', {
                    msg: "Usuario y/o Contraseña incorrecta",
                    usu: usuario
                });
            } else {
                req.session.id = results[0].id;
                id_Usuario = results[0].id;
                req.session.loggedin = true;
                req.session.name = results[0].usuario;
                res.redirect('/logueado');
            }
        })
    } else {
        res.send('Ingrese un usuario y contraseña');
    }
}


controller.cerrarSesion = (req, res) => {
    /*req.session = null;
    res.redirect('/');*/
    req.session.destroy(() => {
        res.redirect('/');
        id_Usuario = null;
        idProveedor = null;
        nombreProveedor = null;
        idCircuito = null;
        proveedorSeleccionado = false;
        datos = {};

    })
}

controller.contactanos = (req, res) => {
    return res.render('contactanos');
}

controller.actualizarBD = (req, res, msg) => {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM proveedor where id_usuario = ?', [id_Usuario], (error, results) => {
            datos = results;
            //console.log(datos);
            if (error) {
                res.json(error)
            } else {
                if (idProveedor != null) {
                    proveedorSeleccionado = true;
                    return res.render('actualizar/actualizar', {
                        data: results,
                        proveedor: nombreProveedor,
                        mensaje: "",
                        cir: "",
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true
                    });
                } else {
                    proveedorSeleccionado = false;
                    return res.render('actualizar/actualizar', {
                        data: results,
                        proveedor: "Proveedor seleccionado",
                        mensaje: "",
                        cir: "",
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true
                    });
                }
            }
        })
    } else {

        res.redirect('/');
    }
}

controller.buscarProveedor = (req, res) => {
    idProveedor = req.body.proveedor;
    connection.query('SELECT nombre_prov FROM proveedor where id_prov = ?', [idProveedor], (error, results) => {
        nombreProveedor = results[0].nombre_prov;
    });
    res.redirect('/actualizarBD');
}

controller.buscarCircuito = (req, res) => {
    if (proveedorSeleccionado == false) {
        res.render('actualizar/actualizar', {
            proveedor: "Proveedor seleccionado",
            data: datos,
            mensaje: "FAVOR DE SELECCIONAR UN PROVEEDOR",
            cir: "",
            login: true,
            name: req.session.name,
            nombre: req.session.name,
            sesion: true

        });
    } else if (proveedorSeleccionado == true) {
        if (req.body.circuito.length === 0) {
            res.render('actualizar/actualizar', {
                proveedor: nombreProveedor,
                data: datos,
                mensaje: "FAVOR DE ESCRIBIR UN CIRCUITO",
                cir: "",
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true
            });
        } else {
            circuitoSeleccionado = true;
            idCircuito = req.body.circuito;
            connection.query('SELECT * FROM circuito where id_prov = ? AND id_cir = ?', [idProveedor, parseInt(idCircuito, 10)], (error, results) => {
                if (error) {
                    res.json(error)
                } else {
                    if (results.length === 0) {
                        res.render('actualizar/actualizar', {
                            proveedor: nombreProveedor,
                            data: datos,
                            mensaje: "NO EXISTE NINGUN CIRCUITO CON ESA ID, PRESIONE 'Agregar Circuito' para agregarlo",
                            cir: idCircuito,
                            login: true,
                            name: req.session.name,
                            nombre: req.session.name,
                            sesion: true
                        });
                    } else {
                        res.render('actualizar/actualizar', {
                            proveedor: nombreProveedor,
                            data: datos,
                            mensaje: "EL CIRCUITO SELECCIONADO SI EXISTE",
                            cir: idCircuito,
                            login: true,
                            name: req.session.name,
                            nombre: req.session.name,
                            sesion: true
                        });
                    }
                }
            });
        }
    }
}

controller.crearN = (req, res) => {
    if (req.session.loggedin) {
        return res.render('crearN/crearN');
    } else {

        res.redirect('/');
    }
}

controller.notificaciones = (req, res) => {
    if (req.session.loggedin) {
        return res.render('notificaciones/notificaciones');
    } else {
        res.redirect('/');
    }
}



module.exports = controller;