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
    <div>
      <h1>Criar Etiqueta</h1>
      {/* Campos para entrada dos dados */}
      <form action="#" onSubmit={handleSubmit}>
        <section id="remetente" className="m-2">
          <h2 className="text-xl font-semibold mb-4">Remetente</h2>
          <FormularioEnvio prefix="remetente_" />
        </section>
        <section id="destinatario" className="m-2">
          <h2 className="text-xl font-semibold mb-4">Destinatário</h2>
          <FormularioEnvio prefix="destinatario_" />
        </section>

        <button type="submit" className="m-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200">
          Gerar Etiqueta
        </button>
      </form>
    </div>
  );
}
