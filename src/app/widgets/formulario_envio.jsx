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
        <div
            className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-subtle grid gap-6"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,.05)' }}
        >
            {/* CEP */}
            <div className="grid gap-2">
                <label htmlFor={`${prefix}cep`} className="text-sm font-semibold text-slate-700">
                    CEP
                </label>
                <input
                    id={`${prefix}cep`}
                    name={`${prefix}cep`}
                    type="text"
                    required
                    autoFocus
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="00000-000"
                    onChange={handleCepChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                     placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <span className="text-xs text-slate-500">Somente números ou formato 00000-000</span>
            </div>

            {/* Nome / Empresa */}
            <div className="grid gap-2">
                <label htmlFor={`${prefix}nome`} className="text-sm font-semibold text-slate-700">
                    Nome / Empresa / Promoção
                </label>
                <input
                    id={`${prefix}nome`}
                    name={`${prefix}nome`}
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                     placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>

            {/* Endereço + Número */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid gap-2">
                    <label htmlFor={`${prefix}logradouro`} className="text-sm font-semibold text-slate-700">
                        Endereço
                    </label>
                    <input
                        id={`${prefix}logradouro`}
                        name={`${prefix}logradouro`}
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor={`${prefix}numero`} className="text-sm font-semibold text-slate-700">
                        Número
                    </label>
                    <input
                        id={`${prefix}numero`}
                        name={`${prefix}numero`}
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
            </div>

            {/* Complemento + Bairro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor={`${prefix}complemento`} className="text-sm font-semibold text-slate-700">
                        Complemento
                    </label>
                    <input
                        id={`${prefix}complemento`}
                        name={`${prefix}complemento`}
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor={`${prefix}bairro`} className="text-sm font-semibold text-slate-700">
                        Bairro
                    </label>
                    <input
                        id={`${prefix}bairro`}
                        name={`${prefix}bairro`}
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
            </div>

            {/* Cidade + UF */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid gap-2">
                    <label htmlFor={`${prefix}cidade`} className="text-sm font-semibold text-slate-700">
                        Cidade
                    </label>
                    <input
                        id={`${prefix}cidade`}
                        name={`${prefix}cidade`}
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                <div className="grid gap-2">
                    <label htmlFor={`${prefix}uf`} className="text-sm font-semibold text-slate-700">
                        UF
                    </label>
                    <input
                        id={`${prefix}uf`}
                        name={`${prefix}uf`}
                        type="text"
                        required
                        maxLength={2}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 uppercase
                       placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
            </div>

            {/* Observações */}
            <div className="grid gap-2">
                <label htmlFor={`${prefix}observacoes`} className="text-sm font-semibold text-slate-700">
                    Observações
                </label>
                <textarea
                    id={`${prefix}observacoes`}
                    name={`${prefix}observacoes`}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900
                     placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                />
            </div>
        </div>
    );
}