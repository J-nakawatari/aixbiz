"use client";

import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Users, 
  Plus, 
  Crown, 
  Shield, 
  Eye, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface AdminsResponse {
  success: boolean;
  admins: Admin[];
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin'
  });
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    // 現在のユーザー情報を取得
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      // CSRFトークンを取得
      const csrfResponse = await fetch('/api/csrf/token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();

      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/v1/admin/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfData.token
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data: AdminsResponse = await response.json();
        setAdmins(data.admins);
      } else {
        setError('管理者一覧の取得に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Admins fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // CSRFトークンを取得
      const csrfResponse = await fetch('/api/csrf/token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();

      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/v1/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfData.token
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setShowAddForm(false);
        setFormData({ username: '', email: '', password: '', role: 'admin' });
        fetchAdmins(); // リストを更新
        alert('管理者を登録しました');
      } else {
        setError(data.message || '管理者登録に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Admin registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      role: admin.role
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    
    setIsLoading(true);

    try {
      // CSRFトークンを取得
      const csrfResponse = await fetch('/api/csrf/token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();

      const token = localStorage.getItem('admin_token');
      const updateData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        isActive: editingAdmin.isActive
      };

      const response = await fetch(`/api/v1/admin/admins/${editingAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfData.token
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        setShowEditForm(false);
        setEditingAdmin(null);
        setFormData({ username: '', email: '', password: '', role: 'admin' });
        fetchAdmins(); // リストを更新
        alert('管理者情報を更新しました');
      } else {
        setError(data.message || '管理者更新に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Admin update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (admin: Admin) => {
    if (!confirm(`管理者「${admin.username}」を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    try {
      // CSRFトークンを取得
      const csrfResponse = await fetch('/api/csrf/token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/v1/admin/admins/${admin._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfData.token
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        fetchAdmins(); // リストを更新
        alert('管理者を削除しました');
      } else {
        setError(data.message || '管理者削除に失敗しました');
      }
    } catch (error) {
      setError('ネットワークエラーが発生しました');
      console.error('Admin delete error:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'super_admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-purple-100 text-purple-800">
          <Crown className="w-3 h-3 mr-1" />
          スーパー管理者
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-blue-100 text-blue-800">
        <Shield className="w-3 h-3 mr-1" />
        管理者
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 mr-1" />
          有効
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium bg-red-100 text-red-800">
        <UserX className="w-3 h-3 mr-1" />
        無効
      </span>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">管理者管理</h1>
          <p className="text-gray-600 mt-2">システム管理者アカウントの管理</p>
        </div>
        
        {currentUser?.role === 'super_admin' && (
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            管理者追加
          </Button>
        )}
      </div>

      {/* Add/Edit Admin Form */}
      {(showAddForm || showEditForm) && currentUser?.role === 'super_admin' && (
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {showEditForm ? '管理者情報編集' : '新規管理者登録'}
          </h3>
          <form onSubmit={showEditForm ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  ユーザー名
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {!showEditForm && (
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    パスワード
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  権限
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'super_admin' })}
                >
                  <option value="admin">管理者</option>
                  <option value="super_admin">スーパー管理者</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {showEditForm ? '更新' : '登録'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="text-white"
                onClick={() => {
                  setShowAddForm(false);
                  setShowEditForm(false);
                  setEditingAdmin(null);
                  setFormData({ username: '', email: '', password: '', role: 'admin' });
                }}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Admins List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-6 bg-white">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
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
        ) : admins.length === 0 ? (
          <Card className="p-8 bg-white text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">管理者が登録されていません</p>
          </Card>
        ) : (
          admins.map((admin) => (
            <Card key={admin._id} className="p-6 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {admin.username}
                    </h3>
                    {getRoleBadge(admin.role)}
                    {getStatusBadge(admin.isActive)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {admin.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      登録日: {formatDate(admin.createdAt)}
                    </div>
                    {admin.lastLogin && (
                      <div className="flex items-center col-span-2">
                        <UserCheck className="w-4 h-4 mr-2" />
                        最終ログイン: {formatDate(admin.lastLogin)}
                      </div>
                    )}
                  </div>
                </div>
                
                {currentUser?.role === 'super_admin' && admin._id !== currentUser?.id && (
                  <div className="ml-6 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white"
                      onClick={() => handleEdit(admin)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white"
                      onClick={() => handleDelete(admin)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}