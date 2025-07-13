import { body } from 'express-validator';

export const validateReportRequest = [
  body('industry')
    .trim()
    .notEmpty().withMessage('業種は必須です')
    .isLength({ max: 100 }).withMessage('業種は100文字以内で入力してください')
    .escape(), // XSS対策
  
  body('jobFunction')
    .trim()
    .notEmpty().withMessage('部門は必須です')
    .isLength({ max: 100 }).withMessage('部門は100文字以内で入力してください')
    .escape(),
  
  body('challenges')
    .trim()
    .notEmpty().withMessage('課題は必須です')
    .isLength({ max: 1000 }).withMessage('課題は1000文字以内で入力してください')
    .escape(),
  
  body('companySize')
    .trim()
    .notEmpty().withMessage('企業規模は必須です')
    .isLength({ max: 50 }).withMessage('企業規模は50文字以内で入力してください')
    .escape(),
  
  body('aiExperience')
    .trim()
    .notEmpty().withMessage('AI経験は必須です')
    .isIn(['未導入', '初歩的に使っている', '部分的に試験運用中', '本格運用中'])
    .withMessage('AI経験の値が不正です')
];