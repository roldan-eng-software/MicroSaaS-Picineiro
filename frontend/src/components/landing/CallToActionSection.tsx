import React from 'react';

export default function CallToActionSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-primary-500 text-white text-center">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold mb-4">Pronto para Transformar Sua Gestão?</h2>
                <p className="text-xl mb-8">
                    Junte-se a centenas de profissionais que já estão otimizando seus projetos com Propiscineiro.
                </p>
                <a
                    href="/register"
                    className="bg-white text-primary-600 hover:bg-gray-100 text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 ease-in-out"
                >
                    Comece Sua Jornada Hoje!
                </a>
            </div>
        </section>
    );
}
