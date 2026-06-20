<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - AraBet</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-[#0D0D0D]">
    <section class="min-h-screen flex flex-col items-center justify-center p-6 relative">
        
        <div class="fixed top-0 left-0 h-full w-full overflow-hidden -z-10">
            <div class="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-lime-500/10 blur-[150px]"></div>
        </div>

        <div class="w-full max-w-lg rounded-3xl border border-[#202020] bg-[#111111] p-8 shadow-[0_0_40px_rgba(0,0,0,.5)]">
            
            <div class="text-center mb-8">
                <h2 class="text-3xl font-black text-white">Acessar Conta</h2>
                <p class="text-gray-400 mt-2">Bem-vindo de volta à AraBet</p>
            </div>

            @if ($errors->any())
                <div class="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-center text-sm text-red-400">
                    {{ $errors->first() }}
                </div>
            @endif

            <form action="{{ route('login.authenticate') }}" method="POST" class="space-y-5">
                @csrf

                <div>
                    <label class="block text-sm text-gray-400 mb-2">E-mail</label>
                    <input type="email" name="email" value="{{ old('email') }}" required class="w-full rounded-2xl border border-[#202020] bg-[#171717] px-5 py-4 text-white focus:border-lime-400 outline-none transition" placeholder="email@exemplo.com">
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-2">Senha</label>
                    <input type="password" name="password" required class="w-full rounded-2xl border border-[#202020] bg-[#171717] px-5 py-4 text-white focus:border-lime-400 outline-none transition" placeholder="••••••••">
                </div>

                <button type="submit" class="w-full rounded-2xl bg-lime-400 py-4 font-bold text-black transition hover:bg-lime-300 mt-4">
                    Entrar
                </button>

                <div class="text-center mt-6">
                    <p class="text-gray-500 text-sm">Não tem uma conta? 
                        <a href="{{ route('cadastro.index') }}" class="text-lime-400 hover:text-lime-300 transition">Cadastre-se</a>
                    </p>
                </div>
            </form>

        </div>
        <a href="/" class="text-gray-500 underline hover:text-lime-300 transition mt-2">Início</a>
    </section>
</body>
</html>