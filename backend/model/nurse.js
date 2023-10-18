const db = require('../db');

const getAllNurses = async () => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM nurse', 
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const getNursesByName = async (firstName, lastName) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM nurse WHERE 1=1';
        let params = [];
        
        if (firstName) {
            query += ' AND FirstName LIKE ?';
            params.push(`%${firstName}%`);
        }
        
        if (lastName) {
            query += ' AND LastName LIKE ?';
            params.push(`%${lastName}%`);
        }

        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const getNursesByWard = async (ward) => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM nurse WHERE LOWER(Ward) = LOWER(?)', 
            [ward], 
            (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            }
        );
    });
};

const createNurse = async (nurse) => {
    return new Promise((resolve, reject) => {
        const { firstname, lastname, ward, email } = nurse;
        db.run(
            'INSERT INTO nurse (FirstName, LastName, Ward, Email) VALUES (?, ?, ?, ?)', 
            [firstname, lastname, ward, email], 
            function (err) {
                if (err) reject(err);
                resolve({ ...nurse, EmployeeID: this.lastID });
            }
        );
    });
};

const updateNurse = async (id, nurse) => {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE nurse SET ';
        let params = [];
        let isFirstParam = true;

        for (const [key, value] of Object.entries(nurse)) {
            if (value) { 
                if (!isFirstParam) query += ', ';
                query += `${key} = ?`;
                params.push(value);
                isFirstParam = false;
            }
        }

        query += ' WHERE EmployeeID = ?';
        params.push(id);

        db.run(query, params, function (err) {
            if (err) reject(err);
            resolve(nurse);
        });
    });
};

const deleteNurse = async (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM nurse WHERE EmployeeID = ?', 
            [id], 
            function (err) {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

module.exports = {
    getAllNurses,
    getNursesByName,
    getNursesByWard,
    createNurse,
    updateNurse,
    deleteNurse
};
