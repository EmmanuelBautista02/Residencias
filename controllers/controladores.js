
const connection=require('../database/db');
const controller={};

controller.principal=(req,res)=>{
    if(req.session.loggedin){
        return res.render('principal/principal',{
            login:true,
            name: req.session.name,
            nombre:req.session.name,
            sesion:true
        });
    }else{
    return res.render('index',{msg:"", usu:""});
}
}

controller.logueado=(req,res)=>{
    if (req.session.loggedin){
        return res.render('principal/principal',{
            login:true,
            name: req.session.name,
            nombre:req.session.name,
            sesion:true
        });
    }else{
        res.redirect('/');
    }   
}

controller.autenticar=(req,res)=>{
    const usuario=req.body.email;
    const password=req.body.password;
    if(usuario && password){
        connection.query('SELECT * FROM usuario WHERE usuario = ?',[usuario], async (error,results)=>{
            if(results.length==0 || !(password == results[0].contraseña) ){
                
                res.render('index',{
                    msg: "Usuario y/o Contraseña incorrecta",
                    usu: usuario
                });
            }else{         
                req.session.loggedin=true;
                req.session.name = results[0].usuario;
                res.redirect('/logueado');
            }
        })
    }else{
        res.send('Ingrese un usuario y contraseña');
    }
}


controller.cerrarSesion=(req,res)=>{
    /*req.session = null;
    res.redirect('/');*/
    req.session.destroy(()=>{
        res.redirect('/');
    })
}

controller.contactanos=(req,res)=>{
    return res.render('contactanos');
}

controller.actualizarBD=(req,res)=>{
    if(req.session.loggedin){
        return res.render('actualizar/actualizar');
    }else{
        
        res.redirect('/');
    }  
}

controller.crearN=(req,res)=>{
    if(req.session.loggedin){
        return res.render('crearN/crearN');
    }else{
        
        res.redirect('/');
    }   
}

controller.notificaciones=(req,res)=>{
    if(req.session.loggedin){
        return res.render('notificaciones/notificaciones');
    }else{      
        res.redirect('/');
    }  
}



module.exports = controller;