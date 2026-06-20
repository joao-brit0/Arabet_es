<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Partida;
use App\Models\Apostador;
// 1. Altere o import para usar transações ao invés de resetar o banco
use Illuminate\Foundation\Testing\DatabaseTransactions; 
use PHPUnit\Framework\Attributes\Test;

class ApostaTest extends TestCase
{
    // 2. Use a trait que preserva as tabelas existentes e reverte inserções ao fim do teste
    use DatabaseTransactions;

    #[Test]
    public function deve_falhar_se_os_dados_forem_invalidos()
    {
        $response = $this->postJson('/api/apostar', [
            'id_apostador' => 'não-é-inteiro',
            'id_partida'   => 1,
            'valor'        => 0,
            'palpite'      => 'LIVERPOOL'
        ]);

        $response->assertStatus(422);
    }

    #[Test]
    public function nao_deve_permitir_aposta_em_partida_nao_agendada()
    {
        $partida = new Partida();
        $partida->status = 'FINALIZADA';
        $partida->odd_mandante = 1.80;
        $partida->odd_empate = 3.20;
        $partida->odd_visitante = 4.00;
        $partida->save();

        $apostador = new Apostador();
        $apostador->saldo = 100.00;
        $apostador->save();

        $response = $this->postJson('/api/apostar', [
            'id_apostador' => $apostador->id_apostador,
            'id_partida'   => $partida->id_partida,
            'valor'        => 20.00,
            'palpite'      => 'MANDANTE'
        ]);

        $response->assertStatus(400)
                 ->assertJson(['error' => 'Partida indisponível para apostas.']);
    }

    #[Test]
    public function nao_deve_permitir_aposta_com_saldo_insuficiente()
    {
        $partida = new Partida();
        $partida->status = 'AGENDADA';
        $partida->odd_mandante = 2.00;
        $partida->odd_empate = 3.00;
        $partida->odd_visitante = 3.50;
        $partida->save();

        $apostador = new Apostador();
        $apostador->saldo = 10.00;
        $apostador->save();

        $response = $this->postJson('/api/apostar', [
            'id_apostador' => $apostador->id_apostador,
            'id_partida'   => $partida->id_partida,
            'valor'        => 50.00,
            'palpite'      => 'MANDANTE'
        ]);

        $response->assertStatus(400)
                 ->assertJson(['error' => 'Saldo insuficiente.']);
    }

    #[Test]
    public function deve_realizar_aposta_com_sucesso()
    {
        $partida = new Partida();
        $partida->status = 'AGENDADA';
        $partida->odd_mandante = 2.50;
        $partida->odd_empate = 3.10;
        $partida->odd_visitante = 2.80;
        $partida->save();

        $apostador = new Apostador();
        $apostador->saldo = 100.00;
        $apostador->save();

        $response = $this->postJson('/api/apostar', [
            'id_apostador' => $apostador->id_apostador,
            'id_partida'   => $partida->id_partida,
            'valor'        => 30.00,
            'palpite'      => 'MANDANTE'
        ]);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Aposta registrada com sucesso!']);

        $this->assertEquals(70.00, (float) $apostador->refresh()->saldo);

        $this->assertDatabaseHas('arabetdb.aposta', [
            'id_apostador' => $apostador->id_apostador,
            'id_partida'   => $partida->id_partida,
            'valor'        => 30.00,
            'palpite'      => 'MANDANTE',
            'odd_momento'  => 2.50,
            'status'       => 'PENDENTE'
        ]);
    }
}