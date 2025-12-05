import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function PricingSection() {
    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-12">Escolha o Plano Perfeito para Você</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Free Plan */}
                    <div className="flex flex-col p-8 bg-white rounded-lg shadow-md border-2 border-transparent hover:border-primary-500 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Plano Grátis</h3>
                        <p className="text-gray-600 mb-6">Perfeito para começar e experimentar nossos recursos.</p>
                        <div className="text-4xl font-bold text-primary-600 mb-6">
                            R$0<span className="text-xl text-gray-500">/mês</span>
                        </div>
                        <ul className="text-left text-gray-700 space-y-3 mb-8 flex-grow">
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                1 Projeto Ativo
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Até 5 Tarefas por Projeto
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Suporte Básico
                            </li>
                        </ul>
                        <a
                            href="/register"
                            className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                        >
                            Comece Grátis
                        </a>
                    </div>

                    {/* Premium Plan */}
                    <div className="flex flex-col p-8 bg-white rounded-lg shadow-xl border-2 border-primary-500 transform scale-105">
                        <h3 className="text-2xl font-bold text-primary-600 mb-4">Plano Premium</h3>
                        <p className="text-gray-600 mb-6">Para profissionais que precisam de mais poder.</p>
                        <div className="text-4xl font-bold text-primary-600 mb-6">
                            R$49<span className="text-xl text-gray-500">/mês</span>
                        </div>
                        <ul className="text-left text-gray-700 space-y-3 mb-8 flex-grow">
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Projetos Ilimitados
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Tarefas Ilimitadas
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Colaboradores Ilimitados
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Suporte Prioritário
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Relatórios Avançados
                            </li>
                        </ul>
                        <a
                            href="/register"
                            className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                        >
                            Assine Agora
                        </a>
                    </div>

                    {/* Business Plan (Placeholder) */}
                    <div className="flex flex-col p-8 bg-white rounded-lg shadow-md border-2 border-transparent hover:border-primary-500 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Plano Empresarial</h3>
                        <p className="text-gray-600 mb-6">Soluções customizadas para grandes equipes.</p>
                        <div className="text-4xl font-bold text-gray-700 mb-6">
                            R$99<span className="text-xl text-gray-500">/mês</span>
                        </div>
                        <ul className="text-left text-gray-700 space-y-3 mb-8 flex-grow">
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Tudo do Premium
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Treinamento Exclusivo
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                Consultoria Dedicada
                            </li>
                        </ul>
                        <a
                            href="/register"
                            className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                        >
                            Fale Conosco
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
