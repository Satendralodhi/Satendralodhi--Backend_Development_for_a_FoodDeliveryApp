const client = require('./connection.js')
const express = require('express');
const app = express();

app.listen(3301, ()=>{
    console.log("Sever is now listening at port 3301");
})

client.connect();

const bodyParser = require("body-parser");
app.use(bodyParser.json());








app.get('/pricing', (req, res)=>{
    client.query(`Select * from pricing`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})


app.get('/item', (req, res)=>{
    client.query(`Select * from item`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})


app.post('/pricing', (req, res)=> {
    console.log("hi ")
    const user = req.body;
    console.log(user)
    let insertQuery = `insert into pricing( orderid,organizationid,itemid,zone,basedistanceinkm,kmpriceforperishable,kmpricefornonperishable,fixprice) 
                       values(${user.orderid}, ${user.organizationid},${user.orderid}, '${user.zone}', ${user.basedistanceinkm},${user.kmpriceforperishable},${user.kmpricefornonperishable},${user.fixprice})`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})














app.post('/request', (req, res)=> {
    console.log("hi ")
    const item_type1=req.body.item_type
    const zone1=req.body.zone
    const user = req.body;
    console.log(user)
    let valuekm=0
    let fixpricevalue=0
    let total_distance1=req.body.total_distance
    let id=req.body.organizationid
    let insertQuery = `Select basedistanceinkm from pricing where organizationid=$1;`
    client.query(insertQuery,[id], (err, result)=>{
        if(!err){
           
            valuekm=result.rows[0].basedistanceinkm;
        }
        else{ console.log(err.message) }
        console.log(valuekm)
    let insertQuery2 = `Select fixprice from pricing where organizationid=$1;`

    client.query(insertQuery2,[id], (err, result)=>{
            if(!err){
               
                fixpricevalue=result.rows[0].fixprice;
            }
            else{ console.log(err.message) }
            console.log(fixpricevalue)
    if(item_type1=="perishable"){
        let per_price=0;
        let insertQuery = `Select kmpriceforperishable from pricing where organizationid=$1 and zone=$2;`
        client.query(insertQuery,[id,zone1], (err, result)=>{
            if(!err){
               
                    per_price=result.rows[0].kmpriceforperishable;
                    }
            else{ console.log(err.message) }
                console.log(per_price)
             let distance=total_distance1-valuekm;
            console.log(distance)
        let total_price=((distance*per_price)+fixpricevalue)
        console.log(total_price)
        res.json({total_price:total_price})
        })
        }
       else{


        if(item_type1=="nonperishable"){
            let per_price=0;
            let insertQuery = `Select kmpricefornonperishable from pricing where organizationid=$1 and zone=$2;`
            client.query(insertQuery,[id,zone1], (err, result)=>{
                if(!err){
                    
                        per_price=result.rows[0].kmpricefornonperishable;
                        }
                else{ console.log(err.message) }
                    console.log(per_price)
                 let distance=total_distance1-valuekm;
                console.log(distance)
            let total_price=((distance*per_price)+fixpricevalue)
            console.log(total_price)
            res.json({total_price:total_price})
            })
            }
else{
    console.log("wrong input")
    res.send('wrong item type')
}

       } 

})
})
})


