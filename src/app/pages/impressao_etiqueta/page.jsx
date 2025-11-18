'use client';

export default function ImpressaoEtiqueta() {
    // Get form data from sessionStorage (set by criar_etiqueta)
    const formData = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' 
        ? JSON.parse(sessionStorage.getItem('etiquetaData')) 
        : null;
    
    if (!formData) {
        return (
            <div>
                <h1>Impressão Etiqueta</h1>
                <p>Nenhum dado encontrado. Por favor, preencha o formulário primeiro.</p>
            </div>
        );
    }
    
    const formatEndereco = (dados) => {
        let endereco = dados.logradouro;
        if (dados.numero) endereco += `, ${dados.numero}`;
        if (dados.complemento) endereco += ` - ${dados.complemento}`;
        endereco += `\n${dados.bairro}`;
        endereco += `\n${dados.cidade} - ${dados.uf}`;
        endereco += `\nCEP: ${dados.cep}`;
        return endereco;
    };
    
    return (
        <div>
            <h1>Impressão Etiqueta</h1>
            
            <section id="remetente" className="mb-8 p-4 border-2 border-gray-300 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Remetente</h2>
                <div className="space-y-2">
                    <p className="font-bold text-lg">{formData.remetente.nome}</p>
                    <pre className="whitespace-pre-wrap font-normal">{formatEndereco(formData.remetente)}</pre>
                    {formData.remetente.observacoes && (
                        <p className="text-sm text-gray-600 italic">Obs: {formData.remetente.observacoes}</p>
                    )}
                </div>
            </section>
            
            <section id="destinatario" className="mb-8 p-4 border-2 border-gray-300 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Destinatário</h2>
                <div className="space-y-2">
                    <p className="font-bold text-lg">{formData.destinatario.nome}</p>
                    <pre className="whitespace-pre-wrap font-normal">{formatEndereco(formData.destinatario)}</pre>
                    {formData.destinatario.observacoes && (
                        <p className="text-sm text-gray-600 italic">Obs: {formData.destinatario.observacoes}</p>
                    )}
                </div>
            </section>
            
            <div className="mt-8 space-x-4">
                <button 
                    onClick={() => window.print()} 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                    Imprimir
                </button>
                <button 
                    onClick={() => window.history.back()} 
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                    Voltar
                </button>
            </div>
        </div>
    );
}