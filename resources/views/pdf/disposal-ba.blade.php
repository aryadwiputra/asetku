<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $documentNumber }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #111; }
        h1 { font-size: 18px; margin: 0 0 6px; }
        h2 { font-size: 12px; margin: 18px 0 6px; text-transform: uppercase; letter-spacing: .04em; color: #444; }
        .muted { color: #666; font-size: 11px; }
        .row { display: flex; gap: 12px; }
        .col { flex: 1; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        td, th { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
        th { background: #f5f5f5; text-align: left; }
        .sign { margin-top: 26px; }
        .sign td { height: 70px; }
        .right { text-align: right; }
    </style>
</head>
<body>
    <h1>Berita Acara Penghapusan Aset</h1>
    <div class="muted">
        Nomor: {{ $documentNumber }}<br>
        Digenerate: {{ $generatedAt->format('Y-m-d H:i') }}
    </div>

    <h2>Organisasi</h2>
    <table>
        <tr>
            <th style="width: 28%">Nama</th>
            <td>{{ $organization?->name ?? '-' }}</td>
        </tr>
        <tr>
            <th>Slug</th>
            <td>{{ $organization?->slug ?? '-' }}</td>
        </tr>
    </table>

    <h2>Identitas Aset</h2>
    <table>
        <tr>
            <th style="width: 28%">Kode</th>
            <td>{{ $asset->code }}</td>
        </tr>
        <tr>
            <th>Nama</th>
            <td>{{ $asset->name }}</td>
        </tr>
        <tr>
            <th>Cabang / Departemen</th>
            <td>
                {{ $asset->branch?->code ?? '-' }} — {{ $asset->branch?->name ?? '-' }}<br>
                {{ $asset->department?->code ?? '-' }} — {{ $asset->department?->name ?? '-' }}
            </td>
        </tr>
        <tr>
            <th>Lokasi</th>
            <td>{{ $asset->location?->name ?? '-' }}</td>
        </tr>
        <tr>
            <th>Kategori</th>
            <td>{{ $asset->category?->name ?? '-' }}</td>
        </tr>
        <tr>
            <th>PIC / Pengguna</th>
            <td>
                PIC: {{ $asset->personInCharge?->name ?? '-' }}<br>
                Pengguna: {{ $asset->user?->name ?? '-' }}
            </td>
        </tr>
    </table>

    <h2>Detail Penghapusan</h2>
    <table>
        <tr>
            <th style="width: 28%">Tipe</th>
            <td>{{ $disposal->type }}</td>
        </tr>
        <tr>
            <th>Tanggal Penghapusan</th>
            <td>{{ $disposal->disposed_at?->format('Y-m-d H:i') ?? '-' }}</td>
        </tr>
        <tr>
            <th>Alasan</th>
            <td>{{ $disposal->reason ?? '-' }}</td>
        </tr>
        <tr>
            <th>Catatan</th>
            <td>{{ $disposal->notes ?? '-' }}</td>
        </tr>
    </table>

    <h2>Perhitungan Nilai</h2>
    <table>
        <tr>
            <th style="width: 28%">Nilai Buku</th>
            <td class="right">{{ $disposal->book_value_at_disposal ?? '-' }}</td>
        </tr>
        <tr>
            <th>Nilai Hasil (Net)</th>
            <td class="right">{{ $disposal->net_proceeds_amount ?? '-' }}</td>
        </tr>
        <tr>
            <th>Untung / Rugi</th>
            <td class="right">{{ $disposal->gain_loss_amount ?? '-' }}</td>
        </tr>
    </table>

    <h2>Persetujuan</h2>
    <table class="sign">
        <tr>
            <th style="width: 33%">Diajukan</th>
            <th style="width: 33%">Disetujui</th>
            <th style="width: 33%">Dieksekusi</th>
        </tr>
        <tr>
            <td>
                Nama:<br><br><br>
                Tanggal:
            </td>
            <td>
                Nama:<br><br><br>
                Tanggal:
            </td>
            <td>
                Nama:<br><br><br>
                Tanggal:
            </td>
        </tr>
    </table>
</body>
</html>

