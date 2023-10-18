const fs = require("fs");
const logger = require("./utils/logger");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./nurse.db";

function createTable(db) {
    db.exec(`
    CREATE TABLE nurse
    (
      EmployeeID INTEGER PRIMARY KEY AUTOINCREMENT,
      FirstName  VARCHAR(50) NOT NULL,
      LastName  VARCHAR(50) NOT NULL,
      Ward VARCHAR(50) NOT NULL,
      Email VARCHAR(50) NOT NULL
    );
  `);
}

function seedData(db) {
    db.exec(`
    INSERT INTO nurse (FirstName, LastName, Ward, Email) VALUES ('Ella', 'Quinn', 'Red', 'ellaq@gmail.com');
    INSERT INTO nurse (FirstName, LastName, Ward, Email) VALUES ('Emma', 'Murphy', 'Green', 'emmam@gmail.com');
    INSERT INTO nurse (FirstName, LastName, Ward, Email) VALUES ('Anna', 'Monroe', 'Blue', 'annam@gmail.com');
    INSERT INTO nurse (FirstName, LastName, Ward, Email) VALUES ('Anna', 'Quinn', 'Yellow', 'annaq@gmail.com');
    INSERT INTO nurse (FirstName, LastName, Ward, Email) VALUES ('Chloe', 'Ashley', 'Red', 'chloea@gmail.com');
    `)
}

function createDbConnection() {
    if (fs.existsSync(filepath)) {
        return new sqlite3.Database(filepath, (error) => {
                if (error) return logger.error(error.message);
            }    
        );
    } else {
        const db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                return logger.error(error.message);
            }
            createTable(db);
            seedData(db);
        });
        logger.info(`Connection with SQLite has been established. Create new table at ${filepath}`);
        return db;
    }
}

module.exports = createDbConnection();
