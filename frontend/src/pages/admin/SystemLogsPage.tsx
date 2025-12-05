import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function SystemLogsPage() {
    const [logs, setLogs] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [numLines, setNumLines] = useState(200); // Default to last 200 lines
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            fetchLogs();
        }
    }, [token, numLines]); // Re-fetch logs if numLines changes

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/v1/admin/system-logs?last_n_lines=${numLines}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'text', // Expecting plain text response
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Erro ao carregar logs:', error);
            setLogs('Erro ao carregar logs. Verifique o console ou a configuração do backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Logs do Sistema</h2>
                        <p className="text-gray-600 mt-1">Visualize os logs recentes da aplicação</p>
                    </div>
                    <div>
                        <label htmlFor="num-lines" className="sr-only">Número de Linhas</label>
                        <select
                            id="num-lines"
                            value={numLines}
                            onChange={(e) => setNumLines(Number(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value={50}>Últimas 50 linhas</option>
                            <option value={100}>Últimas 100 linhas</option>
                            <option value={200}>Últimas 200 linhas</option>
                            <option value={500}>Últimas 500 linhas</option>
                        </select>
                        <button
                            onClick={fetchLogs}
                            className="ml-3 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition shadow-md"
                        >
                            Atualizar
                        </button>
                    </div>
                </div>

                {/* Log Display */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md overflow-x-auto font-mono text-sm">
                        <pre>{logs || 'Nenhum log disponível ou erro ao carregar.'}</pre>
                    </div>
                )}
            </div>
        </Layout>
    );
}