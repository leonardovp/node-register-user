function validateUsers(request, response, next){

    //if(!request.body.isAdmin){
    //    return response.json({message: "user unauthorized"});
    //}

    next();
}

export default { validateUsers }