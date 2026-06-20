import { usePage } from '@inertiajs/react';
export default function BonusCardComponent () {
    const { auth } = usePage().props;
    return (
        <div className="relative w-full overflow-hidden rounded-3xl border border-lime-500/20 bg-[#000] p-8">

            <div
                className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-lime-500/20 blur-3xl">
            </div>


            <div className="relative z-10 flex items-center justify-between gap-8">

                <div>
            <span className="text-sm uppercase tracking-widest text-gray-400">
                Bônus de Boas-Vindas
            </span>

                    <h2 className="mt-3 text-4xl font-extrabold leading-none text-white">
                        BÔNUS DE
                    </h2>

                    <div className="mt-1 text-7xl font-black text-lime-400">
                        100%
                    </div>

                    <p className="mt-2 text-2xl font-bold text-white">
                        NO SEU 1º DEPÓSITO
                    </p>

                    <button
                        className="mt-8 rounded-xl bg-[#7DFF00] px-8 py-4 font-bold text-black transition hover:bg-lime-300">
                            {auth.user ? (
                                <a href="/dashboard">Pegue seu bônus!</a>
                            ) : (
                                <a href="/cadastro">Cadastre-se agora → </a>
                            )}
                    </button>
                </div>


                <div className="hidden md:flex items-center justify-center">
                    <div className="relative">

                        <div
                            className="absolute inset-0 rounded-full bg-lime-500/30 blur-[80px]">
                        </div>

                        <div
                            className="relative flex h-52 w-52 items-center justify-center rounded-3xl border border-lime-400/20 bg-gradient-to-br from-[#161616] to-[#0d0d0d] shadow-[0_0_40px_rgba(132,255,0,0.25)]">

                            <img src="images/gift-svgrepo-com.svg" alt="Ícone de presente" srcset="" />

                        </div>

                    </div>
                </div>

            </div>
        </div>

    )
}
