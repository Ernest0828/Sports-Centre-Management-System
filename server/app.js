const app = require("./index");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('App listening on port ' + PORT);
});