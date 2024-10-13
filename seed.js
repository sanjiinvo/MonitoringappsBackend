const { User, Role, Department, Status } = require('./models/models');
const bcrypt = require('bcrypt');

async function seedDatabase() {
    try {
        // Создание ролей
        const roles = ['Admin', 'Moder', 'User'];
        for (const role of roles) {
            await Role.findOrCreate({
                where: { roleName: role }
            });
        }

        // Создание отдела
        const [itDepartment, created] = await Department.findOrCreate({
            where: { departmentName: 'IT' },
        });

        // Создание статусов
        const statuses = ['Не начат', 'В процессе', 'Завершен'];
        for (const status of statuses) {
            await Status.findOrCreate({
                where: { statusName: status }
            });
        }

        // Получение ID роли "Admin"
        const adminRole = await Role.findOne({ where: { roleName: 'Admin' } });
        if (!adminRole) {
            console.error('Роль Admin не найдена.');
            return;
        }

        // Создание пользователя-администратора
        const [adminUser, userCreated] = await User.findOrCreate({
            where: { username: 'sanzh' },
            defaults: {
                rlname: 'Admin User',
                password: bcrypt.hashSync('sanzh', 10),
                roleId: adminRole.id,
                rolename: "Admin",
                departmentId: itDepartment.id
            }
        });

        // Проверка и вывод данных о созданном пользователе
        if (userCreated) {
            console.log('Пользователь создан:', adminUser.toJSON());
        } else {
            console.log('Пользователь уже существует:', adminUser.toJSON());
        }

        console.log('База данных успешно инициализирована начальными данными.');
    } catch (error) {
        console.error('Ошибка при инициализации данных:', error);
    }
}

// Вызов функции и завершение процесса после выполнения
seedDatabase().then(() => {
    console.log('Сеединг завершен.');
    process.exit();
}).catch(error => {
    console.error('Ошибка при выполнении сеединга:', error);
    process.exit(1);
});
