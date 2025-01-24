const { client } = require("./common");

const seed = async () => {
  try {
    await client.connect();
    const SQL = `DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS notes;
    CREATE TABLE categories(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
  );
    CREATE TABLE notes(
        id SERIAL PRIMARY KEY,
        txt VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        ranking INTEGER DEFAULT 3 NOT NULL,
        category_id INTEGER REFERENCES categories(id) NOT NULL
    );
    INSERT INTO categories(name) VALUES
    ('SQL'),
    ('Express'),
    ('Shopping');
    INSERT INTO notes(txt, ranking, category_id) VALUES
    ('learn express', 5, (SELECT id FROM categories WHERE name='Express')),
    ('add logging middleware', 5, (SELECT id FROM categories WHERE name='Express')),
    ('write SQL queries', 4, (SELECT id FROM categories WHERE name='SQL')),
    ('learn about foreign keys', 4, (SELECT id FROM categories WHERE name='SQL')),
    ('buy a quart of milk', 2, (SELECT id FROM categories WHERE name='Shopping'));
    `;
    await client.query(SQL);
    console.log("Does this work?");
    await client.end();
  } catch (error) {
    console.error(error);
  }
};

seed();
