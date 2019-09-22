console.log('Hello Node Server');

const http = require('http');
const fs = require('fs');
const WooCommerceAPI = require('woocommerce-api');


// Api inställningar
let WooCommerce = new WooCommerceAPI({
  url: 'http://www.borasbasket.se',
  consumerKey: 'ck_2eb96f8a2ed6901e72509b4f19da24cd9a8f5bf4',
  consumerSecret: 'cs_aa8595cc3ca7533624dfa29def652c1931cb282d',
  version: 'v3'
});



// Hämtar produkter och sparar de in csv fil 
 WooCommerce.getAsync('products').then(function(result) {

    let produkter =  JSON.parse(result.toJSON().body)
    //Skapar fil och sprar all data som hämtas av api
    fs.writeFileSync('./borasbasket.csv',JSON.stringify(produkter,null,2))
   
  
});


// Kör en server 
http.createServer(function (req, res){
     //Hämtar produkter från api
    WooCommerce.getAsync('products').then(function(result) {
        
        let produkter =  JSON.parse(result.toJSON().body)
        let x = produkter['products'];
        //loopar igenom för att hämta produktnamn
        for(let i=0, len=x.length; i<len; i++){
            console.log("Namn på produkter: "+ x[i].title)   
        }   
    });
    

    //Läser in data från filen
    fs.readFile('./borasbasket.csv', function(err, data){

        res.writeHead(200, {'content-Type': 'application/json'});
        
        let x =  JSON.parse(data);
        
        let xy = x['products'];
         //console.log(xy)
         //Loopar igenom filen för att hämta ut namn på produkter
        for(let i=0, len=xy.length; i<len; i++){
            console.log("Namn på produkter: "+ xy[i].title) 
            let z = "Namn på produkter: "+ xy[i].title  
            //Skriver ut namn på produkter i webbläsaren
            res.write(JSON.stringify(z,null,2)); 
        }
        
        return res.end();
    })

    
   
    
}).listen(880);