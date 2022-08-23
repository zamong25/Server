const express = require("express");
const app = express();
const cors = require("cors");
const { Client } = require("pg");
// const dbInfo = require("../DB/dbInfo");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbInfo = {
  user: "vyooreyzsmppzy",
  password: "d56ccad697f3f9782cb71c727691d386aeec125c611b3b83ecc357a7e3a6cf8c",
  port: 5432,
  host: "ec2-52-207-15-147.compute-1.amazonaws.com",
  database: "d24vq1cjc7o72d",
  ssl: { rejectUnauthorized: false },
};

app.get("/", (req, res) => {
  res.send("Success");
});

app.get("/kor", (req, res) => {
  res.send("안녕하세요");
});

app.get("/eng", (req, res) => {
  res.send("Hello");
});

// app.get("/jap", (req, res) => {
//   res.send("おはよう！");
// });

app.get("/language_all/", (req, res) => {
  const client = new Client(dbInfo);
  client.connect();
  client.query('SELECT language, msg FROM public."Language"', (err, result) => {
    res.send(result.rows);
  });
});

app.post("/reg", (req, res) => {
  const lan = req.body.lan;
  const msg = req.body.msg;

  console.log(lan);

  const client = new Client(dbInfo);
  client.connect();
  client.query(
    'INSERT INTO public."Language" VALUES ($1 ,$2)',
    [lan, msg],
    (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.send("OK");
      }
    }
  );
});

app.post("/del", (req, res) => {
  const item = req.body.item;
  console.log(item);

  const client = new Client(dbInfo);
  client.connect();
  client.query(
    'DELETE FROM public."Language" WHERE language = $1',
    [item],
    (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.send("OK");
      }
    }
  );
});

app.post("/update", (req, res) => {
  const lan = req.body.lan;
  const msg = req.body.msg;
  const selectedItem = req.body.selectedItem;

  const client = new Client(dbInfo);
  client.connect();
  client.query(
    'UPDATE public."Language" SET language=$1, msg=$2 WHERE language=$3',
    [lan, msg, selectedItem],
    (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.send("OK");
      }
    }
  );
});

app.get("/language/:lan", (req, res) => {
  const lan = req.params.lan;
  const client = new Client(dbInfo);
  client.connect();
  client.query(
    'SELECT language, msg FROM public."Language" WHERE language = $1',
    [lan],
    (err, result) => {
      res.send(result.rows);
    }
  );
});

app.post("/language/", (req, res) => {
  const lan = req.body.lan;
  const msg1 = req.body.msg;

  let msg = "";

  const client = new Client(dbInfo);
  client
    .connect()
    .then(() => {
      console.log("connection ok");
    })
    .catch((err) => {
      console.log("error", err);
    });

  client.query(
    'SELECT msg FROM public."Language" WHERE language = $1',
    [lan],
    (err, result) => {
      console.log(result.rowCount);

      if (err) {
        console.log("Error", err);
      } else {
        if (result.rowCount == 0) {
          client.query(
            'INSERT INTO public."Language" VALUES ($1 ,$2)',
            [lan, msg1],
            (err, result) => {
              if (err) {
                console.log("Error", err);
              } else {
                client.query(
                  'SELECT msg FROM public."Language" WHERE language = $1',
                  [lan],
                  (err, result) => {
                    res.send(result.rows[0].msg);
                  }
                );
              }
            }
          );
        } else {
          res.send(result.rows[0].msg);
        }
      }
    }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Start Server On Port 3000");
});
