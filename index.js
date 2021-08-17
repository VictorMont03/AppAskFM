// Express, MySQL, Ejs
//EJS - js+html
const express = require('express');

const app = express();
const connection = require('./database/database');
const perguntaModel = require('./database/Pergunta');
const respostaModel = require('./database/Resposta');

//Database

connection.authenticate().then(() => {
    console.log('Autentication done');
}).catch((err) => {
    console.log(err);
})

app.set('view engine', 'ejs'); //chamada paro o express - motor js utilizado = ejs
app.use(express.static('public')); //linha para usar arquivos estaticos ex: arquivos do frontend css

//Rotas

app.get('/', (req, res) => {
    //SELECT * FROM    pegar somente dados
    perguntaModel.findAll({raw: true, order: [['id', 'DESC']]}).then(perguntas => {
        //console.log(perguntas);
        res.render('index', {perguntas: perguntas});
    });
    
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar.ejs');
})

//Rota de captação de informações do formulario de pergunta

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.post('/sendask', (req, res) => {
    var pergunta = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
    }
    perguntaModel.create({  //INSERT INTO...
        titulo: pergunta.titulo,
        descricao: pergunta.descricao
    }).then(() => {
        console.log('Ask saved');
        res.redirect('/');
    }); 
})

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    perguntaModel.findOne({raw: true, where: { id: id }}).then((pergunta) => {
        if(pergunta != undefined) {
            respostaModel.findAll({raw:true, where: { perguntaId: id }, order: [['id', 'DESC']]}).then((resposta) => {
                res.render('pergunta', {pergunta: pergunta, resposta: resposta});
            })      
        }else{
            res.redirect('/');
        }
    })
})

app.post('/responder', (req, res) => {
    var resposta = {
        corpo: req.body.corpo,
        perguntaId: req.body.perguntaId
    }
    respostaModel.create({
        corpo: resposta.corpo,
        perguntaId: resposta.perguntaId
    }).then(() => {
        //console.log(res);
        res.redirect('/pergunta/'+resposta.perguntaId);
    })
})

app.listen(8080, () => {
    console.log('Rodando app...');
});