const app = require('./app');
require('./database');

const PORT = app.get('port');

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
