"use client";

import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Stats {
  total: number;
  unread: number;
  today: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/v1/admin/contacts/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        setError('統計情報の取得に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Stats fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: '総お問い合わせ数',
      value: stats.total,
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: '未読お問い合わせ',
      value: stats.unread,
      icon: Mail,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      title: '本日のお問い合わせ',
      value: stats.today,
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: '処理済み',
      value: stats.total - stats.unread,
      icon: CheckCircle,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">AI導入ナビゲーター管理画面へようこそ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6 bg-white max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
        <div className="space-y-3">
          <a
            href="/admin/contacts"
            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">お問い合わせ管理</p>
                <p className="text-sm text-gray-600">未読のお問い合わせを確認する</p>
              </div>
            </div>
          </a>
          <a
            href="/admin/users"
            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">管理者管理</p>
                <p className="text-sm text-gray-600">管理者アカウントを管理する</p>
              </div>
            </div>
          </a>
        </div>
      </Card>
    </div>
  );
}