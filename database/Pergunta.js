const Sequelize = require('sequelize');
const connection = require('./database');

const Pergunta = connection.define('pergunta', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() => {console.log('Table iniciated')}); //ira sincronizar tabela no banco, forcefalse significa q nao vai força criação se ja existir

module.exports = Pergunta;