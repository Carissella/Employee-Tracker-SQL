const inquirer = require("inquirer");
const connection = require("./db/server");
const consoleTable = require("console.table");

function userPrompts() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "action",
            message: "Please select one of the choices displayed",
            choices: [
                "View All Departments?",
                "View All Roles?",
                "View All Employees",
                "Add A Department?",
                "Add A Role?",
                "Add An Employee?",
                "Update An Employee Role?",
                "Exit?",
            ],
        },
    ])
    .then((answers) => {
    switch (answers.action) {
        case "View Departments?":
            viewAllDepartments();
            break;
        case "View Roles":
            viewAllRoles();
            break;
        case "View Employees?":
            viewAllEmployees();
            break;
        case "Add A Department?":
            addDepartment();
            break;
        case "Add A Role?":
            addRole();
            break;
        case "Add An Employee?":
            addEmployee();
            break;
        case "Update An Employee Role?":
            updateEmployeeRole();
        case "Exit?":
            connection.end();
            break;
    }
    });

    function viewAllDepartments() {
        connection.query("SELECT * FROM department", (error, results) => {
        if (error) throw error;
        console.log("\n")
        console.table((results));
        userPrompts();
        });
    };

    function viewAllRoles() {
        connection.query(
        "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles JOIN department ON roles.department_id = department.id", 
        (error, results) => {
            if (error) throw error;
            console.table(results);
            userPrompts();
        });
    };

    function viewAllEmployees() {
        connection.query(
          "SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id",
          (error, results) => {
            if (error) throw error;
            console.table(results);
            userPrompts();
          });
      };
      
    function addDepartment() {
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "Please enter the name of the department you are making:",
            },
          ])
          .then((answers) => {
            connection.query(
              "INSERT INTO department SET ?",
              { name: answers.name },
              (error) => {
                if (error) throw error;
                console.log(`Department "${answers.name}" has been added successfully!`);
                userPrompts();
              }
            );
          });
      };
      
      function addRole() {
        connection.query("SELECT * FROM department", (error, departments) => {
          if (error) throw error;
          inquirer
            .prompt([
              {
                type: "input",
                name: "title",
                message: "Please enter the title of the role:",
              },
              {
                type: "input",
                name: "salary",
                message: "Please enter the salary of the role:",
              },
              {
                type: "list",
                name: "department",
                message: "Please select the department of the role:",
                choices: departments.map((department) => ({
                  name: department.name,
                  value: department.id,
                })),
              },
            ])
        .then((answers) => {
            connection.query(
            "INSERT INTO roles SET ?",
                {
                  title: answers.title,
                  salary: answers.salary,
                  department_id: answers.department,
                },
                (error) => {
                  if (error) throw error;
                  console.log(`Role "${answers.title}" added successfully!`);
                  userPrompts();
                }
              );
            });
        });
      }
      
      function addEmployee() {
        connection.query("SELECT * FROM roles", (error, roles) => {
          if (error) throw err;
          connection.query("SELECT * FROM employee", (error, managers) => {
            if (error) throw error;
            console.table(roles);
            console.table(managers);
      
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "firstName",
                  message: "Please enter the employee first name",
                },
                {
                  type: "input",
                  name: "lastName",
                  message: "Please enter the employee last name",
                },
                {
                  type: "list",
                  name: "roleId",
                  message: "Please enter the employee role",
                  choices: roles.map((role) => role.title),
                },
                {
                  type: "list",
                  name: "managerId",
                  message: "Please enter the manager of the employee",
                  choices: managers.map(
                    (manager) => `${manager.first_name} ${manager.last_name}`
                  ),
                },
              ])
              .then((answers) => {
                const role = roles.find((role) => role.title === answers.roleId);
                const manager = managers.find(
                  (manager) =>
                    `${manager.first_name} ${manager.last_name}` === answers.managerId
                );
                connection.query(
                  "INSERT INTO employee SET ?",
                  {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: role.id,
                    manager_id: manager.id,
                  },
                  (error, res) => {
                    if (error) throw error;
                    console.log(`\n Employee successfully added!\n`);
                    userPrompts();
                  }
                );
              });
          });
        });
      }
      
      
      function updateEmployeeRole() {
        connection.query("SELECT * FROM employee", (error, employees) => {
          if (error) throw error;
          connection.query("SELECT * FROM roles", (error, roles) => {
            if (error) throw error;
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "employee",
                  message: "Please select an employee you would you like to update",
                  choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                  })),
                },
                {
                  type: "list",
                  name: "role",
                  message: "What is the employee new role?",
                  choices: roles.map((role) => ({
                    name: role.title,
                    value: role.id,
                  })),
                },
              ])
              .then((answers) => {
                connection.query(
                  "UPDATE employee SET role_id = ? WHERE id = ?",
                  [answers.role, answers.employee],
                  (error) => {
                    if (error) throw error;
                    console.log("Employee role has been updated successfully!");
                    userPrompts();
                  }
                );
              });
          });
        });
      };
    };
userPrompts();