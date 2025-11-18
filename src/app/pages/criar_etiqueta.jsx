import FormularioEnvio from "../widgets/formulario_envio";

export default function CriarEtiqueta() {
  return (
    <div>
      <h1>Criar Etiqueta</h1>
      {/* Campos para entrada dos dados */}
      <form action="#">
        <section id="remetente" className="m-2">
            <h2 className="text-xl font-semibold mb-4">Remetente</h2>
            <FormularioEnvio prefix="remetente_" />
        </section>
        <section id="destinatario" className="m-2">
            <h2 className="text-xl font-semibold mb-4">Destinatário</h2>
            <FormularioEnvio prefix="destinatario_" />
        </section>
      </form>
    </div>
  );
}
