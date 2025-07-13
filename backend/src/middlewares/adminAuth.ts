import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

// 拡張リクエスト型
interface AuthRequest extends Request {
  admin?: any;
}

// JWT秘密鍵
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWTトークン生成
export const generateToken = (adminId: string): string => {
  return jwt.sign(
    { id: adminId },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 認証ミドルウェア
export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    // トークンの検証
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // 管理者情報を取得
    const admin = await Admin.findOne({ 
      _id: decoded.id, 
      isActive: true 
    }).select('-password');

    if (!admin) {
      throw new Error();
    }

    // リクエストに管理者情報を追加
    req.admin = admin;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: '認証が必要です'
    });
  }
};

// スーパー管理者のみ許可
export const superAdminOnly = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.admin && req.admin.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'この操作にはスーパー管理者権限が必要です'
    });
  }
};