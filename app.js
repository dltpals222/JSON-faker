const express = require('express');
const path = require('path');

const app = express();

app.use(
  express.static(
    path.join(__dirname, 'dist'), {
      setHeaders : (res, filePath) => {
        if(filePath.endsWith('.js')){
          res.setHeader('Content-Type', 'application/javascript');
        }
      }
    }
    )
  );

let portNumber = 3050

app.listen(portNumber, () => {
  console.log('Start Server listening on port ' + portNumber);
});
