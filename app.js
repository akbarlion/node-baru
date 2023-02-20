const express = require('express');
const app = express();
const conn = require('./config/db');

app.use(express.json())

app.get('/get-karyawan', function (req, res) {
    const queryStr = "SELECT * FROM karyawan WHERE deleted_at IS NULL";
    conn.query(queryStr, (err, results)=>{
        if (err){
            console.log(err);
            res.errored(err.sqlMessage, res);
      } else{
        res.status(200).json({
            "success": true,
            "message": "Sukses menampilkan data",
            "data": results
        });
      }
    });
});

app.post('/store-karyawan', function (req, res){
    console.log(req.body);
    const param = req.body;
    const username = param.username;
    const password = param.password;
    const now = new Date();

    const queryStr = "INSERT INTO karyawan (username, password, created_at) VALUES (?, ?, ?)";
    const values = [username, password, now];

    conn.query(queryStr, values, (err, results)=>{
        if (err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        } else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menyimpan data",
                "data": results
            });
        }
    })
});

app.get('/get-karyawan-by-id', function (req, res) {
    const param= req.query
    const id = param.id
    const queryStr = "SELECT * FROM karyawan WHERE deleted_at IS NULL AND id= ?";
    const values = [id];

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            }) 
        } else {
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data",
                "data": results
            });
        }
    })
});

app.post('/update-karyawan', function(req, res){
    const param = req.body;
    const id = param.id;
    const username = param.username;
    const password = param.password;

    const queryStr = "UPDATE karyawan SET username = ?, password = ? WHERE id = ? AND deleted_at IS NULL";
    const values = [username, password, id];

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": "Sukses mengupdate data",
                "data": results
            })
        }
    })
})

 app.post('/delete-karyawan', function (req, res){
    const param = req.body;
    const id = param.id;
    const now = new Date();

    queryStr = "UPDATE karyawan SET deleted_at = ? WHERE id = ?";
    const values = [now, id];

    conn.query(queryStr, values, (err,results)=>{
        if (err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": "Sukses menghapus data",
                "data": results
            })
        }
    })
 });

 app.post('/login', function (req, res){
    console.log(req.body);
    const param = req.body;
    const username = param.username;
    const password = param.password;

    const queryStr = "SELECT id, username, password FROM karyawan WHERE username = ? AND password = ? AND deleted_at IS NULL";
    const values = [username, password];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        } else {
            if(results.length > 0){
                res.status(200).json({
                    "success": true,
                    "message": "Login berhasil",
                    "data": results[0]
                });
            } else {
                res.status(401).json({
                    "success": false,
                    "message": "Login gagal, username atau password salah",
                    "data": null
                })
            }
        }
    });
 })

 app.post('/register', function (req, res) {
    console.log(req.body);
    const param = req.body;
    const username = param.username;
    const password = param.password;
    const now = new Date();

    // Check if username already exists
    const checkQuery = "SELECT COUNT(*) as count FROM karyawan WHERE username = ?";
    const checkValues = [username];

    conn.query(checkQuery, checkValues, (checkErr, checkResults) => {
        if (checkErr) {
            console.log(checkErr);
            res.status(500).json({
                "success": false,
                "message": checkErr.sqlMessage,
                "data": null
            });
        } else {
            const count = checkResults[0].count;

            if (count > 0) {
                // If username already exists
                res.status(440).json({
                    "success": false,
                    "message": "Username telah terdaftar",
                    "data": null
                });
            } else {
                // If username does not exist, insert new data
                const insertQuery = "INSERT INTO karyawan (username, password, created_at) VALUES (?, ?, ?)";
                const insertValues = [username, password, now];

                conn.query(insertQuery, insertValues, (insertErr, insertResults) => {
                    if (insertErr) {
                        console.log(insertErr);
                        res.status(500).json({
                            "success": false,
                            "message": insertErr.sqlMessage,
                            "data": null
                        });
                    } else {
                        // If data is successfully inserted
                        res.status(200).json({
                            "success": true,
                            "message": "Sukses menambahkan data",
                            "data": insertResults
                        });
                    }
                });
            }
        }
    });
});



app.listen(3000);