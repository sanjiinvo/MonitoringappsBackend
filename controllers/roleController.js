const {Role} = require('../models/models')

class RoleController {
    static async createRole (req, res, next){
        try {
            const role = await Role.create(req.body)
            res.status(201).json(role)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }

    static async getRole(req, res, next){
        try {
            const role = await Role.findByPk(req.params.id)
            if (!role) return res.status(404).json({error: 'Role not found'})
            res.json(role)
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    static async updateRole(req, res) {
        try {
          const role = await Role.findByPk(req.params.id);
          if (role) {
            await role.update(req.body);
            res.status(200).json(role);
          } else {
            res.status(404).json({ error: 'Role not found' });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
    
      static async deleteRole(req, res) {
        try {
          const role = await Role.findByPk(req.params.id);
          if (role) {
            await role.destroy();
            res.status(204).send();
          } else {
            res.status(404).json({ error: 'Role not found' });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
}

module.exports = RoleController;