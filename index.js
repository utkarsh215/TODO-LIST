import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "319be2a7",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
async function getItems()
{
  let items=[];
  const result = await db.query("SELECT * FROM item_list");
  result.rows.forEach(i => {
    items.push(i);
  });

  return items;
}

app.get("/", async(req, res) => {
  const items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  db.query("INSERT INTO item_list(title) VALUES ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  console.log(req.body);
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  await db.query("UPDATE item_list SET title=$1 WHERE id = $2",[title,id]);
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;

   db.query("DELETE FROM item_list WHERE id=$1",[id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
