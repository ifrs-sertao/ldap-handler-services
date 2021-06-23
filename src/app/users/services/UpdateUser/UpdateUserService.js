const AppError = require('../../../../shared/errors/AppError');
const usersRepository = require('../../repositories/UsersRepository')

class CreateGroupService {

    constructor() { }

    async execute(user, updateUser_data) {

        const foundUser = await usersRepository.searchByUser(user)
        
        if (!foundUser) {
            throw new AppError(404, `The user ${user} does not exists!`);
        };

        const updateNewUser = await usersRepository.updatePassword(foundUser.dn, {...updateUser_data}); 

        if (!updateNewUser) {
            return res.status(401).send({ error: `The user ${user} cannot be updated!`});
        };

        return updateNewUser
    }
}

module.exports = new CreateGroupService;
