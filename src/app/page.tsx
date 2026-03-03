"use client";

import { useState, useRef } from "react";
import ARImprimivel, { EnderecoData } from "./components/ARImprimivel";

// ─── Tipo de formulário ───────────────────────────────────────────────────────
interface FormData {
  remetente: EnderecoData;
  destinatario: EnderecoData;
}

const campoVazio: EnderecoData = {
  nome: "", endereco: "", numero: "", complemento: "",
  bairro: "", cidade: "", uf: "", cep: "", observacoes: "",
};

// ─── Componente de seção de formulário ───────────────────────────────────────
function SecaoEndereco({
  titulo,
  dados,
  onChange,
}: {
  titulo: string;
  dados: EnderecoData;
  onChange: (campos: Partial<EnderecoData>) => void;
}) {
  const [buscando, setBuscando] = useState(false);
  const [erroCep, setErroCep] = useState("");

  const handleCepChange = async (valor: string) => {
    // Formata enquanto digita: 00000-000
    const soNumeros = valor.replace(/\D/g, "").slice(0, 8);
    const formatado = soNumeros.length > 5
      ? `${soNumeros.slice(0, 5)}-${soNumeros.slice(5)}`
      : soNumeros;
    onChange({ cep: formatado });
    setErroCep("");

    if (soNumeros.length === 8) {
      setBuscando(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${soNumeros}/json/`);
        const data = await res.json();
        if (data.erro) {
          setErroCep("CEP não encontrado.");
        } else {
          onChange({
            cep: formatado,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            uf: data.uf || "",
          });
        }
      } catch {
        setErroCep("Erro ao buscar o CEP. Verifique sua conexão.");
      } finally {
        setBuscando(false);
      }
    }
  };

  const campo = (
    label: string,
    key: keyof EnderecoData,
    placeholder?: string,
    readOnly?: boolean
  ) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={dados[key]}
        onChange={e => onChange({ [key]: e.target.value })}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          readOnly
            ? "bg-gray-50 border-gray-200 text-gray-500 cursor-default"
            : "border-gray-300"
        }`}
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-bold mb-4 border-b pb-2">{titulo}</h2>

      {/* CEP com feedback de busca */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
        <div className="relative">
          <input
            type="text"
            value={dados.cep}
            onChange={e => handleCepChange(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
          />
          {buscando && (
            <span className="absolute right-3 top-2.5 text-blue-500 text-xs animate-pulse">
              Buscando...
            </span>
          )}
        </div>
        {erroCep && <p className="text-red-500 text-xs mt-1">{erroCep}</p>}
      </div>

      {campo("Nome / Empresa / Promoção", "nome")}
      {campo("Endereço", "endereco")}
      <div className="grid grid-cols-2 gap-3">
        {campo("Número", "numero")}
        {campo("Complemento", "complemento")}
      </div>
      {campo("Bairro", "bairro")}
      <div className="grid grid-cols-2 gap-3">
        {campo("Cidade", "cidade", undefined, true)}
        {campo("UF", "uf", undefined, true)}
      </div>
      {campo("Observações", "observacoes")}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Home() {
  const [form, setForm] = useState<FormData>({
    remetente: { ...campoVazio },
    destinatario: { ...campoVazio },
  });

  // Controla visibilidade da etiqueta e do AR
  const [etiquetaGerada, setEtiquetaGerada] = useState(false);
  const [mostrarAR, setMostrarAR] = useState(false);
  const etiquetaRef = useRef<HTMLDivElement>(null);
  const arRef = useRef<HTMLDivElement>(null);

  const atualizar = (secao: "remetente" | "destinatario") =>
    (campos: Partial<EnderecoData>) =>
      setForm(f => ({ ...f, [secao]: { ...f[secao], ...campos } }));

  const handleGerar = () => {
    setEtiquetaGerada(true);
    setMostrarAR(false);
  };

  const handleImprimirEtiqueta = () => {
    const conteudo = etiquetaRef.current?.innerHTML;
    if (!conteudo) return;
    const janela = window.open("", "_blank", "width=600,height=400");
    if (!janela) return;
    janela.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Etiqueta</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 16px; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>${conteudo}
      <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </body>
      </html>
    `);
    janela.document.close();
    janela.focus();
    setTimeout(() => { janela.print(); janela.close(); }, 500);
  };

  const handleImprimirTudo = () => {
    // Garante que o AR esteja renderizado para capturar o conteúdo
    if (!mostrarAR) {
      setMostrarAR(true);
      setTimeout(() => imprimirEtiquetaEAr(), 100);
    } else {
      imprimirEtiquetaEAr();
    }
  };

  const imprimirEtiquetaEAr = () => {
    const etiqueta = etiquetaRef.current?.innerHTML;
    const ar = arRef.current?.innerHTML;
    if (!etiqueta || !ar) return;
    const janela = window.open("", "_blank", "width=700,height=600");
    if (!janela) return;
    janela.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Etiqueta + AR</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; padding: 16px; gap: 32px; }
          .divisor { width: 100%; border: none; border-top: 2px dashed #999; margin: 8px 0; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div>${etiqueta}</div>
        <hr class="divisor" />
        <div>${ar}</div>
        <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </body>
      </html>
    `);
    janela.document.close();
    janela.focus();
    setTimeout(() => { janela.print(); janela.close(); }, 500);
  };

  const cepFormatado = (cep: string) =>
    cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Criar Etiqueta</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Preencha os dados de remetente e destinatário para gerar a etiqueta.
        </p>

        <SecaoEndereco titulo="Remetente" dados={form.remetente} onChange={atualizar("remetente")} />
        <SecaoEndereco titulo="Destinatário" dados={form.destinatario} onChange={atualizar("destinatario")} />

        <div className="flex justify-center mb-8">
          <button
            onClick={handleGerar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow transition-colors"
          >
            Gerar Etiqueta
          </button>
        </div>

        {/* ── Etiqueta gerada ── */}
        {etiquetaGerada && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Etiqueta</h2>

            {/* Layout da etiqueta */}
            <div ref={etiquetaRef}>
            <div
              style={{
                border: "2px solid black",
                padding: "12px",
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              <div style={{ borderBottom: "1px solid black", paddingBottom: "8px", marginBottom: "8px" }}>
                <strong>REMETENTE</strong>
                <div>{form.remetente.nome}</div>
                <div>
                  {form.remetente.endereco}
                  {form.remetente.numero ? `, ${form.remetente.numero}` : ""}
                  {form.remetente.complemento ? ` — ${form.remetente.complemento}` : ""}
                </div>
                <div>{form.remetente.bairro}</div>
                <div>
                  {form.remetente.cidade} — {form.remetente.uf} &nbsp;|&nbsp; CEP: {cepFormatado(form.remetente.cep)}
                </div>
              </div>

              <div>
                <strong>DESTINATÁRIO</strong>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>{form.destinatario.nome}</div>
                <div>
                  {form.destinatario.endereco}
                  {form.destinatario.numero ? `, ${form.destinatario.numero}` : ""}
                  {form.destinatario.complemento ? ` — ${form.destinatario.complemento}` : ""}
                </div>
                <div>{form.destinatario.bairro}</div>
                <div>
                  {form.destinatario.cidade} — {form.destinatario.uf} &nbsp;|&nbsp; CEP: {cepFormatado(form.destinatario.cep)}
                </div>
                {form.destinatario.observacoes && (
                  <div style={{ marginTop: "4px", fontStyle: "italic", color: "#555" }}>
                    Obs: {form.destinatario.observacoes}
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* ── Botões ── */}
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              <button
                onClick={handleImprimirEtiqueta}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
              >
                🖨️ Imprimir Etiqueta
              </button>
              <button
                onClick={() => setMostrarAR(v => !v)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded shadow transition-colors"
              >
                {mostrarAR ? "Ocultar AR" : "📄 Gerar AR (Aviso de Recebimento)"}
              </button>
              <button
                onClick={handleImprimirTudo}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
                title="Imprime etiqueta e AR juntos"
              >
                🖨️ Imprimir Etiqueta + AR
              </button>
            </div>
          </div>
        )}

        {/* ── AR imprimível ── */}
        {etiquetaGerada && mostrarAR && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">
              AR — Aviso de Recebimento
            </h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Cole este formulário no verso do envelope ou embalagem antes de postar.
              O carteiro o preencherá e devolverá ao remetente após a entrega.
            </p>
            <div ref={arRef}>
              <ARImprimivel remetente={form.remetente} destinatario={form.destinatario} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}