// App.js

var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	nQuery = require('nodeQuery'),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose =
		require("passport-local-mongoose")
const User = require("./model/User");
var app = express();

// mongoose.connect("mongodb+srv://jesusvrdz:Dwight00@cluster0.ya6rgyl.mongodb.net/?retryWrites=true&w=majority");
//
mongoose.connect(
	"mongodb+srv://jesusvrdz:Dwight00@cluster0.ya6rgyl.mongodb.net/?retryWrites=true&w=majority",
	{ useNewUrlParser: true, useUnifiedTopology: true}
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "PIA",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// RUTAS
//=====================

// INICIO LOCAL HOST
app.get("/", function (req, res) {
	res.render("login");
});

// PAGINA HOME
app.get("/home", function (req, res) {
	res.render("home");
});

// PAGINA REGISTRER
app.get("/register", function (req, res) {
    console.log(req.body);
	res.render("register");
});

// POST REGISTER
app.post("/register", async (req, res) => {
	try {
        console.log(req.body);
        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        });
        // console.log(user);
		console.log("USUARIO REGISTRADO");
		res.render("login");
		return "USUARIO REGISTRADO";
	} catch (error) {
        console.log(error);
		return error;
	}
});

// PAGINA LOGIN
app.get("/login", function (req, res) {
	res.render("login");
});

// POST LOGIN
app.post("/login", async function(req, res){
	try {
        console.log(req.body);
		// REVISA SI EL USUARIO EXISTE
		const user = await User.findOne({ username: req.body.username });
        console.log(user);
		if (user) {
            // REVISA SI LA CONTRASEÑA COINCIDE
            const result = req.body.password === user.password;
            if (result) {
                // console.log(result);
				console.log("BIENVENIDO");
                res.render("home");
            } else {
                console.log("La contraseña no coincide");
				return "La contraseña no coincide";
            }
		} else {
            console.log("El usuario no existe");
			return "El usuario no existe";
		}
	} catch (error) {
        console.log(error);
		return error;
	}
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("SERVIDOR INICIADO CORRECTAMENTE");
});