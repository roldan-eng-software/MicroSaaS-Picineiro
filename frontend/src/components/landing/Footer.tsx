import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-12 px-4">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8 mb-8">
                {/* Brand Info */}
                <div>
                    <h3 className="text-2xl font-bold mb-4">Propiscineiro</h3>
                    <p className="text-gray-400">
                        Sua plataforma completa para gerenciamento de projetos de piscinas. Simplifique, organize e cresça.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Início</a></li>
                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors duration-300">Recursos</a></li>
                        <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors duration-300">Preços</a></li>
                        <li><a href="/login" className="text-gray-400 hover:text-white transition-colors duration-300">Login</a></li>
                        <li><a href="/register" className="text-gray-400 hover:text-white transition-colors duration-300">Registro</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Siga-nos</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                            <Linkedin className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Propiscineiro. Todos os direitos reservados.
            </div>
        </footer>
    );
}
