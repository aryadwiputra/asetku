<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\AssetStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MasterDataHomeController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AssetStatus::class);

        return Inertia::render('master-data/home');
    }
}
