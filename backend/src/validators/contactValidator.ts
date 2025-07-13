import { body } from 'express-validator';

export const validateContactForm = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('会社名は必須です')
    .isLength({ max: 100 })
    .withMessage('会社名は100文字以内で入力してください'),

  body('contactName')
    .trim()
    .notEmpty()
    .withMessage('ご担当者名は必須です')
    .isLength({ max: 50 })
    .withMessage('ご担当者名は50文字以内で入力してください'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('メールアドレスは必須です')
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),

  body('industry')
    .notEmpty()
    .withMessage('業種を選択してください')
    .isIn(['製造業', '士業', '飲食業', '不動産', '小売業', 'IT・Web', 'その他'])
    .withMessage('無効な業種が選択されています'),

  body('employeeCount')
    .notEmpty()
    .withMessage('従業員数を選択してください')
    .isIn(['1-5名', '6-20名', '21-50名', '51-100名', '101名以上'])
    .withMessage('無効な従業員数が選択されています'),

  body('challenges')
    .isArray({ min: 1 })
    .withMessage('業務課題を1つ以上選択してください'),

  body('challenges.*')
    .isIn([
      '業務効率化が必要',
      '人手不足',
      '顧客対応の改善',
      'データ分析の強化',
      '社内コミュニケーション',
      '書類・文書作成の効率化'
    ])
    .withMessage('無効な業務課題が選択されています')
];