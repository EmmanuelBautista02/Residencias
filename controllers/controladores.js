//Declaración de variables
const { json } = require('express');
const connection = require('../database/db');
const controller = {};
let id_Usuario = null;
let idProveedor = null;
let nombreProveedor = null;
let idCircuito = null;
let proveedorSeleccionado = false;
let datosProveedor = {};
let datosCircuito = {};
let datosServicios = {};
let datosServicioModificar = {};
let circuitoSeleccionado = false;
const cinco = [];
let consumidos = null;
let idServicio = null;
let servicioSeleccionado = false;

//RUTA PRINCIPAL YA LOGUEADO
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

/*
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
}*/

//MÉTODO PARA AUTENTICAR INICIO DE SESIÓN
controller.autenticar = (req, res) => {
    const usuario = req.body.email;
    const password = req.body.password;
    if (usuario && password) {
        connection.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async (error, results) => {
            //SI NO CONCUERDA LO ESCRITO CON LA BASE DE DATOS
            if (results.length == 0 || !(password == results[0].contraseña)) {
                res.render('index', {
                    msg: "Usuario y/o Contraseña incorrecta",
                    usu: usuario
                });
            } else {
                //GUARDAR VARIALES DE INICIO DE SESIÓN
                req.session.id = results[0].id;
                id_Usuario = results[0].id;
                req.session.loggedin = true;
                req.session.name = results[0].nombre_usuario;
                res.redirect('/principal');
            }
        })
    } else {
        res.send('Ingrese un usuario y contraseña');
    }
}

//MÉTODO PARA CERRAR SESION
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
        datosProveedor = {};
        datosCircuito = {};
        datosServicios = {};
        circuitoSeleccionado = false;
        datosServicioModificar = {};
    })
}

//PÁGINA PARA CONTACTANOS
controller.contactanos = (req, res) => {
    return res.render('contactanos');
}


//PÁGINA PARA ACTUALIZAR BASE DE DATOS
controller.actualizarBD = (req, res) => {
    //SI HAY SESION INICIADA
    if (req.session.loggedin) {
        //SELECCIONA TODOS LOS PROVEEDORES DEL USUARIO QUE HA INICIADO SESIÓN
        connection.query('SELECT * FROM proveedor where id_usuario = ?', [id_Usuario], (error, results1) => {
            //GUARDAR DATOS DE LOS PROVEEDORES EN EL BACK
            datosProveedor = results1;
            //console.log(datos);
            //SI HAY ERROR MOSTRARLO EN UN JSON
            if (error) {
                return res.json(error)
            } else {
                //SI EXISTE UN ID DEL PROVEEDOR CONSULTA SUS CIRCUITOS, SIEMPRE Y CUANDO ESTEN
                //HABILITADOS
                if (idProveedor != null) {
                    connection.query('SELECT * FROM circuito where id_prov = ? AND cir_Habilitado =1 order by fecha desc', [idProveedor], (error, results) => {
                        if (error) {
                            return res.json(error);
                        } else {
                            //GUARDA RESULTADOS DE LOS CIRCUITOS. lIMPIA LOS DATOS DEL SERVICIO 
                            //PONE BANDERA DE PROVEEDOR SELECCIONADO EN TRUE
                            datosCircuito = results;
                            datosServicios = {};
                            proveedorSeleccionado = true;
                            //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                            return res.render('actualizar/actualizar', {
                                data: results1,
                                proveedor: nombreProveedor,
                                mensaje: "",
                                cir: "",
                                login: true,
                                name: req.session.name,
                                nombre: req.session.name,
                                sesion: true,
                                dataCircuito: datosCircuito,
                                dataServicio: datosServicios,
                                modificar: datosServicioModificar
                            });
                        }
                    });
                    //SI NO EXISTE PROVEEDOR. lIMPIAR DATOS DE LOS SERVICIOS. BANDERA DE PROVEEDOR SELECCIONADO
                    //EN FALSE
                } else {
                    datosServicios = {};
                    proveedorSeleccionado = false;
                    //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                    return res.render('actualizar/actualizar', {
                        data: results1,
                        proveedor: "Proveedor seleccionado",
                        mensaje: "",
                        cir: "",
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios,
                        modificar: datosServicioModificar
                    });
                }
            }
        })
        //SI NO HAY SESIÓN ACTIVA
    } else {
        res.redirect('/');
    }
}

//MÉTODO PARA BUSCAR PROVEEDOR
controller.buscarProveedor = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //GUARDA ID DEL PROVEEDOR 
        idProveedor = req.body.proveedor;
        //SELECCIONA EL NOMBRE DEL PROVEEDOR
        connection.query('SELECT nombre_prov FROM proveedor where id_prov = ?', [idProveedor], (error, results) => {
            //GUARDA EL NOMBRE DEL PROVEEDOR
            nombreProveedor = results[0].nombre_prov;
        });
        //REDIRECCIONA A PÁGINA ACTUALIZAR BD
        res.redirect('/actualizarBD');
        //SI NO HAY SESIÓN ACTIVA
    } else {
        res.redirect('/');
    }
}

//MÉTODO PARA BUSCAR EL CIRCUITO
controller.buscarCircuito = (req, res) => {
    //SI HAY SESIÓN ACTIVA
    if (req.session.loggedin) {
        //SI NO HAY PROVEEDOR SELECCIONADO
        if (proveedorSeleccionado == false) {
            //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
            res.render('actualizar/actualizar', {
                proveedor: "Proveedor seleccionado",
                data: datosProveedor,
                mensaje: "FAVOR DE SELECCIONAR UN PROVEEDOR",
                cir: "",
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar: datosServicioModificar
            });
            //SI HAY PROVEEDOR SELECCIONADO
        } else if (proveedorSeleccionado == true) {
            //SI NO HAY CIRCUITO SELECCIONADO
            if (req.body.circuito.length === 0) {
                //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                res.render('actualizar/actualizar', {
                    proveedor: nombreProveedor,
                    data: datosProveedor,
                    mensaje: "FAVOR DE ESCRIBIR UN CIRCUITO",
                    cir: "",
                    login: true,
                    name: req.session.name,
                    nombre: req.session.name,
                    sesion: true,
                    dataCircuito: datosCircuito,
                    dataServicio: datosServicios,
                    modificar: datosServicioModificar
                });
            } else {
                //SI SI HAY CIRCUITO SELECCIONADO: BANDERA DE CIRCUITO SELECCIONADO EN TRUE.
                //SE GUARDA ID DEL CIRCUITO
                circuitoSeleccionado = true;
                idCircuito = req.body.circuito;
                //SE REALIZA CONSULTA DE LOS CIRCUITOS ANCLADOS AL PROVEEDOR, AL USUARIO Y QUE ESTEN
                //HABILITADOS
                connection.query('SELECT * FROM circuito where id_prov = ? AND id_cir = ? AND cir_Habilitado =1', [idProveedor, parseInt(idCircuito, 10)], (error, results) => {
                    //SI HAY ERROR MANDA PÁGINA EN JSON
                    if (error) {
                        res.json(error)
                    } else {
                        //SI NO HAY ERROR
                        //SI NO EXISTE CIRCUITOS ANCLADOS A ESE PROVEEDOR, USUARIO Y HABILITADOS
                        if (results.length === 0) {
                            //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                            res.render('actualizar/actualizar', {
                                proveedor: nombreProveedor,
                                data: datosProveedor,
                                mensaje: "NO EXISTE NINGUN CIRCUITO CON ESA ID, PRESIONE 'Agregar Circuito' para agregarlo",
                                cir: idCircuito,
                                login: true,
                                name: req.session.name,
                                nombre: req.session.name,
                                sesion: true,
                                dataCircuito: datosCircuito,
                                dataServicio: datosServicios,
                                modificar: datosServicioModificar
                            });
                            //SI EXISTE CIRCUITOS ANCLADOS A ESE PROVEEDOR, USUARIO Y HABILITADOS
                        } else {
                            //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                            res.render('actualizar/actualizar', {
                                proveedor: nombreProveedor,
                                data: datosProveedor,
                                mensaje: "CIRCUITO SELECCIONADO",
                                cir: idCircuito,
                                login: true,
                                name: req.session.name,
                                nombre: req.session.name,
                                sesion: true,
                                dataCircuito: datosCircuito,
                                dataServicio: datosServicios,
                                modificar: datosServicioModificar
                            });
                        }
                    }
                });
            }
        }

    }//SI NO HAY SESIÓN ACTIVA
    else {
        res.redirect('/');
    }
}

//MÉTODO PARA LISTAR LOS SERVICIOS
controller.listarServicios = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //GUARDAR ID DEL CIRCUITO. BANDERA DE CIRCUITO SELECCIONADO EN TRUE
        idCircuito = req.params.id;
        circuitoSeleccionado = true;
        //BUSCAR LOS DATOS DEL CIRCUITO SELECCIONADO
        connection.query('SELECT * FROM circuito where id_cir=?', [idCircuito], (error, results) => {
            //SI HAY ERROR, MANDAR PÁGINA EN JSON
            if (error) {
                res.json(error);
            } else {
                //SI EL CIRCUITO SELECCIONADO ESTÁ HABILITADO
                if (results[0].cir_Habilitado == 1) {
                    //SI EL PROVEEDOR Y CIRCUITO ESTÁ SELECCIONADO, Y SI EL ID DEL CIRCUITO NO ESTÁ VACÍO 
                    if ((proveedorSeleccionado == true) && (circuitoSeleccionado == true) && (idCircuito != "")) {
                        //SELECCIONAR LOS SERVICIOS DEL CIRCUITO
                        connection.query('SELECT * FROM servicio where id_cir = ?', [idCircuito], (error, results) => {
                            //SI HAY ERROR, MANDAR PÁGINA EN JSON
                            if (error) {
                                res.json(error);
                            } else {
                                //GUARDAR LOS DATOS DE LOS SERVICIOS EN VARIABLE
                                datosServicios = results;
                                //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                                res.render('actualizar/actualizar', {
                                    proveedor: nombreProveedor,
                                    data: datosProveedor,
                                    mensaje: "CIRCUITO SELECCIONADO",
                                    cir: idCircuito,
                                    login: true,
                                    name: req.session.name,
                                    nombre: req.session.name,
                                    sesion: true,
                                    dataCircuito: datosCircuito,
                                    dataServicio: datosServicios,
                                    modificar: datosServicioModificar
                                });
                            }
                        });
                        ////SI EL PROVEEDOR Ó CIRCUITO ESTÁ SELECCIONADO, Ó SI EL ID DEL CIRCUITO ESTÁ VACÍO 
                    } else {
                        //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                        res.render('actualizar/actualizar', {
                            proveedor: nombreProveedor,
                            data: datosProveedor,
                            mensaje: "FAVOR DE SELECCIONAR PROVEEDOR Y/O CIRCUITO",
                            cir: idCircuito,
                            login: true,
                            name: req.session.name,
                            nombre: req.session.name,
                            sesion: true,
                            dataCircuito: datosCircuito,
                            dataServicio: datosServicios,
                            modificar: datosServicioModificar
                        });
                    }
                    //SI EL CIRCUITO SELECCIONADO NO ESTÁ HABILITADP
                } else {
                    //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                    res.render('actualizar/actualizar', {
                        proveedor: nombreProveedor,
                        data: datosProveedor,
                        mensaje: "EL CIRCUITO QUE SELECCIONÓ NO EXISTE",
                        cir: idCircuito,
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios,
                        modificar: datosServicioModificar
                    });
                }
            }
        });
        //SI NO EXISTE SESIÓN ACTIVA
    } else {
        res.redirect('/');
    }
}

//MÉTODO PARA AVISTAR QUE LOS SERVICIOS NO ESTAN DISPONIBLES SI NO SELECCIONA PRIMERO PROVEEDOR Y CIRCUITO
controller.listarServiciosNoExisten = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
        res.render('actualizar/actualizar', {
            proveedor: nombreProveedor,
            data: datosProveedor,
            mensaje: "FAVOR DE SELECCIONAR PROVEEDOR Y/O CIRCUITO",
            cir: idCircuito,
            login: true,
            name: req.session.name,
            nombre: req.session.name,
            sesion: true,
            dataCircuito: datosCircuito,
            dataServicio: datosServicios,
            modificar: datosServicioModificar
        });
        //SI NO EXISTE SESIÓN ACTIVA
    } else {
        res.redirect('/');
    }
}

//MÉTODO PARA INHABILITAR UN CIRCUITO
controller.inhabilitarCircuito = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //GUARDA EL ID DEL CIRCUITO LOCALMENTE Y BANDERA DE CIRCUITO SELECCIONADO EN TRUE  
        let idCircuitoParam = req.params.id;
        circuitoSeleccionado = true;
        //SI EL PROVEEDOR Y CIRCUITO ESTÁ SELECCIONADO, Y SI EL ID DEL CIRCUITO NO ESTÁ VACÍO 
        if ((proveedorSeleccionado == true) && (circuitoSeleccionado == true) && (idCircuitoParam != "")) {
            //ACTUALIZA EL ATRIBUTO DEL CIRCUITO PARA MOSTRAR DE HABILITADO A INHABILITADO
            connection.query('UPDATE circuito set cir_Habilitado = 0 where id_cir = ?', [idCircuitoParam], (error, results) => {
                //SI HAY ERROR, MANDAR PÁGINA EN JSON
                if (error) {
                    res.json(error);
                } else {
                    //SELECCIONA LOS CIRCUITOS QUE TENGA EL PROVEEDOR, EL CIRCUITO Y QUE ESTEN HABILITADOS
                    connection.query('SELECT * FROM circuito where id_prov = ? AND id_cir = ? AND cir_Habilitado =1', [idProveedor, idCircuitoParam], (error, results) => {
                        //SI HAY ERROR, MANDAR PÁGINA EN JSON
                        if (error) {
                            res.json(error);
                        } else {
                            //GUARDA VARIABLES DE CIRCUITO. BORRA DATOS DE LOS SERVICIOS Y REDIRECCIONA A PÁGINA DE ACTUALIZAR BD
                            datosCircuito = results;
                            datosServicios = {};
                            /*res.render('actualizar/actualizar', {
                                proveedor: nombreProveedor,
                                data: datosProveedor,
                                mensaje: "CIRCUITO INHABILITADO",
                                cir: idCircuito,
                                login: true,
                                name: req.session.name,
                                nombre: req.session.name,
                                sesion: true,
                                dataCircuito: datosCircuito,
                                dataServicio: datosServicios
                            });*/
                            connection.query('delete from servicio where id_cir = ?', [idCircuitoParam], (error, resultados) => {
                                if (error) {
                                    return res.json(error);
                                } else {
                                    res.redirect('/actualizarBD');
                                }
                            })

                        }
                    });

                }
            });
        }
        //UNA VEZ QUE SE INHABILITÓ EL CIRCUITO LA BANDERA DEL CIRCUITO SELECCIONADO SE PASA A FALSE
        circuitoSeleccionado = false;
    }
    //SI NO EXISTE SESIÓN ACTIVA
    else {
        res.redirect('/');
    }
}

//MÉTODO PARA AGREGAR CIRCUITO SI HAY PROVEEDOR SELECCIONADO
controller.agregarCircuito = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //SI HAY PROVEEDOR SELECCIONADO
        if (proveedorSeleccionado) {
            //OBTIENE EL ID Y NOMBRE DEL CIRCUITO A AGREGAR
            let id = req.body.id;
            let nombre = req.body.nombre;
            //GUARDAR CIRCUITO NUEVO
            connection.query('INSERT INTO circuito (id_cir, nombre_cir, id_prov, cir_Habilitado) values (?,?,?,?) ', [id, nombre, idProveedor, 1], (error, results) => {
                //SI HAY ERROR DE SINTAXIS O SI EL CIRCUITO YA EXISTE
                if (error) {
                    //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                    res.render('actualizar/actualizar', {
                        proveedor: nombreProveedor,
                        data: datosProveedor,
                        mensaje: "EL CIRCUITO YA EXISTE FAVOR DE INGRESAR OTRO",
                        cir: idCircuito,
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios,
                        modificar: datosServicioModificar
                    });
                    //SI EL CIRCUITO NO EXISTE, LO AGREGA A LA BD
                } else {
                    res.redirect('/actualizarBD');

                }
            });
            //SI NO HAY PROVEEDOR SELECCIONADO
        } else {
            //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
            res.render('actualizar/actualizar', {
                proveedor: nombreProveedor,
                data: datosProveedor,
                mensaje: "FAVOR DE SELECCIONAR PROVEEDOR",
                cir: idCircuito,
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar: datosServicioModificar
            });
        }
        //SI NO EXISTE SESIÓN ACTIVA 
    } else {
        res.redirect('/');
    }

}

//FUNCIÓN PARA RECOGER LOS CINCO PRIMEROS CIRCUITOS DE UN PROVEEDOR (EN DESARROLLO)
function primerosCinco() {
    for (let i = 0; i < datosCircuito.length; i++) {
        if (i < 5) {
            cinco[i] = datosCircuito[i];
        }
    }
    consumidos = 6;
}

//MÉTODO PARA PAGINACION, PÁGINA ANTERIOR (EN DESARROLLO)
controller.paginaAnteriorCircuitos = (req, res) => {
    console.log("Anterior");
}

//MÉTODO PARA PAGINACION, PÁGINA SIGUIENTE (EN DESARROLLO)
controller.paginaSiguienteCircuitos = (req, res) => {

}

//MÉTODO PARA AGREGAR SERVICIO
controller.agregarServicio = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //SI HAY PROVEEDOR Y CIRCUITO SELECCIONADO
        if ((proveedorSeleccionado == true) && (circuitoSeleccionado == true)) {
            //RECUPERAR DATOS DEL SERVICIO A AGREGAR
            let servicio = req.body.servicio;
            let m6 = req.body.m6;
            let activo = req.body.activo;
            let nombre = req.body.nombre;
            //QUERY PARA INSERTAR DATOS
            connection.query('INSERT INTO servicio (id_serv, nombre_serv ,id_cir, m6, id_act)VALUES(?,?,?,?,?)', [servicio, nombre, idCircuito, m6, activo], (error, resultados) => {
                if (error) {
                    //SI EL SERVICIO YA EXISTE
                    res.render('actualizar/actualizar', {
                        proveedor: nombreProveedor,
                        data: datosProveedor,
                        mensaje: "EL SERVICIO YA EXISTE",
                        cir: idCircuito,
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios,
                        modificar: datosServicioModificar
                    });
                } else {
                    //SI NO EXISTE SERVICIO, SELECCIONAR LOS SERVICIOS DEL CIRCUITO SELECCIONADO
                    connection.query('SELECT * FROM servicio where id_cir = ?', [idCircuito], (error, resultados) => {
                        if (error) {
                            //SI HAY ERROR, LANZAR PÁGINA EN JSON
                            return res.json(error);
                        } else {
                            //GUARDAR LOS SERVICIOS CON EL AGREGADO EN VARIABLE
                            datosServicios = resultados;
                        }
                    });
                    //LANZAR LA PÁGINA DE ACTUALIZAR BD
                    res.redirect('/actualizarBD');
                }
            });
            //SI NO HAY CIRCUITO Y/O PROVEEDOR SELECCIONADO
        } else {
            //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
            res.render('actualizar/actualizar', {
                proveedor: nombreProveedor,
                data: datosProveedor,
                mensaje: "FAVOR DE SELECCIONAR PROVEEDOR Y/O CIRCUITO",
                cir: idCircuito,
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar: datosServicioModificar
            });
        }
        //SI NO HAY SESION ACTIVA
    } else {
        res.redirect('/');
    }
}

//MÉTODO PARA ELIMINAR SERVICIO
controller.eliminarServicio = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //GUARDAR EL ID DEL SERVICIO A ELIMINAR Y PONER BANDERA DE SERVICIO SELECCIONADO EN TRUE
        idServicio = req.params.id;
        servicioSeleccionado = true;
        //QUERY PARA ELIMINAR EL SERVICIO SELECCIONADO
        connection.query('DELETE FROM servicio where id_serv=?', [idServicio], (error, resultados) => {
            //SI HAY ERROR MANDAR PÁGINA EN JSON
            if (error) {
                res.json(error);
            } else {
                //REDIRECCIONAR A LA PÁGINA ACTUALIZAR BD
                res.redirect('/actualizarBD');
            }
        });
        //PONER BANDERA DE SERVICIO SELECCIONADO EN FALSE
        servicioSeleccionado = false;
        //SI NO EXISTE SESION ACTIVA
    } else {
        res.redirect('/');
    }
}

//MÉTODO PARA MODIFICAR SERVICIO
controller.modificarServicio = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //SI HAY SERVICIO SELECCIONADO
        if (servicioSeleccionado) {
            //OBTIENES LOS NUEVOS DATOS A MODIFICAR
            let m6Nuevo = req.body.m6;
            let idActivo = req.body.id_act;
            //QUERY PARA MODIFICAR SERVICIO
            connection.query('UPDATE servicio SET m6=?, id_act=? where id_serv=?', [m6Nuevo, idActivo, idServicio], (error, resultado) => {
                //SI HAY ERROR, MANDAR PÁGINA EN JSON
                if (error) {
                    return res.json(error);
                }
                //si no hay error, redireccionar a Actualizar BD con el servicio actualizado
                else {
                    res.redirect('/actualizarBD');
                    servicioSeleccionado = false;
                    idServicio = null;
                    datosServicioModificar = {};
                }
            });
        } else {
            //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
            res.render('actualizar/actualizar', {
                proveedor: nombreProveedor,
                data: datosProveedor,
                mensaje: "FAVOR DE SELECCIONAR UN SERVICIO PARA MODIFICAR",
                cir: idCircuito,
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar: datosServicioModificar
            });
        }
        //SI NO HAY SESIÓN ACTIVA
    } else {
        res.redirect('/');
    }
}

//mostrar el servicio a actualizar en la pestaña "Modificar"
controller.mostrarServicio = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        //RECUPERAR ID DEL SERVICIO A MODIFICAR Y PONER BANDERA DE SERVICIO SELECCIONADO EN TRUE
        idServicio = req.params.id;
        servicioSeleccionado = true;
        //QUERY PARA OBTENER TODOS LOS DATOS DEL SERVICIO A MODIFICAR
        connection.query('SELECT * FROM servicio where id_serv=?', [idServicio], (error, resultados) => {
            //SI HAY ERROR MANDAR PÁGINA EN JSON
            if (error) {
                return res.json(error);
            }
            //SI NO HAY ERROR, GUARDAR LOS DATOS DEL SERVICIO EN UNA VARIABLE
            else {
                datosServicioModificar = resultados[0];
                //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                res.render('actualizar/actualizar', {
                    proveedor: nombreProveedor,
                    data: datosProveedor,
                    mensaje: `SERVICIO ${idServicio} SELECCIONADO FAVOR DE IR A LA PESTAÑA 'Modificar' EN 'Ejecutar acciones para servicios'`,
                    cir: idCircuito,
                    login: true,
                    name: req.session.name,
                    nombre: req.session.name,
                    sesion: true,
                    dataCircuito: datosCircuito,
                    dataServicio: datosServicios,
                    modificar: datosServicioModificar
                });
            }
        });
        //SI EXISTE SESION ACTIVA
    } else {
        res.redirect('/');
    }
}

//MÉTODO PARA ABRIR PÁGINA DE CREAR NOTIFICACIÓN
controller.crearN = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        return res.render('crearN/crearN');
    }
    //SI EXISTE SESION ACTIVA
    else {
        res.redirect('/');
    }
}

//MÉTODO PARA ABRIR PÁGINA DE LISTAR NOTIFICACIONES
controller.notificaciones = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        return res.render('notificaciones/notificaciones');
    }
    //SI NO EXISTE SESION ACTIVA
    else {
        res.redirect('/');
    }
}

controller.mostrarCircuitosTodos = (req, res) => {
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        connection.query('SELECT C.id_cir, C.nombre_cir, C.cir_habilitado, P.nombre_prov, U.nombre_usuario from circuito C INNER JOIN proveedor P ON C.id_prov = P.id_prov INNER JOIN usuario U ON P.id_usuario = U.id order by fecha desc', (error, results) => {
            if (error) {
                return res.json(error);
            } else {
                res.render('mostrarTodosCircuitos/mostrarTodosCircuitos', {
                    datosTodos: results,
                    login: true,
                    name: req.session.name,
                    nombre: req.session.name,
                    sesion: true
                });
            }
        });
    }
    //SI NO EXISTE SESION ACTIVA
    else {
        res.redirect('/');
    }
}

controller.ordenarFecha=(req,res)=>{
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        if(proveedorSeleccionado==true){
            connection.query('SELECT * FROM circuito where id_prov = ? AND cir_Habilitado =1 order by fecha desc', [idProveedor], (error, results) => {
                if (error) {
                    return res.json(error);
                } else {
                    //GUARDA RESULTADOS DE LOS CIRCUITOS. lIMPIA LOS DATOS DEL SERVICIO 
                    //PONE BANDERA DE PROVEEDOR SELECCIONADO EN TRUE
                    datosCircuito = results;
                    datosServicios = {};
                    proveedorSeleccionado = true;
                    //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                    return res.render('actualizar/actualizar', {
                        data: datosProveedor,
                        proveedor: nombreProveedor,
                        mensaje: "",
                        cir: "",
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios,
                        modificar: datosServicioModificar
                    });
                }
            });
        }else{
            return res.render('actualizar/actualizar', {
                data: datosProveedor,
                proveedor: nombreProveedor,
                mensaje: "SELECCIONA PROVEEDOR",
                cir: "",
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar: datosServicioModificar
            });        
        }
    }
    //SI NO EXISTE SESION ACTIVA
    else {
        res.redirect('/');
    }
}

controller.ordenarMenorMayor=(req,res)=>{
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        if(proveedorSeleccionado==true){
            connection.query('SELECT * FROM circuito where id_prov = ? AND cir_Habilitado =1', [idProveedor], (error, results) => {
                if (error) {
                    return res.json(error);
                } else {
                    //GUARDA RESULTADOS DE LOS CIRCUITOS. lIMPIA LOS DATOS DEL SERVICIO 
                    //PONE BANDERA DE PROVEEDOR SELECCIONADO EN TRUE
                    datosCircuito = results;
                    datosServicios = {};
                    proveedorSeleccionado = true;
                    //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                    return res.render('actualizar/actualizar', {
                        data: datosProveedor,
                        proveedor: nombreProveedor,
                        mensaje: "",
                        cir: "",
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios,
                        modificar: datosServicioModificar
                    });
                }
            });
        }else{
            return res.render('actualizar/actualizar', {
                data: datosProveedor,
                proveedor: nombreProveedor,
                mensaje: "SELECCIONA PROVEEDOR",
                cir: "",
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar: datosServicioModificar
            });        
        }
    }
    //SI NO EXISTE SESION ACTIVA
    else {
        res.redirect('/');
    }
}

controller.ordenarMayorMenor=(req,res)=>{
    //SI EXISTE SESION ACTIVA
    if (req.session.loggedin) {
        if(proveedorSeleccionado==true){
            connection.query('SELECT * FROM circuito where id_prov = ? AND cir_Habilitado =1 order by id_cir desc', [idProveedor], (error, results) => {
                if (error) {
                    return res.json(error);
                } else {
                    //GUARDA RESULTADOS DE LOS CIRCUITOS. lIMPIA LOS DATOS DEL SERVICIO 
                    //PONE BANDERA DE PROVEEDOR SELECCIONADO EN TRUE
                    datosCircuito = results;
                    datosServicios = {};
                    proveedorSeleccionado = true;
                    //RENDERIZA VENTANA DE ACTUALIZAR BD Y MANDA DATOS AL FRONT
                    return res.render('actualizar/actualizar', {
                        data: datosProveedor,
                        proveedor: nombreProveedor,
                        mensaje: "",
                        cir: "",
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios,
                        modificar: datosServicioModificar
                    });
                }
            });
        }else{
            return res.render('actualizar/actualizar', {
                data: datosProveedor,
                proveedor: nombreProveedor,
                mensaje: "SELECCIONA PROVEEDOR",
                cir: "",
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar: datosServicioModificar
            });        
        }
    }
    //SI NO EXISTE SESION ACTIVA
    else {
        res.redirect('/');
    }
}
//MÉTODO PARA EXPORTAR LOS MÉTODOS
module.exports = controller;