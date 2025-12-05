import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Droplets, Wrench, FileText, Plus, Trash2, Calendar, DollarSign, Clock } from 'lucide-react';

interface Pool {
    id: number;
    volume: number;
    pool_type: string;
    coating: string;
    depth: string;
}

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Service {
    id: number;
    pool_id: number;
    service_type: string;
    description: string;
    value: string;
    time_spent: string;
    date: string;
}

interface Budget {
    id: number;
    client_id: number;
    items: string;
    total: string;
    status: string;
    validity: string;
    created_at: string;
}

export default function ClientDetails() {
    const { id } = useParams();
    const [client, setClient] = useState<Client | null>(null);
    const [pools, setPools] = useState<Pool[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pools');

    // Forms State
    const [showPoolForm, setShowPoolForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [showBudgetForm, setShowBudgetForm] = useState(false);

    const [newPool, setNewPool] = useState({ volume: '', pool_type: 'alvenaria', coating: '', depth: '' });
    const [newService, setNewService] = useState({ pool_id: '', service_type: 'Manutenção', description: '', value: '', time_spent: '', date: new Date().toISOString().split('T')[0] });
    const [newBudget, setNewBudget] = useState({ items: '', total: '', validity: '' }); // items as JSON string

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [clientRes, poolsRes, servicesRes, budgetsRes] = await Promise.all([
                api.get(`/api/v1/clientes/${id}`),
                api.get(`/api/v1/piscinas/cliente/${id}`),
                api.get(`/api/v1/servicos/`),
                api.get(`/api/v1/orcamentos/`)
            ]);
            setClient(clientRes.data);
            const clientPools = poolsRes.data;
            setPools(clientPools);

            // Filter services for pools belonging to this client
            const poolIds = clientPools.map((p: Pool) => p.id);
            setServices(servicesRes.data.filter((s: Service) => poolIds.includes(s.pool_id)));

            // Filter budgets for this client
            setBudgets(budgetsRes.data.filter((b: Budget) => b.client_id === Number(id)));

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Pools Handlers ---
    const handleCreatePool = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/piscinas/', { ...newPool, client_id: id });
            setShowPoolForm(false);
            setNewPool({ volume: '', pool_type: 'alvenaria', coating: '', depth: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating pool:', error);
        }
    };

    const handleDeletePool = async (poolId: number) => {
        if (!confirm("Tem certeza que deseja deletar esta piscina?")) return;
        try {
            await api.delete(`/api/v1/piscinas/${poolId}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting pool:", error);
        }
    }

    // --- Services Handlers ---
    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/servicos/', newService);
            setShowServiceForm(false);
            setNewService({ pool_id: '', service_type: 'Manutenção', description: '', value: '', time_spent: '', date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (error) {
            console.error('Error creating service:', error);
            alert("Erro ao criar serviço. Verifique se selecionou uma piscina.");
        }
    };

    const handleDeleteService = async (serviceId: number) => {
        if (!confirm("Tem certeza?")) return;
        try {
            await api.delete(`/api/v1/servicos/${serviceId}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // --- Budgets Handlers ---
    const handleCreateBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // For MVP, items is a simple string description
            const payload = {
                client_id: id,
                items: JSON.stringify([{ description: newBudget.items }]), // Mocking JSON structure
                total: newBudget.total,
                validity: newBudget.validity ? new Date(newBudget.validity).toISOString() : null
            };
            await api.post('/api/v1/orcamentos/', payload);
            setShowBudgetForm(false);
            setNewBudget({ items: '', total: '', validity: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating budget:', error);
        }
    };

    const handleDeleteBudget = async (budgetId: number) => {
        if (!confirm("Tem certeza?")) return;
        try {
            await api.delete(`/api/v1/orcamentos/${budgetId}?client_id=${id}`); // sending query param if needed, or check backend logic
            // Backend endpoint: @router.delete("/{budget_id}") ... 
            // Wait, backend budgets.py doesn't have delete endpoint in the file I saw?
            // Checking backend logic: I saw create, read_all, read_one.
            // If delete is missing, I should add it.
            // For now, let's assume it might be missing and check later. 
            // Actually, I should probably check if delete exists in budgets.py.
            // In the previous `implement_backend_api_routers` log, I created it.
            // But let's verify.
            // Re-reading budgets.py content... it was NOT in the viewed file in step 256.
            // I will implement it now if it's unrelated to the button issue, 
            // but the user complained about "Create" buttons.
            // So I will focus on Create first.
        } catch (error) {
            console.error(error);
        }
    };


    if (loading) return <div className="p-8 text-center bg-gray-50 h-full">Carregando detalhes...</div>;
    if (!client) return <div className="p-8 text-center text-red-500 bg-gray-50 h-full">Cliente não encontrado.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link to="/dashboard/clientes" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                    <p className="text-sm text-gray-500">{client.email} • {client.phone}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('pools')}
                        className={`${activeTab === 'pools' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Droplets className="mr-2 h-4 w-4" />
                        Piscinas
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`${activeTab === 'services' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Wrench className="mr-2 h-4 w-4" />
                        Histórico de Serviços
                    </button>
                    <button
                        onClick={() => setActiveTab('budgets')}
                        className={`${activeTab === 'budgets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Orçamentos
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white shadow rounded-lg p-6">

                {/* --- POOLS TAB --- */}
                {activeTab === 'pools' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Piscinas Cadastradas</h3>
                            <button
                                onClick={() => setShowPoolForm(!showPoolForm)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Adicionar Piscina
                            </button>
                        </div>

                        {showPoolForm && (
                            <form onSubmit={handleCreatePool} className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Volume (Litros)</label>
                                        <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newPool.volume} onChange={e => setNewPool({ ...newPool, volume: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newPool.pool_type} onChange={e => setNewPool({ ...newPool, pool_type: e.target.value })}>
                                            <option value="alvenaria">Alvenaria</option>
                                            <option value="fibra">Fibra</option>
                                            <option value="vinil">Vinil</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Revestimento</label>
                                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newPool.coating} onChange={e => setNewPool({ ...newPool, coating: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Profundidade (m)</label>
                                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newPool.depth} onChange={e => setNewPool({ ...newPool, depth: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={() => setShowPoolForm(false)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Salvar</button>
                                </div>
                            </form>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {pools.map(pool => (
                                <div key={pool.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <div className="flex-shrink-0">
                                        <Droplets className="h-10 w-10 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {pool.volume} Litros
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {pool.pool_type} • {pool.coating || 'N/A'}
                                        </p>
                                    </div>
                                    <button onClick={() => handleDeletePool(pool.id)} className="text-red-400 hover:text-red-600 p-2">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            {pools.length === 0 && !showPoolForm && (
                                <div className="col-span-full text-center text-gray-500 py-4 italic">Nenhuma piscina cadastrada ainda.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- SERVICES TAB --- */}
                {activeTab === 'services' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Histórico de Serviços</h3>
                            <button
                                onClick={() => setShowServiceForm(!showServiceForm)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Novo Serviço
                            </button>
                        </div>

                        {showServiceForm && (
                            <form onSubmit={handleCreateService} className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Piscina *</label>
                                        <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newService.pool_id} onChange={e => setNewService({ ...newService, pool_id: e.target.value })}>
                                            <option value="">Selecione...</option>
                                            {pools.map(p => <option key={p.id} value={p.id}>Vol: {p.volume}L - {p.pool_type}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tipo de Serviço</label>
                                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newService.service_type} onChange={e => setNewService({ ...newService, service_type: e.target.value })}>
                                            <option value="Manutenção">Manutenção</option>
                                            <option value="Limpeza">Limpeza</option>
                                            <option value="Reparo">Reparo</option>
                                            <option value="Instalação">Instalação</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newService.value} onChange={e => setNewService({ ...newService, value: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Data</label>
                                        <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newService.date} onChange={e => setNewService({ ...newService, date: e.target.value })} />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                        <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            rows={2}
                                            value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={() => setShowServiceForm(false)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Salvar Serviço</button>
                                </div>
                            </form>
                        )}

                        <div className="flow-root">
                            <ul role="list" className="-my-5 divide-y divide-gray-200">
                                {services.map((service) => (
                                    <li key={service.id} className="py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <Wrench className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {service.service_type}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {service.description}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-sm font-semibold text-gray-900">
                                                R$ {service.value || '0,00'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(service.date).toLocaleDateString()}
                                            </div>
                                            <button onClick={() => handleDeleteService(service.id)} className="text-red-400 hover:text-red-600 p-2">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                                {services.length === 0 && !showServiceForm && (
                                    <div className="text-center py-10 text-gray-500">
                                        <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço registrado</h3>
                                        <p className="mt-1 text-sm text-gray-500">Comece registrando uma manutenção para este cliente.</p>
                                        <div className="mt-6">
                                            <button onClick={() => setShowServiceForm(true)} type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                                Novo Serviço
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {/* --- BUDGETS TAB --- */}
                {activeTab === 'budgets' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Orçamentos</h3>
                            <button
                                onClick={() => setShowBudgetForm(!showBudgetForm)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Novo Orçamento
                            </button>
                        </div>

                        {showBudgetForm && (
                            <form onSubmit={handleCreateBudget} className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Descrição / Itens</label>
                                        <textarea required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            rows={3} placeholder="Descreva os itens do orçamento..."
                                            value={newBudget.items} onChange={e => setNewBudget({ ...newBudget, items: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Valor Total (R$)</label>
                                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newBudget.total} onChange={e => setNewBudget({ ...newBudget, total: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Validade</label>
                                        <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            value={newBudget.validity} onChange={e => setNewBudget({ ...newBudget, validity: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={() => setShowBudgetForm(false)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Salvar Orçamento</button>
                                </div>
                            </form>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {budgets.map((budget) => (
                                <div key={budget.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                                    <div className="flex-shrink-0">
                                        <FileText className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            R$ {budget.total}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {/* Tries to parse JSON description, fallback to raw string */}
                                            {(() => {
                                                try {
                                                    const items = JSON.parse(budget.items);
                                                    return items[0]?.description || budget.items;
                                                } catch {
                                                    return budget.items;
                                                }
                                            })()}
                                        </p>
                                        <p className="text-xs text-blue-500 mt-1">Status: {budget.status}</p>
                                    </div>
                                    {/* No delete button for budgets yet implemented in backend properly? Visual placeholder */}
                                    {/* <button onClick={() => handleDeleteBudget(budget.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2/></button> */}
                                </div>
                            ))}

                            {budgets.length === 0 && !showBudgetForm && (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum orçamento</h3>
                                    <p className="mt-1 text-sm text-gray-500">Crie propostas comerciais para este cliente.</p>
                                    <div className="mt-6">
                                        <button onClick={() => setShowBudgetForm(true)} type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                                            Novo Orçamento
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
