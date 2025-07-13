import express from 'express';
import { adminAuth, superAdminOnly } from '../middlewares/adminAuth';
import { globalRateLimiter } from '../middlewares/rateLimiter';
import { body } from 'express-validator';
import {
  adminLogin,
  getAdminProfile,
  registerAdmin,
  getAdminList,
  updateAdmin,
  deleteAdmin
} from '../controllers/adminAuthController';
import {
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
} from '../controllers/adminContactController';

const router = express.Router();

// ===============================
// 認証関連
// ===============================

// ログイン（レート制限強化）
router.post(
  '/auth/login',
  globalRateLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('有効なメールアドレスを入力してください'),
    body('password').notEmpty().withMessage('パスワードを入力してください')
  ],
  adminLogin
);

// プロフィール取得
router.get(
  '/auth/profile',
  adminAuth,
  getAdminProfile
);

// 管理者登録（スーパー管理者のみ）
router.post(
  '/auth/register',
  adminAuth,
  superAdminOnly,
  [
    body('username').isLength({ min: 3, max: 30 }).withMessage('ユーザー名は3-30文字で入力してください'),
    body('email').isEmail().normalizeEmail().withMessage('有効なメールアドレスを入力してください'),
    body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上で入力してください'),
    body('role').optional().isIn(['admin', 'super_admin']).withMessage('無効な権限です')
  ],
  registerAdmin
);

// 管理者一覧（スーパー管理者のみ）
router.get(
  '/admins',
  adminAuth,
  superAdminOnly,
  getAdminList
);

// 管理者更新（スーパー管理者のみ）
router.put(
  '/admins/:id',
  adminAuth,
  superAdminOnly,
  [
    body('username').isLength({ min: 3, max: 30 }).withMessage('ユーザー名は3-30文字で入力してください'),
    body('email').isEmail().normalizeEmail().withMessage('有効なメールアドレスを入力してください'),
    body('role').optional().isIn(['admin', 'super_admin']).withMessage('無効な権限です'),
    body('isActive').optional().isBoolean().withMessage('有効/無効は真偽値で指定してください')
  ],
  updateAdmin
);

// 管理者削除（スーパー管理者のみ）
router.delete(
  '/admins/:id',
  adminAuth,
  superAdminOnly,
  deleteAdmin
);

// ===============================
// お問い合わせ管理
// ===============================

// お問い合わせ一覧
router.get(
  '/contacts',
  adminAuth,
  getContacts
);

// お問い合わせ統計
router.get(
  '/contacts/stats',
  adminAuth,
  getContactStats
);

// お問い合わせ詳細
router.get(
  '/contacts/:id',
  adminAuth,
  getContactById
);

// お問い合わせステータス更新
router.patch(
  '/contacts/:id/status',
  adminAuth,
  [
    body('status').isIn(['unread', 'read', 'responded']).withMessage('無効なステータスです')
  ],
  updateContactStatus
);

// お問い合わせ削除（スーパー管理者のみ）
router.delete(
  '/contacts/:id',
  adminAuth,
  superAdminOnly,
  deleteContact
);

export default router;