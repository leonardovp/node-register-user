import { sqliteConnection as dataBase } from '../../sqlite';
import { createUsers } from './createUsers';

async function executeMigrations(){
    const schemas = [
        createUsers
    ].join('');

    dataBase()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error));
}

export default { executeMigrations };