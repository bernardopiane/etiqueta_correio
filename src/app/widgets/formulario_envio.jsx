'use client';

import { CepResponse } from '@/app/data/cep_response.js';

export default function FormularioEnvio({ prefix = "" }) {
    let cepTimeout = null;

    const fetchCep = async (cepValue) => {
        // Clear any existing timeout
        if (cepTimeout) {
            clearTimeout(cepTimeout);
        }

        // Only proceed if CEP has 8 digits (after removing non-digits)
        const cleanCep = cepValue.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            return;
        }

        // Set new timeout to fetch after user stops typing
        cepTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

                if (!response.ok) {
                    throw new Error('Erro ao buscar CEP');
                }

                console.log(response);

                const data = await response.json();

                console.log(data);

                // Check if API returned an error
                if (data.erro) {
                    console.error('CEP não encontrado');
                    return;
                }

                // Use CepResponse class
                const cepData = CepResponse.fromApiResponse(data);

                if (cepData.isValid()) {
                    // Populate form fields with unique IDs
                    document.getElementById(`${prefix}logradouro`).value = cepData.getLogradouro();
                    document.getElementById(`${prefix}bairro`).value = cepData.getBairro();
                    document.getElementById(`${prefix}cidade`).value = cepData.getCidade();
                    document.getElementById(`${prefix}uf`).value = cepData.getUf();

                    // Optional: populate complemento if available
                    if (cepData.complemento) {
                        document.getElementById(`${prefix}complemento`).value = cepData.complemento;
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }, 1000); // Wait 1 second after user stops typing
    };

    const handleCepChange = (e) => {
        fetchCep(e.target.value);
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6">
            {/* cep Field - Own Line */}
            <div className="mb-8">
                <label
                    htmlFor={`${prefix}cep`}
                    className="block text-lg font-bold text-blue-700 mb-2"
                >
                    cep:
                </label>
                <input
                    type="text"
                    id={`${prefix}cep`}
                    name={`${prefix}cep`}
                    required
                    autoFocus
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="00000-000"
                    aria-describedby={`${prefix}cep-help`}
                    onChange={handleCepChange}
                    className="w-full px-4 py-3 border-2 border-blue-600 rounded-lg text-lg font-semibold bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                />
                <p id={`${prefix}cep-help`} className="mt-2 text-sm text-blue-600">
                    Informe o cep (somente números ou no formato 00000-000)
                </p>
            </div>

            {/* Nome/Empresa Field - Full Width */}
            <div className="mb-6">
                <label
                    htmlFor={`${prefix}nome`}
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Nome / Empresa / Promoção:
                </label>
                <input
                    type="text"
                    id={`${prefix}nome`}
                    name={`${prefix}nome`}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
            </div>

            {/* Endereço and Número */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                    <label
                        htmlFor={`${prefix}logradouro`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Endereço:
                    </label>
                    <input
                        type="text"
                        id={`${prefix}logradouro`}
                        name={`${prefix}logradouro`}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
                <div>
                    <label
                        htmlFor={`${prefix}numero`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Número:
                    </label>
                    <input
                        type="number"
                        id={`${prefix}numero`}
                        name={`${prefix}numero`}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
            </div>

            {/* Complemento and Bairro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label
                        htmlFor={`${prefix}complemento`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Complemento:
                    </label>
                    <input
                        type="text"
                        id={`${prefix}complemento`}
                        name={`${prefix}complemento`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
                <div>
                    <label
                        htmlFor={`${prefix}bairro`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Bairro:
                    </label>
                    <input
                        type="text"
                        id={`${prefix}bairro`}
                        name={`${prefix}bairro`}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
            </div>

            {/* Cidade and UF */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                    <label
                        htmlFor={`${prefix}cidade`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Cidade:
                    </label>
                    <input
                        type="text"
                        id={`${prefix}cidade`}
                        name={`${prefix}cidade`}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
                <div>
                    <label
                        htmlFor={`${prefix}uf`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        UF:
                    </label>
                    <input
                        type="text"
                        id={`${prefix}uf`}
                        name={`${prefix}uf`}
                        required
                        maxLength={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 uppercase"
                    />
                </div>
            </div>

            {/* Observações */}
            <div className="mb-6">
                <div>
                    <label
                        htmlFor={`${prefix}observacoes`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Observações:
                    </label>
                    <textarea
                        id={`${prefix}observacoes`}
                        name={`${prefix}observacoes`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
            </div>
        </div>
    );
}
