require('dotenv').config()

const express = require('express');
const helmet = require('helmet');

const { DBTest } = require("./database.js");
const tareaModel = require("./tareaModel.js");

const app = express();
const puerto = process.env.puerto

//Configurar EJS como motor de plantilla
app.set('view engine', 'ejs');

//Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async function (req, res) {
    const tareas = await tareaModel.findAll();

    res.render("inicio", { tareas: tareas });
})

app.get('/agregar', function (req, res) {
    res.render("agregar")
})

app.post('/agregar', async function (req, res) {
    console.log(req.body)
    //const tarea = req.body.tarea
    //const descripcion = req.body.descripcion
    const { tarea, descripcion } = req.body

    try{
        const nuevaTarea = await tareaModel.create({ 
            nombre: tarea,
            descripcion: descripcion,
            imagen: 'https://image.shutterstock.com/image-photo/image-260nw-643080895.jpg'   
        })

        if (nuevaTarea){
            //res.send("Tarea agregada: " + nuevaTarea.id)
            res.redirect('/');
        }else{
            res.send("No se pudo agregar la tarea ")
        }
    } catch (err){
        res.send("Se produjo un error al cargar la tarea " + err)
    }
})

app.get('/eliminar/:id', async function (req, res) {
    const { id } = req.params;

    try{
        const borrarTarea = await tareaModel.destroy({
            where: {
                id: id 
            }
        });

        if (borrarTarea){
            //res.send("Tarea agregada: " + nuevaTarea.id)
            res.redirect('/');
        }else{
            res.send("No se pudo borrar la tarea ")
        }
    } catch (err){
        res.send('Se produjo un error al borar la tarea '+ err)
    }

    res.render("agregar")
})

app.get('/editar/:id', async function (req, res) {
    const { id } = req.params;

    try{
        const tarea = await tareaModel.findOne({
            where:{
                id : id
            }
        })

        if (tarea){
            res.render("editar", { tarea: tarea })
        } else{
            res.send("No se pudo encontrar la tarea ")
        }

        res.render("editar", { tarea: tarea })
    } catch (err){
        res.send('Se produjo un error al buscar la tarea '+ err)
    }
})

app.post('/editar/:id', async function (req, res) {
    const { id } = req.params;
    const { tarea, descripcion } = req.body

    try{
        const tareaActualizada = await tareaModel.update(
            {
                nombre: tarea,
                descripcion: descripcion
            }, {
                    where:{
                        id : id
                    }
                }
        )

        if (tareaActualizada){
            res.redirect('/')
        } else{
            res.send("No se pudo actualizar la tarea ")
        }

        res.render("editar", { tarea: tarea })
    } catch (err){
        res.send('Se produjo un error al buscar la tarea '+ err)
    }
})

DBTest()

app.listen(puerto, () => {
    console.log('El servidor esta corriendo en el puerto ' + puerto);
})