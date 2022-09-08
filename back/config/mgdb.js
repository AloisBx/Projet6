const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Jeando25:Jeando25-25220@cluster0.eoaxpyw.mongodb.net/test',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));