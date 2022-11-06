import bcryptjs from 'bcryptjs';
import AppError from "../utils/AppError";
import { sqliteConnection } from '../database/sqlite'

async function create(request, response){

    const {name, email, passsword} = request.body;  
    
    // database connection estabilishing
    const dataBase = await sqliteConnection();
    
    const checkUserExixts = await dataBase.get('SELECT * FROM users WHERE email = (?)', [email]);

    if(checkUserExixts){
        throw new AppError(`Email ${email} already exixts.`);
    }

    // crypting password
    // necessary put 'await' becouse method 'hash' is a promise
    const hashedPassword = await bcryptjs.hash(passsword, 8);

    // insert User in data base
    await dataBase.run('INSERT INTO users (name, email, password) values (?, ?, ?)', [name, email, hashedPassword]);

    response.status(201).json({name, email});
}

async function update(request, response){

    const {name, email, password, old_password} = request.body; 
    const { id } = request.params; 
    
    // database connection estabilishing
    const dataBase = await sqliteConnection();
    
    // verfy if user already exixts
    const user = await dataBase.get('SELECT * FROM users WHERE id = (?)', [id]);

    if(!user){
        throw new AppError(`User not exixts.`);
    }  

    // verify if email already in use by another users
    const userWithUpdatedEmail = await dataBase.get('SELECT * FROM users WHERE email = (?)', [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id != id) {
        throw new AppError(`This email already in user by another user.`);
    }

    user.name = name ?? user.name; // sintaxe '??' if 'name' is not null then use 'name' else use 'user.name'
    user.email = email ?? user.email;


    if(password && !old_password) {      
        throw new AppError(`You must info old password to define a new password.`);        
    }

    if(password && old_password) {  

        const checkPassword = await bcryptjs.compare(old_password, user.password);
      
        if(!checkPassword){
            throw new AppError(`The old password not match with current password.`);
        }
        user.password = await bcryptjs.hash(password, 8);
    }  
     

    // update User in data base
    await dataBase.run(`UPDATE users SET 
    name = (?), 
    email = (?),
    password = (?),
    updated_at = DATETIME('now') 
    WHERE id = (?)`, 
    [user.name, user.email, user.password, id]);

    response.status(201).json({name, email});
}

export default { create, update };