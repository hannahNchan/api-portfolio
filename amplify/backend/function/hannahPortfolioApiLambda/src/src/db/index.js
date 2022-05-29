const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const getDataFromDB = (table = 'career') => {
  return new Promise((resolve, reject) => { 
    const dbPath = path.resolve(__dirname, './../../../portfoliodb/portfoliodb.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    db.serialize(() => {
      db.all(`SELECT * FROM ${table}`, (err, row) => {
        if (err) {
          reject(err);
          closeDB(db)
        }
        resolve(row);
          closeDB(db)
      });
    });
  });
}

const updateDataFromDB = (table = 'career', params) => {
  const { id, date, title, subtitle, description, activities, technologies } = params;
  return new Promise((resolve, reject) => { 
    const dbPath = path.resolve(__dirname, './../../../portfoliodb/portfoliodb.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    const query = `UPDATE ${table}
      SET date = '${date}',
          title = '${title}',
          subtitle = '${subtitle}',
          description = '${description}',
          activities = '${JSON.stringify(activities)}',
          technologies = '${JSON.stringify(technologies)}'
          WHERE id = ${id};`;
    db.serialize(() => {
      db.all(query, (err, row) => {
        if (err) {
          reject(false);
        }
          resolve(true);
      });
    });
  });
}

const newDataFromDB = (table = 'career', params) => {
  const { date, title, subtitle, description, activities, technologies } = params;
  return new Promise((resolve, reject) => { 
    const dbPath = path.resolve(__dirname, './../../../portfoliodb/portfoliodb.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

    const getId = (table) => {
      return new Promise((resolve, reject) => {
        var query = `select id from ${table} ORDER BY id DESC LIMIT 1;`;
        db.all(query, (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    }

    getId('career').then(newId => {
      const id = newId.length === 0 ? 0 : newId[0].id + 1;
      const query = `INSERT INTO career(
        id,
        date,
        title,
        subtitle,
        description,
        activities,
        technologies)
      VALUES(
        '${id}',
        '${date}',
        '${title}',
        '${subtitle}',
        '${description}',
        '${JSON.stringify(activities)}',
        '${JSON.stringify(technologies)}'
      );`;
      
      db.serialize(() => {
        db.all(query, (err, row) => {
          if (err) {
            reject(false);
          }
          resolve(true);
        });
      });
    });

  });
}

const deleteDataFromDB = (table = 'career', id) => {
  return new Promise((resolve, reject) => { 
    const dbPath = path.resolve(__dirname, './../../../portfoliodb/portfoliodb.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    const query = `delete from ${table} where id = '${id}'`;

    db.serialize(() => {
      db.all(query, (err, row) => {
        if (err) {
          reject(false);
        }
        resolve(true);
      });
    });
  });
}
const closeDB = (db) => {
  return new Promise((resolve, reject) => { 
    db.close((err) => {
      if (err) {
        reject(err);
      }
      resolve('Database closed');
    });
  });
}

module.exports = {
  updateDataFromDB,
  deleteDataFromDB,
  newDataFromDB,
  getDataFromDB,
  closeDB
};
