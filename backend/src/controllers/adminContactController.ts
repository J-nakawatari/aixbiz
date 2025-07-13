import { Request, Response } from 'express';
import Contact from '../models/Contact';

// お問い合わせ一覧取得
export const getContacts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, search, date, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // クエリ条件
    const query: any = {};
    if (status) {
      query.status = status;
    }
    
    // 検索条件（会社名、担当者名）
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // 日付フィルター（指定日の00:00:00から23:59:59まで）
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(date as string);
      endDate.setHours(23, 59, 59, 999);
      
      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // ページネーション計算
    const skip = (Number(page) - 1) * Number(limit);

    // 並び替え設定
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortBy as string]: sortOrder };

    // データ取得
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(skip),
      Contact.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'お問い合わせ一覧の取得に失敗しました'
    });
  }
};

// お問い合わせ詳細取得
export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'お問い合わせが見つかりません'
      });
    }

    // 既読に更新
    if (contact.status === 'unread') {
      contact.status = 'read';
      await contact.save();
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Get contact by id error:', error);
    res.status(500).json({
      success: false,
      message: 'お問い合わせ詳細の取得に失敗しました'
    });
  }
};

// お問い合わせステータス更新
export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '無効なステータスです'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'お問い合わせが見つかりません'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'ステータス更新に失敗しました'
    });
  }
};

// お問い合わせ削除
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'お問い合わせが見つかりません'
      });
    }

    res.json({
      success: true,
      message: 'お問い合わせを削除しました'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'お問い合わせの削除に失敗しました'
    });
  }
};

// 統計情報取得
export const getContactStats = async (req: Request, res: Response) => {
  try {
    const [totalCount, unreadCount, todayCount] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      Contact.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    res.json({
      success: true,
      stats: {
        total: totalCount,
        unread: unreadCount,
        today: todayCount
      }
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: '統計情報の取得に失敗しました'
    });
  }
};