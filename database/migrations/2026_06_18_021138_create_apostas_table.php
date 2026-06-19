<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('apostas', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('jogo_id');
        $table->string('palpite');
        $table->decimal('odd', 8, 2);
        $table->decimal('valor', 10, 2);
        $table->decimal('retorno_potencial', 10, 2);
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apostas');
    }
};
