<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetLabelController extends Controller
{
    public function print(Request $request): Response
    {
        $this->authorize('viewAny', Asset::class);

        $ids = $request->query('ids', []);
        if (! is_array($ids)) {
            $ids = [];
        }

        $ids = array_values(array_unique(array_filter(array_map(
            fn ($id) => is_numeric($id) ? (int) $id : null,
            $ids,
        ), fn ($id) => is_int($id) && $id > 0)));

        abort_unless($ids !== [], 422, __('labels.validation.ids_required'));

        $size = (string) $request->query('size', 'a4');
        $allowed = ['a4'];
        if (! in_array($size, $allowed, true)) {
            $size = 'a4';
        }

        $user = $request->user();

        $assets = Asset::query()
            ->whereKey($ids)
            ->forUser($user)
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'qr_token']);

        return Inertia::render('assets/labels/print', [
            'size' => $size,
            'assets' => $assets,
        ]);
    }
}
