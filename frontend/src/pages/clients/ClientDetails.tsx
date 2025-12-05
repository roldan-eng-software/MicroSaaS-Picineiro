import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Droplets, Wrench, FileText, Plus, Trash2, Calendar, DollarSign, Clock, Eye, X, Pencil } from 'lucide-react';

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
    ph?: string;
    chlorine?: string;
    alkalinity?: string;
    remarks?: string;
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
    const [newService, setNewService] = useState({
        pool_id: '',
        service_type: 'Manutenção',
        description: '',
        value: '',
        time_spent: '',
        date: new Date().toISOString().split('T')[0],
        ph: '',
        chlorine: '',
        alkalinity: '',
        remarks: ''
    });
    const [newBudget, setNewBudget] = useState({ items: '', total: '', validity: '' }); // items as JSON string

    // Detail Modal State
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

    // Edit State
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

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
    const handleCreateOrUpdateService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingService) {
                await api.put(`/api/v1/servicos/${editingService.id}`, newService);
                setEditingService(null);
            } else {
                await api.post('/api/v1/servicos/', newService);
            }
            setShowServiceForm(false);
            setNewService({ pool_id: pools.length > 0 ? pools[0].id.toString() : '', service_type: 'Manutenção', description: '', value: '', time_spent: '', date: new Date().toISOString().split('T')[0], ph: '', chlorine: '', alkalinity: '', remarks: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving service:', error);
            alert("Erro ao salvar serviço. Verifique os dados.");
        }
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setNewService({
            pool_id: service.pool_id.toString(),
            service_type: service.service_type,
            description: service.description || '',
            value: service.value || '',
            time_spent: service.time_spent || '',
            date: service.date.split('T')[0],
            ph: service.ph || '',
            chlorine: service.chlorine || '',
            alkalinity: service.alkalinity || '',
            remarks: service.remarks || ''
        });
        setShowServiceForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEditService = () => {
        setEditingService(null);
        setNewService({ pool_id: pools.length > 0 ? pools[0].id.toString() : '', service_type: 'Manutenção', description: '', value: '', time_spent: '', date: new Date().toISOString().split('T')[0], ph: '', chlorine: '', alkalinity: '', remarks: '' });
        setShowServiceForm(false);
    }

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
    const handleCreateOrUpdateBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let itemsPayload = newBudget.items;
            try {
                JSON.parse(newBudget.items);
            } catch {
                itemsPayload = JSON.stringify([{ description: newBudget.items }]);
            }

            const payload = {
                client_id: id,
                items: itemsPayload,
                total: newBudget.total,
                validity: newBudget.validity ? new Date(newBudget.validity).toISOString() : null
            };

            if (editingBudget) {
                await api.put(`/api/v1/orcamentos/${editingBudget.id}`, payload);
                setEditingBudget(null);
            } else {
                await api.post('/api/v1/orcamentos/', payload);
            }

            setShowBudgetForm(false);
            setNewBudget({ items: '', total: '', validity: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    const handleEditBudget = (budget: Budget) => {
        setEditingBudget(budget);

        let displayItems = budget.items;
        try {
            const parsed = JSON.parse(budget.items);
            if (Array.isArray(parsed) && parsed.length > 0) {
                displayItems = parsed.map((i: any) => i.description).join('\n');
            }
        } catch { }

        setNewBudget({
            items: displayItems,
            total: budget.total,
            validity: budget.validity ? budget.validity.split('T')[0] : ''
        });
        setShowBudgetForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEditBudget = () => {
        setEditingBudget(null);
        setNewBudget({ items: '', total: '', validity: '' });
        setShowBudgetForm(false);
    }

    const handleDeleteBudget = async (budgetId: number) => {
        if (!confirm("Tem certeza?")) return;
        try {
            await api.delete(`/api/v1/orcamentos/${budgetId}`);
            fetchData();
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
                            <form onSubmit={handleCreateOrUpdateService} className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">{editingService ? 'Editar Serviço' : 'Registrar Novo Serviço'}</h3>
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

                                    {/* Chemical Parameters */}
                                    <div className="sm:col-span-2 grid grid-cols-3 gap-4 border-t pt-4">
                                        <h4 className="col-span-3 text-sm font-medium text-gray-900 mb-2">Parâmetros Químicos</h4>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">pH</label>
                                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                value={newService.ph} onChange={e => setNewService({ ...newService, ph: e.target.value })}
                                                placeholder="7.2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cloro (ppm)</label>
                                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                value={newService.chlorine} onChange={e => setNewService({ ...newService, chlorine: e.target.value })}
                                                placeholder="3.0" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Alcalinidade (ppm)</label>
                                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                value={newService.alkalinity} onChange={e => setNewService({ ...newService, alkalinity: e.target.value })}
                                                placeholder="100" />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Observações Técnicas</label>
                                        <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            rows={2}
                                            value={newService.remarks}
                                            onChange={e => setNewService({ ...newService, remarks: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={handleCancelEditService} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{editingService ? 'Atualizar' : 'Salvar'}</button>
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
                                            <div className="text-sm text-gray-500 text-right">
                                                <div>{new Date(service.date).toLocaleDateString()}</div>
                                                {(service.ph || service.chlorine) && (
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        pH: {service.ph || '-'} | Cl: {service.chlorine || '-'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => setSelectedService(service)} className="text-gray-400 hover:text-blue-600 p-2" title="Ver Detalhes">
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleEditService(service)} className="text-blue-400 hover:text-blue-600 p-2" title="Editar">
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDeleteService(service.id)} className="text-red-400 hover:text-red-600 p-2" title="Excluir">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
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
                            <form onSubmit={handleCreateOrUpdateBudget} className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">{editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}</h3>
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
                                    <button type="button" onClick={handleCancelEditBudget} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">{editingBudget ? 'Atualizar' : 'Salvar'}</button>
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

                                    <button onClick={() => setSelectedBudget(budget)} className="text-gray-400 hover:text-blue-600 p-2" title="Ver Detalhes">
                                        <Eye className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleEditBudget(budget)} className="text-blue-400 hover:text-blue-600 p-2" title="Editar">
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDeleteBudget(budget.id)} className="text-red-400 hover:text-red-600 p-2" title="Excluir">
                                        <Trash2 className="h-5 w-5" />
                                    </button>

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
            {/* Service Detail Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedService(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={() => setSelectedService(null)}>
                                    <span className="sr-only">Fechar</span>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Detalhes do Serviço</h3>
                                    <div className="mt-4 border-t border-gray-200 pt-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Tipo</p>
                                                <p className="text-sm text-gray-900">{selectedService.service_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Data</p>
                                                <p className="text-sm text-gray-900">{new Date(selectedService.date).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Valor</p>
                                                <p className="text-sm text-gray-900">R$ {selectedService.value || '0,00'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Tempo Gasto</p>
                                                <p className="text-sm text-gray-900">{selectedService.time_spent || '-'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Parâmetros Químicos</p>
                                            <div className="bg-gray-50 rounded p-3 grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <span className="block text-xs text-gray-500">pH</span>
                                                    <span className="font-medium">{selectedService.ph || '-'}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-500">Cloro</span>
                                                    <span className="font-medium">{selectedService.chlorine || '-'}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-500">Alcalinidade</span>
                                                    <span className="font-medium">{selectedService.alkalinity || '-'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Descrição</p>
                                            <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedService.description || '-'}</p>
                                        </div>

                                        {selectedService.remarks && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Observações Técnicas</p>
                                                <p className="text-sm text-gray-900 mt-1 bg-yellow-50 p-2 rounded text-yellow-800">{selectedService.remarks}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setSelectedService(null)}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Budget Detail Modal */}
            {selectedBudget && (
                <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedBudget(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={() => setSelectedBudget(null)}>
                                    <span className="sr-only">Fechar</span>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Detalhes do Orçamento</h3>
                                    <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {selectedBudget.status}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Validade: {selectedBudget.validity ? new Date(selectedBudget.validity).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Itens / Descrição</p>
                                            <div className="mt-2 bg-gray-50 rounded p-3 text-sm text-gray-900 whitespace-pre-wrap font-mono">
                                                {/* Try to parse JSON or show raw */}
                                                {(() => {
                                                    try {
                                                        const items = JSON.parse(selectedBudget.items);
                                                        return Array.isArray(items)
                                                            ? items.map((i: any, idx: number) => `- ${i.description}`).join('\n')
                                                            : JSON.stringify(items, null, 2);
                                                    } catch {
                                                        return selectedBudget.items;
                                                    }
                                                })()}
                                            </div>
                                        </div>

                                        <div className="flex justify-end border-t pt-3">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Total</p>
                                                <p className="text-xl font-bold text-gray-900">R$ {selectedBudget.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setSelectedBudget(null)}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
