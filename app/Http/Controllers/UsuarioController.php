<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // Usando o seu model User
use Illuminate\Support\Facades\Hash; // Para criptografar a senha

class UsuarioController extends Controller
{
    /**
     * 1. Buscar dados do usuário para preencher o Perfil e o Dashboard
     */
    public function mostrar($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        // Retornamos os dados no formato que o seu React (Dashboard e Perfil) espera.
        // DICA: Se no seu banco a coluna de nome for 'name' em vez de 'nome', 
        // mude aqui para $usuario->name
        return response()->json([
            'nome' => $usuario->name ?? $usuario->nome, 
            'cpf' => $usuario->cpf ?? '***.***.***-**',
            'email' => $usuario->email,
        ], 200);
    }

    /**
     * 2. Atualizar dados pessoais (Nome, Email, Telefone)
     */
    public function atualizarDados(Request $request, $id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        // Validação dos dados que chegam do React
        $dadosValidados = $request->validate([
            'nome' => 'required|string|max:255',
            // O email deve ser único, exceto para o próprio usuário que está atualizando
            'email' => 'required|email|max:255|unique:users,email,' . $id,
        ]);

        try {
            // Atualiza os dados (Se a sua coluna no banco for 'name', troque 'nome' para 'name' aqui abaixo)
            if(isset($usuario->name)) {
                $usuario->name = $dadosValidados['nome'];
            } else {
                $usuario->nome = $dadosValidados['nome'];
            }
            
            $usuario->email = $dadosValidados['email'];
            
            

            $usuario->save();

            return response()->json(['message' => 'Dados atualizados com sucesso!', 'usuario' => $usuario], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar dados: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 3. Atualizar a senha com segurança
     */
    public function atualizarSenha(Request $request, $id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        // Validação
        $request->validate([
            'senha_atual' => 'required',
            'nova_senha' => 'required|min:6'
        ]);

        // Verifica se a "Senha Atual" digitada bate com a que está no banco de dados
        if (!Hash::check($request->senha_atual, $usuario->senha)) {
            // Retorna erro 400 (Bad Request) se a senha estiver errada
            return response()->json(['message' => 'A senha atual está incorreta.'], 400);
        }

        try {
            // Atualiza a senha criptografando a nova
            $usuario->senha = Hash::make($request->nova_senha);
            $usuario->save();

            return response()->json(['message' => 'Senha atualizada com sucesso!'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar senha.'], 500);
        }
    }
}