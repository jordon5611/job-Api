require('dotenv').config();
require('express-async-errors');

//Extra Security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const express = require('express');
const app = express();

// connectDb
const connectDb = require('./db/connect');

//Authenticataion
const authenticateUser = require('./middleware/authentication')

//  Routers

const AuthRouter = require('./routes/auth');
const JobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { stackTraceLimit } = require('./errors/custom-api');

app.set('trust proxy', 1);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})

// extra packages

// routes
app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/jobs', authenticateUser, JobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
