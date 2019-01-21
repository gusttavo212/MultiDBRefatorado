docker exec -it d96e753cc519 /
   mongo -u gadsden -p 250433 --authenticationDatabase herois

//dbs
show dbs

//mudando apra o contexto de um db
use herois

//mostar tables(coleções)
show collections

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
});

db.herois.find();
db.herois.find().pretty();

for(let i=0; i<= 100000; i++){

}

//CREATE
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
});

//READ
db.herois.find();

//UPDATE
db.herois.update({ _id: ObjectId("5c40d9c6c55ae4a5ddf0e636")},
                    {nome: 'Mulher Maravilha'})

db.herois.update({ _id: ObjectId("5c40d9c6c55ae4a5ddf0e636")},
                 {$set: {nome: 'Mulher Maravilha'} })

//DELETE
db.herois.remove({})                 