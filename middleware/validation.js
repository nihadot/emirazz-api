import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';


// login validation code
const loginValidation = [
    body('username')
      .trim()
      .isLength({ min: 5, max: 40 })
      .withMessage('Username or email must be between 5 and 40 characters.')
      .matches(/^[a-zA-Z0-9@._]+$/)
      .withMessage("Only letters, numbers, '@', '.', and '_' are allowed.")
      .notEmpty()
      .withMessage('Username or email is required.'),
    
      body('password')
      .trim() // Trim whitespace
      .isLength({ min: 8, max: 12 })
      .withMessage('Password must be at least 8 characters and not exceed 12 characters.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()!_\-+=])[A-Za-z\d@#$%^&*()!_\-+=]{8,12}$/)
      .withMessage('Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (@#$%^&*()!_-+=).')
      .notEmpty()
      .withMessage('Password is required.')
  ];

// create blog validation code
const createBlogValidation = [
    // Blog Title Validation
    body('blogTitle')
      .trim()
      .notEmpty()
      .withMessage('Blog title is required.'),
  
    // Arabic Blog Title Validation
    body('blogTitleAr')
      .notEmpty()
      .withMessage('عنوان المدونة مطلوب.'),
  
    // Blog Description Validation
    body('blogDescription')
      .trim()
      .notEmpty()
      .withMessage('Blog description is required.'),
  
    // Arabic Blog Description Validation
    body('blogDescriptionAr')
      .notEmpty()
      .withMessage('وصف المدونة مطلوب.'),
  
    // Blog Date Validation
    body('blogDate')
      .notEmpty()
      .withMessage('Date is required.')
      .isISO8601()
      .withMessage('Invalid date format.')
      .custom((value) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        if (inputDate < today) {
          throw new Error('Past dates are not allowed.');
        }
        return true;
      }),
  
    // SEO Title Validation
    body('seoTitle')
      .trim()
      .notEmpty()
      .withMessage('SEO meta title is required.'),
  
    // Arabic SEO Title Validation
    body('seoTitleAr')
      .notEmpty()
      .withMessage('عنوان السيو مطلوب.'),
  
    // SEO Description Validation
    body('seoDescription')
      .trim()
      .notEmpty()
      .withMessage('SEO meta description is required.'),
  
    // Arabic SEO Description Validation
    body('seoDescriptionAr')
      .notEmpty()
      .withMessage('وصف السيو مطلوب.'),
  
    // SEO Keywords Validation
    body('seoKeywords')
      .trim()
      .notEmpty()
      .withMessage('SEO keywords are required.'),
  
    // Arabic SEO Keywords Validation
    body('seoKeywordsAr')
      .notEmpty()
      .withMessage('كلمات مفتاحية للسيو مطلوبة.'),
  ];

//   news validation
const NewsValidation = [
    // News Title Validation
    body('newsTitle')
      .trim()
      .notEmpty()
      .withMessage('News title is required.'),
  
    // Arabic News Title Validation
    body('newsTitleAr')
      .notEmpty()
      .withMessage('عنوان الخبر مطلوب.'),
  
    // News Content Validation
    body('newsDescription')
      .trim()
      .notEmpty()
      .withMessage('News content is required.'),
  
    // Arabic News Content Validation
    body('newsDescriptionAr')
      .notEmpty()
      .withMessage('محتوى الخبر مطلوب.'),
  
    // News Date Validation
    body('newsDate')
      .notEmpty()
      .withMessage('Date is required.')
      .isISO8601()
      .withMessage('Invalid date format.')
      .custom((value) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const inputDate = new Date(value).setHours(0, 0, 0, 0);
        if (inputDate < today) {
          throw new Error('Past dates are not allowed.');
        }
        return true;
      }),
  
    // SEO Title Validation
    body('seoTitle')
      .trim()
      .notEmpty()
      .withMessage('SEO meta title is required.'),
  
    // Arabic SEO Title Validation
    body('seoTitleAr')
      .notEmpty()
      .withMessage('عنوان السيو مطلوب.'),
  
    // SEO Description Validation
    body('seoDescription')
      .trim()
      .notEmpty()
      .withMessage('SEO meta description is required.'),
  
    // Arabic SEO Description Validation
    body('seoDescriptionAr')
      .notEmpty()
      .withMessage('وصف السيو مطلوب.'),
  
    // SEO Keywords Validation
    body('seoKeywords')
      .trim()
   
      .notEmpty()
      .withMessage('SEO keywords are required.'),
  
    // Arabic SEO Keywords Validation
    body('seoKeywordsAr')
      .notEmpty()
      .withMessage('كلمات مفتاحية للسيو مطلوبة.'),
  ];



  //   Gallery validation
const GalleryValidation = [
    // Gallery Title Validation
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Gallery title is required.'),
   ];

   
  




  //   Partners validation
const PartnersValidation = [
  // Partners Title Validation
  body('name')
    .trim()
    .matches(/^[a-zA-Z@!# ]+$/)
    .withMessage("Only letters, '@', '!', '#', and spaces are allowed.")
    .isLength({ min: 3, max: 40 })
    .withMessage('Partners title must be between 3 and 40 characters.')
    .notEmpty()
    .withMessage('Partners title is required.'),
 ];



  // Rate limiter to prevent brute force attacks (limit to 5 requests per minute)
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { message: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });




  const ProductValidation = [
    // Product Title Validation
    body('productTitle')
      .trim()
      .notEmpty()
      .withMessage('Product title is required.'),
  
    // Arabic Product Title Validation
    body('productTitleAr')
      .notEmpty()
      .withMessage('عنوان المنتج مطلوب.'),
  
    // Product Description Validation
    body('productDescription')
      .trim()
      .notEmpty()
      .withMessage('Product description is required.'),
  
    // Arabic Product Description Validation
    body('productDescriptionAr')
      .notEmpty()
      .withMessage('وصف المنتج مطلوب.'),
  
    // SEO Title Validation
    body('seoTitle')
      .trim()
      .notEmpty()
      .withMessage('SEO meta title is required.'),
  
    // Arabic SEO Title Validation
    body('seoTitleAr')
      .notEmpty()
      .withMessage('عنوان السيو مطلوب.'),
  
    // SEO Description Validation
    body('seoDescription')
      .trim()
      .notEmpty()
      .withMessage('SEO meta description is required.'),
  
    // Arabic SEO Description Validation
    body('seoDescriptionAr')
      .notEmpty()
      .withMessage('وصف السيو مطلوب.'),
  
    // SEO Keywords Validation
    body('seoKeywords')
      .trim()
      .notEmpty()
      .withMessage('SEO keywords are required.'),
  
    // Arabic SEO Keywords Validation
    body('seoKeywordsAr')
      .notEmpty()
      .withMessage('كلمات مفتاحية للسيو مطلوبة.'),


      body('productDetails')
      .trim()
      .notEmpty()
      .withMessage('Name details are required'),
  
    // Arabic SEO Keywords Validation
    body('productDetailsAr')
      .notEmpty()
      .withMessage("تفاصيل الاسم مطلوبة."),
  ];



  const ContactValidation = [
    // First Name Validation
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required.')
    ,
    
    // Last Name Validation
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required.')
    ,
    
    // Message Validation
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required.')
      .isLength({ min: 10, max: 500 })
      .withMessage('Message must be between 10 and 500 characters long.'),
    
    // Phone Number Validation
    body('phoneNumber')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required.')
      .matches(/^[0-9]{10,15}$/)
      .withMessage('Phone number must contain only numbers and be between 10 and 15 digits.'),
  ];

  export {
    loginValidation,
    loginLimiter,
    createBlogValidation,
    NewsValidation,
    GalleryValidation,
    PartnersValidation,
    ProductValidation,
    ContactValidation
  }