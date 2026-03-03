"use client";

import { useRef } from "react";

export interface EnderecoData {
  nome: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  observacoes: string;
}

interface ARImprimivelProps {
  remetente: EnderecoData;
  destinatario: EnderecoData;
}

export default function ARImprimivel({ remetente, destinatario }: ARImprimivelProps) {
  const arRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const conteudo = arRef.current?.innerHTML;
    if (!conteudo) return;

    const janela = window.open("", "_blank", "width=800,height=600");
    if (!janela) return;

    janela.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>AR - Aviso de Recebimento</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; font-size: 11px; background: white; }
          .ar-wrapper { width: 148mm; margin: 0 auto; padding: 4mm; }
          .ar-title { text-align: center; font-weight: bold; font-size: 13px;
            border: 2px solid black; padding: 4px; margin-bottom: 4px;
            letter-spacing: 2px; background: #f0f0f0; }
          .ar-subtitle { text-align: center; font-size: 10px; margin-bottom: 8px; color: #444; }
          .ar-section { border: 1px solid black; margin-bottom: 6px; }
          .ar-section-title { background: black; color: white; font-weight: bold;
            padding: 2px 6px; font-size: 10px; letter-spacing: 1px; }
          .ar-row { padding: 3px 6px; border-bottom: 1px solid #ccc; min-height: 18px; }
          .ar-row:last-child { border-bottom: none; }
          .ar-label { font-size: 9px; color: #555; display: block; }
          .ar-value { font-size: 11px; font-weight: bold; display: block; min-height: 14px; }
          .ar-grid { display: grid; grid-template-columns: 1fr 1fr; }
          .ar-grid-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; }
          .ar-col { padding: 3px 6px; border-right: 1px solid #ccc; }
          .ar-col:last-child { border-right: none; }
          .ar-assinatura { min-height: 28px; }
          .ar-obs { font-size: 9px; color: #666; text-align: center;
            margin-top: 6px; padding: 4px; border: 1px dashed #aaa; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="ar-wrapper">${conteudo}</div>
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
    <div className="mt-8">
      {/* Prévia do AR */}
      <div
        ref={arRef}
        style={{
          width: "148mm",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          border: "1px solid #ccc",
          padding: "4mm",
          background: "white",
        }}
      >
        {/* Cabeçalho */}
        <div style={{
          textAlign: "center", fontWeight: "bold", fontSize: "13px",
          border: "2px solid black", padding: "4px", marginBottom: "4px",
          letterSpacing: "2px", background: "#f0f0f0",
        }}>
          AR — AVISO DE RECEBIMENTO
        </div>
        <div style={{ textAlign: "center", fontSize: "10px", marginBottom: "8px", color: "#444" }}>
          Após a entrega, este aviso será devolvido ao remetente
        </div>

        {/* Destinatário */}
        <div style={{ border: "1px solid black", marginBottom: "6px" }}>
          <div style={{
            background: "black", color: "white", fontWeight: "bold",
            padding: "2px 6px", fontSize: "10px", letterSpacing: "1px",
          }}>
            DESTINATÁRIO
          </div>
          <div style={{ padding: "3px 6px", borderBottom: "1px solid #ccc" }}>
            <span style={{ fontSize: "9px", color: "#555", display: "block" }}>Nome / Empresa</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
              {destinatario.nome}
            </span>
          </div>
          <div style={{ padding: "3px 6px", borderBottom: "1px solid #ccc" }}>
            <span style={{ fontSize: "9px", color: "#555", display: "block" }}>Endereço</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
              {destinatario.endereco}{destinatario.numero ? `, ${destinatario.numero}` : ""}
              {destinatario.complemento ? ` — ${destinatario.complemento}` : ""}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr" }}>
            <div style={{ padding: "3px 6px", borderRight: "1px solid #ccc" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>Cidade</span>
              <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
                {destinatario.cidade}
              </span>
            </div>
            <div style={{ padding: "3px 6px", borderRight: "1px solid #ccc" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>UF</span>
              <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
                {destinatario.uf}
              </span>
            </div>
            <div style={{ padding: "3px 6px" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>CEP</span>
              <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
                {cepFormatado(destinatario.cep)}
              </span>
            </div>
          </div>
        </div>

        {/* Remetente */}
        <div style={{ border: "1px solid black", marginBottom: "6px" }}>
          <div style={{
            background: "black", color: "white", fontWeight: "bold",
            padding: "2px 6px", fontSize: "10px", letterSpacing: "1px",
          }}>
            REMETENTE
          </div>
          <div style={{ padding: "3px 6px", borderBottom: "1px solid #ccc" }}>
            <span style={{ fontSize: "9px", color: "#555", display: "block" }}>Nome / Empresa</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
              {remetente.nome}
            </span>
          </div>
          <div style={{ padding: "3px 6px", borderBottom: "1px solid #ccc" }}>
            <span style={{ fontSize: "9px", color: "#555", display: "block" }}>Endereço</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
              {remetente.endereco}{remetente.numero ? `, ${remetente.numero}` : ""}
              {remetente.complemento ? ` — ${remetente.complemento}` : ""}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr" }}>
            <div style={{ padding: "3px 6px", borderRight: "1px solid #ccc" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>Cidade</span>
              <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
                {remetente.cidade}
              </span>
            </div>
            <div style={{ padding: "3px 6px", borderRight: "1px solid #ccc" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>UF</span>
              <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
                {remetente.uf}
              </span>
            </div>
            <div style={{ padding: "3px 6px" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>CEP</span>
              <span style={{ fontSize: "11px", fontWeight: "bold", display: "block", minHeight: "14px" }}>
                {cepFormatado(remetente.cep)}
              </span>
            </div>
          </div>
        </div>

        {/* Recebimento */}
        <div style={{ border: "1px solid black", marginBottom: "6px" }}>
          <div style={{
            background: "black", color: "white", fontWeight: "bold",
            padding: "2px 6px", fontSize: "10px", letterSpacing: "1px",
          }}>
            RECEBIMENTO (preenchido pelo carteiro)
          </div>
          <div style={{ padding: "3px 6px", borderBottom: "1px solid #ccc", minHeight: "36px" }}>
            <span style={{ fontSize: "9px", color: "#555", display: "block" }}>
              Assinatura do recebedor
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "3px 6px", borderRight: "1px solid #ccc", minHeight: "28px" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>Nome legível</span>
            </div>
            <div style={{ padding: "3px 6px", minHeight: "28px" }}>
              <span style={{ fontSize: "9px", color: "#555", display: "block" }}>
                Data de entrega: ___/___/______
              </span>
            </div>
          </div>
          <div style={{ padding: "3px 6px", borderTop: "1px solid #ccc", minHeight: "24px" }}>
            <span style={{ fontSize: "9px", color: "#555", display: "block" }}>
              Documento de identidade (RG/CPF)
            </span>
          </div>
        </div>

        {/* Rodapé */}
        <div style={{
          fontSize: "9px", color: "#666", textAlign: "center",
          marginTop: "6px", padding: "4px", border: "1px dashed #aaa",
        }}>
          AR — Aviso de Recebimento | Cole este formulário no verso do envelope ou embalagem
        </div>
      </div>

      {/* Botão de impressão */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
        >
          🖨️ Imprimir AR
        </button>
      </div>
    </div>
  );
}