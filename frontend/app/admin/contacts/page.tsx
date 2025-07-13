"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  MessageSquare, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Mail,
  Building
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
}

interface ContactsResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [dateFilter, setDateFilter] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  });

  useEffect(() => {
    fetchContacts();
  }, [currentPage, statusFilter, sortOrder, dateFilter]);

  const fetchContacts = async () => {
    try {
      // CSRFトークンを取得
      const csrfResponse = await fetch('/api/csrf/token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();

      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy: 'createdAt',
        order: sortOrder,
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
        ...(dateFilter && { date: dateFilter })
      });

      const response = await fetch(`/api/v1/admin/contacts?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfData.token
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data: ContactsResponse = await response.json();
        setContacts(data.data);
        setPagination(data.pagination);
      } else {
        setError('お問い合わせの取得に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Contacts fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-red-100 text-red-800">
            <Mail className="w-3 h-3 mr-1" />
            未読
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-yellow-100 text-yellow-800">
            <Eye className="w-3 h-3 mr-1" />
            既読
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">お問い合わせ管理</h1>
          <p className="text-gray-600 mt-2">
            総件数: {pagination.total}件 ({pagination.page}/{pagination.pages}ページ)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="会社名、担当者名で検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchContacts();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {dateFilter && (
                <Button
                  onClick={() => {
                    setDateFilter('');
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">全ステータス</option>
              <option value="unread">未読</option>
              <option value="read">既読</option>
              <option value="responded">対応済み</option>
            </select>
            <Button
              onClick={() => {
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                setCurrentPage(1);
              }}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {sortOrder === 'desc' ? '↓ 新しい順' : '↑ 古い順'}
            </Button>
            <Button 
              onClick={fetchContacts}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              検索
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-6 bg-white">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </Card>
        ) : contacts.length === 0 ? (
          <Card className="p-8 bg-white text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">お問い合わせがありません</p>
          </Card>
        ) : (
          contacts.map((contact) => (
            <Card key={contact._id} className="p-6 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contact.companyName}
                    </h3>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-600">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      担当者: {contact.contactName}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {contact.email}
                    </div>
                    <div>
                      業種: {contact.industry}
                    </div>
                    <div>
                      従業員数: {contact.employeeCount}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-base text-gray-600">
                      課題: {contact.challenges.slice(0, 2).join(', ')}
                      {contact.challenges.length > 2 && '...'}
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-3 text-base text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(contact.createdAt)}
                  </div>
                </div>
                
                <div className="ml-6">
                  <Link href={`/admin/contacts/${contact._id}`}>
                    <Button
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      詳細
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className="p-4 bg-white">
          <div className="flex justify-center gap-2">
            {currentPage > 1 && (
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                variant="outline"
                className="text-white"
              >
                前へ
              </Button>
            )}
            
            <span className="px-4 py-2 text-base text-gray-600">
              {currentPage} / {pagination.pages}
            </span>
            
            {currentPage < pagination.pages && (
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                variant="outline"
                className="text-white"
              >
                次へ
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}