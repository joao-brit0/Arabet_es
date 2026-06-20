import BonusCardComponent from "@/Components/BonusCardComponent.jsx";
import FooterComponent from "@/Components/FooterComponent";
import SlipBetComponent from "@/Components/SlipBetComponent.jsx";
import { usePage, Link } from '@inertiajs/react';
import { User } from 'lucide-react';

export default function Home () {

    const { auth } = usePage().props;
    return (
        <>
        <header>
            <nav>
                <ul className="text-white flex justify-between p-5">
                    <div className="flex items-center gap-4">
                        <img src="images/logo.png" alt="logo da casa de aposta AraBet"
                             className="w-30 h-10 mr-16"/>
                        <li><a href="/dashboard" className="hover:text-[#7DFF00] transition">Jogos</a></li>
                        <li><a href="/dashboard" className="hover:text-[#7DFF00] transition">Ao vivo</a></li>
                        <li><a href="#" className="hover:text-[#7DFF00] transition">Tabelas</a></li>
                        <li><a href="#" className="hover:text-[#7DFF00] transition">VIP</a></li>
                        <li><a href="#" className="hover:text-[#7DFF00] transition">Suporte</a></li>
                    </div>
                    <div className="flex items-center gap-4">
                        <li><a href="/login" className="text-[#7DFF00] flex items-center gap-2 mr-5 hover:text-white"><img
                            src="images/gift-svgrepo-com.svg" alt="ìcone de uma caixa de presente"
                            className="w-6"/>Promoções</a></li>
                        {auth.user ? (
                            <>
                            <a href="/dashboard" className="flex items-center gap-2 hover:text-[#7DFF00] transition">Painel</a>
                            <div className="w-10 h-10 rounded-md bg-[#111111] border border-[#202020] text-[#BDBDBD] hover:text-[#7DFF00] hover:border-[#7DFF00] transition cursor-pointer flex items-center justify-center">
                                <Link href="/perfil" className="flex items-center gap-2">
                                    <User size={20} />
                                </Link>
                                          
                                        </div>
                            </>
                        ) : (
                            <>
                            <li><a href="/login" className="px-5 py-2 border border-[#202020] rounded-md">Entrar</a></li>
                            <li><a href="/cadastro" className="px-5 py-2 bg-[#7DFF00] text-[#050505] font-medium rounded-md">Cadastre-se</a>
                            </li>
                            </>
                        )}
                        
                    </div>
                </ul>
            </nav>
        </header>
    <main className="flex flex-col w-full">
        <div className="w-full h-[600px] bg-[url(images/background.png)] bg-cover p-10">
            <div className="mt-10">
                <h2 className="text-white font-bold text-5xl">AQUI, SUA PAIXÃO</h2>
                <h2 className="text-[#7DFF00] font-bold text-5xl">VIRA JOGO.</h2>
                <p className="text-[#BDBDBD] text-lg mt-2 w-[310px]">As melhores odds, os maiores eventos e a emoção que você
                    merece!</p>
            </div>
            {auth.user ? (
                <div className="flex items-center gap-6 mt-10">
                    <a href="/dashboard" className="px-6 py-3 w-60 text-center bg-[#7DFF00] text-[#050505] font-semibold rounded-md hover:bg-[#7DFF00]/90 transition">Apostar Agora</a>
                </div>
            ) : (
                <div className="flex mt-6 gap-4">
                    <a href="/cadastro"
                    className="text-[#050505] bg-[#7DFF00] font-medium px-7 py-3 rounded-md hover:bg-[#56C800] transition">Cadastre-se
                        agora</a>
                    <a href="/login" className="text-white font-medium px-7 py-3 border border-[#202020] rounded-md ">Explorar</a>
                </div>
            )}
            <div className="flex items-center gap-6 text-sm mt-10 text-[#BDBDBD]">
                <p className="flex items-center gap-2"><img src="images/security-verified-svgrepo-com (1).svg"
                                                            alt="ícone de segurança" className="w-6"/>Pagamentos rápidos e
                    seguros</p>
                <p className="flex items-center gap-2"><img src="images/headset-svgrepo-com.svg"
                                                            alt="ícone de fone" className="w-6"/>Suporte 24/7</p>
                <p className="flex items-center gap-2"><img src="images/cup-1-svgrepo-com.svg"
                                                            alt="ícone de uma taça" className="w-6"/>As melhores odds do
                    mercado</p>
            </div>
        </div>
        <section className="flex items-start gap-6 mt-10 w-full">
    
            {/* Container do vídeo: o flex-1 faz ele ocupar o espaço restante, 
                e min-w-0 permite que ele encolha abaixo do seu tamanho base */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[#BDBDBD] font-medium text-lg mb-2">🔴Ao vivo</h3>
                
                <iframe 
                    className="w-full aspect-video rounded-md" 
                    src="https://www.youtube.com/embed/-QlNMqIoD6Y?si=5Ydp5oB6Bx26srI1"
                    title="YouTube video player" 
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </div>

            {/* Container do componente de apostas: shrink-0 impede que ele seja esmagado
                pelo vídeo em telas menores. Ajuste o 'w-[300px]' para a largura real dele. */}
            <div className="w-[500px] shrink-0">
                <SlipBetComponent />
            </div>

        </section>
        <section className="mt-20 bg-[url(images/footer_grid.svg)] bg-cover">
            <h2 className="text-3xl font-bold text-white mb-10">Bônus e Promoções</h2>
            <div className="flex gap-6">
                <BonusCardComponent title="Bônus de Boas-Vindas" description="Ganhe um bônus de 100% no seu primeiro depósito, até R$500!" imageUrl="images/bonus1.png" />
            </div>
        </section>
    </main>
    <FooterComponent />
    </>
)
}