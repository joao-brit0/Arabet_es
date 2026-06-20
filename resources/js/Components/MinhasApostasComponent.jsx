
export default function MinhasApostasComponent({dadosApostas}) {
    console.log(dadosApostas);
  if (!dadosApostas || dadosApostas.length === 0 || dadosApostas[0].id_aposta === null) {
        return (
            <div className="min-h-screen bg-[#121212] p-8 flex justify-center items-center">
                <div className="text-center text-gray-500 bg-[#1E1E1E] p-10 rounded-2xl border border-[#333]">
                    <p className="text-lg">Você ainda não fez nenhuma aposta.</p>
                </div>
            </div>
        );
    }

    
    const usuario = {
        nome: dadosApostas[0].nome,
        saldo: parseFloat(dadosApostas[0].saldo)
    };


    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    const formatarData = (dataSql) => {
        const data = new Date(dataSql);
        return new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        }).format(data);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'GANHA':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'PERDIDA':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'CANCELADA':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default: // PENDENTE
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                
                {/* CABEÇALHO DO USUÁRIO */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1E1E1E] p-6 rounded-2xl border border-[#333] shadow-lg">
                    <div>
                        <h1 className="text-2xl font-black text-white">Minhas Apostas</h1>
                        <p className="text-gray-400 text-sm mt-1">{usuario.nome}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Saldo Disponível</p>
                        <p className="text-2xl font-bold text-lime-400">{formatarMoeda(usuario.saldo)}</p>
                    </div>
                </header>

                {/* LISTA DE APOSTAS */}
                <div className="space-y-4">
                    {dadosApostas.map((aposta) => {
                        const valorAposta = parseFloat(aposta.valor_aposta);
                        const odd = parseFloat(aposta.odd_momento);
                        const retornoPotencial = valorAposta * odd;

                        return (
                            <div key={aposta.id_aposta} className="bg-[#171717] rounded-xl border border-[#202020] p-5 shadow-sm hover:border-[#333] transition-colors relative overflow-hidden">
                                
                                {/* Borda lateral colorida para dar destaque ao status */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                    aposta.status_aposta === 'GANHA' ? 'bg-green-500' : 
                                    aposta.status_aposta === 'PERDIDA' ? 'bg-red-500' : 
                                    aposta.status_aposta === 'PENDENTE' ? 'bg-yellow-500' : 'bg-gray-500'
                                }`}></div>

                                <div className="flex flex-col md:flex-row justify-between pl-3 gap-4">
                                    
                                    {/* INFO DO JOGO */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${getStatusStyle(aposta.status_aposta)}`}>
                                                {aposta.status_aposta}
                                            </span>
                                            <span className="text-xs text-gray-500">{formatarData(aposta.data_aposta)}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white tracking-wide">
                                            {aposta.confronto}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Palpite: <strong className="text-gray-200">{aposta.palpite}</strong>
                                        </p>
                                    </div>

                                    {/* VALORES E ODDS */}
                                    <div className="flex items-center gap-6 bg-[#121212] p-4 rounded-lg border border-[#202020]">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Aposta</p>
                                            <p className="text-sm font-semibold text-white">{formatarMoeda(valorAposta)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 mb-1">Odd</p>
                                            <p className="text-sm font-bold text-blue-400">x{odd.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">
                                                {aposta.status_aposta === 'GANHA' ? 'Retorno' : 'Retorno Potencial'}
                                            </p>
                                            <p className={`text-base font-bold ${aposta.status_aposta === 'PERDIDA' ? 'text-gray-600 line-through' : 'text-lime-400'}`}>
                                                {formatarMoeda(retornoPotencial)}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
