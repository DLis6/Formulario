const express = require('express');
const app = express();
app.use(express.urlencoded());
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/formulario', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

var schema = mongoose.Schema({
    name: { type: String, default: "Anónimo" },
    email: { type: String, default: "Anónimo" },
    password: { type: String, default: "Anónimo" },
})

var Formulario = mongoose.model("Formulario", schema);

var crearHTML = function(info) {
    var chtml = '<table class="table"><thead><tr><th>Nombre</th><th>Correo</th></tr></thead><tbody>';
    info.forEach(elem => {
        chtml += '<tr>'
        chtml += '<td>' + elem.name + '</td>'
        chtml += '<td>' + elem.email + '</td></tr>'
    });
    chtml += '</tbody></table>';
    return chtml;
}

app.get('/', async(req, res) => { //Muestra lista de usuarios

    var info = await Formulario.find({}).exec();
    var html = crearHTML(info)

    res.send('<a href="/register">Registrar</a><br>' + html);
});

app.get('/register', (req, res) => { // Muestra el formulario para registarse
    res.send('<form action="/register" method="post"><label for="name"><h2> Nombre</h2><input type="text" id="name" name="name"><h2>Email</h2><input type="text" id="email" name="email"><h2> Contraseña</h2><input type="password" id="password" name="password"><button type="submit">Registrarse</button></form>');
});

app.post('/register', async(req, res) => { //Crear un usuario en mongoDB

    await Formulario.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function(err) {
        if (err) return console.error(err);
    });
    res.redirect('/');
})


app.listen(3000, () => console.log('Listening on port 3000!'));