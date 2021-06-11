const express = require('express');
const bodyParser = require('body-parser');
const path=require('path')


//config init
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// Motor de plantilla
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");



const  Transbank = require('transbank-sdk').WebpayPlus;








app.get("/",function(request, response){
    response.sendFile(path.join(__dirname+'/views/index.html'))
});

app.post('/paySuccess', async function(request,response){
    const token = request.body.token_ws
    const res = await Transbank.Transaction.commit(token);

    response.render('exito', {token, status:res.status})
});

app.post('/pay', async function(request,response){
    const sessionId = 'S-43261';
// Identificador único de orden de compra:
    const buyOrder = 'O-16521';
    const amount=1833;
    const returnUrl = 'http://localhost:3000/paySuccess';
    
    const createResponse = await Transbank.Transaction.create(
        buyOrder, 
        sessionId, 
        amount, 
        returnUrl
    );
    let token = createResponse.token;
    let url = createResponse.url;
    console.log(token)
    console.log(url)
    response.render('pagar',{url:url, token:token})
});




app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
 console.log("Server Its Works!");
});