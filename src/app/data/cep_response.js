export class CepResponse {
    constructor(data) {
        this.cep = data.cep || '';
        this.logradouro = data.logradouro || '';
        this.complemento = data.complemento || '';
        this.unidade = data.unidade || '';
        this.bairro = data.bairro || '';
        this.localidade = data.localidade || '';
        this.uf = data.uf || '';
        this.estado = data.estado || '';
        this.regiao = data.regiao || '';
        this.ibge = data.ibge || '';
        this.gia = data.gia || '';
        this.ddd = data.ddd || '';
        this.siafi = data.siafi || '';
    }

    // Getters for commonly used fields
    getCep() {
        return this.cep;
    }

    getLogradouro() {
        return this.logradouro;
    }

    getBairro() {
        return this.bairro;
    }

    getCidade() {
        return this.localidade;
    }

    getUf() {
        return this.uf;
    }

    getEstado() {
        return this.estado;
    }

    getDdd() {
        return this.ddd;
    }

    // Check if address is valid
    isValid() {
        return this.cep && this.logradouro && this.bairro && this.localidade && this.uf;
    }

    // Get formatted address
    getEnderecoCompleto() {
        let endereco = this.logradouro;
        if (this.complemento) {
            endereco += `, ${this.complemento}`;
        }
        endereco += ` - ${this.bairro}`;
        endereco += `, ${this.localidade} - ${this.uf}`;
        endereco += ` CEP: ${this.cep}`;
        return endereco;
    }

    // Static method to create instance from API response
    static fromApiResponse(apiData) {
        return new CepResponse(apiData);
    }

    // Convert to plain object
    toObject() {
        return {
            cep: this.cep,
            logradouro: this.logradouro,
            complemento: this.complemento,
            unidade: this.unidade,
            bairro: this.bairro,
            localidade: this.localidade,
            uf: this.uf,
            estado: this.estado,
            regiao: this.regiao,
            ibge: this.ibge,
            gia: this.gia,
            ddd: this.ddd,
            siafi: this.siafi
        };
    }

    // Convert to JSON string
    toJson() {
        return JSON.stringify(this.toObject());
    }
}