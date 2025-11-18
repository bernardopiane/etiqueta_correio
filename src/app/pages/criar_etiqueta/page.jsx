'use client';

import FormularioEnvio from "../../widgets/formulario_envio";

export default function CriarEtiqueta() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract all form data
    const formData = {
      remetente: {
        cep: e.target.remetente_cep.value,
        nome: e.target.remetente_nome.value,
        logradouro: e.target.remetente_logradouro.value,
        numero: e.target.remetente_numero.value,
        complemento: e.target.remetente_complemento.value,
        bairro: e.target.remetente_bairro.value,
        cidade: e.target.remetente_cidade.value,
        uf: e.target.remetente_uf.value,
        observacoes: e.target.remetente_observacoes.value
      },
      destinatario: {
        cep: e.target.destinatario_cep.value,
        nome: e.target.destinatario_nome.value,
        logradouro: e.target.destinatario_logradouro.value,
        numero: e.target.destinatario_numero.value,
        complemento: e.target.destinatario_complemento.value,
        bairro: e.target.destinatario_bairro.value,
        cidade: e.target.destinatario_cidade.value,
        uf: e.target.destinatario_uf.value,
        observacoes: e.target.destinatario_observacoes.value
      }
    };

    console.log('Form Data Extracted:', formData);

    // Store the data in sessionStorage for persistence across navigation
    sessionStorage.setItem('etiquetaData', JSON.stringify(formData));

    // Navigate to impressao_etiqueta page
    window.location.href = '/pages/impressao_etiqueta';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 grid gap-10">
      {/* Header */}
      <header className="grid gap-2">
        <h1 className="text-3xl font-bold text-slate-800">Criar Etiqueta</h1>
        <p className="text-sm text-slate-500">Preencha os dados de remetente e destinatário para gerar a etiqueta.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-8">
        {/* Remetente */}
        <section id="remetente" className="bg-white rounded-2xl shadow-subtle p-6 md:p-8 grid gap-4">
          <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">Remetente</h2>
          <FormularioEnvio prefix="remetente_" />
        </section>

        {/* Destinatário */}
        <section id="destinatario" className="bg-white rounded-2xl shadow-subtle p-6 md:p-8 grid gap-4">
          <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-100 pb-3">Destinatário</h2>
          <FormularioEnvio prefix="destinatario_" />
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Gerar Etiqueta
          </button>
        </div>
      </form>
    </div>
  );
}
