import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { AppSetting, AppSettingCreate, AppSettingUpdate } from '../../types'; // Import AppSetting and related types
import { Plus, Trash2, Edit } from 'lucide-react'; // Import icons

export default function GlobalSettingsPage() {
    const [settings, setSettings] = useState<AppSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSetting, setEditingSetting] = useState<AppSetting | null>(null);
    const [createForm, setCreateForm] = useState<AppSettingCreate>({ key: '', value: '' });
    const [editForm, setEditForm] = useState<AppSettingUpdate>({});
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            fetchSettings();
        }
    }, [token]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get<AppSetting[]>('/api/v1/admin/settings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSettings(response.data);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/admin/settings/', createForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCreateForm({ key: '', value: '' });
            setShowCreateModal(false);
            fetchSettings();
        } catch (error) {
            console.error('Erro ao criar configuração:', error);
            alert('Erro ao criar configuração. Verifique se a chave já existe.');
        }
    };

    const handleEditClick = (setting: AppSetting) => {
        setEditingSetting(setting);
        setEditForm({ key: setting.key, value: setting.value });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSetting) return;

        try {
            await api.put(`/api/v1/admin/settings/${editingSetting.key}`, editForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowEditModal(false);
            setEditingSetting(null);
            setEditForm({});
            fetchSettings();
        } catch (error) {
            console.error('Erro ao atualizar configuração:', error);
            alert('Erro ao atualizar configuração. Verifique se a chave já existe ou tente novamente.');
        }
    };

    const handleDeleteSetting = async (key: string) => {
        if (!confirm(`Tem certeza que deseja deletar a configuração com a chave "${key}"?`)) return;

        try {
            await api.delete(`/api/v1/admin/settings/${key}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchSettings();
        } catch (error) {
            console.error('Erro ao deletar configuração:', error);
            alert('Erro ao deletar configuração. Verifique os logs para mais detalhes.');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Configurações Globais</h2>
                        <p className="text-gray-600 mt-1">Gerencie as configurações gerais da aplicação</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nova Configuração</span>
                    </button>
                </div>

                {/* Settings Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : settings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">Nenhuma configuração encontrada</p>
                        <p className="text-gray-400 mt-2">As configurações serão listadas aqui</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chave</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {settings.map((setting) => (
                                    <tr key={setting.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{setting.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{setting.key}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{setting.value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditClick(setting)}
                                                className="text-primary-600 hover:text-primary-900 mr-3"
                                            >
                                                <Edit className="w-5 h-5 inline-block align-text-bottom" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSetting(setting.key)}
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

                {/* Create Setting Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Nova Configuração</h3>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="create-key" className="block text-sm font-medium text-gray-700 mb-2">
                                        Chave
                                    </label>
                                    <input
                                        id="create-key"
                                        type="text"
                                        value={createForm.key}
                                        onChange={(e) => setCreateForm({ ...createForm, key: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="create-value" className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor
                                    </label>
                                    <input
                                        id="create-value"
                                        type="text"
                                        value={createForm.value}
                                        onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition"
                                    >
                                        Criar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Setting Modal */}
                {showEditModal && editingSetting && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Editar Configuração</h3>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="edit-key" className="block text-sm font-medium text-gray-700 mb-2">
                                        Chave
                                    </label>
                                    <input
                                        id="edit-key"
                                        type="text"
                                        value={editForm.key || ''}
                                        onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-value" className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor
                                    </label>
                                    <input
                                        id="edit-value"
                                        type="text"
                                        value={editForm.value || ''}
                                        onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
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