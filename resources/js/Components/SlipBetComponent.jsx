import {useState} from 'react'
import { usePage } from '@inertiajs/react';
export default function SlipBetComponent () {
    const { auth } = usePage().props;
    const [selectItem, setSelectItem] = useState(2)
    const [bet, setBet] = useState(50)
    const [odd, setOdd] = useState(3.2)
    const [betResult, setBetResult] = useState(160)

    function slipBet (odd) {
        setOdd(odd)
        if (bet > 0 && bet * odd <= 100000) {
            setBetResult(bet * odd)
        }
    }

    return (
        <section className="relative w-[500px] overflow-hidden rounded-3xl border border-lime-500/20 bg-[#0D0D0D] p-4">

            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-lime-500/10 blur-[120px]"></div>

            <div className="relative z-10 grid gap-10 lg:grid-cols-1">

                <div>
            <span className="text-lime-400 font-semibold">
                Simule sua aposta
            </span>

                    <h2 className="mt-3 text-2xl font-black text-white">
                        Descubra quanto você pode ganhar
                    </h2>

                    <p className="mt-4 text-gray-400 text-md">
                        Veja como é simples apostar no Campeonato Alagoano e receba seus ganhos rapidamente.
                    </p>

                    {auth.user ? ('') : (
                        <button
                        className="mt-8 rounded-lg bg-lime-400 px-6 py-4 font-bold text-black transition hover:bg-lime-300">
                        Criar conta grátis
                        </button>
                    )}
                </div>


                <div className="rounded-3xl border border-[#202020] bg-[#111111] p-6 shadow-[0_0_40px_rgba(125,255,0,.12)]">

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                CSA x CRB
                            </h3>

                            <span className="text-sm text-gray-400">
                        Campeonato Alagoano
                    </span>
                        </div>

                        <span
                            className="rounded-full bg-lime-400/10 px-3 py-1 text-sm font-semibold text-lime-400">
                    AO VIVO
                </span>
                    </div>

                    <div className="mt-8 space-y-3">

                        <button
                            className={`flex w-full items-center justify-between rounded-2xl border border-[#202020] bg-[#171717] px-5 py-4 text-white transition hover:border-lime-400 ${selectItem == 1 ? 'border-lime-400 bg-lime-400/10' : ''}`} onClick={() => {setSelectItem(1); slipBet(2.1)}}>
                            <span>Vitória do CRB</span>
                            <span className="font-bold text-lime-400">2.10</span>
                        </button>
                        <button
                            className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-white border-[#202020] bg-[#171717]  ${selectItem == 2 ? 'border-lime-400 bg-lime-400/10' : ''}`} onClick={() => {setSelectItem(2); slipBet(3.2)}}>
                            <span>Empate</span>
                            <span className="font-bold text-lime-400">3.20</span>
                        </button>

                        <button
                            className={`flex w-full items-center justify-between rounded-2xl border border-[#202020] bg-[#171717] px-5 py-4 text-white transition hover:border-lime-400 ${selectItem == 3 ? 'border-lime-400 bg-lime-400/10' : ''}`} onClick={() => {setSelectItem(3); slipBet(2.5)}}>
                            <span>Vitória do CSA</span>
                            <span className="font-bold text-lime-400">2.50</span>
                        </button>

                    </div>

                    <div className="my-8 h-px bg-[#202020]"></div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-400">
                            Valor da aposta
                        </label>

                        <input type="number" className="mt-2 rounded-2xl border border-[#202020] bg-[#171717] px-5 py-4 text-xl font-bold text-white" placeholder="R$ 50,00" value={bet} onChange={(e) => {setBet(parseFloat(e.target.value) || 0); slipBet(odd);}} />

                    </div>

                    <div className="mt-8 flex items-center justify-between">

                        <div>
                            <p className="text-gray-400">
                                Retorno estimado
                            </p>

                            <div className="mt-1 text-4xl font-black text-lime-400">
                                R$ {betResult.toFixed(2)}
                            </div>
                        </div>

                        <button
                            className="rounded-2xl bg-lime-400 px-6 py-4 font-bold text-black transition hover:bg-lime-300">
                            Apostar Agora
                        </button>

                    </div>

                </div>

            </div>

        </section>

    )
}
