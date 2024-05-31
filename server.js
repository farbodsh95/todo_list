const app = require("./app");
const port = process.env.APP_RUNNING_PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
