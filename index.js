// Handlebars tipo Django do python
const { Console } = require('console');
const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

// Configuração do handlebars
// Configuração para que o express rode com ele
app.engine('hbs', hbs.engine({
  // Em vez de usar .handlebrars usa só hbs
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Middlewares
// Arquivos estáticos
app.use(express.static('public'));
// middleware para trabalhar com bodyParser
app.use(bodyParser.urlencoded({extended:false}));

// Configuração das sessions
app.use(session({
  secret: 'CriarUmaChave123',
  resave: false,
  saveUninitialized: true
}))

// Rota
app.get('/',(req, res) => {
  if(req.session.errors){
    var arrayErros = req.session.errors;
    req.session.errors = "";
    return res.render('index',{NavActiveCad:true, error: arrayErros});
  }

  if(req.session.success){
    req.session.success = false;
    return res.render('index',{NavActiveCad:true, MsgSuccess: true});
  }
  // index do handlebars
  res.render('index',{NavActiveCad:true});
})

app.get('/users',(req, res) => {
  // index do handlebars
  res.render('users',{NavActiveUsers:true});
})

app.get('/editar',(req, res) => {
  // index do handlebars
  res.render('editar');
})

app.post('/cad', (req, res) => {
    var nome = req.body.nome;
    var email = req.body.email;

    // array que vai conter os erros
    // const posso alterar o conteúdo
    // mas não posso declarar erros novamente
    const erros = [];

    // Tratamento dos inputs
    // Remover espaços antes e depois
    nome = nome.trim();
    email = email.trim();

    //limpar o nome de caracteres especiais (apenas letras)
    // substituir qualquer coisa que não for letra ou letra com acentuaçaõ por nada
    nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');

    // Verficar se está vazio ou não definido
    if(nome == '' || typeof nome == undefined || nome == null){
      erros.push({mensagem: "Campo nome não pode ser vazio!"});
    }

    //VERIFICAR SE O CAMPO NOME É VÁLIDO (APENAS LETRAS)
    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
      erros.push({mensagem:"Nome inválido!"});
    }

    // Validação do e-mail
    if(email == '' || typeof email == undefined || email == null){
      erros.push({mensagem: "Campo email não pode ser vazio!"});
    }

    //VERIFICAR SE EMAIL É VALIDO
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      erros.push({mensagem:"Campo email inválido!"});
    }

    // Se houve algum erro
    if(erros.length > 0){
      console.log(erros);
      req.session.errors = erros;
      req.session.success = false;
      return res.redirect('/');
    }

    // Sucesso nenhum erro
    // Salvar no banco de dados
    console.log('Validação realizda com sucesso');
    req.session.success = true;
    return res.redirect('/');

})

// Lançar servidor
app.listen(PORT, () => {
  console.log("Servidor rodando em http:localhost:" + PORT);
})