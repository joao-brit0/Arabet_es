import { useState } from 'react';
import { 
  Home, Ticket, Gift, Settings, Search, Bell, User, Tag, CheckCircle, Clock, AlertCircle 
} from 'lucide-react'
export default function BonusScreenComponent() {

    const [codigoInput, setCodigoInput] = useState('');
  const [mensagem, setMensagem] = useState(null);

  // Mock de dados para os cupons (Simulando o que viria do banco)
  const [cupons, setCupons] = useState([
    {
      id: 1,
      codigo: 'BEMVINDO200',
      descricao: 'Bônus de 100% no seu primeiro depósito até R$ 200,00',
      validade: '2026-12-31',
      status: 'DISPONIVEL',
      tipo: 'BÔNUS'
    },
    {
      id: 2,
      codigo: 'FREEBET50',
      descricao: 'Aposta grátis para jogos do Campeonato Alagoano',
      validade: '2026-06-30',
      status: 'USADO',
      tipo: 'APOSTA GRÁTIS'
    },
    {
      id: 3,
      codigo: 'ARABET10',
      descricao: 'Cashback de 10% em apostas perdidas no final de semana',
      validade: '2026-06-15',
      status: 'EXPIRADO',
      tipo: 'CASHBACK'
    }
  ]);

  const resgatarCupom = () => {
    if (!codigoInput) return;
    // Simulação de resgate
    setMensagem({ text: 'Validando cupom...', type: 'loading' });
    
    setTimeout(() => {
      setMensagem({ text: 'Cupom resgatado com sucesso!', type: 'success' });
      setCodigoInput('');
      setTimeout(() => setMensagem(null), 3000);
    }, 1500);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DISPONIVEL': return 'text-lime-400 bg-lime-400/10 border-lime-400/20';
      case 'USADO': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'EXPIRADO': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };
  return ( 
    <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            
            <h2 className="text-2xl font-black mb-6">Central de Cupons</h2>

            {/* BOX DE RESGATE */}
            <div className="bg-[#0A0A0A] border border-[#202020] p-6 rounded-2xl mb-10">
              <label className="block text-sm text-gray-400 mb-3">Tem um código promocional? Digite abaixo:</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                  placeholder="EX: TRABALHO10"
                  className="flex-1 bg-[#111111] border border-[#202020] rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#7DFF00] transition font-mono tracking-widest"
                />
                <button 
                  onClick={resgatarCupom}
                  className="bg-[#7DFF00] text-black font-bold px-8 rounded-xl hover:bg-lime-300 transition"
                >
                  Resgatar
                </button>
              </div>
              {mensagem && (
                <p className={`mt-3 text-sm font-medium ${mensagem.type === 'success' ? 'text-lime-400' : 'text-gray-400'}`}>
                  {mensagem.text}
                </p>
              )}
            </div>

            {/* LISTA DE CUPONS */}
            <div className="space-y-4">
              {cupons.map((cupom) => (
                <div 
                  key={cupom.id} 
                  className={`bg-[#111111] border border-[#202020] p-6 rounded-2xl flex justify-between items-center relative overflow-hidden transition-all hover:border-[#333] ${cupom.status !== 'DISPONIVEL' ? 'opacity-60' : ''}`}
                >
                  {/* Ícone de fundo decorativo */}
                  <Tag className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-12" />

                  <div className="flex items-start gap-5">
                    <div className={`p-4 rounded-xl ${getStatusStyle(cupom.status)} bg-opacity-10 border`}>
                      <Gift size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold font-mono tracking-tighter text-white">{cupom.codigo}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusStyle(cupom.status)}`}>
                          {cupom.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm max-w-md">{cupom.descricao}</p>
                      <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500 uppercase font-bold tracking-widest">
                        <span className="flex items-center gap-1"><Clock size={12}/> Válido até: {new Date(cupom.validade).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Tag size={12}/> Tipo: {cupom.tipo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {cupom.status === 'DISPONIVEL' ? (
                      <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2 rounded-lg text-sm font-bold transition">
                        Ativar Agora
                      </button>
                    ) : cupom.status === 'USADO' ? (
                      <span className="flex items-center gap-2 text-blue-400 text-sm font-bold">
                        <CheckCircle size={18} /> Resgatado
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-400 text-sm font-bold">
                        <AlertCircle size={18} /> Expirado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
  )
    
}
