var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var ethers = require('ethers');
const { ethers, JsonRpcProvider } = require('ethers');


const axios = require('axios');
const { Readable } = require('stream');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const connectDatabase = require("./database/connection");
const userRouter = require("./routers/userRouter");

connectDatabase();


// var provider = ethers.getDefaultProvider('');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// (async () => {
var app = express();
app.set('port', process.env.PORT || 9000);
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors()); 
app.use(express.json());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/user", userRouter);

const { int, string } = require('hardhat/internal/core/params/argumentTypes');


require('dotenv').config();
 
let abi = require('./artifacts/contracts/medicine.sol/MedicineManager.json').abi;
// const provider = new ethers.getDefaultProvider(
//   process.env.PROVIDER_URL
// );
const provider = new JsonRpcProvider("http://127.0.0.1:7545");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

/* GET home page. */
app.get('/', function (req, res, next) {
  res.json({ title: 'Express' });
});

app.post('/addNumber', async function (req, res, next) {
  try {
    console.log(req.body);

    // console.log("contract", contract);
    const tx = await contract.store(req.body.value);
    // console.log("tx", tx);
    res.status(200).json(tx);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get('/getNumber', async function (req, res, next) {
  try {
    console.log(req.body);
    const tx = await contract.retrieve();
    res.status(200).json({ value: Number(tx) });
  } catch (err) {
    res.status(404).send(err);
  }
});


app.listen(app.get('port'), () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('Press CTRL-C to stop\n');
});




// Main Code

app.get('/test', async function (req, res, next) {
  console.log("TEST");
  res.status(200).send({image: imageUrl});
});

app.post('/addMedicine', async function (req, res, next) {
    try {
      // Extracting parameters from the request body
      console.log(req.body);
      const { id, name, manufacturerName, manufacturerAddress, supplierId, manufacturingDate, expiryDate, mrp, quantity, temperature } = req.body;

      // Calling the addMedicine function of the contract
      const tx = await contract.addMedicine(
        id,
        name,
        manufacturerName,
        manufacturerAddress,
        supplierId,
        manufacturingDate,
        expiryDate,
        mrp,
        quantity,
        temperature
      );  

    const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(`${process.env.FRONTEND_LINK}/${id}`);
    // const qrResponse = await axios.get(qrApiUrl);
    
    const response = await axios.get(qrApiUrl, {
        responseType: 'arraybuffer', // Ensure binary response
        headers: {
            'Content-Type': 'image/png', // Set content type
            // Add any other headers if needed
        },
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    const { hash, to, from, nonce, gasLimit, maxFeePerGas, chainId } = tx;

      // Sending the response with extracted fields
      res.status(200).send({
          image: imageUrl,
          hash: hash,
          to: to,
          from: from,
          nonce: nonce,
          gasLimit: gasLimit.toString(),
          maxFeePerGas: maxFeePerGas.toString(),
          chainId: chainId.toString()
      });
    } catch (err) {
      console.error('Error adding medicine:', err);
      res.status(500).send(err.message || 'Internal Server Error');
    }
  });

  app.post('/addSupplier/:id', async function (req, res, next) {
    try {
        const { id } = req.params; // Extract the medicine ID from the URL
        const { supplierId, temperature } = req.body; // Extract the supplier ID from the request body
        console.log("Medicine ID: ", id);
        console.log("Supplier ID: ", supplierId);

        // Call the updateMedicineSupplier function of the contract
        await contract.updateMedicineSupplier(parseInt(id), supplierId, parseInt(temperature));

        res.status(200).send({"message": "Supplier ID added successfully."});
    } catch (err) {
        console.error('Error adding supplier ID:', err);
        res.status(500).send({"error": "Failed to add supplier ID."});
    }
});
  
  app.get('/getMedicine/:index', async function (req, res, next) {
    try {
      const index = req.params.index;
      console.log(index);
      // Calling the getMedicine function of the contract
      const medicine = await contract.getMedicine(parseInt(index));
  
      const {
        id,
        name,
        manufacturerName,
        manufacturerAddress,
        manufacturingDate,
        expiryDate,
        mrp,
        quantity,
        temperatures,
        suppliers
      } = medicine;

      const parsedTemperatures = temperatures.map(temp => parseInt(temp.toString()));
  
      // Convert BigInt values to strings or numbers
      const parsedMedicine = {
        id: id.toString(),
        name,
        manufacturerName,
        manufacturerAddress,
        manufacturingDate: Number(manufacturingDate), // Convert BigInt to number
        expiryDate: Number(expiryDate), // Convert BigInt to number
        mrp: mrp.toString(),
        quantity: quantity.toString(),
        temperature: parsedTemperatures,
        suppliers: suppliers
      };
  
      // Sending the medicine details as response
      console.log("HERE ", parsedMedicine);
      res.status(200).send({
        id: id.toString(),
        name,
        manufacturerName,
        manufacturerAddress,
        manufacturingDate: Number(manufacturingDate), // Convert BigInt to number
        expiryDate: Number(expiryDate), // Convert BigInt to number
        mrp: mrp.toString(),
        quantity: quantity.toString(),
        temperature: parsedTemperatures,
        suppliers: suppliers
      });
    } catch (err) {
      console.error('Error fetching medicine:', err);
      res.status(500).send({"error":"Invalid Input Passed"});
    }
  });

  app.get('/getSupplierMedicines/:supplierId', async function (req, res, next) {
    try {
      const supplierId = req.params.supplierId;
      console.log(supplierId);
      // Calling the getMedicine function of the contract
      const medicines = await contract.getMedicinesBySupplierId(supplierId);

      const parsedmedicineIds = medicines.map(temp => parseInt(temp.toString()));

      console.log("Medicines : ", parsedmedicineIds);
      res.status(200).send({ medicines: parsedmedicineIds });
    } catch (err) {
      console.error('Error fetching medicine:', err);
      res.status(500).send({"error":"Invalid Input Passed"});
    }
  });
  
  
  app.get('/create-qr', async function (req, res, next) {
    try {
      // Call the QR code generation API
      const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(req.query.value);
      const qrResponse = await axios.get(qrApiUrl, { responseType: 'arraybuffer' });
  
      // Respond with the generated QR code
      res.setHeader('Content-Type', 'image/png'); // Set the response content type
      res.status(200).send(qrResponse.data); // Send the generated QR code as response
    } catch (err) {
      console.error('Error generating QR code:', err);
      res.status(500).send('Internal Server Error');
    }
  });

