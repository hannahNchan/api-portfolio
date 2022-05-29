const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const tableData = require('./src/fakeTable');

const {
  newDataFromDB,
  getDataFromDB,
  deleteDataFromDB,
  updateDataFromDB,
} = require('./src/db/index');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const host = '0.0.0.0';
const port = 8000;

const messageSuccess = {
  status: 'ok',
  payload: {
    message: 'Database has been updated succesfully'
  }
};

const messageFail = {
  status: 'fail',
  payload: {
    message: 'An error ocurred triyng updated database'
  }
};

const parseCareerData = (data) => {
  const parsedData = data.map(i => {
    return {
      date: i.date,
      content: {
        id: i.id,
        title: i.title,
        subtitle: i.subtitle,
        description: i.description,
        activities: i.activities,
        technologies: i.technologies
      }
    }
  });

  return JSON.stringify({
    payload: parsedData
  })
};

app.get('/endpoint/career', (req, res) => {
  getDataFromDB()
    .then(path => {
      res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      const response = parseCareerData(path);
      res.send(response)
    })
});

app.get('/v1/dataTable/:totalElements?', (req, res) => {
  const response = {
    length: null,
    type: 'comodity',
    status: 'ok',
    payload: []
  };
  if (req.params.totalElements) {
    const {totalElements} = req.params;
    const restTable = tableData.slice(0, totalElements);
    response.length = restTable.length;
    response.payload = restTable;
    return res.send(response);
  }
  response.length = tableData.length;
  response.payload = tableData;
  return res.send(response);
});

app.post('/endpoint/set-career/v1/:id', function (req, res, next) {
  const {id} = req.params;
  const {title, date, subtitle, description, activities, technologies} = req.body;
  const params = {
    id,
    date,
    title,
    subtitle,
    description,
    activities,
    technologies
  };
  updateDataFromDB('career', params)
    .then((response) => {
      if (response) {
        res.status(200).json(messageSuccess);
      } else {
        res.status(200).json(messageFail);
      }
    })
});

app.post('/endpoint/new-set-career/v1', function (req, res, next) {
  const {title, date, subtitle, description, activities, technologies} = req.body;
  const params = {
    date,
    title,
    subtitle,
    description,
    activities,
    technologies
  };
  newDataFromDB('career', params)
    .then((response) => {
      if (response) {
        res.status(200).json(messageSuccess);
      } else {
        res.status(200).json(messageFail);
      }
    })

});

app.get('/endpoint/delete-set-career/v1/:id', function (req, res, next) {
  const {id} = req.params;
  deleteDataFromDB('career', id)
    .then((response) => {
      if (response) {
        res.status(200).json(messageSuccess);
      } else {
        res.status(200).json(messageFail);
      }
    })

});

app.get('/', function(req, res) {
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/health', function(req, res) {
  res.json({success: 'Api is Healthy!', url: req.url});
});

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app