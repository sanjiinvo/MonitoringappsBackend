const {User} = require('../models/models')

class UserController {
    static async createUser (req, res, next){
        try {
            const user = await User.create(req.body)
            res.status(201).json(user)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }

    static async getUser(req, res, next){
        try {
            const user = await User.findByPk(req.params.id)
            if(user){
                res.status(200).json(user)
            } else {
                res.status(404).json({error: 'User not found'})
            }
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }


    static async updateUser(req, res) {
        try {
          const user = await User.findByPk(req.params.id);
          if (user) {
            await user.update(req.body);
            res.status(200).json(user);
          } else {
            res.status(404).json({ error: 'User not found' });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
    
      static async deleteUser(req, res) {
        try {
          const user = await User.findByPk(req.params.id);
          if (user) {
            await user.destroy();
            res.status(204).send();
          } else {
            res.status(404).json({ error: 'User not found' });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
}


module.exports = UserController