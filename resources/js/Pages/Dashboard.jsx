import React, { useState, useEffect } from 'react';
import { 
  Home, Ticket, Gift, Settings, Search, Bell, User, X
} from 'lucide-react';

export default function Dashboard() {
  // 👇 ID do usuário que já está cadastrado no seu banco de dados
  const USUARIO_ID = 4; 

  // ==========================================
  // ESTADOS (Variáveis da Tela)
  // ==========================================
  const [jogos, setJogos] = useState([]);
  const [carregandoJogos, setCarregandoJogos] = useState(true);
  const [apostasSelecionadas, setApostasSelecionadas] = useState([]); 
  const [valorAposta, setValorAposta] = useState('');
  const [mensagem, setMensagem] = useState('');
  
  // 👇 O saldo começa em 0, mas será substituído pelo valor REAL do banco em milissegundos
  const [saldo, setSaldo] = useState(0); 

  // ==========================================
  // 1. API: BUSCAR SALDO REAL DO USUÁRIO (GET)
  // ==========================================
  useEffect(() => {
    const buscarSaldoDoBanco = async () => {
      try {
        // Altere a URL abaixo caso a sua rota de usuário no Laravel seja diferente
        const resposta = await fetch(`http://localhost:8000/api/usuario/${USUARIO_ID}`);
        
        if (resposta.ok) {
          const dados = await resposta.json();
          // Ajuste o 'dados.saldo' dependendo de como o seu Laravel envia a coluna do banco
          setSaldo(parseFloat(dados.saldo || 0)); 
        } else {
          console.error("Erro ao buscar dados do usuário no banco");
        }
      } catch (erro) {
        console.error("Erro de conexão ao buscar saldo:", erro);
      }
    };

    buscarSaldoDoBanco();
  }, []);

  // ==========================================
  // 2. API: BUSCAR JOGOS REAIS DO LARAVEL (GET)
  // ==========================================
  useEffect(() => {
    const buscarJogosDoBanco = async () => {
      try {
        const resposta = await fetch('http://localhost:8000/api/jogos'); 
        
        if (resposta.ok) {
          const dados = await resposta.json();
          setJogos(dados);
        } else {
          console.error("Erro na API ao buscar jogos");
        }
      } catch (erro) {
        console.error("Erro de conexão com o servidor:", erro);
      } finally {
        setCarregandoJogos(false);
      }
    };

    buscarJogosDoBanco();
  }, []);

  // ==========================================
  // 3. API: ENVIAR MÚLTIPLA (POST)
  // ==========================================
  const finalizarAposta = async () => {
    if (apostasSelecionadas.length === 0 || !valorAposta) return;

    const valorNumerico = parseFloat(valorAposta);

    // Validação básica no front para não gastar processamento à toa
    if (valorNumerico > saldo) {
      setMensagem('❌ Saldo insuficiente para realizar esta aposta.');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:8000/api/apostar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          id_apostador: USUARIO_ID, // Enviando o ID real do banco
          apostas: apostasSelecionadas, 
          valor_total: valorNumerico,
          odd_total: oddTotal
        })
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        setMensagem('✅ Bilhete registrado com sucesso!');
        setSaldo(prevSaldo => prevSaldo - valorNumerico); // Atualiza o saldo na tela
        setValorAposta('');
        setApostasSelecionadas([]); 
        setTimeout(() => setMensagem(''), 4000); 
      } else {
        setMensagem('❌ Erro: ' + (resultado.error || resultado.message || 'Não foi possível registrar o bilhete.'));
      }
    } catch (erro) {
      console.error('Erro ao finalizar bilhete:', erro);
      setMensagem('❌ Erro de conexão ao tentar registrar.');
    }
  };

  // ==========================================
  // 4. API: REALIZAR DEPÓSITO REAIS (POST)
  // ==========================================
  const realizarDeposito = async () => {
    const valorDigitado = window.prompt('Digite o valor que deseja depositar (Ex: 50.00):');
    
    if (!valorDigitado || isNaN(valorDigitado) || parseFloat(valorDigitado) <= 0) {
      return; 
    }

    try {
      const resposta = await fetch('http://localhost:8000/api/depositar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ 
          id_apostador: USUARIO_ID, // Informa quem está depositando
          valor: parseFloat(valorDigitado) 
        })
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        alert(`💰 Depósito de R$ ${valorDigitado} realizado com sucesso!`);
        setSaldo(prevSaldo => prevSaldo + parseFloat(valorDigitado));
      } else {
        alert('❌ Erro no depósito: ' + (resultado.message || 'Falha na transação.'));
      }
    } catch (erro) {
      console.error("Erro ao depositar:", erro);
      alert('❌ Erro de conexão ao tentar depositar.');
    }
  };

  // ==========================================
  // LÓGICA DO BILHETE DE APOSTAS
  // ==========================================
  const selecionarPalpite = (jogo, tipo, odd) => {
    let palpiteFormatado = '';
    if (tipo === 'casa') palpiteFormatado = 'MANDANTE'; 
    else if (tipo === 'visitante') palpiteFormatado = 'VISITANTE';
    else palpiteFormatado = 'EMPATE';

    const novaAposta = {
      jogoId: jogo.id_partida,
      confronto: `${jogo.mandante} x ${jogo.visitante}`, 
      palpiteExibicao: tipo === 'casa' ? jogo.mandante : tipo === 'visitante' ? jogo.visitante : 'Empate',
      palpite: palpiteFormatado, 
      odd: parseFloat(odd),
      tipoSelecionado: tipo
    };

    setApostasSelecionadas(prev => {
      const jogoJaExisteIndex = prev.findIndex(item => item.jogoId === jogo.id_partida);

      if (jogoJaExisteIndex >= 0) {
        if (prev[jogoJaExisteIndex].tipoSelecionado === tipo) {
          return prev.filter(item => item.jogoId !== jogo.id_partida);
        }
        const novoArray = [...prev];
        novoArray[jogoJaExisteIndex] = novaAposta;
        return novoArray;
      } else {
        return [...prev, novaAposta];
      }
    });
    setMensagem('');
  };

  const removerAposta = (jogoId) => {
    setApostasSelecionadas(prev => prev.filter(item => item.jogoId !== jogoId));
  };

  const isSelecionado = (jogoId, tipo) => {
    return apostasSelecionadas.some(item => item.jogoId === jogoId && item.tipoSelecionado === tipo);
  };

  const oddTotal = apostasSelecionadas.length > 0 
    ? apostasSelecionadas.reduce((acumulador, item) => acumulador * item.odd, 1).toFixed(2)
    : 0;

  const retornoPotencial = apostasSelecionadas.length > 0 && valorAposta 
    ? (parseFloat(valorAposta) * parseFloat(oddTotal)).toFixed(2) 
    : '0.00';

  return (
    <div className="flex bg-[#050505] min-h-screen text-white font-sans">
      
      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="w-64 bg-[#0A0A0A] flex flex-col border-r border-[#202020] hidden md:flex">
        <div className="p-6 flex items-center justify-center border-b border-[#202020]">
           <img src="/images/logo.png" alt="AraBet" className="h-10 object-contain" />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <a href="#" className="flex items-center gap-3 text-[#050505] bg-[#7DFF00] font-medium p-3 rounded-md transition">
            <Home size={20} /> Início
          </a>
          <a href="#" className="flex items-center gap-3 text-[#BDBDBD] hover:text-[#7DFF00] hover:bg-[#111111] p-3 rounded-md transition mt-4">
            <Ticket size={20} /> Minhas Apostas
          </a>
          <a href="#" className="flex items-center gap-3 text-[#BDBDBD] hover:text-[#7DFF00] hover:bg-[#111111] p-3 rounded-md transition">
            <Gift size={20} /> Cupons
          </a>
          <a href="#" className="flex items-center gap-3 text-[#BDBDBD] hover:text-[#7DFF00] hover:bg-[#111111] p-3 rounded-md transition">
            <Settings size={20} /> Configurações
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#111111] border border-[#202020] p-4 rounded-md text-center">
            <h3 className="font-bold text-sm mb-1 text-white">Bônus de boas-vindas</h3>
            <p className="text-xs text-[#BDBDBD] mb-4">Deposite e ganhe até R$ 200 em apostas</p>
            <button className="w-full border border-[#7DFF00] text-[#7DFF00] hover:bg-[#7DFF00] hover:text-[#050505] transition py-2 rounded-md text-sm font-semibold">
              Resgatar Bônus
            </button>
          </div>
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="h-20 flex items-center justify-between px-8 border-b border-[#202020] bg-[#0A0A0A]">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BDBDBD]" size={18} />
            <input 
              type="text" 
              placeholder="Buscar times, campeonatos ou jogos" 
              className="w-full bg-[#111111] border border-[#202020] rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#7DFF00] transition"
            />
          </div>

          <div className="flex items-center gap-6 ml-4">
            <button className="text-[#BDBDBD] hover:text-[#7DFF00] transition relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center bg-[#111111] border border-[#202020] rounded-md p-1 pl-4 pr-1 gap-4">
              <span className="text-sm font-bold text-[#7DFF00]">R$ {saldo.toFixed(2)}</span>
              <div className="flex gap-2">
                <button 
                  onClick={realizarDeposito}
                  className="bg-[#7DFF00] text-[#050505] hover:bg-[#56C800] rounded w-8 h-8 flex items-center justify-center text-lg font-bold transition"
                  title="Depositar"
                >
                  +
                </button>
              </div>
            </div>

            <div className="w-10 h-10 rounded-md bg-[#111111] border border-[#202020] text-[#BDBDBD] hover:text-[#7DFF00] hover:border-[#7DFF00] transition cursor-pointer flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex gap-8">
          
          {/* ================= COLUNA ESQUERDA (JOGOS) ================= */}
          <div className="flex-1 min-w-[500px]">
            <div className="bg-[url(/images/background.png)] bg-cover bg-center rounded-md p-10 mb-10 border border-[#202020] relative overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="relative z-10">
                <div className="flex gap-2 mb-4">
                  <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded">🔴 ALAGOANO</span>
                  <span className="bg-[#7DFF00]/20 text-[#7DFF00] text-xs font-bold px-2 py-1 rounded">⚡ ODDS ESPECIAIS</span>
                </div>
                <h2 className="text-4xl font-bold mb-2 text-white leading-tight">Aposte no melhor do <br/><span className="text-[#7DFF00]">futebol Alagoano</span></h2>
                <p className="text-[#BDBDBD] mb-6 mt-2">Odds especiais para você ganhar mais com os times da terra</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-xl text-white">Próximos Jogos</h3>
            </div>

            {carregandoJogos ? (
              <div className="text-center py-20 text-[#BDBDBD]"><p>Buscando jogos ao vivo...</p></div>
            ) : jogos.length === 0 ? (
              <div className="text-center py-20 text-[#BDBDBD]"><p>Nenhum jogo agendado encontrado.</p></div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {jogos.map((jogo) => (
                  <div key={jogo.id_partida} className="bg-[#111111] p-5 rounded-md border border-[#202020] hover:border-[#7DFF00]/50 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-[#050505] border border-[#202020] text-xs px-3 py-1 rounded-md text-[#BDBDBD]">
                        {jogo.data_hora}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-6 px-2">
                      <div className="text-center font-bold text-white text-lg">{jogo.mandante}</div>
                      <div className="text-sm font-medium text-[#BDBDBD] bg-[#050505] px-2 py-1 rounded">X</div>
                      <div className="text-center font-bold text-white text-lg">{jogo.visitante}</div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => selecionarPalpite(jogo, 'casa', jogo.odd_mandante)} 
                        className={`flex-1 py-2 rounded-md transition border text-center group
                          ${isSelecionado(jogo.id_partida, 'casa') ? 'bg-[#7DFF00] border-[#7DFF00]' : 'bg-[#0A0A0A] border-[#202020] hover:border-[#7DFF00]/50'}
                        `}
                      >
                        <div className={`text-[10px] font-medium mb-1 ${isSelecionado(jogo.id_partida, 'casa') ? 'text-[#050505]' : 'text-[#BDBDBD]'}`}>CASA</div>
                        <div className={`font-bold ${isSelecionado(jogo.id_partida, 'casa') ? 'text-[#050505]' : 'text-white'}`}>{parseFloat(jogo.odd_mandante).toFixed(2)}</div>
                      </button>

                      <button 
                        onClick={() => selecionarPalpite(jogo, 'empate', jogo.odd_empate)} 
                        className={`flex-1 py-2 rounded-md transition border text-center group
                          ${isSelecionado(jogo.id_partida, 'empate') ? 'bg-[#7DFF00] border-[#7DFF00]' : 'bg-[#0A0A0A] border-[#202020] hover:border-[#7DFF00]/50'}
                        `}
                      >
                        <div className={`text-[10px] font-medium mb-1 ${isSelecionado(jogo.id_partida, 'empate') ? 'text-[#050505]' : 'text-[#BDBDBD]'}`}>EMPATE</div>
                        <div className={`font-bold ${isSelecionado(jogo.id_partida, 'empate') ? 'text-[#050505]' : 'text-white'}`}>{parseFloat(jogo.odd_empate).toFixed(2)}</div>
                      </button>

                      <button 
                        onClick={() => selecionarPalpite(jogo, 'visitante', jogo.odd_visitante)} 
                        className={`flex-1 py-2 rounded-md transition border text-center group
                          ${isSelecionado(jogo.id_partida, 'visitante') ? 'bg-[#7DFF00] border-[#7DFF00]' : 'bg-[#0A0A0A] border-[#202020] hover:border-[#7DFF00]/50'}
                        `}
                      >
                        <div className={`text-[10px] font-medium mb-1 ${isSelecionado(jogo.id_partida, 'visitante') ? 'text-[#050505]' : 'text-[#BDBDBD]'}`}>VISITANTE</div>
                        <div className={`font-bold ${isSelecionado(jogo.id_partida, 'visitante') ? 'text-[#050505]' : 'text-white'}`}>{parseFloat(jogo.odd_visitante).toFixed(2)}</div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= COLUNA DIREITA (BILHETE MULTIPLA) ================= */}
          <aside className="w-[340px] shrink-0 bg-[#111111] rounded-md border border-[#202020] p-6 h-fit sticky top-0 flex flex-col">
            <div className="flex items-center gap-3 mb-6 text-[#7DFF00] border-b border-[#202020] pb-4">
              <Ticket size={24} />
              <h2 className="text-lg font-bold text-white">Bilhete de Apostas</h2>
            </div>
            
            {mensagem && (
              <div className={`p-3 rounded-md mb-6 text-sm text-center border ${mensagem.includes('✅') ? 'bg-[#7DFF00]/10 border-[#7DFF00] text-[#7DFF00]' : 'bg-red-900/20 border-red-500 text-red-500'}`}>
                {mensagem}
              </div>
            )}

            {apostasSelecionadas.length > 0 ? (
              <div className="flex flex-col gap-4">
                
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-[#202020] scrollbar-track-transparent">
                  {apostasSelecionadas.map((aposta) => (
                    <div key={aposta.jogoId} className="bg-[#050505] border border-[#202020] p-3 rounded-md relative group">
                      <button 
                        onClick={() => removerAposta(aposta.jogoId)}
                        className="absolute top-2 right-2 text-[#555] hover:text-red-500 transition"
                        title="Remover jogo"
                      >
                        <X size={16} />
                      </button>
                      <div className="text-[11px] text-[#BDBDBD] mb-1.5 pr-6">{aposta.confronto}</div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#7DFF00] text-sm">{aposta.palpiteExibicao}</span>
                        <span className="font-bold text-white text-sm">{aposta.odd.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#202020] pt-4 mt-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-[#BDBDBD]">Odd Total:</span>
                    <span className="font-bold text-white bg-[#050505] border border-[#202020] px-3 py-1 rounded text-lg">
                      {oddTotal}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-medium text-[#BDBDBD] mb-2 block">Valor da Aposta (R$)</label>
                    <input 
                      type="number" 
                      value={valorAposta}
                      onChange={(e) => setValorAposta(e.target.value)}
                      placeholder="0.00" 
                      className="w-full p-3 bg-[#050505] border border-[#202020] rounded-md text-white focus:outline-none focus:border-[#7DFF00] transition"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-[#050505] rounded-md border border-[#202020]">
                    <span className="text-sm font-medium text-[#BDBDBD]">Retornos:</span>
                    <strong className="text-[#7DFF00] text-lg">R$ {retornoPotencial}</strong>
                  </div>

                  <button 
                    onClick={finalizarAposta}
                    className="w-full py-4 mt-4 bg-[#7DFF00] hover:bg-[#56C800] text-[#050505] rounded-md font-bold transition text-lg shadow-[0_0_15px_rgba(125,255,0,0.2)] hover:shadow-[0_0_25px_rgba(125,255,0,0.4)]"
                  >
                    Apostar Agora
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-[#BDBDBD] text-sm">Seu bilhete está vazio.</p>
                <p className="text-xs text-[#555555] mt-2">Clique nas odds dos jogos para adicionar uma aposta múltipla.</p>
              </div>
            )}
          </aside>

        </div>
      </main>
    </div>
  );
}