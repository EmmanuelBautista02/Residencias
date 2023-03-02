
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
const cinco=[];
let consumidos=null;
let idServicio=null;
let servicioSeleccionado=false;

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
        datosProveedor = {};
        datosCircuito = {};
        datosServicios = {};
        circuitoSeleccionado=false;
        datosServicioModificar={ id_serv: 0, id_cir: 0, m6: '0', id_act: '0' };
    })
}

controller.contactanos = (req, res) => {
    return res.render('contactanos');
}

controller.actualizarBD = (req, res) => {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM proveedor where id_usuario = ?', [id_Usuario], (error, results1) => {
            datosProveedor = results1;
            //console.log(datos);
            if (error) {
                return res.json(error)
            } else {
                if (idProveedor != null) {
                    connection.query('SELECT * FROM circuito where id_prov = ? AND cir_Habilitado =1', [idProveedor], (error, results) => {
                        if (error) {
                            return res.json(error);
                        } else {
                            datosCircuito = results;
                            datosServicios={};
                            proveedorSeleccionado = true;
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
                                modificar:datosServicioModificar
                            });
                        }
                    });

                } else {
                    datosServicios={};
                    proveedorSeleccionado = false;
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
                        modificar:datosServicioModificar
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
            data: datosProveedor,
            mensaje: "FAVOR DE SELECCIONAR UN PROVEEDOR",
            cir: "",
            login: true,
            name: req.session.name,
            nombre: req.session.name,
            sesion: true,
            dataCircuito: datosCircuito,
            dataServicio: datosServicios,
            modificar:datosServicioModificar
        });
    } else if (proveedorSeleccionado == true) {
        if (req.body.circuito.length === 0) {
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
                modificar:datosServicioModificar
            });
        } else {
            circuitoSeleccionado = true;
            idCircuito = req.body.circuito;
            connection.query('SELECT * FROM circuito where id_prov = ? AND id_cir = ? AND cir_Habilitado =1', [idProveedor, parseInt(idCircuito, 10)], (error, results) => {
                if (error) {
                    res.json(error)
                } else {
                    if (results.length === 0) {
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
                            modificar:datosServicioModificar
                        });
                    } else {
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
                            modificar:datosServicioModificar
                        });
                    }
                }
            });
        }
    }
}

controller.listarServicios = (req, res) => {
    idCircuito = req.params.id;
    circuitoSeleccionado = true;
    connection.query('SELECT * FROM circuito where id_cir=?',[idCircuito],(error,results)=>{
        if(error){
            res.json(error);
        }else{
            if(results[0].cir_Habilitado == 1){  
                if ((proveedorSeleccionado == true) && (circuitoSeleccionado == true) && (idCircuito != "")) {
                    connection.query('SELECT * FROM servicio where id_cir = ?', [idCircuito], (error, results) => {
                        if (error) {
                            res.json(error);
                        } else {
                            datosServicios = results;
                            res.render('actualizar/actualizar', {
                                proveedor: nombreProveedor,
                                data: datosProveedor,
                                mensaje: "",
                                cir: idCircuito,
                                login: true,
                                name: req.session.name,
                                nombre: req.session.name,
                                sesion: true,
                                dataCircuito: datosCircuito,
                                dataServicio: datosServicios,
                                modificar:datosServicioModificar
                            });
                        }
                    });
                } else {
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
                        modificar:datosServicioModificar
                    });
                }
            }else{
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
                    modificar:datosServicioModificar
                });
            }
        }
    });
    
}

controller.listarServiciosNoExisten = (req, res) => {
    res.render('actualizar/actualizar', {
        proveedor: nombreProveedor,
        data: datosProveedor,
        mensaje: "FAVOR DE SELECCIONAR PROVEEDOR Y/O CIRCUITO",
        cir: idCircuito,
        login: true,
        name: req.session.name,
        nombre: req.session.name,
        sesion: true,
        dataCircuito:datosCircuito,
        dataServicio: datosServicios,
        modificar:datosServicioModificar
    });
}

controller.inhabilitarCircuito = (req, res) => {
    let idCircuitoParam = req.params.id;
    circuitoSeleccionado = true;
    if ((proveedorSeleccionado == true) && (circuitoSeleccionado == true) && (idCircuitoParam != "")) {
        connection.query('UPDATE circuito set cir_Habilitado = 0 where id_cir = ?', [idCircuitoParam], (error, results) => {
            if (error) {
                res.json(error);
            } else {
                connection.query('SELECT * FROM circuito where id_prov = ? AND id_cir = ? AND cir_Habilitado =1', [idProveedor, idCircuitoParam], (error, results) => {
                    if (error) {
                        res.json(error);
                    } else {
                        datosCircuito = results;
                        datosServicios={};
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
                        res.redirect('/actualizarBD');
                    }
                });

            }
        });
    }
}

controller.agregarCircuito=(req,res)=>{
    if(proveedorSeleccionado){
        let id = req.body.id;
        let nombre = req.body.nombre;
        connection.query('SELECT * FROM circuito where id_prov = ? AND id_cir = ?', [idProveedor, id], (error, results) => {
            if(error){
                res.json(error);
            }else{                
                    /*res.render('actualizar/actualizar', {
                        proveedor: nombreProveedor,
                        data: datosProveedor,
                        mensaje: "EL CIRCUITO YA HA SIDO AGREGADO ANTERIORMENTE",
                        cir: idCircuito,
                        login: true,
                        name: req.session.name,
                        nombre: req.session.name,
                        sesion: true,
                        dataCircuito: datosCircuito,
                        dataServicio: datosServicios
                    });*/
                    connection.query('INSERT INTO circuito (id_cir, nombre_cir, id_prov, cir_Habilitado) values (?,?,?,?) ',[id, nombre, idProveedor,1],(error,results)=>{
                        if(error){
                            res.render('actualizar/actualizar', {
                                proveedor: nombreProveedor,
                                data: datosProveedor,
                                mensaje: "EL CIRCUITO YA HA SIDO AGREGADO ANTERIORMENTE",
                                cir: idCircuito,
                                login: true,
                                name: req.session.name,
                                nombre: req.session.name,
                                sesion: true,
                                dataCircuito: datosCircuito,
                                dataServicio: datosServicios,
                                modificar:datosServicioModificar
                            });
                        }else{
                            res.redirect('/actualizarBD');
                
                        }
                    });
                
            }
        });
    }else{
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
            modificar:datosServicioModificar
        });
    }
}

function primerosCinco(){
    for (let i = 0; i < datosCircuito.length; i++) {
        if(i<5){
            cinco[i]=datosCircuito[i];
        }
    }
    consumidos=6;
}

controller.paginaAnteriorCircuitos=(req,res)=>{
    console.log("Anterior");
}

controller.paginaSiguienteCircuitos=(req,res)=>{
    
}

controller.agregarServicio=(req,res)=>{
    if((proveedorSeleccionado==true)&&(circuitoSeleccionado==true)){
        let servicio= req.body.servicio;
        let m6 = req.body.m6;
        let activo = req.body.activo;
        connection.query('INSERT INTO servicio (id_serv, id_cir, m6, id_act)VALUES(?,?,?,?)',[servicio,idCircuito,m6,activo],(error,resultados)=>{
            if(error){
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
                    modificar:datosServicioModificar
                });
            }else{
                connection.query('SELECT * FROM servicio where id_cir = ?',[idCircuito],(error,resultados)=>{
                    if(error){
                        return res.json(error);
                    }else{
                        datosServicios=resultados;
                    }
                });   
            res.redirect('/actualizarBD');
            }
        }); 
    }else{
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
            modificar:datosServicioModificar
        });
    }
}

controller.eliminarServicio=(req,res)=>{
    idServicio = req.params.id;
    servicioSeleccionado=true;
    connection.query('DELETE FROM servicio where id_serv=?',[idServicio],(error,resultados)=>{
        if(error){
            res.json(error);
        }else{
            res.redirect('/actualizarBD');
        }
    });
    servicioSeleccionado=false;
}


controller.modificarServicio=(req,res)=>{
    if(servicioSeleccionado){
        let m6Nuevo= req.body.m6;
        let idActivo=req.body.id_act;
        connection.query('UPDATE servicio SET m6=?, id_act=? where id_serv=?',[m6Nuevo,idActivo,idServicio],(error,resultado)=>{
            if(error){
                return res.json(error);
            }else{
                res.redirect('/actualizarBD');
                servicioSeleccionado=false;
                idServicio=null;
                datosServicioModificar={};
            }
        });
    }else{
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
            modificar:datosServicioModificar
        });
        
    }
}

controller.mostrarServicio=(req,res)=>{
    idServicio=req.params.id;
    servicioSeleccionado=true;
    connection.query('SELECT * FROM servicio where id_serv=?',[idServicio],(error,resultados)=>{
        if(error){
            return res.json(error);
        }else{
            datosServicioModificar=resultados[0];
            res.render('actualizar/actualizar', {
                proveedor: nombreProveedor,
                data: datosProveedor,
                mensaje:  `SERVICIO ${idServicio} SELECCIONADO FAVOR DE IR A LA PESTAÑA 'Modificar' EN 'Ejecutar acciones para servicios'` ,
                cir: idCircuito,
                login: true,
                name: req.session.name,
                nombre: req.session.name,
                sesion: true,
                dataCircuito: datosCircuito,
                dataServicio: datosServicios,
                modificar:datosServicioModificar
            });
        }
    });
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