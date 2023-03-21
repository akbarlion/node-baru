const express = require('express');
const app = express();
const conn = require('./config/db');

app.use(express.json())

app.get('/get-data', function (req, res) {
    const queryStr = "SELECT * FROM data WHERE deleted_at IS NULL";
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

app.post('/store-data', function (req, res){
    console.log(req.body);
    const param = req.body;
    const username = param.username;
    const password = param.password;
    const now = new Date();

    const queryStr = "INSERT INTO data (username, password, created_at) VALUES (?, ?, ?)";
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

app.get('/get-data-by-id', function (req, res) {
    const param= req.query
    const id = param.id;
    const queryStr = "SELECT * FROM data WHERE deleted_at IS NULL AND id= ?";
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

app.post('/update-data', function(req, res){
    const param = req.body;
    const id = param.id;
    const Nama = param.Nama;
    const username = param.username;
    const password = param.password;

    const queryStr = "UPDATE data SET Nama = ?, username = ?, password = ? WHERE id = ? AND deleted_at IS NULL";
    const values = [Nama, username, password, id];

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

 app.post('/delete-data', function (req, res){
    const param = req.query;
    const id = param.id;
    const now = new Date();

    queryStr = "UPDATE data SET deleted_at = ? WHERE id = ?";
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

 app.post('/delete/:id', function (req, res){
    console.log(req.body);
    const param = req.body;
    const id = param.id;
    const now = new Date();

    const queryStr = "UPDATE data SET deleted_at = ? WHERE id = ?";
    const values = [now, id];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": "Gagal menghapus data"
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": "Berhasil menghapus data",
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

    const queryStr = "SELECT id, username, password FROM data WHERE username = ? AND password = ? AND deleted_at IS NULL";
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
    const Nama = param.Nama;
    const username = param.username;
    const password = param.password;
    const now = new Date();

    // Check if username already exists
    const checkQuery = "SELECT COUNT(*) as count FROM data WHERE username = ?";
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
                const insertQuery = "INSERT INTO data (Nama, username, password, created_at) VALUES (?, ?, ?, ?)";
                const insertValues = [Nama, username, password, now];

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

app.post('/tambah', function (req, res){
    console.log(req.body);
    const param = req.body;
    const tindakan = param.tindakan
    const pemeriksaan = param.pemeriksaan
    const harga = param.harga
    const now = new Date()

    const queryStr = "INSERT INTO mapping (tindakan, pemeriksaan, harga, created_at) VALUES (?, ?, ?, ?)";
    const values = [tindakan, pemeriksaan, harga, now];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": "Berhasil menyimpan data",
                "data": results
            })
        }
    })
})



app.listen(3000);