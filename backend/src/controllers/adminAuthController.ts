import { Request, Response } from 'express';
import Admin from '../models/Admin';
import { generateToken } from '../middlewares/adminAuth';
import { validationResult } from 'express-validator';

// 管理者ログイン
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // 管理者を検索
    const admin = await Admin.findOne({ email, isActive: true });
    
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }

    // 最終ログイン時刻を更新
    admin.lastLogin = new Date();
    await admin.save();

    // JWTトークンを生成
    const token = generateToken((admin._id as any).toString());

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'ログイン処理中にエラーが発生しました'
    });
  }
};

// 管理者情報取得
export const getAdminProfile = async (req: any, res: Response) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: '管理者情報が見つかりません'
      });
    }

    res.json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'エラーが発生しました'
    });
  }
};

// 管理者登録（スーパー管理者のみ）
export const registerAdmin = async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password, role = 'admin' } = req.body;

    // メールアドレスの重複チェック
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'このメールアドレスまたはユーザー名は既に使用されています'
      });
    }

    // 新規管理者を作成
    const admin = new Admin({
      username,
      email,
      password,
      role: role === 'super_admin' && req.admin.role === 'super_admin' ? 'super_admin' : 'admin'
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: '管理者を登録しました',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: '管理者登録中にエラーが発生しました'
    });
  }
};

// 管理者一覧取得（スーパー管理者のみ）
export const getAdminList = async (req: any, res: Response) => {
  try {
    const admins = await Admin.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      admins
    });

  } catch (error) {
    console.error('Get admin list error:', error);
    res.status(500).json({
      success: false,
      message: 'エラーが発生しました'
    });
  }
};

// 管理者更新（スーパー管理者のみ）
export const updateAdmin = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, role, isActive } = req.body;

    // 自分自身は編集できない
    if (id === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '自分自身のアカウントは編集できません'
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      { username, email, role, isActive },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: '管理者が見つかりません'
      });
    }

    res.json({
      success: true,
      message: '管理者情報を更新しました',
      admin
    });

  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: '管理者更新中にエラーが発生しました'
    });
  }
};

// 管理者削除（スーパー管理者のみ）
export const deleteAdmin = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // 自分自身は削除できない
    if (id === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '自分自身のアカウントは削除できません'
      });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: '管理者が見つかりません'
      });
    }

    res.json({
      success: true,
      message: '管理者を削除しました'
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: '管理者削除中にエラーが発生しました'
    });
  }
};