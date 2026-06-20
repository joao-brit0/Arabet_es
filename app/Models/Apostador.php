<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Apostador extends Model
{
    protected $table = 'arabetdb.apostador';
    protected $primaryKey = 'id_apostador';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario', 'data_nascimento', 'saldo'
    ];
}
