/* IMPORT */
require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();

app.use(formidable());
app.use(cors());

/* MAILGUN CONFIGURATION */
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

/* ROUTES */
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bienvenu sur mon serveur dédié au formulaire",
    });
});

app.post("/", (req, res) => {
    // Les données du formulaire
    const { firstname, lastname, email, subject, message } = req.fields;

    /* CREATION DE L'OBJET DATA */
    const data = {
        from: `${firstname} ${lastname} <${email}>`,
        to: "sengmany.cathy@gmail.com",
        subject: subject,
        text: message,
    };
    console.log(data);
    /* ENVOI DE L'OBJET VIA MAILGUN */
    mailgun.messages().send(data, (error, body) => {
        console.log(body);
        console.log(error);
        if (!error) {
            return res.status(200).json(body);
        }
        res.status(401).json(error);
    });
});

app.listen(process.env.PORT, () => {
    console.log("Server started");
});
