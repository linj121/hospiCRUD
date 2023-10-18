const express = require('express');
const nursesRouter = express.Router();
const nurseModel = require('../model/nurse');
const logger = require('../utils/logger');

// Fetch nurses with optional filters
nursesRouter.get('/', async (req, res) => {
    const { firstname, lastname, ward } = req.query;
    let nurses;

    logger.info(`firstName: ${firstname}, lastName: ${lastname}, ward: ${ward}`);

    if (firstname || lastname) {
        nurses = await nurseModel.getNursesByName(firstname, lastname);
    } else if (ward) {
        nurses = await nurseModel.getNursesByWard(ward);
    } else {
        nurses = await nurseModel.getAllNurses();
    }

    res.json(nurses);
});

// Create a new nurse
nursesRouter.post('/', async (req, res) => {
    const { firstname, lastname, ward, email } = req.body;

    if (!firstname || !lastname || !ward || !email) {
        return res.status(400).json({ error: 'All fields (FirstName, LastName, Ward, Email) are required.' });
    } else if (!["Red", "Green", "Blue", "Yellow"].includes(ward)) {
        return res.status(400).json({ error: 'Ward must be one of Red, Green, Blue, Yellow.' });
    }

    const nurse = { firstname, lastname, ward, email };
    const addedNurse = await nurseModel.createNurse(nurse);
    res.json(addedNurse);
});

// Update nurse details
nursesRouter.put('/:id', async (req, res) => {
    const { firstname, lastname, ward, email } = req.body;
    const id = Number(req.params.id);

    if (ward && !["Red", "Green", "Blue", "Yellow"].includes(ward)) {
        return res.status(400).json({ error: 'Ward must be one of Red, Green, Blue, Yellow.' });
    }
    
    const nurse = { firstname, lastname, ward, email };
    const updatedNurse = await nurseModel.updateNurse(id, nurse);
    res.json(updatedNurse);
});

// Delete a nurse
nursesRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await nurseModel.deleteNurse(id);
    res.status(204).end();
});

module.exports = nursesRouter;
