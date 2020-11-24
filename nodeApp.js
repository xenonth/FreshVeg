const inquirer = require("inquirer");
const table = require("console.table");
const mysql = require("mysql");
const colors = require("colors");
// const sequelize = require("./config/sequelize");

const connection = mysql.createConnection({
    host: "tyduzbv3ggpf15sx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "rcp5kgnzh5w2y4w4",
    password: "mr7txoqjdyittef0",
    database: "thjgsjh6mvck6pc7",
});

connection.connect(function(err) {
    if (err) throw err;

    run();
});

function run() {

    function mainMenu() {
        inquirer.prompt([
            {
                type: "list",
                name: "menu",
                message: "Hello.\nPlease select from one of the following prompts".green,
                choices: 
                [
                    " --> See All Current Produce",
                    " --> See All Farmers",
                    " --> Add New Farmer",
                    " --> Add New Produce",
                    " --> Remove Obsolete or Depleted Produce",
                    " --> Rmove Farmers",
                    " --> Exit"
                ]
            }
        ]).then(function(data) {
            if (data.menu === " --> See All Current Produce") return seeAll();
            if (data.menu === " --> Add New Farmer") return addFarmer();
            if (data.menu === " --> See All Farmers") return seeFarmer();
            if (data.menu === " --> Add New Produce") return addProduct();
            if (data.menu === " --> Remove Obsolete or Depleted Produce") return removeProduce();
            if (data.menu === " --> Rmove Farmers") return removeFarmer();
            if (data.menu === " --> Exit") return exit();
        }).catch(err => {
            return err;
        });
    }

    function seeAll() {
        let queryString = "SELECT * FROM products";
        connection.query(queryString, function(err, res) {
            if (err) throw err;

            console.table(`\n All Current Produce \n`.red, res)
            return subMenu();
        });
    };
    
    function exit() {
        console.log("\nGoodBye\n".red)
        connection.end();
    };

    function subMenu() {
        inquirer.prompt([
            {
                type: "list",
                name: "subMenu",
                message: "Where to Next?.".green,
                choices: [
                    " --> Main Menu",
                    " --> Filter Produce"
                ]
            }
        ]).then(function(data) {
            if (data.subMenu === " --> Main Menu") return mainMenu();
            if (data.subMenu === " --> Filter Produce") return filterMenu();
        }).catch(err => {
            return err;
        });
    };

    // function updateLevels() {
    //     connection.query(`SELECT * FROM products`, function(err, res) {
    //         if (err) throw err;

    //         inquirer.prompt([
    //             {
    //                 type: "list",
    //                 name: "produceSelection",
    //                 message: "What would you like to update".green,
    //                 choices: function() {
    //                     let produceArray = [];
    //                     let currentProduce = [];
    //                     for (let i = 0; i < res.length; i++) {
    //                         console.log(res[i]);
    //                         produceArray.push(`ID ${res[i].id} : ${res[i].produce_name.green}`);
    //                         currentProduce.push(res[i]);
                            
    //                     };
    //                     return produceArray;
    //                 }
    //             }
    //         ]).then(function(data) {
    //             let newAmount = JSON.stringify(data);
    //             let amountString = newAmount.slice(23,26).toLowerCase();

    //             if (data.produceSelection) {
    //                 inquirer.prompt([
    //                     {
    //                         type: "input",
    //                         name: "newAmount",
    //                         message: "What is the new price per KG?"
    //                     },
    //                     {
    //                         type: "list",
    //                         name: "confirm",
    //                         message: "Confirm?",
    //                         choices: ["Yes", "No", "Exit"]
    //                     }
    //                 ]).then(function(data) {
                        
    //                     if (data.confirm === "No") return updateLevels();
    //                     if (data.confirm === "Exit") return mainMenu();
    //                     if (data.confirm === "Yes") {
    //                         connection.query(`UPDATE products SET price_kg = ${data.newAmount} WHERE id = ${amountString}`, 
    //                         function(err, res) {
    //                             if (err) throw err;

    //                             console.log("Success");

    //                             inquirer.prompt([
    //                                 {
    //                                     type: "list",
    //                                     name: "mainMenu",
    //                                     message: "Return to main menu or view produce",
    //                                     choices: 
    //                                     [
    //                                         "View Produce",
    //                                         "Main Menu"
    //                                     ]
    //                                 }
    //                             ]).then(function(data) {
    //                                 if (data.mainMenu === "View Produce") return seeAll();
    //                                 if (data.mainMenu === "Main Menu") return mainMenu();
    //                             })
    //                         })
    //                     }
    //                 })
    //             }
    //         })
    //     });  
    // };

    function addFarmer() {
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is your first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is your last name?"
            }
        ]).then(function(data) {
            let queryString = `INSERT INTO farmer (first_name, last_name) VALUES ('${data.firstName}', '${data.lastName}')`;

            connection.query(queryString, function(err, res) {
                if (err) throw err;

                
                console.log(`${data.firstName} ${data.lastName} Added Successfully`);
                inquirer.prompt([
                            {
                                type: "list",
                                name: "mainMenu",
                                message: "Return to main menu or view produce",
                                choices: 
                                    [
                                        "View Produce",
                                        "Main Menu"
                                    ]
                            }
                ]).then(function(data) {
                    if (data.mainMenu === "View Produce") return seeAll();
                    if (data.mainMenu === "Main Menu") return mainMenu();
                })
            })
        })
    }

    function seeFarmer() {
        connection.query("SELECT * FROM farmer", function (err, res) {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: "list",
                    name: "farmerSelect",
                    message: "View Farmer Details".green,
                    choices: function() {
                        let farmerArray = [];
                        for (let i = 0; i < res.length; i++) {
                            
                            farmerArray.push(`ID ${res[i].id} : ${res[i].first_name.green} ${res[i].last_name.green}`);
                                        
                        };
                    return farmerArray;
                    }
                },
                {
                    type: "list",
                    name: "mainMenu",
                    message: "Return to main menu or view produce",
                    choices: 
                            [
                                "View Produce",
                                "Main Menu"
                            ]
                }
            ]).then(function(data) {
                if (data.farmerSelect) {
                    
                    let newString = JSON.stringify(data);

                    console.table(newString);

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "mainMenu",
                            message: "Return to main menu or view produce",
                            choices: 
                                [
                                    "View Produce",
                                    "Main Menu"
                                ]
                        }
                    ]).then(function(data) {
                        if (data.mainMenu === "View Produce") return seeAll();
                        if (data.mainMenu === "Main Menu") return mainMenu();
                    })
                };
                if (data.mainMenu === "View Produce") return seeAll();
                if (data.mainMenu === "Main Menu") return mainMenu();
            })
        })
    }

    function addProduct() {
        let queryString = "SELECT id, product_name FROM products";
        connection.query(queryString, function(err, res) {
            if (err) throw err;

            let farmerString = `SELECT * from farmer`;

            inquirer.prompt([
                // {
                //     type: "list",
                //     name: "vegSelector",
                //     message: "What type of veg are you adding",
                //     choices: 
                //         function() {
                //             let produceArray = [];
                //             for (let i = 0; i < res.length; i++) {
                //                 produceArray.push(`${res[i].id} ${res[i].produce_type}`);
                //             };
                //             return produceArray;
                //         }
                // },
                {
                    type: "input",
                    name: "vegName",
                    message: "What are you adding?" 
                },
                {
                    type: "list",
                    name: "vegFarmer",
                    message: "Which farmer does this produce belong too?",
                    choices: [
                        connection.query(farmerString, function(err, res) {
                            if (err) throw err;

                            let farmerArray = [];
                            for (let i = 0; i < res.length; i++) {
                                
                                farmerArray.push(`${res[i].id} ${res[i].last_name}`);
                            };
                            return farmerArray;
                            
                        })
                        
                    ]
                },
                {
                    type: "input",
                    name: "vegAmount",
                    message: "What does it cost per KG?"
                }
            ]).then(function(data) {
                console.log(data);
                
                let queryString = `INSERT INTO products (farmer_id, product_name) VALUES ('${data.vegID}', '${data.vegName}')`
                connection.query(queryString, function(err, res) {
                    if (err) throw err;

                    console.log("great");
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "mainMenu",
                            message: "Return to main menu or view produce",
                            choices: 
                            [
                                "View Produce",
                                "Main Menu"
                            ],
                        }
                    ]).then(function(data) {
                        if (data.mainMenu === "View Produce") return seeAll();
                        if (data.mainMenu === "Main Menu") return mainMenu();
                    });
                })

                // if (data.vegSelector) {
                //     let queryStringProduce = `INSERT INTO fresh_produce (produce_name, farm_location, Amount_kg, produce_type_id) VALUES ('${data.vegName}', '${vegLocation}', '${data.vegAmount}', ${vegId})`;

                //     connection.query(queryStringProduce, function(err, res) {
                //         if (err) throw err;

                //         console.log("Success");

                //         inquirer.prompt([
                //             {
                //                 type: "list",
                //                 name: "mainMenu",
                //                 message: "Return to main menu or view produce",
                //                 choices: 
                //                 [
                //                     "View Produce",
                //                     "Main Menu"
                //                 ],
                //             }
                //         ]).then(function(data) {
                //             if (data.mainMenu === "View Produce") return seeAll();
                //             if (data.mainMenu === "Main Menu") return mainMenu();
                //         });
                //     });
                // };
            });
        });  
    };

    function removeProduce() {
        let queryString = "SELECT id, produce_name FROM fresh_produce";
        connection.query(queryString, function(err, res) {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: "list",
                    name: "produce",
                    message: "What produce is to be removed?",
                    choices: 
                    function() {
                        let produceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            produceArray.push(`${res[i].id} ${res[i].produce_name}`);
                        };
                        return produceArray;
                    }
                }
            ]).then(function(data) {
                let produce = JSON.stringify(data.produce);
                let produceString = produce.replace(/[^a-zA-Z ]/g, "");
                let produceID = produce.replace(/[^0-9 ]/g, "");
                console.log(produceString);
                console.log(produceID);
                if (data.produce) {
                    connection.query(`DELETE FROM fresh_produce WHERE id = ${produceID}`,
                        function(err, res) {
                            if (err) throw err;

                            console.log(`Successfully removed ${res} from database`);

                        });
                        inquirer.prompt([
                            {
                                type: "list",
                                name: "mainMenu",
                                message: "Return to main menu or view produce",
                                choices: 
                                [
                                    "View Produce",
                                    "Main Menu"
                                ]
                            }
                        ]).then(function(data) {
                            if (data.mainMenu === "View Produce") return seeAll();
                            if (data.mainMenu === "Main Menu") return mainMenu();
                        });
                };
            });
        });
    };

    mainMenu();

};