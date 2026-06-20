import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Lock, Save, ArrowLeft, Shield, Award, Wallet 
} from 'lucide-react';

import { usePage, Link } from '@inertiajs/react';

export default function Perfil() {
  const USUARIO_ID = usePage().props.auth.user.id_usuario;

  // Estados do formulário de dados
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '',
    email: '',
    cpf: '' // Geralmente bloqueado para edição em casas de apostas
  });

  // Estados para alteração de senha
  const [senhas, setSenhas] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [estatisticas, setEstatisticas] = useState({
    saldo: 0,
    apostasRealizadas: 0,
    taxaAcerto: 0
  });

  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [carregando, setCarregando] = useState(false);

  // Buscar dados atuais do usuário no banco
  useEffect(() => {
    const buscarDadosUsuario = async () => {
      try {
        const resposta = await fetch(`http://localhost:8000/api/usuario/${USUARIO_ID}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setDadosUsuario({
            nome: dados.nome || '',
            email: dados.email || '',
            cpf: dados.cpf || '***.***.***-**'
          });
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
      }
    };

    buscarDadosUsuario();
  }, []);

  useEffect(() => {
    // Simulação de busca de estatísticas do usuário
    const buscarEstatisticas = async () => {
      try {
        const resposta = await fetch(`http://localhost:8000/api/historico/${USUARIO_ID}`);
        
        if (resposta.ok) {
          const dados = await resposta.json();
          
          // Se o usuário não tiver nenhuma aposta, zera tudo para não dar erro
          if (!dados || dados.length === 0) {
            setEstatisticas({
              saldo: 0,
              apostasRealizadas: 0,
              taxaAcerto: 0,
              totalGanho: 0
            });
            return;
          }

          // 1. Variáveis auxiliares para o cálculo
          let apostasConcluidas = 0;
          let apostasGanhas = 0;
          let valorTotalGanho = 0;

          // 2. Percorre o array para somar os valores
          dados.forEach(aposta => {
            // Conta apenas jogos finalizados para a taxa de acerto ser realista
            if (aposta.status_aposta === 'GANHA' || aposta.status_aposta === 'PERDIDA') {
                apostasConcluidas++;
                
                if (aposta.status_aposta === 'GANHA') {
                    apostasGanhas++;
                    // O retorno de uma aposta ganha é o valor apostado multiplicado pela odd
                    const retorno = parseFloat(aposta.valor_aposta) * parseFloat(aposta.odd_momento);
                    valorTotalGanho += retorno;
                }
            }
          });

          // 3. Calcula a porcentagem de acerto (evita divisão por zero)
          const taxaAcerto = apostasConcluidas > 0 
            ? Math.round((apostasGanhas / apostasConcluidas) * 100) 
            : 0;

          // 4. Atualiza o estado com os dados reais calculados
          setEstatisticas({
            saldo: parseFloat(dados[0].saldo || 0), // Pega o saldo atual do primeiro registro
            apostasRealizadas: dados.length,        // Total de apostas feitas
            taxaAcerto: taxaAcerto,                 // Porcentagem de acerto
            totalGanho: valorTotalGanho             // R$ total que já retornou para o bolso
          });

        }
      } catch (erro) {
        console.error("Erro ao carregar estatísticas:", erro);
      }
  };

    buscarEstatisticas();
  }, []);

  // Lidar com atualização de dados pessoais (PUT)
  const salvarDadosPessoais = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ texto: '', tipo: '' });

    try {
      const resposta = await fetch(`http://localhost:8000/api/usuario/${USUARIO_ID}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dadosUsuario)
      });

      if (resposta.ok) {
        setMensagem({ texto: '✅ Dados atualizados com sucesso!', tipo: 'sucesso' });
      } else {
        const erro = await resposta.json();
        setMensagem({ texto: `❌ ${erro.message || 'Erro ao atualizar dados.'}`, tipo: 'erro' });
      }
    } catch (erro) {
      setMensagem({ texto: '❌ Erro de conexão com o servidor.', tipo: 'erro' });
    } finally {
      setCarregando(false);
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 5000);
    }
  };

  // Lidar com alteração de senha
  const atualizarSenha = async (e) => {
    e.preventDefault();
    if (senhas.novaSenha !== senhas.confirmarSenha) {
      setMensagem({ texto: '❌ A nova senha e a confirmação não batem.', tipo: 'erro' });
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch(`http://localhost:8000/api/usuario/${USUARIO_ID}/senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senha_atual: senhas.senhaAtual,
          nova_senha: senhas.novaSenha
        })
      });

      if (resposta.ok) {
        setMensagem({ texto: '🔒 Senha alterada com segurança!', tipo: 'sucesso' });
        setSenhas({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      } else {
        setMensagem({ texto: '❌ Senha atual incorreta.', tipo: 'erro' });
      }
    } catch (erro) {
      setMensagem({ texto: '❌ Erro de conexão.', tipo: 'erro' });
    } finally {
      setCarregando(false);
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 5000);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans flex flex-col items-center py-10 px-4">
      
      {/* Cabeçalho da página */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#BDBDBD] hover:text-[#7DFF00] transition group">
          <button 
           // Volta para o Dashboard
          className="flex items-center gap-2 text-[#BDBDBD] hover:text-[#7DFF00] transition group"
        >
          <div className="p-2 bg-[#111111] border border-[#202020] rounded-lg group-hover:border-[#7DFF00] transition">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Voltar ao Dashboard</span>
        </button>
        </Link>
        

        <h1 className="text-2xl font-bold flex items-center gap-3">
          <User className="text-[#7DFF00]" size={28} /> Minha Conta
        </h1>
      </div>

      {mensagem.texto && (
        <div className={`w-full max-w-5xl p-4 rounded-lg mb-6 border font-medium ${mensagem.tipo === 'sucesso' ? 'bg-[#7DFF00]/10 border-[#7DFF00] text-[#7DFF00]' : 'bg-red-900/20 border-red-500 text-red-500'}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ================= COLUNA ESQUERDA (Resumo do Usuário) ================= */}
        <aside className="md:col-span-1 space-y-6">
          
          {/* Card Perfil */}
          <div className="bg-[#111111] border border-[#202020] rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7DFF00] to-transparent"></div>
            <div className="w-24 h-24 bg-[#050505] border-2 border-[#7DFF00] rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <User size={40} className="text-[#7DFF00]" />
            </div>
            <h2 className="text-xl font-bold">{dadosUsuario.nome || 'Carregando...'}</h2>
            <p className="text-sm text-[#BDBDBD] mb-6">{dadosUsuario.email}</p>

            <div className="flex flex-col gap-3">
              <div className="bg-[#050505] p-3 rounded-lg border border-[#202020] flex items-center gap-3">
                <Wallet className="text-green-500" size={20} />
                <div className="text-left">
                  <p className="text-[10px] text-[#BDBDBD] uppercase font-bold">Saldo Disponível</p>
                  <p className="text-lg font-bold text-white">R$ {estatisticas.saldo.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Estatísticas */}
          <div className="bg-[#111111] border border-[#202020] rounded-xl p-6">
            <h3 className="font-bold text-sm text-[#BDBDBD] mb-4 uppercase flex items-center gap-2">
              <Award size={16} /> Estatísticas
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#202020]">
                <span className="text-sm text-[#BDBDBD]">Apostas Realizadas</span>
                <span className="font-bold text-white">{estatisticas.apostasRealizadas}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#202020]">
                <span className="text-sm text-[#BDBDBD]">Taxa de Acerto</span>
                <span className="font-bold text-[#7DFF00]">{estatisticas.taxaAcerto}%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#202020]">
                <span className="text-sm text-[#BDBDBD]">Total Ganho</span>
                <span className="font-bold text-[#7DFF00]">R$ {estatisticas.totalGanho}</span>
              </div>
              <div className="flex justify-between items-center pb-3">
                <span className="text-sm text-[#BDBDBD]">Status da Conta</span>
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-md font-bold flex items-center gap-1">
                  <Shield size={12} /> VERIFICADA
                </span>
              </div>
            </div>
          </div>
          <Link 
  href="/logout" 
  method="post" 
  as="button" 
  className="flex items-center text-[#BDBDBD] hover:text-red-400 p-3 rounded-md transition w-full "
>
  Sair da Conta
</Link>
        </aside>

        {/* ================= COLUNA DIREITA (Formulários) ================= */}
        <main className="md:col-span-2 space-y-6">
          
          {/* Dados Pessoais */}
          <div className="bg-[#111111] border border-[#202020] rounded-xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User size={22} className="text-[#BDBDBD]" /> Informações Pessoais
            </h2>

            <form onSubmit={salvarDadosPessoais} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#BDBDBD] uppercase">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                    <input 
                      type="text" 
                      value={dadosUsuario.nome}
                      onChange={(e) => setDadosUsuario({...dadosUsuario, nome: e.target.value})}
                      className="w-full bg-[#050505] border border-[#202020] focus:border-[#7DFF00] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#BDBDBD] uppercase">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                    <input 
                      type="email" 
                      value={dadosUsuario.email}
                      onChange={(e) => setDadosUsuario({...dadosUsuario, email: e.target.value})}
                      className="w-full bg-[#050505] border border-[#202020] focus:border-[#7DFF00] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none transition"
                      required
                    />
                  </div>
                </div>

                

                {/* CPF - Somente Leitura */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#BDBDBD] uppercase">CPF (Inalterável)</label>
                  <div className="relative opacity-60">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={18} />
                    <input 
                      type="text" 
                      value={dadosUsuario.cpf}
                      disabled
                      className="w-full bg-[#0A0A0A] border border-[#202020] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#777] outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={carregando}
                  className="bg-[#7DFF00] hover:bg-[#56C800] text-[#050505] font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} /> {carregando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>

          {/* Segurança / Alterar Senha */}
          <div className="bg-[#111111] border border-[#202020] rounded-xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <Lock size={22} className="text-[#BDBDBD]" /> Segurança
            </h2>

            <form onSubmit={atualizarSenha} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#BDBDBD] uppercase">Senha Atual</label>
                  <input 
                    type="password" 
                    value={senhas.senhaAtual}
                    onChange={(e) => setSenhas({...senhas, senhaAtual: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-[#202020] focus:border-[#7DFF00] rounded-lg py-2.5 px-4 text-sm text-white outline-none transition"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#BDBDBD] uppercase">Nova Senha</label>
                  <input 
                    type="password" 
                    value={senhas.novaSenha}
                    onChange={(e) => setSenhas({...senhas, novaSenha: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-[#202020] focus:border-[#7DFF00] rounded-lg py-2.5 px-4 text-sm text-white outline-none transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#BDBDBD] uppercase">Confirmar Nova</label>
                  <input 
                    type="password" 
                    value={senhas.confirmarSenha}
                    onChange={(e) => setSenhas({...senhas, confirmarSenha: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-[#202020] focus:border-[#7DFF00] rounded-lg py-2.5 px-4 text-sm text-white outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={carregando}
                  className="bg-transparent border border-[#7DFF00] text-[#7DFF00] hover:bg-[#7DFF00] hover:text-[#050505] font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock size={18} /> Atualizar Senha
                </button>
              </div>
            </form>
          </div>

        </main>

      </div>
    </div>
  );
}