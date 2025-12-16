import express from 'express'
const app = express();

const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Backend is running well'
    })
})


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}) 