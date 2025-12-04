import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import type { Project } from '../../types';

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get<Project[]>('/projetos/');
            setProjects(response.data);
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projetos/', {
                name: newProjectName,
                description: newProjectDescription,
            });
            setNewProjectName('');
            setNewProjectDescription('');
            setShowModal(false);
            fetchProjects();
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este projeto?')) return;

        try {
            await api.delete(`/projetos/${id}`);
            fetchProjects();
        } catch (error) {
            console.error('Erro ao deletar projeto:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Meus Projetos</h2>
                        <p className="text-gray-600 mt-1">Gerencie seus projetos de piscinas</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Novo Projeto</span>
                    </button>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg">Nenhum projeto criado ainda</p>
                        <p className="text-gray-400 mt-2">Clique em "Novo Projeto" para começar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-gray-500 hover:text-primary-500 transition"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="text-gray-500 hover:text-red-500 transition"
                                            title="Deletar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {project.description && (
                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                )}

                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Criado em {formatDate(project.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Project Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Novo Projeto</h3>

                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Projeto
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Ex: Piscina Residencial"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Descrição (opcional)
                                    </label>
                                    <textarea
                                        id="description"
                                        value={newProjectDescription}
                                        onChange={(e) => setNewProjectDescription(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Descreva seu projeto..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
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
            </div>
        </Layout>
    );
}
