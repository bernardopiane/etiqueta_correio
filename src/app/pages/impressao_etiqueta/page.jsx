'use client';
import { useEffect, useState } from 'react';

export default function ImpressaoEtiqueta() {
    const [formData, setFormData] = useState(null);
    
    useEffect(() => {
        if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
            const data = sessionStorage.getItem('etiquetaData');
            if (data) setFormData(JSON.parse(data));
        }
    }, []);
    
    if (!formData) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Impressão Etiqueta</h1>
                <p>Nenhum dado encontrado. Por favor, preencha o formulário primeiro.</p>
            </div>
        );
    }
    
    const formatEndereco = (dados) => {
        const parts = [
            `${dados.logradouro}${dados.numero ? ', ' + dados.numero : ''}${dados.complemento ? ' - ' + dados.complemento : ''}`,
            dados.bairro,
            `${dados.cidade} - ${dados.uf}`,
            `CEP: ${dados.cep}`
        ];
        return parts.join('\n');
    };
    
    const LabelSection = ({ title, data }) => (
        <div className="label-box">
            <h2 className="label-title">{title}</h2>
            <p className="label-name">{data.nome}</p>
            <pre className="label-address">{formatEndereco(data)}</pre>
            {data.observacoes && (
                <p className="label-obs">Obs: {data.observacoes}</p>
            )}
        </div>
    );
    
    return (
        <>
            <style jsx global>{`
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none !important; }
                    .label-box {
                        page-break-inside: avoid;
                        border: 2px solid #000 !important;
                        padding: 12mm !important;
                        margin-bottom: 8mm !important;
                    }
                    .label-title { 
                        font-size: 14pt !important;
                        margin-bottom: 3mm !important;
                    }
                    .label-name { 
                        font-size: 12pt !important;
                        margin-bottom: 2mm !important;
                    }
                    .label-address { 
                        font-size: 11pt !important;
                        line-height: 1.4 !important;
                    }
                    .label-obs {
                        font-size: 9pt !important;
                        margin-top: 2mm !important;
                    }
                }
                
                @media screen {
                    .label-box {
                        border: 2px solid #d1d5db;
                        border-radius: 0.5rem;
                        padding: 1.5rem;
                        margin-bottom: 1.5rem;
                    }
                    .label-title {
                        font-size: 1.25rem;
                        font-weight: 600;
                        margin-bottom: 1rem;
                    }
                    .label-name {
                        font-size: 1.125rem;
                        font-weight: 700;
                        margin-bottom: 0.5rem;
                    }
                    .label-address {
                        white-space: pre-wrap;
                        font-family: inherit;
                        line-height: 1.6;
                        margin: 0;
                    }
                    .label-obs {
                        font-size: 0.875rem;
                        color: #6b7280;
                        font-style: italic;
                        margin-top: 0.5rem;
                    }
                }
            `}</style>
            
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6 no-print">Impressão Etiqueta</h1>
                
                <LabelSection title="Remetente" data={formData.remetente} />
                <LabelSection title="Destinatário" data={formData.destinatario} />
                
                <div className="mt-8 space-x-4 no-print">
                    <button 
                        onClick={() => window.print()} 
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                        Imprimir
                    </button>
                    <button 
                        onClick={() => window.history.back()} 
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </>
    );
}