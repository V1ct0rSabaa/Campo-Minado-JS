var linhas;
var colunas;
var campo = [];

var minas;
var local_minas = [];
var minas_achadas = 0;

var bandeira_clicada = false;

var bandeiras_clicadas = [];

var celulas_verificadas = [];

var primeira_jogada = false;
var id_primeira;

var fim_de_jogo = false;

var total_celulas;

function desativar_botoes(){
    document.getElementById("botao-facil").disabled = true;
    document.getElementById("botao-medio").disabled = true;
    document.getElementById("botao-dificil").disabled = true;
}

function reativar_botoes(){
    document.getElementById("botao-facil").disabled = false;
    document.getElementById("botao-medio").disabled = false;
    document.getElementById("botao-dificil").disabled = false;
}

function definir_tamanho(linha, coluna){
    if(linha == 8 && coluna == 10){
        document.getElementById("campo").style.width = "350px";
        document.getElementById("campo").style.height = "315px";
    }
    else if(linha == 14 && coluna == 18){
        document.getElementById("campo").style.width = "635px";
        document.getElementById("campo").style.height = "505px";
    }

    else if(linha == 20 && coluna == 24){
        document.getElementById("campo").style.width = "843px";
        document.getElementById("campo").style.height = "720px";
    }
}

function set_minas(linha, coluna, mina){
    for(let i = 0; i < mina; i += 1){
        let linha_especifica = Math.floor(Math.random() * linha);
        let coluna_especifica = Math.floor(Math.random() * coluna);
        let id = linha_especifica.toString() + coluna_especifica.toString();
        if (!local_minas.includes(id) && id != id_primeira ) {
            local_minas.push(id);
        }
        else{
            i -= 1;
        }
    }
}

function set_campo(quantidade_linha, quantidade_coluna, quantidade_mina){
    linhas = quantidade_linha;
    colunas = quantidade_coluna;
    minas = quantidade_mina

    total_celulas = linhas * colunas;
    document.getElementById("selecione-dificuldade").innerText = "";

    document.getElementById("quantidade_de_minas").innerText = "Minas Restantes: " + quantidade_mina;

    definir_tamanho(quantidade_linha, quantidade_coluna);

    document.getElementById("botao-bandeira").addEventListener("click", set_bandeira);

    document.getElementById("botao-facil").addEventListener("click", desativar_botoes());
    document.getElementById("botao-medio").addEventListener("click", desativar_botoes());
    document.getElementById("botao-dificil").addEventListener("click", desativar_botoes());

    for(let i = 0; i < quantidade_linha; i += 1){
        let coluna = [];
        for(let j = 0; j < quantidade_coluna; j += 1){
            let celula = document.createElement("div");
            celula.id = i.toString() + j.toString();
            celula.addEventListener("click", clicar_celula);
            document.getElementById("campo").append(celula);
            coluna.push(celula);
        }
        campo.push(coluna);
    }

}


function set_bandeira() {
    if (bandeira_clicada) {
        bandeira_clicada = false;
        document.getElementById("botao-bandeira").style.backgroundColor = "lightgray";
    }
    else {
        bandeira_clicada = true;
        document.getElementById("botao-bandeira").style.backgroundColor = "darkgray";
    }
}

function checar_vitoria(){
    if(total_celulas == local_minas.length){
        fim_de_jogo = true;
        alert("FIm DE JOGO, Você venceu\nDepois de clicar em ok, o campo vai ser limpo em 3 segundos");
        setTimeout(limpar_campo, 3000);
        setTimeout(reativar_botoes, 3000);
    }
}

function limpar_campo(){
    for(let i = 0; i < linhas; i += 1){
        let coluna = [];
        for(let j = 0; j < colunas; j += 1){
            id = i.toString() + j.toString();
            document.getElementById(id).remove(id);
        }
        while(campo.length > 0){
            campo.pop();
        }
        while(local_minas.length > 0){
            local_minas.pop();
        }
        while(bandeiras_clicadas.length > 0){
            bandeiras_clicadas.pop();
        }
        for(let k = 0; k < campo.length; k += 1){
            
            local_minas.pop();
            bandeiras_clicadas.pop();
        }

    }
}

function clicar_celula(){
    celula = this;
    if(!primeira_jogada){
        primeira_jogada = true;
        id_primeira = celula.id;
        set_minas(linhas, colunas, minas);
    }
    if(bandeira_clicada){
        if(celula.innerText == ""){
            celula.innerText = "🚩";
            bandeiras_clicadas.push(celula.id);
        }
        else if(celula.innerText == "🚩"){
            celula.innerText = "";
            let x = bandeiras_clicadas.indexOf(celula.id);
            bandeiras_clicadas.splice(x, 1);
        }
        return;
    }
    if(local_minas.includes(celula.id)){
        fim_de_jogo = true;
        alert("FIM DE JOGO, Você perdeu\nDepois de clicar em ok, o campo vai ser limpo em 3 segundos");
        revelar_minas();
        setTimeout(limpar_campo, 3000);
        setTimeout(reativar_botoes, 3000);
        return;
    }
    let linha = parseInt(celula.id[0]);
    let coluna = parseInt(celula.id[1]);
    checar_mina(linha, coluna);
    checar_vitoria();
}

function revelar_minas(){
    for(let i = 0; i < linhas; i += 1){
        for(let j = 0; j < colunas; j += 1){
            let celula = campo[i][j];
            if(local_minas.includes(celula.id)){
                //celula.innerText = "💣";
                celula.style.backgroundColor = "red";   
            }
        }
    }

}

function checar_celula(linha, coluna){
    if (linha < 0 || linha >= linhas || coluna < 0 || coluna >= colunas) {
        return;
    }
    else if (local_minas.includes(campo[linha][coluna].id)) {
        minas_achadas += 1;
    }
}

function checar_mina(linha, coluna){
    if(celulas_verificadas.includes(linha.toString() + coluna.toString())){
        return;
    }
    celulas_verificadas.push(linha.toString() + coluna.toString());
    if(linha < 0 || linha >= linhas || coluna < 0 || coluna >= colunas){
        return;
    }
    for(let i = -1; i < 2; i += 1){
        for(let j = -1; j < 2; j += 1){
            checar_celula(linha + i, coluna + j);
        }   
    }
    if(minas_achadas > 0){
        campo[linha][coluna].innerText = minas_achadas.toString();
        campo[linha][coluna].style.backgroundColor = "white";
        if(minas_achadas < 3){
            campo[linha][coluna].style.color = "blue";
        }
        else{
            campo[linha][coluna].style.color = "red";
        }
        minas_achadas = 0;
    }
    else{
        campo[linha][coluna].style.backgroundColor = "white";
        if(campo[linha][coluna].innerText == "🚩"){
            campo[linha][coluna].innerText = "";
        }
        for(let i = -1; i < 2; i += 1){
            for(let j = -1; j < 2; j += 1){
                checar_mina(linha + i, coluna + j);
            }   
        }
    }
    total_celulas -= 1;
}
