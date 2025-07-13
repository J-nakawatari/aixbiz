"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { 
  ArrowLeft, 
  Mail, 
  Building, 
  Users, 
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface Contact {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
  employeeCount: string;
  challenges: string[];
  status: 'unread' | 'read' | 'responded';
  createdAt: string;
  updatedAt: string;
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchContact();
  }, [params.id]);

  const fetchContact = async () => {
    try {
      // CSRFトークンを取得
      const csrfResponse = await fetch('/api/csrf/token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/v1/admin/contacts/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfData.token
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setContact(data.data);
      } else if (response.status === 404) {
        setError('お問い合わせが見つかりません');
      } else {
        setError('お問い合わせの取得に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Contact fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: 'unread' | 'read' | 'responded') => {
    if (!contact) return;
    
    setIsUpdating(true);
    try {
      // CSRFトークンを取得
      const csrfResponse = await fetch('/api/csrf/token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/v1/admin/contacts/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfData.token,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setContact(data.data);
      } else {
        setError('ステータスの更新に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Status update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <Mail className="w-4 h-4 mr-2" />
            未読
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <MessageSquare className="w-4 h-4 mr-2" />
            既読
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            対応済み
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-white">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-red-50 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-700 text-base">{error}</p>
          </div>
          <div className="mt-4">
            <Link href="/admin/contacts">
              <Button variant="outline" className="text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                一覧に戻る
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/contacts">
            <Button variant="outline" className="text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              一覧に戻る
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">お問い合わせ詳細</h1>
        </div>
        {getStatusBadge(contact.status)}
      </div>

      {/* Company Information */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          企業情報
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-base">会社名</p>
            <p className="text-lg font-medium">{contact.companyName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-base">担当者名</p>
            <p className="text-lg font-medium">{contact.contactName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-base">メールアドレス</p>
            <p className="text-lg font-medium">{contact.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-base">業種</p>
            <p className="text-lg font-medium">{contact.industry}</p>
          </div>
          <div>
            <p className="text-gray-600 text-base">従業員数</p>
            <p className="text-lg font-medium">{contact.employeeCount}</p>
          </div>
        </div>
      </Card>

      {/* Challenges */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          課題・要望
        </h2>
        <div className="space-y-2">
          {contact.challenges.map((challenge, index) => (
            <div key={index} className="flex items-start">
              <span className="text-indigo-600 mr-2 text-base">•</span>
              <span className="text-base">{challenge}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Timestamps */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          タイムスタンプ
        </h2>
        <div className="space-y-2">
          <div>
            <p className="text-gray-600 text-base">受信日時</p>
            <p className="text-base">{formatDate(contact.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-base">最終更新</p>
            <p className="text-base">{formatDate(contact.updatedAt)}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">ステータス変更</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => updateStatus('unread')}
            disabled={contact.status === 'unread' || isUpdating}
            variant={contact.status === 'unread' ? 'default' : 'outline'}
            className={contact.status === 'unread' ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-white'}
          >
            未読にする
          </Button>
          <Button
            onClick={() => updateStatus('read')}
            disabled={contact.status === 'read' || isUpdating}
            variant={contact.status === 'read' ? 'default' : 'outline'}
            className={contact.status === 'read' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'text-white'}
          >
            既読にする
          </Button>
          <Button
            onClick={() => updateStatus('responded')}
            disabled={contact.status === 'responded' || isUpdating}
            variant={contact.status === 'responded' ? 'default' : 'outline'}
            className={contact.status === 'responded' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-white'}
          >
            対応済みにする
          </Button>
        </div>
      </Card>
    </div>
  );
}