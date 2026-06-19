<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtratoApostador extends Model
{

    protected $table = 'arabetdb.vw_extrato_apostador';
    
    protected $primaryKey = null;
    public $incrementing = false;
    
    public $timestamps = false;
}
