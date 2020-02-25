// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ============================
//  Vencimiento del Token //60seg * 60min * 24horas * 30 dias
// ============================
process.env.TOKEN_CADUCIDAD = '72h';

// ============================
//  Seed de Autenticacion 
// ============================
process.env.SEED = process.env.SEED || 'players-seed';


// ============================
//  Base De Datos
// ============================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/jugadores'
} else {
    urlDB = 'mongodb+srv://LadyAnaid:h6jFgUZk0UhfCTc8@cluster0-o3i67.mongodb.net/jugadores?retryWrites=true&w=majority'
}
process.env.URLDB = urlDB;


// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '448493769494-ovbdmpm69k4kleov07mjuo7qn6du2bqq.apps.googleusercontent.com';