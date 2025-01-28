const { client } = require("./common");
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/", async (req, res) => {
  res.status(200).json({ message: "This works" });
});

app.get("/api/categories", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * FROM categories
        `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/notes", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * FROM notes ORDER BY created_at DESC;
        `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/notes", async (req, res, next) => {
  try {
    const { txt, ranking, category_id } = req.body;
    const SQL = `
          INSERT INTO notes(txt, ranking, category_id) VALUES($1, $2, $3) RETURNING *;
          `;
    const response = await client.query(SQL, [txt, ranking, category_id]);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.put("/api/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { txt, ranking } = req.body;
    const SQL = `
          UPDATE notes
          SET txt = $1, ranking = $2
          WHERE id = $3
          RETURNING *
          `;
    const response = await client.query(SQL, [txt, ranking, id]);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
          DELETE FROM notes WHERE id = $1
          `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, async () => {
  await client.connect();
  console.log(`I am listening on port number ${PORT}`);
});
