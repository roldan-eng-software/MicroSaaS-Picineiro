import React from 'react';
import { CheckCircle, Briefcase, DollarSign } from 'lucide-react';

export default function FeaturesSection() {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-12">Recursos Poderosos para Sua Gestão</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <CheckCircle className="w-12 h-12 text-primary-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Gestão Simplificada de Projetos</h3>
                        <p className="text-gray-600">
                            Organize, acompanhe e gerencie todos os seus projetos de piscinas em um único lugar. Tenha controle total do início ao fim.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <Briefcase className="w-12 h-12 text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Colaboração Eficaz</h3>
                        <p className="text-gray-600">
                            Compartilhe projetos com sua equipe, atribua tarefas e mantenha todos na mesma página para maior produtividade.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <DollarSign className="w-12 h-12 text-purple-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">Controle Financeiro</h3>
                        <p className="text-gray-600">
                            Monitore custos, orçamentos e faturamento de cada projeto, garantindo a saúde financeira do seu negócio.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
