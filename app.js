const express = require('express');
const app = express();
const conn = require('./config/db');
// const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors({origin: '*'}))
app.use(express.json());
// app.use(bodyParser.json());

app.get('/get-namaperiksa', function(req,res){
    const queryStr = "SELECT * FROM nama_pemeriksaan WHERE deleted_at IS NULL";
    conn.query(queryStr, (err, results)=>{
        if(err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        } else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan seluruh data",
                "data": results
            });
        }
    });
})

app.get('/get-cabang', function(req, res){
    const queryStr = "SELECT * FROM namacabang WHERE deleted_at IS NULL";
    conn.query(queryStr, (err, results)=>{
        if(err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data cabang",
                "data": results
            })
        }
    })
});

app.get('/get-tindakan', function (req, res){
    const queryStr = "SELECT * FROM tindakan WHERE deleted_at IS NULL";
    conn.query(queryStr, (err, results)=>{
        if(err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data tindakan",
                "data": results
            })
        }
    })
})

app.post('/store-tarif-name', function(req, res){
    console.log(req.body);
    const param = req.body;
    const ID_TARIF_NAME = param.ID_TARIF_NAME;
    const TARIF_NAME = param.TARIF_NAME;
    const IS_ACTIVE = param.IS_ACTIVE;
    const ID_TREATMENT = param.ID_TREATMENT;
    const ID_SPECIMEN = param.ID_SPECIMEN;
    const URUT = param.URUT;
    const MODIFIED_BY = param.MODIFIED_BY;
    const MODIFIED_DATE = new Date();
    const OTHER_ID = param.OTHER_ID;
    const TARIF_NAME_ENG = param.TARIF_NAME_ENG;
    const DECLAIMER = param.DECLAIMER;
    const DECLAIMER_ENG = param.DECLAIMER_ENG;
    const IS_REGPOLI = param.IS_REGPOLI;
    const IS_PUBLISH = param.IS_PUBLISH;

    //check if TARIF_NAME already exist
    const checkQuery = "SELECT COUNT(*) as count FROM tarif_name WHERE ID_TARIF_NAME = ?";
    const checkValues = [ID_TARIF_NAME];

    conn.query(checkQuery, checkValues, (checkErr, checkResults)=>{
        if(checkErr){
            console.log(checkErr);
            res.status(500).json({
                "success": false,
                "message": checkErr.sqlMessage,
                "data": null
            })
        }else{
            const count= checkResults[0].count;

            if (count > 0) {
                // If username already exists
                res.status(440).json({
                    "success": false,
                    "message": "Tindakan telah terdaftar",
                    "data": null
                });
            } else {
                // If username does not exist, insert new data
                const insertQuery = "INSERT INTO tarif_name (ID_TARIF_NAME, TARIF_NAME, IS_ACTIVE, ID_TREATMENT, ID_SPECIMEN, URUT, MODIFIED_BY, MODIFIED_DATE, OTHER_ID, TARIF_NAME_ENG, DECLAIMER, DECLAIMER_ENG, IS_REGPOLI, IS_PUBLISH) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const insertValues = [ID_TARIF_NAME, TARIF_NAME, IS_ACTIVE, ID_TREATMENT, ID_SPECIMEN, URUT, MODIFIED_BY, MODIFIED_DATE, OTHER_ID, TARIF_NAME_ENG, DECLAIMER, DECLAIMER_ENG, IS_REGPOLI, IS_PUBLISH];

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
    })

})

app.post('/store-periksa', function (req, res) {
    console.log(req.body);
    const param = req.body;
    const inisial = param.inisial;
    const namaPemeriksaan = param.namaPemeriksaan;
    const harga = param.harga;
    const now = new Date();

    // Check if username already exists
    const checkQuery = "SELECT COUNT(*) as count FROM nama_pemeriksaan WHERE inisial= ?";
    const checkValues = [inisial];

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
                    "message": "Pemeriksaan telah terdaftar",
                    "data": null
                });
            } else {
                // If username does not exist, insert new data
                const insertQuery = "INSERT INTO nama_pemeriksaan (inisial, namaPemeriksaan, harga, created_at) VALUES (?, ?, ?, ?)";
                const insertValues = [inisial, namaPemeriksaan, harga, now];

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

function generateEndpoint(){
    const date = new Date();
    const timestamp = date.toISOString().replace(/[-:T]/g, "").slice(0,14);
    const randomString = Math.random().toString(36).substring(2, 14);
    return `TH${timestamp}${randomString}`;
}

app.get('/get-temporary', function(req,res){
    const queryStr = "SELECT ID_TREATMENT, TREATMENT FROM temporary GROUP BY ID_TREATMENT";
    conn.query(queryStr, (err, results)=>{
        if(err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data cabang",
                "data": results
            })
        }
    })
});


app.post('/temporer', (req, res) => {
    // extract the request body
    const { ID_TREATMENT } = req.body;
  
    // define the SQL query and parameters
    const query = "SELECT * FROM TEMPORARY WHERE ID_TREATMENT IN (?)";
    const params = [ID_TREATMENT];
  
    // execute the query using the connection pool
    conn.query(query, params, (err, results) => {
      if (err) {
        // handle error
        console.error(err);
        res.status(500).send('Error querying database');
      } else {
        // return results as JSON
        res.json(results);
      }
    });
  });


app.post('/temporary', function (req, res){
    const param = req.body;
    const ID_TREATMENT = param.ID_TREATMENT;
    const TREATMENT = param.TREATMENT;
    const ID_TARIF_NAME = param.ID_TARIF_NAME;
    const TARIF_NAME = param.TARIF_NAME;
    const HARGA = param.HARGA;
    const PROFESI = param.PROFESI
    const MODIFIED_BY = param.MODIFIED_BY;
    const MODIFIED_DATE = new Date()

    const queryStr = "INSERT INTO temporary (ID_TREATMENT, TREATMENT, ID_TARIF_NAME, TARIF_NAME, HARGA, PROFESI, MODIFIED_BY, MODIFIED_DATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [ID_TREATMENT, TREATMENT, ID_TARIF_NAME, TARIF_NAME, HARGA, PROFESI, MODIFIED_BY, MODIFIED_DATE];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menginput data",
                "data": results
            });
        }
    });
});

app.get('/tarif-name-join', function(req,res){
    const queryStr = "SELECT * FROM tarif_harga JOIN tarif_name ON tarif_harga.ID_TARIF_NAME = tarif_name.ID_TARIF_NAME JOIN treatment ON tarif_name.ID_TREATMENT = treatment.ID_TREATMENT";
    conn.query(queryStr, (err, results)=>{
        if(err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data",
                "data": results
            })
        }
    })
})

app.post('/tarif-name-join', function(req, res) {
    const ID_DIVISI_LAB = req.body.ID_DIVISI_LAB; // Mengambil nilai ID_DIVISI_LAB dari request body
  
    const queryStr = `
      SELECT *
      FROM tarif_harga
      JOIN tarif_name ON tarif_harga.ID_TARIF_NAME = tarif_name.ID_TARIF_NAME
      JOIN treatment ON tarif_name.ID_TREATMENT = treatment.ID_TREATMENT
      WHERE ID_DIVISI_LAB = ?
    `;
    const values = [ID_DIVISI_LAB]; // Menyimpan nilai ID_DIVISI_LAB dalam array values
    conn.query(queryStr, values, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.sqlMessage });
      } else {
        res.status(200).json({
          success: true,
          message: 'Sukses menampilkan data',
          data: results
        });
      }
    });
  });
  


app.post('/tarif-harga', function(req, res){
    const param = req.body;
    const ID_TARIF_HARGA= param.ID_TARIF_HARGA;
    const ID_DIVISI_LAB= param.ID_DIVISI_LAB;
    const ID_TARIF_NAME= param.ID_TARIF_NAME;
    const HARGA= param.HARGA;
    const PROFESI= param.PROFESI;
    const MODIFIED_BY= param.MODIFIED_BY;
    const MODIFIED_DATE= new Date()
    
    const checkQuery = "SELECT COUNT(*) as count FROM tarif_harga WHERE ID_TARIF_HARGA = ?";
    const checkValues = [ID_TARIF_HARGA];

    conn.query(checkQuery, checkValues, (checkErr, checkResults)=>{
        if(checkErr){
            console.log(checkErr);
            res.status(500).json({
                "success": false,
                "message": checkErr.sqlMessage,
                "data": null
            })
        }else{
            const count= checkResults[0].count;

            if (count > 0) {
                // If username already exists
                res.status(440).json({
                    "success": false,
                    "message": "Tindakan telah terdaftar",
                    "data": null
                });
            } else {
                // If username does not exist, insert new data
                const insertQuery = "INSERT INTO tarif_harga (ID_TARIF_HARGA, ID_DIVISI_LAB, ID_TARIF_NAME, HARGA, PROFESI, MODIFIED_BY, MODIFIED_DATE) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const insertValues = [ID_TARIF_HARGA, ID_DIVISI_LAB, ID_TARIF_NAME, HARGA, PROFESI, MODIFIED_BY, MODIFIED_DATE];

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
    })
})

app.get('/get-tarif-name', function(req,res){
    const queryStr = "SELECT * FROM tarif_name";
    conn.query(queryStr, (err, results)=>{
        if(err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data cabang",
                "data": results
            })
        }
    })
})

app.get('/get-treatment', function(req, res){
    const queryStr = "SELECT * FROM tarif_name";
    conn.query(queryStr, (err, results)=>{
        if(err){
            console.log(err);
            res.errored(err.sqlMessage, res);
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data",
                "data": results
            })
        }
    })
})

app.post('/update-tarif', function(req, res){
    const {ID_DIVISI_LAB, ID_TARIF_HARGA} = req.body

    const queryStr = "UPDATE tarif_harga SET ID_DIVISI_LAB = ? WHERE tarif_harga.ID_TARIF_HARGA = ?";
    const values = [ID_DIVISI_LAB, ID_TARIF_HARGA];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            });
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses mengupdate data",
                "data": results
            });
        }
    });
})

app.post('/tarif-name', function (req, res){
    const param = req.body;
    const ID_TARIF_HARGA = param.ID_TARIF_HARGA;
    const MODIFIED_BY = param.MODIFIED_BY;
    const ID_TARIF_NAME = param.ID_TARIF_NAME;
    const HARGA = param.HARGA;
    const PROFESI = param.PROFESI;
    const now = new Date()

    const queryStr = "INSERT INTO tarif_harga (ID_TARIF_HARGA, ID_TARIF_NAME, HARGA, PROFESI, MODIFIED_BY) VALUES (?, ?, ?, ?, ?)";
    const values = [ID_TARIF_HARGA, ID_TARIF_NAME, HARGA, PROFESI, MODIFIED_BY, now];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menginput data",
                "data": results
            });
        }
    });
})

app.post('/update-pemeriksaan', function(req, res){
    const param = req.body;
    const inisial = param.inisial;
    const namapemeriksaan = param.namaPemeriksaan;
    const harga = param.harga;

    const queryStr = "UPDATE nama_pemeriksaan SET namaPemeriksaan = ?, harga = ? WHERE inisial = ? AND deleted_at IS NULL";
    const values = [namapemeriksaan, harga, inisial];
    
    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        } else{
            res.status(200).json({
                "success": true,
                "message": "Sukses Update",
                "data": results
            });
        }
    });
})

app.get('/get-pemeriksaan-by-inisial', function (req, res){
    const param= req.query;
    const inisial = param.inisial;
    const queryStr = "SELECT * FROM nama_pemeriksaan WHERE deleted_at IS NULL AND inisial= ?";
    const values = [inisial];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);;
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan data",
                "data": results
            });
        }
    });
});

app.post('/delete-pemeriksaan', function (req, res){
    const param = req.body;
    const inisial = param.inisial;
    const now = new Date();

    const queryStr = "UPDATE nama_pemeriksaan SET deleted_at = ? WHERE inisial = ?";
    const values = [now, inisial];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
            "success": false,
            "message": err.sqlMessage,
            "data": null,
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": "Berhasil menghapus data",
                "data": results
            });
        }
    })
});

app.get('/get-pengumpulan', function(req,res){
    const queryStr = "SELECT * FROM data_relasi WHERE deleted_at IS NULL";
    conn.query(queryStr, (err,results)=>{
        if(err){
            res.errored(err.sqlMessage, res);
        }else{
            res.status(200).json({
                "success":true,
                "message": "Sukses menampilkan data",
                "data": results
            })
        }
    })

})

app.post('/pengumpulan', function(req, res){
    console.log(req.body);
    const param = req.body;
    // const id = param.id;
    const id_pemeriksaan = param.id_pemeriksaan;
    const nama_pemeriksaan = param.nama_pemeriksaan;
    const id_tindakan = param.id_tindakan;
    const nama_tindakan = param.nama_tindakan;
    const id_cabang = param.id_cabang;
    const nama_cabang = param.nama_cabang;
    const now = new Date()

    const queryStr = "INSERT INTO tarif (id_pemeriksaan, nama_pemeriksaan, id_tindakan, nama_tindakan, id_cabang, nama_cabang) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [id_pemeriksaan, nama_pemeriksaan, id_tindakan, nama_tindakan, id_cabang, nama_cabang, now];

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
                "message": "Sukses menambahkan data",
                "data": results
            })
        }
    })
});

// app.post('/tarif-name-post', function(req, res){
//     const param = req.body;
//     const ID_TARIF_NAME = param.ID_TARIF_NAME;
//     const TARIF_NAME = param.TARIF_NAME;
//     const IS_ACTIVE = param.IS_ACTIVE;
//     const ID_TREATMENT = param.ID_TREATMENT;
//     const ID_SPECIMEN = param.ID_SPECIMEN;
//     const URUT = param.URUT;
//     const MODIFIED_BY = param.MODIFIED_BY;
//     const MODIFIED_DATE = param.MODIFIED_DATE;
//     const OTHER_ID = param.OTHER_ID;
//     const TARIF_NAME_ENG = param.TARIF_NAME_ENG;
//     const DECLAIMER = param.DECLAIMER;
//     const DECLAIMER_ENG = param.DECLAIMER_ENG;
//     const IS_PUBLISH = param.IS_PUBLISH;
//     const IS_REGPOLI = param.IS_REGPOLI

//     const queryStr = "INSERT INTO tarif_name(ID_TARIF_NAME,TARIF_NAME,IS_ACTIVE,ID_TREATMENT, ID_SPECIMEN, URUT, MODIFIED_BY, MODIFIED_DATE, OTHER_ID, TARIF_NAME_ENG, DECLAIMER, DECLAIMER_ENG, IS_PUBLISH, IS_REGPOLI) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
//     const values = [ID_TARIF_NAME,TARIF_NAME,IS_ACTIVE,ID_TREATMENT, ID_SPECIMEN, URUT, MODIFIED_BY, MODIFIED_DATE, OTHER_ID, TARIF_NAME_ENG, DECLAIMER, DECLAIMER_ENG, IS_PUBLISH, IS_REGPOLI];

//     conn.query(queryStr, values, (err, result)=>{
//         if(err){
//             console.log(err);
//             res.status(500).json({
//                 "success": false,
//                 "message": err.sqlMessage,
//                 "data": null
//             })
//         }else{
//             res.status(200).json({
//                 "success": true,
//                 "message": "Berhasil post data",
//                 "data": result
//             })
//         }
//     })
// })

// app.post('/tarif-name-post', function(req, res){
//     const params = req.body;

//     // Map array params into an array of arrays containing the values
//     const tarifData = params.map(param => [
//         param.ID_TARIF_NAME,
//         param.TARIF_NAME,
//         param.IS_ACTIVE,
//         param.ID_TREATMENT,
//         param.ID_SPECIMEN,
//         param.URUT,
//         param.MODIFIED_BY,
//         param.MODIFIED_DATE,
//         param.OTHER_ID,
//         param.TARIF_NAME_ENG,
//         param.DECLAIMER,
//         param.DECLAIMER_ENG,
//         param.IS_PUBLISH,
//         param.IS_REGPOLI
//     ]);

//     const queryStr = "INSERT INTO tarif_name(ID_TARIF_NAME,TARIF_NAME,IS_ACTIVE,ID_TREATMENT, ID_SPECIMEN, URUT, MODIFIED_BY, MODIFIED_DATE, OTHER_ID, TARIF_NAME_ENG, DECLAIMER, DECLAIMER_ENG, IS_PUBLISH, IS_REGPOLI) VALUES ?";
//     const values = [tarifData];

//     conn.query(queryStr, [values], (err, result)=>{
//         if(err){
//             console.log(err);
//             res.status(500).json({
//                 "success": false,
//                 "message": err.sqlMessage,
//                 "data": null
//             })
//         }else{
//             res.status(200).json({
//                 "success": true,
//                 "message": "Berhasil post data",
//                 "data": result
//             })
//         }
//     })
// })

app.post('/tarif-name-post', function (req, res){
    const param = req.body;
    const ID_TARIF_NAME = param.ID_TARIF_NAME;
    const TARIF_NAME = param.TARIF_NAME;
    const IS_ACTIVE = param.IS_ACTIVE;
    const ID_TREATMENT = param.ID_TREATMENT;
    const ID_SPECIMEN = param.ID_SPECIMEN;
    const URUT = param.URUT;
    const MODIFIED_BY = param.MODIFIED_BY;
    const MODIFIED_DATE = param.MODIFIED_DATE;
    const OTHER_ID = param.OTHER_ID;
    const TARIF_NAME_ENG = param.TARIF_NAME_ENG;
    const DECLAIMER = param.DECLAIMER;
    const DECLAIMER_ENG = param.DECLAIMER_ENG;
    const IS_PUBLISH = param.IS_PUBLISH;
    const IS_REGPOLI = param.IS_REGPOLI

    const queryStr = "INSERT INTO tarif_name(ID_TARIF_NAME,TARIF_NAME,IS_ACTIVE,ID_TREATMENT, ID_SPECIMEN, URUT, MODIFIED_BY, MODIFIED_DATE, OTHER_ID, TARIF_NAME_ENG, DECLAIMER, DECLAIMER_ENG, IS_PUBLISH, IS_REGPOLI) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
    const values = [ID_TARIF_NAME,TARIF_NAME,IS_ACTIVE,ID_TREATMENT, ID_SPECIMEN, URUT, MODIFIED_BY, MODIFIED_DATE, OTHER_ID, TARIF_NAME_ENG, DECLAIMER, DECLAIMER_ENG, IS_PUBLISH, IS_REGPOLI];

    conn.query(queryStr, values, (err, results)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "data": null
            })
        }else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menginput data",
                "data": results
            });
        }
    });
});

app.listen(2345);