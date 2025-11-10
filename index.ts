const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/lib/swagger'); 
const { connectDB } = require('./config/db');
const cookieParser = require('cookie-parser')


const job = require('./src/lib/cron')

const {app,server} = require('./src/lib/socket')


import { Response as ApiResponse } from "express";

const authRoutes = require('./src/v1/auth/auth.route')
const conversationRoutes = require('./src/v1/conversation/conversation.route')
const userRoutes = require('./src/v1/user/user.route')
const storyRoutes = require('./src/v1/story/story.route')

dotenv.config();


const PORT = process.env.PORT || 5000;



// Swagger
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
job.start();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(cookieParser())
app.use(helmet());
app.use(morgan('dev'));

// Example root route
app.get('/', (req: ApiResponse, res:ApiResponse) => {
  return res.status(200).json( { message: 'Welcome to the API' });
});

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/conversation', conversationRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/storys', userRoutes)


app.use('*', (req: ApiResponse, res: ApiResponse) => {
  return res.status(404).json({ message: 'Route not found'});
});

// Start server
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Documentation is at localhost:${PORT}/api/v1/docs`)
  console.log(`✅ Server is running at port ${PORT}`);
});
