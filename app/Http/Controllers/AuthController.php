<?php 

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function create()
    {
        return view('cadastro');
    }
    public function store(Request $request)
    {
        // 1. Validando TUDO (incluindo o 'tipo')
        $request->validate([
            'nome' => 'required|string|max:100',
            'cpf' => ['required', 'string', 'size:11', Rule::unique(User::class, 'cpf')],
            'email' => ['required', 'email', Rule::unique(User::class, 'email')],
            'password' => 'required|min:6',
            'tipo' => 'required|string|in:ADMINISTRADOR,APOSTADOR', 
            'data_nascimento' => 'required_if:tipo,APOSTADOR|date|before_or_equal:-18 years',
        ]);

        try {
            // Ajustamos a transação para retornar o objeto $user criado
            $user = DB::transaction(function () use ($request) {
                // 1. Cria o registro base na tabela arabetdb.usuario
                $user = User::create([
                    'nome' => $request->nome,
                    'cpf' => $request->cpf,
                    'email' => $request->email,
                    'senha' => Hash::make($request->password),
                    'tipo' => $request->tipo,
                ]);

                // 2. SE FOR APOSTADOR, cria a carteira
                if ($request->tipo === 'APOSTADOR') {
                    DB::table('arabetdb.apostador')->insert([
                        'id_usuario' => $user->id_usuario,
                        'data_nascimento' => $request->data_nascimento,
                        'saldo' => 0.00,
                    ]);
                }

                return $user; // Retorna o usuário para fora da Closure
            });

            // 👇 MÁGICA AQUI: Autentica o usuário recém-criado na sessão do Laravel
            Auth::login($user);

            // Boa prática de segurança: gera um novo ID de sessão após logar
            $request->session()->regenerate();

            // Sucesso! Redireciona diretamente para o dashboard
            return redirect('/dashboard')->with('success', 'Cadastro realizado com sucesso!');

        } catch (\Exception $e) {
            // Em caso de erro grave de banco
            return back()->withErrors(['error' => 'Erro interno: ' . $e->getMessage()]);
        }
    }
    public function showLogin()
    {
        return view('login'); // Vamos criar essa view a seguir
    }

    // Processa a tentativa de login
    public function authenticate(Request $request)
    {
        // 1. Valida os campos do formulário
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Tenta fazer o login
        // Como já ensinamos o Laravel no User.php (com o getAuthPassword) que a senha 
        // fica na coluna 'senha', o Auth::attempt faz a mágica automaticamente!
        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            
            // Previne falhas de segurança de sessão (Session Fixation)
            $request->session()->regenerate();

            // Redireciona o usuário (o intended manda de volta pra página que ele tentou acessar antes)
            return redirect()->intended('/dashboard');
        }

        // 3. Se errar e-mail ou senha, volta pro form com erro
        return back()->withErrors([
            'email' => 'E-mail ou senha incorretos.',
        ])->onlyInput('email'); // Mantém o e-mail preenchido na tela
    }

    // Processa o logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
