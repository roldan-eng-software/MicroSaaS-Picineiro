import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom'; // Import Link

export default function SuperuserDashboardPage() {
    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Painel do Superusuário</h2>
                        <p className="text-gray-600 mt-1">Gerenciamento de usuários e configurações avançadas</p>
                    </div>
                </div>

                {/* Superuser specific content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Ferramentas de Administração</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>
                            <Link to="/admin/users" className="text-blue-600 hover:underline">Gerenciar Usuários</Link>
                        </li>
                        <li>
                            <Link to="/admin/settings" className="text-blue-600 hover:underline">Configurações Globais</Link>
                        </li>
                        <li>
                            <Link to="/admin/system-logs" className="text-blue-600 hover:underline">Ver Logs do Sistema</Link>
                        </li>
                        <li>Configurações globais da aplicação</li>
                        <li>Configurações globais da aplicação</li>
                        <li>Outras funcionalidades exclusivas de superusuário...</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
