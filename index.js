import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDataBase } from './connection/index.js';

// Import Routes
import adminRouter from './routes/admin.js';
import blogsRouter from './routes/blogs.js';
import newsRouter from './routes/news.js';
import galleryRouter from './routes/gallery.js';
import partnersRoute from './routes/partners.js';
import productsRouter from "./routes/products.js"
import contactUsRouter from './routes/contactUs.js';

// Initialize Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate Required Environment Variables
if (!process.env.PORT) {
  console.error('Error: PORT is not defined in the .env file.');
  process.exit(1);
}

// Connect to Database
connectDataBase()

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  origin:['http://localhost:5173','http://10.0.14.253:5174','http://10.0.14.253:5174/','*','http://10.0.15.87:5174','http://10.0.15.87:5174/','http://192.168.18.100:5174','http://192.168.18.100:5174/','http://localhost:5174','https://emirazz-api.onrender.com/api/v1','https://emirazz-api.onrender.com/api/v1/'],
  credentials:true,
}))
app.use(morgan('dev')); // Logging middleware
app.use('/api/v1', express.static('uploads'));

// Utility to Wrap Async Functions
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Define Routes
app.use('/api/v1/auth/admin', adminRouter);
app.use('/api/v1/blogs', blogsRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/partners', partnersRoute);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/contact-us', contactUsRouter);
// app.post('/api/v1/refresh', (req, res) => {
//   console.log('first')
//  res.cookie('','',{
//     expires
//   })
//   return true
//   const refreshToken = req.cookies.refreshToken; // Or retrieve it from another secure storage
//   if (!refreshToken) return res.status(401).json({ message: "Refresh token missing!" });

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//       if (err) return res.status(403).json({ message: "Refresh token is invalid!" });

//       const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
//       res.json({ accessToken: newAccessToken });
//   });
// });
// Root Endpoint
app.get(
  '/api/v1',
  asyncHandler(async (req, res) => {
    res.status(200).send('<h1>Server is Working Fine</h1>');
  })
);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
  console.log(`API is available at: http://localhost:${PORT}/api/v1`);
});
