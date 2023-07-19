const conectToMongoDb = require('./db/conn.js')
const express = require('express')
const app = express()
const cors = require('cors')
const PORT=process.env.PORT || 3000
conectToMongoDb();


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth",require('./routes/auth.js'))
app.use("/api/notes",require('./routes/notesRoutes.js'))
app.listen(PORT, () => {
    console.log('Example app listening on port 3000!')
    }
)