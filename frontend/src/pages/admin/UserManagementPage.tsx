import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { User, UserUpdate } from '../../types'; // Import UserUpdate
import { Plus, Trash2, Edit } from 'lucide-react'; // Import icons

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<UserUpdate>({}); // Use UserUpdate for form state
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get<User[]>('/api/v1/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setEditForm({ email: user.email, username: user.username, is_superuser: user.is_superuser });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            await api.put(`/api/v1/admin/users/${editingUser.id}`, editForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowEditModal(false);
            setEditingUser(null);
            setEditForm({});
            fetchUsers(); // Recarrega a lista de usuários
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar usuário. Verifique se o username/email já existem ou tente novamente.');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

        try {
            await api.delete(`/api/v1/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchUsers(); // Recarrega a lista de usuários
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            alert('Erro ao deletar usuário. Verifique os logs para mais detalhes.');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
                        <p className="text-gray-600 mt-1">Visão geral e controle de todos os usuários do sistema</p>
                    </div>
                    <button
                        // TODO: Adicionar funcionalidade para criar novo usuário
                        className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Novo Usuário</span>
                    </button>
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">Nenhum usuário encontrado</p>
                        <p className="text-gray-400 mt-2">Os usuários serão listados aqui</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Superuser</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.is_superuser ? 'Sim' : 'Não'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-primary-600 hover:text-primary-900 mr-3"
                                            >
                                                <Edit className="w-5 h-5 inline-block align-text-bottom" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-5 h-5 inline-block align-text-bottom" />
                                                Deletar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditModal && editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Editar Usuário</h3>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <input
                                        id="edit-username"
                                        type="text"
                                        value={editForm.username || ''}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="edit-email"
                                        type="email"
                                        value={editForm.email || ''}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="edit-is-superuser"
                                        type="checkbox"
                                        checked={editForm.is_superuser || false}
                                        onChange={(e) => setEditForm({ ...editForm, is_superuser: e.target.checked })}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="edit-is-superuser" className="ml-2 block text-sm text-gray-900">
                                        É Superusuário
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nova Senha (deixe em branco para não alterar)
                                    </label>
                                    <input
                                        id="edit-password"
                                        type="password"
                                        value={editForm.password || ''}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="**********"
                                    />
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition"
                                    >
                                        Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}