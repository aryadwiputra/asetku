<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
            body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111827; }
            h1 { font-size: 16px; margin: 0 0 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e5e7eb; padding: 6px 8px; vertical-align: top; }
            th { background: #f9fafb; text-align: left; font-weight: 600; }
            .muted { color: #6b7280; }
        </style>
    </head>
    <body>
        <h1>Assets Export</h1>
        <p class="muted">Generated at {{ now()->format('Y-m-d H:i:s') }}</p>

        <table>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Condition</th>
                    <th>Branch</th>
                    <th>Department</th>
                    <th>Serial</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Purchase</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($rows as $row)
                    <tr>
                        <td>{{ $row->code }}</td>
                        <td>{{ $row->name }}</td>
                        <td>{{ $row->category?->name }}</td>
                        <td>{{ $row->status?->name }}</td>
                        <td>{{ $row->condition?->name }}</td>
                        <td>{{ $row->branch?->name }}</td>
                        <td>{{ $row->department?->name }}</td>
                        <td>{{ $row->serial_number }}</td>
                        <td>{{ $row->brand }}</td>
                        <td>{{ $row->model }}</td>
                        <td>{{ optional($row->purchase_date)->format('Y-m-d') }}</td>
                        <td>{{ $row->cost }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </body>
</html>

