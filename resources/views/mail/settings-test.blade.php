<x-mail::message>
# Koneksi email aktif

Ini adalah email uji dari **{{ settings('app.name', config('app.name')) }}**.

Jika email ini masuk, konfigurasi SMTP aplikasi sudah berfungsi.

<x-mail::panel>
Mailer: {{ settings('mail.default', config('mail.default')) }}<br>
From: {{ settings('mail.from.name', config('mail.from.name')) }} &lt;{{ settings('mail.from.address', config('mail.from.address')) }}&gt;
</x-mail::panel>

Terima kasih,<br>
{{ settings('app.name', config('app.name')) }}
</x-mail::message>
